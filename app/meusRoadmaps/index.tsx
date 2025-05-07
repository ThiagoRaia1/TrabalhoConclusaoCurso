import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";

function RenderRoadmapSelector() {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#2496BE",
        width: "20%",
        height: "20%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 25 }}>Programação</Text>
    </TouchableOpacity>
  );
}

export default function MeusRoadmaps() {
  // Dentro de MenuPrincipal
  const [menuVisivel, setMenuVisivel] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
      <View style={styles.topContent}>
        {RenderRoadmapSelector()}
        {RenderRoadmapSelector()}
      </View>
      {/* Parte inferior centralizada */}
      <View style={styles.bottomContent}>
        <Text style={styles.message}>Conheça um de nossos Roadmaps!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "./roadmap",
              params: { tema: "Programação" },
            })
          }
        >
          <Text style={styles.buttonText}>
            Roadmap - Fundamentos de programação
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({ pathname: "./roadmap", params: { tema: "Xadrez" } })
          }
        >
          <Text style={styles.buttonText}>Roadmap - Xadrez</Text>
        </TouchableOpacity>
      </View>

      {menuVisivel && <MenuSuspenso />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between", // separa parte de cima e de baixo
  },
  topContent: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 20,
    margin: 20,
  },
  bottomContent: {
    alignSelf: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 40,
    minWidth: "40%",
  },
  message: {
    fontSize: 30,
    color: "black",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    width: "50%",
    borderWidth: 1,
    borderColor: "#319594",
    borderRadius: 8,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 20,
    height: 60,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#2596be",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
