import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";
import {
  atualizarStatusConclusao,
  getRoadmap,
  IRoadmap,
} from "../../services/roadmaps";
import { useAuth } from "../../context/auth";
import Carregando from "../components/carregando";
import { gerarQuiz } from "../../services/groq";

export default function Roadmap() {
  const { usuario } = useAuth();
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [roadmap, setRoadmap] = useState<IRoadmap | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [textoExplicacao, setTextoExplicacao] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { tema } = useLocalSearchParams();
  const temaStr = typeof tema === "string" ? tema : "";

  const alternarProgresso = async (faseIndex: number, itemIndex: number) => {
    if (!roadmap) return;

    const novoValor = !roadmap.fases[faseIndex].itens[itemIndex].concluido;

    try {
      setCarregando(true);
      await atualizarStatusConclusao(
        temaStr,
        usuario.login,
        faseIndex,
        itemIndex,
        novoValor
      );

      const atualizado = { ...roadmap };
      atualizado.fases[faseIndex].itens[itemIndex].concluido = novoValor;
      setRoadmap(atualizado);
    } catch (e) {
      console.warn("Erro ao atualizar progresso:", e);
    } finally {
      setCarregando(false);
    }
  };

  const alternarExpandido = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setCarregando(true);
        const dados = await getRoadmap(temaStr, usuario.login);
        setRoadmap(dados);
      } catch (error) {
        console.error("Erro ao buscar roadmap:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchRoadmap();
  }, []);

  return (
    <View style={styles.container}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{roadmap?.titulo}</Text>
        </View>

        {roadmap?.fases?.map((fase, faseIdx) => (
          <View key={faseIdx} style={styles.faseContainer}>
            <View style={[styles.faseHeader, { backgroundColor: fase.cor }]}>
              <Text style={styles.faseTitle}>{fase.titulo}</Text>
              <View style={styles.faseActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => gerarQuiz(fase)}
                >
                  <Text style={styles.actionText}>Gerar quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    const novoEstado = { ...expandidos };
                    const expandir = fase.itens.some(
                      (_, idx) => !expandidos[`${faseIdx}-${idx}`]
                    );
                    fase.itens.forEach((_, idx) => {
                      novoEstado[`${faseIdx}-${idx}`] = expandir;
                    });
                    setExpandidos(novoEstado);
                  }}
                >
                  <Text style={styles.actionText}>
                    {fase.itens.some(
                      (_, idx) => !expandidos[`${faseIdx}-${idx}`]
                    )
                      ? "Expandir todos"
                      : "Colapsar todos"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {fase.itens.map((item, itemIdx) => {
              const id = `${faseIdx}-${itemIdx}`;
              return (
                <View key={id} style={styles.itemBox}>
                  <View style={styles.itemHeader}>
                    <Checkbox
                      status={item.concluido ? "checked" : "unchecked"}
                      onPress={() => alternarProgresso(faseIdx, itemIdx)}
                    />
                    <Pressable
                      style={styles.itemTitleBox}
                      onPress={() => alternarExpandido(id)}
                    >
                      <Text
                        style={[
                          styles.itemTitle,
                          item.concluido && styles.concluded,
                        ]}
                      >
                        {item.titulo}
                      </Text>
                      <Text style={styles.toggleIcon}>
                        {expandidos[id] ? "−" : "+"}
                      </Text>
                    </Pressable>
                  </View>

                  {expandidos[id] && (
                    <View style={styles.itemDescriptionBox}>
                      <Text style={styles.itemDescription}>
                        {item.descricao}
                      </Text>
                      <TouchableOpacity
                        style={styles.explainButton}
                        onPress={() => {
                          setTextoExplicacao(
                            item.descricao || "Sem descrição disponível."
                          );
                          setModalVisivel(true);
                        }}
                      >
                        <Text style={styles.explainText}>Explique mais</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {menuVisivel && <MenuSuspenso />}
      {modalVisivel && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{textoExplicacao}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {carregando && <Carregando />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  backText: {
    color: "white",
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "center",
    marginLeft: 10,
  },
  faseContainer: {
    marginBottom: 30,
  },
  faseHeader: {
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between", // distribui título e ações
    gap: 12,
  },
  faseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    flexGrow: 1, // ocupa espaço disponível
    minWidth: 160,
    marginTop: 5,
  },
  faseActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-end", // alinha os botões à direita
    flexGrow: 1,
  },
  actionButton: {
    backgroundColor: "#0056b3",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionText: {
    color: "white",
    fontSize: 14,
  },
  itemBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemTitleBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  concluded: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  toggleIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  itemDescriptionBox: {
    marginTop: 10,
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 6,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  explainButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#007bff",
  },
  explainText: {
    color: "#007bff",
    fontSize: 14,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    maxWidth: 400,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalCloseButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  modalCloseText: {
    color: "white",
    fontWeight: "600",
  },
});
