import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { router } from "expo-router";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";
import { useLocalSearchParams } from "expo-router";
import {
  atualizarStatusConclusao,
  getRoadmap,
  IRoadmap,
} from "../../services/roadmaps";
import { useAuth } from "../../context/auth";

export default function Roadmap() {
  const { usuario } = useAuth();
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [roadmap, setRoadmap] = useState<IRoadmap | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [textoExplicacao, setTextoExplicacao] = useState("");

  const { tema } = useLocalSearchParams();
  const temaStr = typeof tema === "string" ? tema : ""; // Garantir string

  const alternarProgresso = async (faseIndex: number, itemIndex: number) => {
    if (!roadmap) return;

    const novoValor = !roadmap.fases[faseIndex].itens[itemIndex].concluido;

    try {
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
    }
  };

  const alternarExpandido = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const dados = await getRoadmap(temaStr, usuario.login);
        setRoadmap(dados);
      } catch (error) {
        console.error("Erro ao buscar roadmap:", error);
      }
    };

    fetchRoadmap();
  }, []);

  return (
    <View style={styles.container}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            height: 60,
          }}
        >
          {/* Botão Voltar fixado à esquerda */}
          <TouchableOpacity
            style={styles.voltarButton}
            onPress={() => router.back()}
          >
            <Text style={styles.voltarText}>Voltar</Text>
          </TouchableOpacity>

          {/* Título centralizado */}
          <Text style={{ fontSize: 40, fontWeight: 300, marginTop: -10 }}>
            {roadmap?.titulo}
          </Text>
        </View>

        {roadmap?.fases?.map((secao, idx) => (
          <View key={idx}>
            <View style={[styles.tituloView, { backgroundColor: secao.cor }]}>
              <Text style={styles.tituloText}>{secao.titulo}</Text>

              <View style={styles.botoesContainer}>
                <TouchableOpacity style={styles.botaoText}>
                  <Text style={{ color: "white" }}>Gerar quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoText}
                  onPress={() => {
                    const novosExpandidos = { ...expandidos };
                    const algumFechado = secao.itens.some(
                      (_, itemIdx) => !expandidos[`${idx}-${itemIdx}`]
                    );

                    secao.itens.forEach((_, itemIdx) => {
                      const id = `${idx}-${itemIdx}`;
                      novosExpandidos[id] = algumFechado;
                    });

                    setExpandidos(novosExpandidos);
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {secao.itens.some(
                      (_, itemIdx) => !expandidos[`${idx}-${itemIdx}`]
                    )
                      ? "Expandir todos"
                      : "Colapsar todos"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {secao.itens.map((item, itemIdx) => {
              const id = `${idx}-${itemIdx}`;
              return (
                <View key={id} style={styles.itemContainer}>
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      status={item.concluido ? "checked" : "unchecked"}
                      onPress={() => alternarProgresso(idx, itemIdx)}
                    />

                    <Pressable
                      style={styles.itemHeader}
                      onPress={() => alternarExpandido(id)}
                    >
                      <Text
                        style={[
                          styles.itemTitulo,
                          item.concluido && {
                            textDecorationLine: "line-through",
                            color: "#888",
                          },
                        ]}
                      >
                        {item.titulo}
                      </Text>

                      <Text style={styles.itemIcon}>
                        {expandidos[id] ? "−" : "+"}
                      </Text>
                    </Pressable>
                  </View>

                  {expandidos[id] && (
                    <View style={{ backgroundColor: "#f9f9f9", padding: 8 }}>
                      <Text style={styles.itemDescricao}>{item.descricao}</Text>
                      <TouchableOpacity
                        style={{
                          alignSelf: "flex-end",
                          borderRadius: 4,
                          marginTop: 20,
                          borderWidth: 1,
                          paddingHorizontal: 10,
                        }}
                        onPress={() => {
                          setTextoExplicacao(
                            item.descricao || "Sem descrição disponível."
                          );
                          setModalVisivel(true);
                        }}
                      >
                        <Text>Explique mais</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTexto}>{textoExplicacao}</Text>
            <TouchableOpacity
              onPress={() => setModalVisivel(false)}
              style={styles.modalFecharBtn}
            >
              <Text style={styles.modalFecharTexto}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
  },
  voltarButton: {
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007BFF",
    borderRadius: 4,
    position: "absolute",
    left: 0,
    top: 10,
  },
  voltarText: {
    color: "#fff",
    fontSize: 16,
  },
  tituloView: {
    flexDirection: "row",
    flexWrap: "wrap", // permite quebra de linha
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 8,
    gap: 8,
    borderRadius: 10,
    marginBottom: 24,
  },
  tituloText: {
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1,
    flexGrow: 1,
    minWidth: "60%", // título ocupa o espaço necessário
    color: "black",
  },
  botoesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
  },
  botaoText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#027BFF",
    borderWidth: 1,
    borderColor: "#004691",
    marginTop: 4,
  },
  itemContainer: {
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
    flex: 1,
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  itemDescricao: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTexto: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalFecharBtn: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalFecharTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});
