import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { Checkbox } from "react-native-paper";
import { router } from "expo-router";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";
import secoesProgramacao from "../../data/roadmapProgramacao";
import secoesXadrez from "../../data/roadmapXadrez";
import { useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get("window");

const temas = [
  ...secoesProgramacao.map((secao) => ({ ...secao, categoria: "Programação" })),
  ...secoesXadrez.map((secao) => ({ ...secao, categoria: "Xadrez" })),
];

export default function Roadmap() {
  const [progresso, setProgresso] = useState<Record<string, boolean>>({});
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [menuVisivel, setMenuVisivel] = useState(false);
  const { tema } = useLocalSearchParams();
  const temaStr = typeof tema === "string" ? tema : ""; // Garantir string
  const STORAGE_KEY = `progresso_${temaStr}`;

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
          onPress={() => router.back()}
        >
          <Text style={styles.voltarText}>Voltar</Text>
        </TouchableOpacity>

        {temas
          .filter((secao) => secao.categoria === tema)
          .map((secao, idx) => (
            <View key={idx} style={styles.secaoContainer}>
              <Text
                style={[styles.secaoTitulo, { backgroundColor: secao.cor }]}
              >
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
                        <Text
                          style={[
                            styles.itemTitulo,
                            progresso[id] && {
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
                      <Text style={styles.itemDescricao}>{item.descricao}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
      </ScrollView>
      {menuVisivel && <MenuSuspenso />}
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
