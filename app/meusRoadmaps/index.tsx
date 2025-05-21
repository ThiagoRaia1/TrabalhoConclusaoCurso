import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Modal,
  Animated,
  TextInput,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  deleteRoadmapByTitulo,
  fetchRoadmapsByLogin,
  Roadmap,
} from "../../services/userRoadmaps";
import { useAuth } from "../../context/auth";
import TopBarMenu, { MenuSuspenso } from "../components/TopBarMenu";
import Ionicons from "@expo/vector-icons/Ionicons";
import Carregando from "../components/Carregando";

export default function MeusRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [carregando, setCarregando] = useState(false)
  const { usuario } = useAuth();
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [modalExcluirVisivel, setModalExcluirVisivel] = useState(false);
  const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
  const [novoNomeRoadmap, setNovoNomeRoadmap] = useState("");
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
    const visivel = modalExcluirVisivel || modalEditarVisivel;
    Animated.timing(animating, {
      toValue: visivel ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [modalExcluirVisivel, modalEditarVisivel]);

  const confirmarExclusao = async () => {
    if (!roadmapSelecionado) return;
    setCarregando(true)
    try {
      await deleteRoadmapByTitulo(roadmapSelecionado.titulo, usuario.login);
      setRoadmaps((prev) =>
        prev.filter((r) => r.titulo !== roadmapSelecionado.titulo)
      );
      alert("Roadmap excluído.");
    } catch (e) {
      console.error("Erro ao excluir roadmap:", e);
    } finally {
      setModalExcluirVisivel(false);
      setRoadmapSelecionado(null);
      setCarregando(false)
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
                <Text selectable={false} style={styles.cardText}>
                  {roadmap.titulo}
                </Text>
              </Pressable>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#1A6580",
                  borderBottomEndRadius: 20,
                  borderBottomStartRadius: 20,
                  borderBottomWidth: 5,
                  borderBottomColor: "#196580",
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                }}
              >
                <Pressable
                  style={styles.optionIcon}
                  onPress={() => {
                    setRoadmapSelecionado(roadmap);
                    setNovoNomeRoadmap(roadmap.titulo);
                    setModalEditarVisivel(true);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color="white" />
                </Pressable>

                <Pressable
                  style={styles.optionIcon}
                  onPress={() => {
                    setRoadmapSelecionado(roadmap);
                    setModalExcluirVisivel(true);
                  }}
                >
                  <Ionicons name="trash" size={20} color="white" />
                </Pressable>
              </View>
            </View>
          ))}

          <Pressable
            style={styles.createCard}
            onPress={() => router.push("/menuPrincipal")}
          >
            <Ionicons name="add-circle" size={40} color="#fff" />
            <Text
              selectable={false}
              style={[styles.cardText, { marginTop: 6 }]}
            >
              Novo Roadmap
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {menuVisivel && <MenuSuspenso />}

      <Modal
        transparent
        visible={modalExcluirVisivel}
        animationType="fade"
        onRequestClose={() => setModalExcluirVisivel(false)}
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
                <Text selectable={false} style={styles.modalBotaoTexto}>
                  Sim
                </Text>
              </Pressable>

              <Pressable
                style={[styles.modalBotao, styles.modalCancelar]}
                onPress={() => setModalExcluirVisivel(false)}
              >
                <Text selectable={false} style={styles.modalBotaoTexto}>
                  Não
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Modal>

      <Modal
        transparent
        visible={modalEditarVisivel}
        animationType="fade"
        onRequestClose={() => setModalEditarVisivel(false)}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: animating }]}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Editar Roadmap?</Text>
            <Text style={styles.modalTexto}>
              Digite o novo nome para: "{roadmapSelecionado?.titulo}"?
            </Text>

            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    { width: "100%" },
                    Platform.OS === "web" && ({ outlineStyle: "none" } as any),
                  ]}
                  placeholder={roadmapSelecionado?.titulo}
                  placeholderTextColor="#aaa"
                  value={novoNomeRoadmap}
                  onChangeText={(text) => setNovoNomeRoadmap(text)}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.modalBotoes}>
              <Pressable
                style={[styles.modalBotao, styles.modalExcluir]}
                onPress={confirmarExclusao}
              >
                <Text selectable={false} style={styles.modalBotaoTexto}>
                  Confirmar
                </Text>
              </Pressable>

              <Pressable
                style={[styles.modalBotao, styles.modalCancelar]}
                onPress={() => setModalEditarVisivel(false)}
              >
                <Text selectable={false} style={styles.modalBotaoTexto}>
                  Cancelar
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Modal>

      {carregando && <Carregando/>}
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
    borderStartEndRadius: 20,
    borderStartStartRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  createCard: {
    backgroundColor: "#4CAF50",
    width: 180,
    height: 132,
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
    marginTop: 20,
  },
  optionIcon: {
    flex: 1,
    alignItems: "center",
    marginTop: 2,
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
  inputGroup: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#319594",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 20,
    justifyContent: "space-between",
  },
});
