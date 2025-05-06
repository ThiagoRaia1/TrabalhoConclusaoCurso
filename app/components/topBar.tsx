// TopBarMenu.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";

type Props = {
  menuVisivel: boolean;
  setMenuVisivel: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TopBarMenu({ menuVisivel, setMenuVisivel }: Props) {
  console.log("TopBarMenu renderizado");
  const alternarMenu = () => {
    setMenuVisivel(!menuVisivel);
  };

  return (
    <View style={styles.topBar}>
      <View style={{ flexDirection: "row", gap: 40 }}>
        <Text style={styles.topBarText}>AI TEACHER</Text>
      </View>
      <View style={{ flexDirection: "row", gap: 40 }}>
        <Text style={styles.topBarText}>Topo</Text>
        <Text style={styles.topBarText}>Topo</Text>
        <Text style={styles.topBarText}>Topo</Text>
        <TouchableOpacity onPress={alternarMenu}>
          <FontAwesome name="user-circle" size={70} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function MenuSuspenso() {
  return (
    <View style={styles.menuSuspenso}>
      <TouchableOpacity
        onPress={() => {
          router.push("./meuPerfil");
        }}
      >
        <Text style={styles.menuItem}>Meu Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.push("./");
        }}
      >
        <Text style={styles.menuItem}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 100,
    flexDirection: "row",
    backgroundColor: "#242E3F",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 50,
    zIndex: 10,
  },
  topBarText: {
    color: "white",
    fontSize: 30,
    alignSelf: "center",
  },
  menuSuspenso: {
    position: "absolute",
    right: 30,
    top: 100,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 10,
    zIndex: 10,
    width: 300,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
