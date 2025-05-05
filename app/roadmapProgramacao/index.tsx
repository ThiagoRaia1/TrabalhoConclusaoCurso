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
    titulo: "🟢 Fundamentos da Programação (Iniciante)",
    cor: "#d1fae5",
    itens: [
      {
        titulo: "O que é programação?",
        descricao: 
`\tProgramar é dar instruções para o computador executar tarefas. 
\tEssas instruções são escritas em linguagens de programação.` 
      },
      {
        titulo: "Variáveis e tipos de dados",
        descricao: 
`\tVariáveis armazenam valores usados pelo programa.\n
\tExemplos de tipos:\n
\t• Inteiros (int): números sem casas decimais\n
\t• Reais (float): números com casas decimais\n
\t• Texto (string): sequência de caracteres\n
\t• Booleano (bool): verdadeiro ou falso` 
      },
      {
        titulo: "Operadores",
        descricao:
`\tUsados para realizar cálculos e comparações.\n
\t• Aritméticos: +, -, *, /, %\n
\t• Relacionais: ==, !=, >, <\n
\t• Lógicos: &&, ||, !`
      },
      {
        titulo: "Entrada e saída de dados",
        descricao:
`\tEntrada: receber informações do usuário (ex: prompt, input).\n
\tSaída: mostrar informações (ex: print, console.log).`
      }
    ]
  },
  {
    titulo: "🟡 Estruturas e Lógica (Intermediário)",
    cor: "#fef3c7",
    itens: [
      {
        titulo: "Condicionais",
        descricao:
`\tPermitem executar diferentes blocos de código com base em condições.\n
\tExemplo:\n
\tif (idade >= 18) {\n
\t\tconsole.log("Maior de idade");\n
\t} else {\n
\t\tconsole.log("Menor de idade");\n
\t}`
      },
      {
        titulo: "Laços de repetição",
        descricao:
`\tPermitem repetir um bloco de código várias vezes.\n
\tExemplos:\n
\t• for: laço com contador\n
\t• while: laço com condição\n
\t• do...while: executa pelo menos uma vez`
      },
      {
        titulo: "Funções",
        descricao:
`\tFunções agrupam instruções reutilizáveis.\n
\tExemplo:\n
\tfunction somar(a, b) {\n
\t\treturn a + b;\n
\t}`
      },
      {
        titulo: "Listas e vetores",
        descricao:
`\tEstruturas que armazenam múltiplos valores.\n
\tExemplo em JavaScript:\n
\tlet numeros = [1, 2, 3, 4];`
      }
    ]
  },
  {
    titulo: "🔵 Conceitos Avançados (Avançado)",
    cor: "#dbeafe",
    itens: [
      {
        titulo: "Programação orientada a objetos (POO)",
        descricao:
`\tModelo baseado em objetos e classes.\n
\tConceitos:\n
\t• Classe: molde para criar objetos\n
\t• Objeto: instância com atributos e métodos\n
\t• Herança, encapsulamento e polimorfismo`
      },
      {
        titulo: "Recursão",
        descricao:
`\tFunção que chama a si mesma para resolver um problema.\n
\tÚtil para algoritmos como fatorial, Fibonacci, etc.`
      },
      {
        titulo: "Algoritmos e complexidade",
        descricao:
`\tEstudo de eficiência de algoritmos.\n
\t• Complexidade de tempo (ex: O(n))\n
\t• Complexidade de espaço\n
\tAjuda a escrever código mais rápido e eficiente.`
      },
      {
        titulo: "Estruturas de dados",
        descricao:
`\tTécnicas de organização de dados:\n
\t• Pilha (stack), fila (queue)\n
\t• Árvores, grafos\n
\t• Mapas, conjuntos (sets)`
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
    width: "70%",
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
