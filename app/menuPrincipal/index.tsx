import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { enviarPrompt } from "../../services/groq";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";
import {
  createRoadmap,
  getRoadmap,
  IRoadmap,
  normalizeTituloRoadmap,
} from "../../services/roadmaps";
import { useAuth } from "../../context/auth";
import { roadmapProgramacao, roadmapXadrez } from "../../data/roadmaps";
import Carregando from "../components/carregando";
import Icon from "react-native-vector-icons/Ionicons";

export default function MenuPrincipal() {
  const [prompt, setPrompt] = useState("");
  const [resposta, setResposta] = useState("");
  const { usuario } = useAuth();
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const { width } = useWindowDimensions();
  const isWeb = width >= 900;

  const gerarResposta = async () => {
    if (carregando) return;
    setCarregando(true);
    const tituloNormalized = await normalizeTituloRoadmap(prompt);

    try {
      await getRoadmap(tituloNormalized, usuario.login);
      alert("Roadmap já existe.");
      router.push({
        pathname: "./roadmap",
        params: { tema: tituloNormalized },
      });
      return null;
    } catch (error: any) {
      if (error.message === "Roadmap não encontrado") {
        const resultado = await enviarPrompt(prompt, usuario.login);
        setCarregando(false);
        return resultado;
      }
    }
  };

  async function generateDefaultRoadmap(tema: string) {
    let roadmap: IRoadmap | undefined;
    switch (tema) {
      case "PROGRAMACAO":
        roadmapProgramacao.usuarioLogin = usuario.login;
        roadmap = roadmapProgramacao;
        break;
      case "XADREZ":
        roadmapXadrez.usuarioLogin = usuario.login;
        roadmap = roadmapXadrez;
        break;
      default:
        return;
    }
    await createRoadmap(roadmap);
  }

  return (
    <View style={styles.container}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: width < 600 ? 20 : 50, marginTop: 180 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>🚀 Crie seu Roadmap personalizado!</Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Design de jogos"
            placeholderTextColor="#aaa"
            value={prompt}
            onChangeText={setPrompt}
            returnKeyType="done"
            onSubmitEditing={gerarResposta}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              setCarregando(true);
              if (prompt === "") {
                setResposta("Digite o prompt");
                setCarregando(false);
              } else {
                const respostaGerada = await gerarResposta();
                if (!respostaGerada) return;
                const parsedData = await JSON.parse(respostaGerada.trim());
                const roadmap: IRoadmap = parsedData;
                await createRoadmap(roadmap);

                router.push({
                  pathname: "./roadmap",
                  params: { tema: prompt.toUpperCase() },
                });
              }
            }}
          >
            <Icon
              name="sparkles-outline"
              size={22}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Gerar Roadmap com IA</Text>
          </TouchableOpacity>

          {resposta !== "" && <Text style={styles.alertText}>{resposta}</Text>}

          <View style={styles.divider} />

          <Text style={styles.subtitle}>✨ Exemplos para começar rápido:</Text>

          <View
            style={[
              styles.examplesContainer,
              isWeb && { flexDirection: "row", gap: 20 },
            ]}
          >
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={async () => {
                setCarregando(true);
                try {
                  await getRoadmap("PROGRAMACAO", usuario.login);
                  router.push({
                    pathname: "./roadmap",
                    params: { tema: "PROGRAMACAO" },
                  });
                } catch (error: any) {
                  if (error.message === "Roadmap não encontrado") {
                    await generateDefaultRoadmap("PROGRAMACAO");
                    router.push({
                      pathname: "./roadmap",
                      params: { tema: "PROGRAMACAO" },
                    });
                  }
                }
              }}
            >
              <Icon name="code-slash-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Fundamentos de Programação</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={async () => {
                setCarregando(true);
                try {
                  await getRoadmap("XADREZ", usuario.login);
                  router.push({
                    pathname: "./roadmap",
                    params: { tema: "XADREZ" },
                  });
                } catch (error: any) {
                  if (error.message === "Roadmap não encontrado") {
                    await generateDefaultRoadmap("XADREZ");
                    router.push({
                      pathname: "./roadmap",
                      params: { tema: "XADREZ" },
                    });
                  }
                }
              }}
            >
              <Icon name="game-controller-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Xadrez</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {menuVisivel && <MenuSuspenso />}
      {carregando && <Carregando />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f4f9",
  },
  scrollContent: {
    alignItems: "center",
    gap: 25,
    paddingTop: 30,
    paddingBottom: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 700,
    height: 60,
    borderWidth: 1,
    borderColor: "#38bdf8",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#0ea5e9",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    maxWidth: 400,
  },
  secondaryButton: {
    backgroundColor: "#64748b",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "100%",
    maxWidth: 400,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  alertText: {
    color: "#dc2626",
    fontSize: 16,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    width: "80%",
    marginVertical: 20,
  },
  examplesContainer: {
    flexDirection: "column", // Mantém os botões empilhados
    alignItems: "center", // Centraliza horizontalmente
    justifyContent: "center",
    width: "100%",
    gap: 16,
  },
});
