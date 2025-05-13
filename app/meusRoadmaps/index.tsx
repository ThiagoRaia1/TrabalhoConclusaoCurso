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
import { deleteRoadmapByTitulo, fetchRoadmapsByLogin, Roadmap } from "../../services/userRoadmaps";
import { useAuth } from "../../context/auth";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MeusRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const { usuario } = useAuth();
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [roadmapSelecionado, setRoadmapSelecionado] = useState<Roadmap | null>(null);
  const [animating, setAnimating] = useState(new Animated.Value(0)); // Inicializando a animação

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
    if (modalVisivel) {
      Animated.timing(animating, {
        toValue: 1, // Finalizando a animação de fade (1 é totalmente visível)
        duration: 300, // Duração de 300ms
        useNativeDriver: true, // Usando o driver nativo para melhor desempenho
      }).start();
    } else {
      Animated.timing(animating, {
        toValue: 0, // Revertendo a animação de fade (0 é invisível)
        duration: 300, // Duração de 300ms
        useNativeDriver: true, // Usando o driver nativo para melhor desempenho
      }).start();
    }
  }, [modalVisivel, animating]); // A animação será disparada quando o modal for alterado

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
      <View>
        <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2496BE" />
          <Text style={{ marginTop: 10, fontSize: 16 }}>
            Carregando seus roadmaps...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Meus Roadmaps</Text>

        <View style={styles.roadmapList}>
          {roadmaps.map((roadmap, index) => (
            <View key={index} style={{ position: "relative" }}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && { borderBottomWidth: 0 },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/roadmap",
                    params: { tema: roadmap.titulo },
                  })
                }
              >
                <Text style={styles.buttonText} selectable={false}>
                  {roadmap.titulo}
                </Text>
              </Pressable>

              <Pressable
                style={styles.deleteIcon}
                onPress={() => {
                  setRoadmapSelecionado(roadmap);
                  setModalVisivel(true);
                }}
              >
                <Ionicons name="trash" size={24} color="red" />
              </Pressable>
            </View>
          ))}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: "#4CAF50", borderColor: "#1d5e2f" },
              pressed && { borderBottomWidth: 0 },
            ]}
            onPress={() => router.push("/menuPrincipal")}
          >
            <Ionicons name="add-circle-outline" size={60} color="white" />
            <Text style={styles.buttonText} selectable={false}>
              Criar Roadmap
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      {menuVisivel && <MenuSuspenso />}

      {/* Modal de Confirmação */}
      <Modal
        transparent
        visible={modalVisivel}
        animationType="none" // Removendo animação padrão do Modal
        onRequestClose={() => setModalVisivel(false)}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: animating }, // Controlando a opacidade via animação
          ]}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Confirmar exclusão</Text>
            <Text style={styles.modalTexto}>
              Deseja excluir o roadmap "{roadmapSelecionado?.titulo}"?
            </Text>

            <View style={styles.modalBotoes}>
              <Pressable
                style={[styles.modalBotao, { backgroundColor: "#e53935" }]}
                onPress={confirmarExclusao}
              >
                <Text style={styles.modalBotaoTexto}>Excluir</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBotao, { backgroundColor: "#aaa" }]}
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
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  roadmapList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
    rowGap: 16,
  },
  button: {
    backgroundColor: "#2496BE",
    width: 210,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderBottomWidth: 4,
    borderColor: "#196f8c",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    backgroundColor: "white",
  },
  deleteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 2,
    zIndex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
    width: "80%",
    alignItems: "center",
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalTexto: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalBotoes: {
    flexDirection: "row",
    gap: 12,
  },
  modalBotao: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  modalBotaoTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
