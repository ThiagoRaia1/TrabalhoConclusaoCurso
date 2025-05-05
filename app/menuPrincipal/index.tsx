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
import { MenuSuspenso, TopBarMenu } from "../components/topBar";

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text
          style={[styles.topBarText, { color: "black", alignSelf: "center" }]}
        >
          Crie seu primeiro Roadmap!
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { outlineStyle: "none" } as any]}
            placeholder="Digite o prompt para criação do roadmap"
            placeholderTextColor="#ccc"
            // onChangeText={(text) => setSenha(text)}
            returnKeyType="done"
            // onSubmitEditing={() => handleLogin(senha)} // Agora ENTER envia o login
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "./roadmapProgramacao",
              params: { tema: "Inteligência Artificial" },
            })
          }
        >
          <Text style={styles.buttonText}>Roadmap - Fundamentos de programação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "./roadmapXadrez",
              params: { tema: "Inteligência Artificial" },
            })
          }
        >
          <Text style={styles.buttonText}>Roadmap - Xadrez</Text>
        </TouchableOpacity>

        {/* Adicione mais itens para ver o scroll funcionando */}
        {resposta && (
          <View style={{ marginTop: 20, padding: 20 }}>
            <Text style={{ fontSize: 18 }}>{resposta}</Text>
          </View>
        )}
      </ScrollView>
      {menuVisivel && <MenuSuspenso />}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    gap: 20,
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
    fontSize: 26,
    maxWidth: "95%",
    height: 70,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#2596be",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    minWidth: "40%",
    minHeight: "5%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  topBarText: {
    color: "white",
    fontSize: 30,
    alignSelf: "center",
  },
});
