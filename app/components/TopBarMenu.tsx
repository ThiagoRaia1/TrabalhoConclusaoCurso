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
  const iconSize = width < 500 ? 40 : 50;
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const tooltipTranslateY = useRef(new Animated.Value(8)).current;

  const isSmallScreen = width < 500;

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
      <View
        style={[
          styles.topBar,
          isSmallScreen && {
            flexDirection: "column",
            alignItems: "flex-start",
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>A.I. TEACHER</Text>

          <Pressable
            onHoverIn={() => handleTooltipToggle(true)}
            onHoverOut={() => handleTooltipToggle(false)}
            onPress={() => handleTooltipToggle(!showTooltip)}
            style={{ marginRight: 10 }}
          >
            <FontAwesome name="question-circle-o" size={20} color="#fff" />
          </Pressable>
        </View>

        <View
          style={[
            styles.buttonGroup,
            isSmallScreen && {
              alignSelf: "flex-end",
              marginTop: 10,
              width: "100%",
              justifyContent: "space-between",
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.topBarButton,
              pathname === "/meusRoadmaps" && { backgroundColor: "#10B981" },
              isSmallScreen && {
                flex: 1,
                height: "100%",
                justifyContent: "center",
              },
            ]}
            onPress={() => router.push("/meusRoadmaps")}
          >
            <Text
              style={[
                styles.buttonText,
                pathname === "/meusRoadmaps" && { color: "#fff" },
                { textAlign: "center" },
              ]}
            >
              MEUS ROADMAPS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.topBarButton,
              pathname === "/menuPrincipal" && { backgroundColor: "#10B981" },
              isSmallScreen && {
                flex: 1,
                height: "100%",
                justifyContent: "center",
              },
            ]}
            onPress={() => router.push("/menuPrincipal")}
          >
            <Text
              style={[
                styles.buttonText,
                pathname === "/menuPrincipal" && { color: "#fff" },
                { textAlign: "center" },
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

      {showTooltip && (
        <Animated.View
          style={[
            styles.tooltip,
            {
              opacity: tooltipOpacity,
              transform: [{ translateY: tooltipTranslateY }],
              top: isSmallScreen ? 45 : Platform.OS === "web" ? 55 : 65, // Ajuste conforme necessário
            },
          ]}
        >
          <Text style={styles.tooltipText}>
            Plataforma para *auxiliar* no mapeamento do aprendizado com
            inteligência artificial. Busque sempre por fontes confiáveis.
          </Text>
        </Animated.View>
      )}
    </>
  );
}

export function MenuSuspenso() {
  const { width } = useWindowDimensions();
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuTranslateY = useRef(new Animated.Value(8)).current;

  const isSmallScreen = width < 500;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(menuOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(menuTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.menuSuspenso,
        {
          opacity: menuOpacity,
          transform: [{ translateY: menuTranslateY }],
          top: width <= 375 ? 105 : isSmallScreen ? 95 : Platform.OS === "web" ? 65 : 90,
        },
      ]}
    >
      <TouchableOpacity onPress={() => router.push("/meuPerfil")}>
        <Text style={styles.menuItem}>Meu Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text style={styles.menuItem}>Logout</Text>
      </TouchableOpacity>
    </Animated.View>
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
    zIndex: 1,
  },
  logoContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    maxWidth: 190,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    bottom: 2,
  },
  tooltip: {
    position: "absolute",
    left: 20,
    backgroundColor: "#F9FAFB",
    padding: 8,
    borderRadius: 6,
    width: 220,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
    zIndex: 20,
  },
  tooltipText: {
    fontSize: 13,
    color: "#1F2937",
    textAlign: "justify",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  topBarButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#374151",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  menuSuspenso: {
    position: "absolute",
    right: 20,
    top: Platform.OS === "web" ? 80 : 100,
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
