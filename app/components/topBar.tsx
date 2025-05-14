import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  useWindowDimensions,
  LayoutAnimation,
  UIManager,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";

type Props = {
  menuVisivel: boolean;
  setMenuVisivel: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TopBarMenu({ menuVisivel, setMenuVisivel }: Props) {
  const { width } = useWindowDimensions();
  const iconSize = width < 400 ? 30 : 50;

  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleMenu = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMenuVisivel(!menuVisivel);
  };

  return (
    <>
      <View style={styles.topBar}>
        <Text style={styles.logoText}>AI TEACHER</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.topBarButton}
            onPress={() => router.push("./meusRoadmaps")}
          >
            <Text style={styles.buttonText}>MEUS ROADMAPS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topBarButton}
            onPress={() => router.push("./menuPrincipal")}
          >
            <Text style={styles.buttonText}>INÍCIO</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMenu}>
            <FontAwesome name="user-circle" size={iconSize} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {menuVisivel && <MenuSuspenso />}
    </>
  );
}

export function MenuSuspenso() {
  return (
    <View style={styles.menuSuspenso}>
      <TouchableOpacity onPress={() => router.push("./meuPerfil")}>
        <Text style={styles.menuItem}>Meu Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("./")}>
        <Text style={styles.menuItem}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1F2937",
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topBarButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#374151",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  menuSuspenso: {
    position: "absolute",
    right: 20,
    top: Platform.OS === "web" ? 75 : 100,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    paddingVertical: 10,
    width: 220,
    zIndex: 30,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
});
