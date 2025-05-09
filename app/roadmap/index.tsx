import React, { useEffect, useState } from "react";
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
import { Checkbox } from "react-native-paper";
import { router } from "expo-router";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";
import { useLocalSearchParams } from "expo-router";
import { getRoadmap, IRoadmap } from "./api";
import { useAuth } from "../../context/auth";

export default function Roadmap() {
  const { usuario } = useAuth();
  const [progresso, setProgresso] = useState<Record<string, boolean>>({});
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [roadmap, setRoadmap] = useState<IRoadmap | null>(null);

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
    const fetchRoadmap = async () => {
      try {
        const dados = await getRoadmap(temaStr, usuario.login);
        setRoadmap(dados);
      } catch (error) {
        console.error("Erro ao buscar roadmap:", error);
      }
    };

    carregarProgresso();
    fetchRoadmap();
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

        {roadmap?.fases?.map((secao, idx) => (
          <View key={idx} style={styles.secaoContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[styles.secaoTitulo, { backgroundColor: secao.cor }]}
              >
                {secao.titulo}
              </Text>

              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 0,
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  borderRadius: 10,
                  marginBottom: 8,
                  backgroundColor: "#027BFF",
                  borderWidth: 1,
                  borderColor: "#004691",
                }}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Gerar quiz
                </Text>
              </TouchableOpacity>
            </View>

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
    width: "100%",
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
