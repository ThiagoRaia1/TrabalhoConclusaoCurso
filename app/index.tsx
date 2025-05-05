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
  Image,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "../context/auth";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

export default function Login() {
  const { usuario, handleLogin, setUsuario } = useAuth();
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.loginArea, getStrongShadow()]}>
        <View style={styles.loginContent}>
          <FontAwesome5 name="user-graduate" size={150} color="black" />
          <Text style={styles.titleText}>AI Teacher</Text>

          <View style={[styles.inputContainer, getSoftShadow()]}>
            <TextInput
              /* O "as any" ignora o erro*/
              style={[styles.input, { outlineStyle: "none" } as any]}
              placeholder="Email"
              placeholderTextColor="#ccc"
              value={usuario.login}
              onChangeText={(text) => setUsuario({ ...usuario, login: text })}
              returnKeyType="done"
              onSubmitEditing={() => handleLogin(senha)} // Agora ENTER envia o login
            />
          </View>

          <View style={[styles.inputContainer, getSoftShadow()]}>
            <TextInput
              style={[styles.input, { outlineStyle: "none" } as any]}
              placeholder="Senha"
              placeholderTextColor="#ccc"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={(text) => setSenha(text)}
              returnKeyType="done"
              onSubmitEditing={() => handleLogin(senha)} // Agora ENTER envia o login
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
              <FontAwesome5
                name={mostrarSenha ? "eye-slash" : "eye"}
                size={30}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: '100%',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              style={[styles.button, getSoftShadow()]}
              onPress={() => router.push('./cadastro')}
            >
              <Text style={[styles.buttonText, {fontSize: 18}]}>Cadastre-se</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, getSoftShadow()]}
              onPress={() => handleLogin(senha)}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.imageArea}>
        <Image
          source={require("../assets/menuInicialTemporario.png")}
          style={styles.backgroundImage}
          resizeMode="contain"
        />
        <Text style={styles.propagandaText}>
          Ensino otimizado e{"\n"}personalizado para você
        </Text>
        {/* Borra a imagem */}
        {/* <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFill} /> */}
      </View>
    </View>
  );
}

// Sombra forte (para loginArea)
const getStrongShadow = (): StyleProp<ViewStyle> => {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
    };
  }

  if (Platform.OS === "android") {
    return {
      elevation: 20,
    };
  }

  if (Platform.OS === "web") {
    return {
      boxShadow: "0px 10px 30px rgba(0,0,0,0.4)",
    };
  }

  return {};
};

// Sombra suave (para inputs e botão)
const getSoftShadow = (): StyleProp<ViewStyle> => {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    };
  }

  if (Platform.OS === "android") {
    return {
      elevation: 6,
    };
  }

  if (Platform.OS === "web") {
    return {
      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
    };
  }

  return {};
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  loginArea: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // necessário para sombra
    padding: 30,
    borderRadius: 20,
    margin: 20,
  },
  titleText: {
    fontSize: 40,
    color: "black",
  },
  loginContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: "90%",
    marginBottom: 60,
  },
  input: {
    flex: 1,
    fontSize: 26,
    maxWidth: "95%",
    height: 70,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: "#319594",
    borderRadius: 8,
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#2596be",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width: "40%",
    height: '100%',
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  imageArea: {
    flex: 7,
    flexDirection: "row",
    backgroundColor: "#2596be",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  backgroundImage: {
    maxWidth: "60%",
  },
  propagandaText: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
  },
});
