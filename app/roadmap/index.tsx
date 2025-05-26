import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import TopBarMenu, { MenuSuspenso } from "../components/TopBarMenu";
import {
  atualizarDescricaoItem,
  atualizarStatusConclusao,
  getRoadmap,
  IItem,
  IRoadmap,
} from "../../services/roadmaps";
import { useAuth } from "../../context/auth";
import Carregando from "../components/Carregando";
import { gerarExplicacaoItem, gerarQuiz } from "../../services/groq";
import QuizModal from "./QuizModal";
import * as Animatable from "react-native-animatable";

export default function Roadmap() {
  const { usuario } = useAuth();
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [roadmap, setRoadmap] = useState<IRoadmap | null>(null);
  const [editando, setEditando] = useState(false);
  const [itemDescricao, setItemDescricao] = useState("");
  const [modalExpliqueMaisVisivel, setModalExpliqueMaisVisivel] =
    useState(false);
  const [textoExplicacao, setTextoExplicacao] = useState("");
  const [carregando, setCarregando] = useState(true);

  const [modalQuizVisivel, setModalQuizVisivel] = useState(false);
  const [perguntasQuiz, setPerguntasQuiz] = useState<any[]>([]);
  const [respostasUsuario, setRespostasUsuario] = useState<string[]>(
    new Array(perguntasQuiz.length).fill("")
  );
  const [respostasConfirmadas, setRespostasConfirmadas] = useState(false);

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
    } catch (erro) {
      console.warn("Erro ao atualizar progresso:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const alternarExpandido = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const salvarNovaDescricao = async (faseIndex: number, itemIndex: number) => {
    if (!roadmap) return;
    setCarregando(true);
    console.log(temaStr);
    console.log(usuario.login);
    console.log(faseIndex);
    console.log(itemIndex);
    console.log(itemDescricao);
    try {
      await atualizarDescricaoItem(
        temaStr,
        usuario.login,
        faseIndex,
        itemIndex,
        itemDescricao
      );
      const atualizado = { ...roadmap };
      atualizado.fases[faseIndex].itens[itemIndex].descricao = itemDescricao;
      setRoadmap(atualizado);
    } catch (erro: any) {
      console.warn("Erro ao atualizar descrição:", erro);
    } finally {
      setCarregando(false);
    }
  };

  const buscaExplicacao = async (item: IItem) => {
    setCarregando(true);
    try {
      // setTextoExplicacao(item.descricao || "Sem descrição disponível.");
      setTextoExplicacao(await gerarExplicacaoItem(item.descricao));
      setModalExpliqueMaisVisivel(true);
    } catch (erro: any) {
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
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
          <View key={faseIdx} style={{ marginBottom: 30 }}>
            <View style={[styles.faseHeader, { backgroundColor: fase.cor }]}>
              <Text style={styles.faseTitle}>{fase.titulo}</Text>
              <View style={styles.faseActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={async () => {
                    setCarregando(true);
                    try {
                      const resposta = await gerarQuiz(fase);
                      const data = JSON.parse(resposta);
                      const primeiraChave = Object.keys(data)[0];
                      setPerguntasQuiz(data[primeiraChave]);
                      setRespostasUsuario(
                        new Array(data[primeiraChave].length).fill(null)
                      );
                      console.log(perguntasQuiz);
                      setRespostasConfirmadas(false);
                      setModalQuizVisivel(true);
                    } catch (error) {
                      console.error("Erro ao gerar ou processar quiz:", error);
                    } finally {
                      setCarregando(false);
                    }
                  }}
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
                      <Text style={styles.toggleIcon} selectable={false}>
                        {expandidos[id] ? "−" : "+"}
                      </Text>
                    </Pressable>
                  </View>

                  {expandidos[id] && (
                    <View style={styles.itemDescriptionBox}>
                      {!editando ? (
                        <Text style={styles.itemDescription}>
                          {item.descricao}
                        </Text>
                      ) : (
                        <View>
                          <TextInput
                            autoFocus={true}
                            style={[
                              styles.itemDescription,
                              {
                                borderWidth: 1,
                                borderRadius: 10,
                              },
                            ]}
                            defaultValue={item.descricao}
                            onChangeText={(text) => setItemDescricao(text)}
                            multiline={true}
                            placeholder={item.descricao}
                            placeholderTextColor="#aaa"
                          />
                        </View>
                      )}

                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          alignSelf: "flex-end",
                        }}
                      >
                        <TouchableOpacity
                          style={styles.explainButton}
                          onPress={() => buscaExplicacao(item)}
                        >
                          <Text style={styles.explainText}>Explique mais</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.explainButton}
                          onPress={() => {
                            {
                              setItemDescricao(item.descricao)
                              editando && salvarNovaDescricao(faseIdx, itemIdx);
                            }
                            setEditando(!editando);
                          }}
                        >
                          <Text style={styles.explainText}>
                            {!editando ? "Editar" : "Salvar"}
                          </Text>
                        </TouchableOpacity>

                        {editando && (
                          <TouchableOpacity
                            style={styles.explainButton}
                            onPress={() => {
                              setItemDescricao(item.descricao);
                              setEditando(false);
                            }}
                          >
                            <Text style={styles.explainText}>Cancelar</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {modalExpliqueMaisVisivel && (
        <View style={styles.modalOverlay}>
          <Animatable.View
            animation="fadeInUp"
            duration={700}
            style={styles.modalExpliqueContent}
          >
            <ScrollView
              style={{ flex: 1, alignSelf: "stretch" }}
              contentContainerStyle={{
                padding: 10,
              }}
            >
              <Text style={styles.modalExpliqueText}>{textoExplicacao}</Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalExpliqueMaisVisivel(false)}
            >
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      )}

      {menuVisivel && <MenuSuspenso />}

      {modalQuizVisivel && (
        <QuizModal
          visivel={modalQuizVisivel}
          perguntas={perguntasQuiz}
          respostasUsuario={respostasUsuario}
          setRespostasUsuario={setRespostasUsuario}
          respostasConfirmadas={respostasConfirmadas}
          setRespostasConfirmadas={setRespostasConfirmadas}
          onFechar={() => {
            setModalQuizVisivel(false);
            setRespostasConfirmadas(false);
            setRespostasUsuario([]);
          }}
        />
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
    padding: 10,
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
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
    zIndex: 1000, // Garante que fique acima de outros elementos
  },
  modalExpliqueContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#aaa",
    gap: 20,
    flex: 1,
  },
  modalExpliqueText: {
    fontSize: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#aaa",
  },
  modalCloseButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 6,
    width: "70%",
    maxWidth: 400,
    alignSelf: "center",
  },
  modalCloseText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
