import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

function RenderRoadmapSelector({ tema }: { tema: string }) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => router.push({ pathname: "/roadmap", params: { tema } })}
      style={{
        backgroundColor: "#2496BE",
        width: 200,
        height: 130,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        borderBottomWidth: pressed ? 0 : 5,
        borderColor: "#196f8c",
      }}
    >
      <Text style={{ color: "white", fontSize: 25 }} selectable={false}>
        {tema}
      </Text>
    </Pressable>
  );
}

function RenderCreateRoadmap() {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => router.push({ pathname: "/menuPrincipal" })}
      style={{
        backgroundColor: "#2496BE",
        width: 200,
        height: 130,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        borderBottomWidth: pressed ? 0 : 5,
        borderColor: "#196f8c",
      }}
    >
      <Ionicons name="add-circle-outline" size={60} color="white" />
      <Text
        style={{
          color: "white",
          fontSize: 18,
          justifyContent: "flex-end",
          fontWeight: "500",
        }}
        selectable={false}
      >
        Criar Roadmap
      </Text>
    </Pressable>
  );
}

export default function MeusRoadmaps() {
  const [menuVisivel, setMenuVisivel] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
      <View style={styles.topContent}>
        <RenderRoadmapSelector tema="Programação" />
        <RenderRoadmapSelector tema="Xadrez" />
        <RenderCreateRoadmap />
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
