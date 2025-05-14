import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Carregando() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // garante que fique por cima de tudo
  },
});
