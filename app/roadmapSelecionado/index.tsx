import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

type Item = {
  titulo: string;
  subitens: string[];
};

type Secao = {
  titulo: string;
  cor: string;
  itens: Item[];
};

const secoes: Secao[] = [
  {
    titulo: "🟢 Iniciante – Fundamentos do Xadrez",
    cor: "#d1fae5",
    itens: [
      { titulo: "Regras Básicas", subitens: ["Objetivo do jogo", "Como cada peça se movimenta", "Regras especiais: roque, promoção, en passant"] },
      { titulo: "Configuração Inicial do Tabuleiro", subitens: ["Organização das peças", "Nomenclatura das casas (notação algébrica)"] },
      { titulo: "Como Vencer uma Partida", subitens: ["Xeque e xeque-mate", "Afogamento (empate)", "Outras formas de empate (repetição, 50 lances, material insuficiente)"] },
      { titulo: "Princípios Abertos", subitens: ["Desenvolver peças rapidamente", "Controlar o centro", "Segurança do rei (roque cedo)"] },
    ],
  },
  {
    titulo: "🟡 Intermediário – Tática e Estratégia",
    cor: "#fef3c7",
    itens: [
      { titulo: "Táticas Básicas", subitens: ["Cravada", "Garfo", "Ataque duplo", "Descoberta e raio-x", "Sacrifícios"] },
      { titulo: "Finalizações Simples (Finais)", subitens: ["Mate com torre e rei contra rei", "Mate com dama e rei contra rei", "Final com rei e peão vs rei"] },
      { titulo: "Aberturas Populares", subitens: ["Ruy Lopez", "Defesa Siciliana", "Defesa Francesa", "Gambito da Dama"] },
      { titulo: "Erros Comuns a Evitar", subitens: ["Mover a mesma peça várias vezes na abertura", "Desenvolver rainha cedo demais", "Não rocar"] },
    ],
  },
  {
    titulo: "🔵 Avançado – Estratégia Profunda e Estudo Contínuo",
    cor: "#dbeafe",
    itens: [
      { titulo: "Estratégias de Meio-Jogo", subitens: ["Estrutura de peões", "Colunas abertas", "Casas fracas", "Plano de jogo"] },
      { titulo: "Estudo de Finais", subitens: ["Final de torre", "Final de bispo vs cavalo", "Final com peões passados"] },
      { titulo: "Cálculo e Visualização", subitens: ["Análise de variantes", "Pensamento em profundidade (2-3 jogadas à frente)"] },
      { titulo: "Estudo de Partidas Clássicas", subitens: ["Análise de partidas famosas", "Estilo de jogadores históricos (Kasparov, Fischer, Carlsen etc.)"] },
      { titulo: "Preparação e Treinamento", subitens: ["Uso de softwares e engines (ex: Chess.com, Lichess, Stockfish)", "Solução diária de táticas", "Revisão de partidas próprias"] },
      { titulo: "Competição", subitens: ["Participar de torneios online ou presenciais", "Controle de tempo (blitz, bullet, clássico)", "Psicologia no jogo"] },
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

  return (
    <ScrollView style={{ padding: 16 }}>
      {secoes.map((secao, idx) => (
        <View key={idx} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", backgroundColor: secao.cor, padding: 8 }}>
            {secao.titulo}
          </Text>
          {secao.itens.map((item, i) => (
            <View key={i} style={{ marginVertical: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.titulo}</Text>
              {item.subitens.map((sub, j) => {
                const id = `${idx}-${i}-${j}`;
                const feito = progresso[id];
                return (
                  <Pressable key={j} onPress={() => alternarProgresso(id)}>
                    <Text style={{
                      fontSize: 14,
                      paddingLeft: 12,
                      color: feito ? "#10b981" : "#000",
                      textDecorationLine: feito ? "line-through" : "none",
                    }}>
                      {feito ? "✅ " : "◻️ "} {sub}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};
