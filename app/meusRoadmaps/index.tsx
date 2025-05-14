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
            <Ionicons name="add-circle-outline" size={40} color="#fff" />
            <Text style={styles.cardText}>Criar Roadmap</Text>
          </Pressable>
        </View>
      </ScrollView>

      {menuVisivel && <MenuSuspenso />}

      <Modal
        transparent
        visible={modalVisivel}
        animationType="none"
        onRequestClose={() => setModalVisivel(false)}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: animating }]}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Confirmar exclusão</Text>
            <Text style={styles.modalTexto}>
              Deseja excluir o roadmap "{roadmapSelecionado?.titulo}"?
            </Text>

            <View style={styles.modalBotoes}>
              <Pressable
                style={[styles.modalBotao, styles.modalExcluir]}
                onPress={confirmarExclusao}
              >
                <Text style={styles.modalBotaoTexto}>Excluir</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBotao, styles.modalCancelar]}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.modalBotaoTexto}>Cancelar</Text>
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
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  roadmapList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    rowGap: 20,
    paddingBottom: 30,
  },
  cardContainer: {
    position: "relative",
  },
  roadmapCard: {
    backgroundColor: "#2496BE",
    width: 180,
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  createCard: {
    backgroundColor: "#4CAF50",
    width: 180,
    height: 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 4,
    borderColor: "#1d5e2f",
  },
  cardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
  deleteIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  loadingContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalTexto: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",

    // Efeito de relevo (sombra)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 6, // Android
  },
  modalBotaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  modalExcluir: {
    backgroundColor: "#ff4d4d",
    borderColor: "#d32f2f",
  },
  modalCancelar: {
    backgroundColor: "#607D8B",
  },
});
