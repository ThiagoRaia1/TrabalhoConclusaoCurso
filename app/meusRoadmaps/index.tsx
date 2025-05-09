import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { fetchRoadmapsByLogin, Roadmap } from "./api";
import { useAuth } from "../../context/auth";
import TopBarMenu from "../components/topBar";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MeusRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const { usuario } = useAuth();
  const [menuVisivel, setMenuVisivel] = useState(false);

  useEffect(() => {
    const carregarRoadmaps = async () => {
      try {
        const dados = await fetchRoadmapsByLogin(usuario.login);
        setRoadmaps(dados);
      } catch (error) {
        console.error("Erro ao buscar roadmaps:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarRoadmaps();
  }, []);

  if (loading) {
    return (
      <View>
        <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2496BE" />
          <Text style={{ marginTop: 10, fontSize: 16 }}>
            Carregando seus roadmaps...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Meus Roadmaps</Text>

        <View style={styles.roadmapList}>
          {roadmaps.map((roadmap, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.button,
                pressed && { borderBottomWidth: 0 },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/roadmap",
                  params: { tema: roadmap.titulo },
                })
              }
            >
              <Text style={styles.buttonText} selectable={false}>
                {roadmap.titulo}
              </Text>
            </Pressable>
          ))}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: "#4CAF50", borderColor: "#1d5e2f" },
              pressed && { borderBottomWidth: 0 },
            ]}
            onPress={() => router.push("/menuPrincipal")}
          >
            <Ionicons name="add-circle-outline" size={60} color="white" />
            <Text style={styles.buttonText} selectable={false}>
              Criar Roadmap
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  roadmapList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
    rowGap: 16,
  },
  button: {
    backgroundColor: "#2496BE",
    width: 210,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderBottomWidth: 4,
    borderColor: "#196f8c",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    backgroundColor: "white",
  },
});
