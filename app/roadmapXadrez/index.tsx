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
import TopBarMenu, { MenuSuspenso } from "../components/topBar";

type Item = {
  titulo: string;
  descricao: string;
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
    titulo: "🟢 Fundamentos do Xadrez (Iniciante)",
    cor: cores.iniciante,
    itens: [
      {
        titulo: "Objetivo do jogo",
        descricao: `
${'\t'}O xadrez é vencido ao dar xeque-mate no rei inimigo — isso significa que o rei está sob ataque direto (xeque) e não pode escapar por nenhum movimento legal. 
${'\t'}O objetivo não é capturar todas as peças do oponente, mas colocar o rei em xeque-mate.`,
      },
      {
        titulo: "Tabuleiro e posicionamento",
        descricao: `
${'\t'}O tabuleiro é uma grade 8x8 (64 casas), com cores alternadas (branca e preta). A casa inferior direita deve ser branca. As peças se organizam assim:${"\n"}
${'\t'}Segunda fileira: 8 peões.${"\n"}
${'\t'}Primeira fileira: torre, cavalo, bispo, dama, rei, bispo, cavalo, torre.${"\n"}
${'\t'}Dama vai na cor da peça (dama branca na casa branca, dama preta na casa preta).`,
      },
      {
        titulo: "As peças e seus movimentos",
        descricao: `
${'\t'}Peão: anda 1 casa à frente (ou 2, no primeiro movimento), mas captura na diagonal. 
${'\t'}Peão não anda para trás.${"\n"}
${'\t'}Torre: anda quantas casas quiser na horizontal ou vertical.${"\n"}
${'\t'}Cavalo: anda em “L” (duas casas em uma direção e uma na perpendicular) e pula sobre outras peças.${"\n"}
${'\t'}Bispo: anda na diagonal, quantas casas quiser.${"\n"}
${'\t'}Dama: combina torre + bispo (movimento em qualquer direção reta).${"\n"}
${'\t'}Rei: anda 1 casa em qualquer direção. Deve ser protegido a todo custo.`,
      },
      {
        titulo: "Regras especiais",
        descricao: 
`${'\t'}Roque: troca de posição do rei com uma torre. O rei anda 2 casas para o lado da torre, 
e a torre salta por cima dele. Só é possível se:${"\n"}
${'\t'}Nenhuma peça tiver se movido.${"\n"}
${'\t'}Não houver peças entre eles.${"\n"}
${'\t'}O rei não estiver em xeque nem passar por casas atacadas.${"\n"}
${'\t'}Promoção: se um peão alcança a 8ª fileira, ele é promovido a qualquer peça 
(geralmente uma dama).${"\n"}
${'\t'}En passant: se um peão avança 2 casas e para ao lado de um peão inimigo, esse peão pode 
capturá-lo como se tivesse andado 1 casa, mas apenas no lance seguinte.`,
      },
    ],
  },
  {
    titulo: "🟡 Estratégias Básicas (Intermediário)",
    cor: cores.intermediario,
    itens: [
      {
        titulo: "Desenvolvimento",
        descricao: 
`${'\t'}No início, seu foco deve ser desenvolver suas peças rápido e com eficiência, especialmente cavalos e bispos, para controlar o centro e preparar o roque.`,
      },
      {
        titulo: "Controle do centro",
        descricao: 
`${'\t'}O centro do tabuleiro (casas d4, d5, e4, e5) é onde a ação acontece. Controlá-lo permite:${"\n"}
${'\t'}Maior mobilidade.${"\n"}
${'\t'}Maior domínio tático.${"\n"}
${'\t'}Acesso fácil a qualquer lado do tabuleiro.${"\n"}`,
      },
      {
        titulo: "Segurança do rei",
        descricao: 
`${'\t'}Um rei exposto é vulnerável. O roque protege o rei e conecta suas torres, tornando-as mais ativas.`,
      },
      {
        titulo: "Coordenação de peças",
        descricao: 
`${'\t'}Peças que trabalham juntas (ex: torre e dama alinhadas, cavalo e bispo pressionando a mesma casa) são muito mais fortes do que peças isoladas.`,
      },
      {
        titulo: "Evitar erros comuns",
        descricao: 
`${'\t'}Sair com a dama cedo a expõe a ataques.${"\n"}
${'\t'}Mover peões demais pode criar fraquezas.${"\n"}
${'\t'}Trocar peças sem necessidade pode enfraquecer sua posição.`,
      },
    ],
  },
  {
    titulo: "🔵 Táticas de Xadrez (Intermediário–Avançado)",
    cor: cores.avancado,
    itens: [
      {
        titulo: "Táticas básicas",
        descricao:
`${'\t'}Garfo: uma peça ataca duas (ex: cavalo atacando rei e torre).

${'\t'}Cravada: uma peça não pode se mover sem expor outra mais valiosa (ex: bispo cravando cavalo contra o rei).

${'\t'}Ataque descoberto: mover uma peça revela um ataque de outra (ex: mover peão e descobrir torre atrás).

${'\t'}Ataque duplo: dois ataques feitos em um único lance.`
      },
      {
        titulo: "Combinações",
        descricao:
        `
Sequência de lances forçados (sacrifícios, ataques múltiplos) que levam a ganho de material ou xeque-mate.
        `
      },
      {
        titulo: "Cálculo de variantes",
        descricao:
        `
Capacidade de visualizar lances futuros com precisão. Jogadores mais fortes “enxergam” 4, 5 ou mais lances à frente, considerando as respostas do adversário.
        `
      }
    ]
  }
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
                {(() => {
                  const id = `${idx}-${i}`;
                  const feito = progresso[id];
                  const expandido = expandidos[id];

                  return (
                    <View>
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
                              fontWeight: '700',
                              fontSize: 30,
                              padding: 12,
                              color: feito ? "#10b981" : "#000",
                              textDecorationLine: feito
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {feito ? "✅ " : "◻️ "} {item.titulo}
                          </Text>
                        </Pressable>

                        <TouchableOpacity
                          onPress={() => alternarExpandido(id)}
                          style={{ paddingHorizontal: 40 }}
                        >
                          <Text style={{ fontSize: 35, fontWeight: "900" }}>
                            {expandido ? "−" : "+"}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {expandido && (
                        <Text
                          style={{
                            fontSize: 25,
                            paddingHorizontal: 20,
                            paddingBottom: 10,
                            color: "#555",
                            fontWeight: '700'
                          }}
                        >
                          {item.descricao}
                        </Text>
                      )}
                    </View>
                  );
                })()}
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
