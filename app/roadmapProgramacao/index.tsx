import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { Checkbox } from "react-native-paper";
import { router } from "expo-router";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";

const { width, height } = Dimensions.get("window");

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


const STORAGE_KEY = "progresso_programacao";

export default function Roadmap() {
  const [progresso, setProgresso] = useState<Record<string, boolean>>({});
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [menuVisivel, setMenuVisivel] = useState(false);

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

  const alternarExpandido = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    carregarProgresso();
  }, []);

  return (
    <View style={styles.container}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.voltarButton}
          onPress={() => router.push("./menuPrincipal")}
        >
          <Text style={styles.voltarText}>Voltar</Text>
        </TouchableOpacity>

        {secoes.map((secao, idx) => (
          <View key={idx} style={styles.secaoContainer}>
            <Text style={[styles.secaoTitulo, { backgroundColor: secao.cor }]}>
              {secao.titulo}
            </Text>

            {secao.itens.map((item, itemIdx) => {
              const id = `${idx}-${itemIdx}`;
              return (
                <View key={id} style={styles.itemContainer}>
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      status={progresso[id] ? "checked" : "unchecked"}
                      onPress={() => alternarProgresso(id)}
                    />
                    <Pressable
                      style={styles.itemHeader}
                      onPress={() => alternarExpandido(id)}
                    >
                      <Text style={styles.itemTitulo}>{item.titulo}</Text>
                      <Text style={styles.itemIcon}>
                        {expandidos[id] ? "−" : "+"}
                      </Text>
                    </Pressable>
                  </View>

                  {expandidos[id] && (
                    <Text style={styles.itemDescricao}>{item.descricao}</Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
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
    alignSelf: "flex-start",
  },
  voltarText: {
    color: "#fff",
    fontSize: 16,
  },
  secaoContainer: {
    marginBottom: 24,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
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
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
});