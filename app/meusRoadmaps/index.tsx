import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Modal,
  Animated,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  deleteRoadmapByTitulo,
  fetchRoadmapsByLogin,
  Roadmap,
} from "../../services/userRoadmaps";
import { useAuth } from "../../context/auth";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MeusRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const { usuario } = useAuth();
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [roadmapSelecionado, setRoadmapSelecionado] = useState<Roadmap | null>(
    null
  );
  const [animating] = useState(new Animated.Value(0));

  useEffect(() => {
    const carregarRoadmaps = async () => {
      try {
        const dados = await fetchRoadmapsByLogin(usuario.login);
        setRoadmaps(dados);
      } catch (error) {
        console.error("Erro ao buscar roadmaps:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarRoadmaps();
  }, []);

  useEffect(() => {
    Animated.timing(animating, {
      toValue: modalVisivel ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [modalVisivel]);

  const confirmarExclusao = async () => {
    if (!roadmapSelecionado) return;
    try {
      await deleteRoadmapByTitulo(roadmapSelecionado.titulo, usuario.login);
      setRoadmaps((prev) =>
        prev.filter((r) => r.titulo !== roadmapSelecionado.titulo)
      );
      alert("Roadmap excluído.");
    } catch (e) {
      console.error("Erro ao excluir roadmap:", e);
    } finally {
      setModalVisivel(false);
      setRoadmapSelecionado(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2496BE" />
          <Text style={styles.loadingText}>Carregando seus roadmaps...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Meus Roadmaps</Text>

        <View style={styles.roadmapList}>
          {roadmaps.map((roadmap, index) => (
            <View key={index} style={styles.cardContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.roadmapCard,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/roadmap",
                    params: { tema: roadmap.titulo },
                  })
                }
              >
                <Text style={styles.cardText}>{roadmap.titulo}</Text>
              </Pressable>

              <Pressable
                style={styles.deleteIcon}
                onPress={() => {
                  setRoadmapSelecionado(roadmap);
                  setModalVisivel(true);
                }}
              >
                <Ionicons name="trash" size={20} color="#e53935" />
              </Pressable>
            </View>
          ))}

          <Pressable
            style={styles.createCard}
            onPress={() => router.push("/menuPrincipal")}
          >
            <Ionicons name="add-circle" size={40} color="#fff" />
            <Text style={styles.cardText}>Novo Roadmap</Text>
          </Pressable>
        </View>
      </ScrollView>

      {menuVisivel && <MenuSuspenso />}

      <Modal
        transparent
        visible={modalVisivel}
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: animating }]}>
          <View style={styles.modalContainer}>
            <Ionicons name="alert-circle-outline" size={40} color="#ff5252" />
            <Text style={styles.modalTitulo}>Excluir Roadmap?</Text>
            <Text style={styles.modalTexto}>
              Deseja mesmo excluir o roadmap "{roadmapSelecionado?.titulo}"?
            </Text>

            <View style={styles.modalBotoes}>
              <Pressable
                style={[styles.modalBotao, styles.modalExcluir]}
                onPress={confirmarExclusao}
              >
                <Text style={styles.modalBotaoTexto}>Sim</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBotao, styles.modalCancelar]}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.modalBotaoTexto}>Não</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafa",
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 24,
  },
  roadmapList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    rowGap: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    position: "relative",
  },
  roadmapCard: {
    backgroundColor: "#2496BE",
    width: 180,
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 5,
    borderBottomColor: "#196580",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  createCard: {
    backgroundColor: "#4CAF50",
    width: 180,
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 5,
    borderColor: "#1d5e2f",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
  },
  deleteIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    elevation: 3,
  },
  loadingContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 16,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginTop: 10,
    marginBottom: 8,
  },
  modalTexto: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 24,
  },
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",
  },
  modalBotao: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  modalBotaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalExcluir: {
    backgroundColor: "#e53935",
  },
  modalCancelar: {
    backgroundColor: "#607D8B",
  },
});
