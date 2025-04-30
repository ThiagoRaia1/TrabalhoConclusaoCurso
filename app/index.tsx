import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StyleProp,
  ViewStyle,
  TextInput,
  Text
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useAuth } from "../context/auth";

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
              style={styles.input}
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
              style={styles.input}
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

          <TouchableOpacity
            style={[styles.button, getSoftShadow()]}
            onPress={() => handleLogin(senha)}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.imageArea}>
        <Text style={{ fontSize: 40, color: 'white' }}>Image Placeholder</Text>
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
  imageArea: {
    flex: 7,
    backgroundColor: "#2596be",
    justifyContent: "center",
    alignItems: "center",
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
  input: {
    flex: 1,
    fontSize: 26,
    maxWidth: '95%',
    height: 70,
  },
  button: {
    backgroundColor: "#2596be",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width: "40%",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
});
