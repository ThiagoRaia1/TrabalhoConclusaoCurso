import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StyleProp,
  ViewStyle,
  TextInput,
  Text,
  Dimensions,
  PixelRatio,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import cadastrarUsuario from "../../services/apiCadastro";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 320;

function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function Login() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarErro, setMostrarErro] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: "#ccc" }]}>
      <View style={[styles.elevation, getStrongShadow()]}>
        <TouchableOpacity
          style={styles.arrowBack}
          onPress={() => router.push("./")}
        >
          <MaterialIcons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <FontAwesome5 name="user-graduate" size={100} color="black" />
          <Text style={styles.titleText}>AI Teacher</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.labelInputBlock}>
            <Text style={styles.label}>Nome:</Text>
            <View style={[styles.inputContainer, getSoftShadow()]}>
              <TextInput
                style={[styles.input, { outlineStyle: "none" } as any]}
                placeholder="Nome"
                placeholderTextColor="#ccc"
                value={nome}
                onChangeText={setNome}
                returnKeyType="done"
              />
            </View>
          </View>

          <View style={styles.labelInputBlock}>
            <Text style={styles.label}>Email:</Text>
            <View style={[styles.inputContainer, getSoftShadow()]}>
              <TextInput
                style={[styles.input, { outlineStyle: "none" } as any]}
                placeholder="Email"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
                returnKeyType="done"
              />
            </View>
          </View>

          <View style={styles.labelInputBlock}>
            <Text style={styles.label}>Senha:</Text>
            <View style={[styles.inputContainer, getSoftShadow()]}>
              <TextInput
                style={[styles.input, { outlineStyle: "none" } as any]}
                placeholder="Senha"
                placeholderTextColor="#ccc"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <FontAwesome5
                  name={mostrarSenha ? "eye-slash" : "eye"}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, getSoftShadow()]}
            onPress={async () => {
              try {
                await cadastrarUsuario(nome, email, senha);
                router.push("./cadastro");
              } catch (error: any) {
                setErro(error.message);
                setMostrarErro(true);
              }
            }}
          >
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          {mostrarErro && <Text style={styles.erroText}>{erro}</Text>}
        </View>
      </View>
    </View>
  );
}

// Sombras
const getStrongShadow = (): StyleProp<ViewStyle> => {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
    };
  }
  if (Platform.OS === "android") return { elevation: 20 };
  if (Platform.OS === "web")
    return { boxShadow: "0px 10px 30px rgba(0,0,0,0.4)" };
  return {};
};

const getSoftShadow = (): StyleProp<ViewStyle> => {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    };
  }
  if (Platform.OS === "android") return { elevation: 6 };
  if (Platform.OS === "web")
    return { boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" };
  return {};
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  elevation: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "white",
    alignItems: "center",
  },
  arrowBack: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "600",
    color: "black",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    gap: 10,
    paddingTop: 10,
  },
  labelInputBlock: {
    width: "60%",
  },
  label: {
    fontSize: normalize(6),
    fontWeight: "600",
    color: "black",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#319594",
    borderRadius: 8,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 18,
    height: 40,
    backgroundColor: "white",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#2596be",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  erroText: {
    fontSize: normalize(5),
    color: "red",
    marginTop: 10,
  },
});
