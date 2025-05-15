import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  useWindowDimensions,
  LayoutAnimation,
  UIManager,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, usePathname } from "expo-router";

type Props = {
  menuVisivel: boolean;
  setMenuVisivel: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TopBarMenu({ menuVisivel, setMenuVisivel }: Props) {
  const { width } = useWindowDimensions();
  const iconSize = width < 400 ? 30 : 50;
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const tooltipTranslateY = useRef(new Animated.Value(8)).current;

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

  const fadeIn = () => {
    setShowTooltip(true);
    Animated.parallel([
      Animated.timing(tooltipOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(tooltipTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  };

  const fadeOut = () => {
    Animated.parallel([
      Animated.timing(tooltipOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(tooltipTranslateY, {
        toValue: 8,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start(() => setShowTooltip(false));
  };

  const handleTooltipToggle = (visible: boolean) => {
    if (Platform.OS === "web") {
      visible ? fadeIn() : fadeOut();
    } else {
      if (showTooltip) {
        fadeOut();
      } else {
        fadeIn();
      }
    }
  };

  return (
    <>
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>AI TEACHER</Text>

          <Pressable
            onHoverIn={() => handleTooltipToggle(true)}
            onHoverOut={() => handleTooltipToggle(false)}
            onPressIn={() => handleTooltipToggle(true)}
            onPressOut={() => {
              if (Platform.OS !== "web") setShowTooltip(false);
            }}
            style={{ marginLeft: 6 }}
          >
            <FontAwesome name="question-circle-o" size={20} color="#fff" />
            {showTooltip && (
              <Animated.View
                style={[
                  styles.tooltip,
                  {
                    opacity: tooltipOpacity,
                    transform: [{ translateY: tooltipTranslateY }],
                  },
                ]}
              >
                <Text style={styles.tooltipText}>
                  Plataforma para *auxiliar* no mapeamento do aprendizado com
                  inteligência artificial. Busque sempre por fontes confiáveis.
                </Text>
              </Animated.View>
            )}
          </Pressable>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.topBarButton,
              pathname === "/meusRoadmaps" && styles.activeButton,
            ]}
            onPress={() => router.push("/meusRoadmaps")}
          >
            <Text
              style={[
                styles.buttonText,
                pathname === "/meusRoadmaps" && styles.activeButtonText,
              ]}
            >
              MEUS ROADMAPS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.topBarButton,
              pathname === "/menuPrincipal" && styles.activeButton,
            ]}
            onPress={() => router.push("/menuPrincipal")}
          >
            <Text
              style={[
                styles.buttonText,
                pathname === "/menuPrincipal" && styles.activeButtonText,
              ]}
            >
              INÍCIO
            </Text>
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
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    bottom: 2,
  },
  tooltip: {
    position: "absolute",
    top: 28,
    left: -20,
    backgroundColor: "#F9FAFB",
    padding: 8,
    borderRadius: 6,
    width: 220,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    zIndex: 100,
  },
  tooltipText: {
    fontSize: 13,
    color: "#1F2937",
    textAlign: "justify",
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
  activeButton: {
    backgroundColor: "#10B981",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  activeButtonText: {
    color: "#fff",
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
