import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { enviarPrompt } from "../../services/groq";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";
import { createRoadmap, getRoadmap, IRoadmap } from "../roadmap/api";
import { useAuth } from "../../context/auth";
import { roadmapProgramacao, roadmapXadrez } from "../../data/roadmaps";

export default function MenuPrincipal() {
  const [prompt, setPrompt] = useState("");
  const [resposta, setResposta] = useState("");
  const { usuario } = useAuth();

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

  async function generateDefaultRoadmap(tema: string) {
    let roadmap: IRoadmap | undefined;

    switch (tema) {
      case "Programação":
        // Atribui o login do usuário ao roadmap de Programação
        roadmapProgramacao.usuarioLogin = usuario.login;
        roadmap = roadmapProgramacao; // Atribui a variável roadmap
        break;

      case "Xadrez":
        // Atribui o login do usuário ao roadmap de Xadrez
        roadmapXadrez.usuarioLogin = usuario.login;
        roadmap = roadmapXadrez; // Atribui a variável roadmap
        break;

      default:
        console.log("Tema não encontrado");
        return;
    }

    console.log(roadmap);
    await createRoadmap(roadmap); // Passa o roadmap para a função createRoadmap
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />

      <View style={styles.topContent}>
        <Text style={styles.message}>Crie seu Roadmap!</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { outlineStyle: "none" } as any]}
            placeholder="Digite o prompt para criação do roadmap"
            placeholderTextColor="#ccc"
            value={prompt}
            onChangeText={setPrompt}
            returnKeyType="done"
            // onSubmitEditing={gerarResposta}
            onSubmitEditing={() =>
              router.push({
                pathname: "./roadmap",
                params: { tema: prompt },
              })
            }
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            // router.push({
            //   pathname: "./roadmap",
            //   params: { tema: prompt },
            // })

            console.log("Prompt: ", prompt); // Verifique o valor do prompt
            const resposta = await enviarPrompt(prompt);
            console.log(resposta);
          }}
        >
          <Text style={styles.buttonText}>Gerar</Text>
        </TouchableOpacity>

        {resposta !== "" && (
          <View style={{ marginTop: 20, padding: 20 }}>
            <Text style={{ fontSize: 18 }}>{resposta}</Text>
          </View>
        )}
      </View>

      {/* Parte inferior centralizada */}
      <View style={styles.bottomContent}>
        <Text style={styles.message}>Conheça um de nossos Roadmaps!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              await getRoadmap("Programação", usuario.login);
              router.push({
                pathname: "./roadmap",
                params: { tema: "Programação" },
              });
            } catch (error: any) {
              if (error.message === "Roadmap não encontrado") {
                await generateDefaultRoadmap("Programação");
                router.push({
                  pathname: "./roadmap",
                  params: { tema: "Programação" },
                });
              }
            }
          }}
        >
          <Text style={styles.buttonText}>Fundamentos de programação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              await getRoadmap("Xadrez", usuario.login);
              router.push({
                pathname: "./roadmap",
                params: { tema: "Xadrez" },
              });
            } catch (error: any) {
              if (error.message === "Roadmap não encontrado") {
                await generateDefaultRoadmap("Xadrez");
                router.push({
                  pathname: "./roadmap",
                  params: { tema: "Xadrez" },
                });
              }
            }
          }}
        >
          <Text style={styles.buttonText}>Xadrez</Text>
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
    gap: 30,
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
    width: 700,
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
    width: 400,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
