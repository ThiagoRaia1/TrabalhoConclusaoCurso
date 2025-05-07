import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import { router } from "expo-router";
import { enviarPrompt } from "../../services/openai";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";

const { height: windowHeight } = Dimensions.get("window"); // Altura da tela

export default function MenuPrincipal() {
  const [prompt, setPrompt] = useState("");
  const [resposta, setResposta] = useState("");

  // Dentro de MenuPrincipal
  const [menuVisivel, setMenuVisivel] = useState(false);

  const [carregando, setCarregando] = useState(false);

  const gerarResposta = async () => {
    if (carregando) return;
    setCarregando(true);
    const resultado = await enviarPrompt(prompt);
    setResposta(resultado);
    setCarregando(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />

      <View style={styles.topContent}>
        <Text style={styles.topBarText}>Crie seu primeiro Roadmap!</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { outlineStyle: "none" } as any]}
            placeholder="Digite o prompt para criação do roadmap"
            placeholderTextColor="#ccc"
            value={prompt}
            onChangeText={setPrompt}
            returnKeyType="done"
            onSubmitEditing={gerarResposta}
          />
        </View>

        {resposta !== "" && (
          <View style={{ marginTop: 20, padding: 20 }}>
            <Text style={{ fontSize: 18 }}>{resposta}</Text>
          </View>
        )}
      </View>

      {/* Parte inferior centralizada */}
      <View style={styles.bottomContent}>
        <Text>Conheça um de nossos Roadmaps!</Text>

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
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  bottomContent: {
    alignSelf: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 40,
    minWidth: "40%",
  },
  topBarText: {
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
    borderRadius: 100,
    minWidth: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
