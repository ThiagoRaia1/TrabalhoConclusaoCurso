import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { router } from "expo-router";
import { MenuSuspenso, TopBarMenu } from "../components/topBar";

type Item = {
  titulo: string;
  subitens: string[];
};

type Secao = {
  titulo: string;
  cor: string;
  itens: Item[];
};

const cores = {
  iniciante: "#d1fae5",
  intermediario: "#fef3c7",
  avancado: "#dbeafe",
};

const secoes: Secao[] = [
  {
    titulo: "🟢 Iniciante – Fundamentos do Xadrez",
    cor: cores.iniciante,
    itens: [
      {
        titulo: "Regras Básicas",
        subitens: [
          "Objetivo do jogo",
          "Como cada peça se movimenta",
          "Regras especiais: roque, promoção, en passant",
        ],
      },
      {
        titulo: "Configuração Inicial do Tabuleiro",
        subitens: [
          "Organização das peças",
          "Nomenclatura das casas (notação algébrica)",
        ],
      },
      {
        titulo: "Como Vencer uma Partida",
        subitens: [
          "Xeque e xeque-mate",
          "Afogamento (empate)",
          "Outras formas de empate (repetição, 50 lances, material insuficiente)",
        ],
      },
      {
        titulo: "Princípios Abertos",
        subitens: [
          "Desenvolver peças rapidamente",
          "Controlar o centro",
          "Segurança do rei (roque cedo)",
        ],
      },
    ],
  },
  {
    titulo: "🟡 Intermediário – Tática e Estratégia",
    cor: cores.intermediario,
    itens: [
      {
        titulo: "Táticas Básicas",
        subitens: [
          "Cravada",
          "Garfo",
          "Ataque duplo",
          "Descoberta e raio-x",
          "Sacrifícios",
        ],
      },
      {
        titulo: "Finalizações Simples (Finais)",
        subitens: [
          "Mate com torre e rei contra rei",
          "Mate com dama e rei contra rei",
          "Final com rei e peão vs rei",
        ],
      },
      {
        titulo: "Aberturas Populares",
        subitens: [
          "Ruy Lopez",
          "Defesa Siciliana",
          "Defesa Francesa",
          "Gambito da Dama",
        ],
      },
      {
        titulo: "Erros Comuns a Evitar",
        subitens: [
          "Mover a mesma peça várias vezes na abertura",
          "Desenvolver rainha cedo demais",
          "Não rocar",
        ],
      },
    ],
  },
  {
    titulo: "🔵 Avançado – Estratégia Profunda e Estudo Contínuo",
    cor: cores.avancado,
    itens: [
      {
        titulo: "Estratégias de Meio-Jogo",
        subitens: [
          "Estrutura de peões",
          "Colunas abertas",
          "Casas fracas",
          "Plano de jogo",
        ],
      },
      {
        titulo: "Estudo de Finais",
        subitens: [
          "Final de torre",
          "Final de bispo vs cavalo",
          "Final com peões passados",
        ],
      },
      {
        titulo: "Cálculo e Visualização",
        subitens: [
          "Análise de variantes",
          "Pensamento em profundidade (2-3 jogadas à frente)",
        ],
      },
      {
        titulo: "Estudo de Partidas Clássicas",
        subitens: [
          "Análise de partidas famosas",
          "Estilo de jogadores históricos (Kasparov, Fischer, Carlsen etc.)",
        ],
      },
      {
        titulo: "Preparação e Treinamento",
        subitens: [
          "Uso de softwares e engines (ex: Chess.com, Lichess, Stockfish)",
          "Solução diária de táticas",
          "Revisão de partidas próprias",
        ],
      },
      {
        titulo: "Competição",
        subitens: [
          "Participar de torneios online ou presenciais",
          "Controle de tempo (blitz, bullet, clássico)",
          "Psicologia no jogo",
        ],
      },
    ],
  },
];

const STORAGE_KEY = "progresso_xadrez";

export default function Roadmap() {
  const [progresso, setProgresso] = useState<Record<string, boolean>>({});

  const salvarProgresso = async (novoProgresso: Record<string, boolean>) => {
    const json = JSON.stringify(novoProgresso);
    if (Platform.OS === "web") {
      localStorage.setItem(STORAGE_KEY, json);
    } else {
      await AsyncStorage.setItem(STORAGE_KEY, json);
    }
  };

  const carregarProgresso = async () => {
    try {
      let json = "";
      if (Platform.OS === "web") {
        json = localStorage.getItem(STORAGE_KEY) || "{}";
      } else {
        json = (await AsyncStorage.getItem(STORAGE_KEY)) || "{}";
      }
      setProgresso(JSON.parse(json));
    } catch (e) {
      console.warn("Erro ao carregar progresso:", e);
    }
  };

  const alternarProgresso = (id: string) => {
    const novo = { ...progresso, [id]: !progresso[id] };
    setProgresso(novo);
    salvarProgresso(novo);
  };

  useEffect(() => {
    carregarProgresso();
  }, []);

  const [menuVisivel, setMenuVisivel] = useState(false);

  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

  const alternarExpandido = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={{
            alignItems: "center",
            width: "100%",
            paddingVertical: 10,
            backgroundColor: "#2496BE",
          }}
          onPress={() => router.push("./menuPrincipal")}
        >
          <Text style={{ color: "white", fontSize: 40, fontWeight: "700" }}>
            Voltar
          </Text>
        </TouchableOpacity>

        {secoes.map((secao, idx) => (
          <View key={idx} style={{ gap: 24, marginTop: 24 }}>
            <View style={[styles.topicView, { backgroundColor: secao.cor }]}>
              <Text style={styles.topicText}>{secao.titulo}</Text>
            </View>

            {secao.itens.map((item, i) => (
              <View
                key={i}
                style={[styles.subtopicText, { backgroundColor: secao.cor }]}
              >
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "600",
                    textAlign: "left",
                  }}
                >
                  {item.titulo}
                </Text>
                {item.subitens.map((sub, j) => {
                  const id = `${idx}-${i}-${j}`;
                  const feito = progresso[id];
                  const expandido = expandidos[id];

                  return (
                    <View key={j}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginVertical: 5,
                        }}
                      >
                        <Pressable
                          onPress={() => alternarProgresso(id)}
                          style={{ flex: 1 }}
                        >
                          <Text
                            style={{
                              textAlign: "left",
                              fontSize: 26,
                              paddingHorizontal: 12,
                              paddingVertical: 10,
                              color: feito ? "#10b981" : "#000",
                              textDecorationLine: feito
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {feito ? "✅ " : "◻️ "} {sub}
                          </Text>
                        </Pressable>

                        <TouchableOpacity
                          onPress={() => alternarExpandido(id)}
                          style={{ paddingHorizontal: 10 }}
                        >
                          <Text style={{ fontSize: 35, fontWeight: "900" }}>
                            {expandido ? "−" : "+"}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {expandido && (
                        <Text
                          style={{
                            fontSize: 26,
                            paddingHorizontal: 20,
                            paddingBottom: 10,
                            color: "#555",
                            fontStyle: "italic",
                          }}
                        >
                          {/* Você pode substituir isso por dados reais futuramente */}
                          Mais detalhes sobre: {sub}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      {menuVisivel && <MenuSuspenso />}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  topicView: {
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingVertical: 70,
    borderRadius: 40,
    borderColor: "#242E3F",
    borderWidth: 3,
    minWidth: "60%",
    maxWidth: "90%",
  },
  topicText: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtopicText: {
    marginVertical: 8,
    gap: 10,
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 40,
    borderColor: "#242E3F",
    borderWidth: 3,
  },
});
