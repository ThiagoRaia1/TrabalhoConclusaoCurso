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
  ScrollView,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { cadastrarUsuario } from "./api";
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
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
    <ScrollView style={{ backgroundColor: '#ccc' }}>
      <View style={[styles.elevation, getStrongShadow()]}>
        <TouchableOpacity style={{ position: "absolute", top: 10, right: 10 }} onPress={() => router.push('./')}>
          <MaterialIcons name="logout" size={50} color="black"/>
        </TouchableOpacity>
        <View style={{ alignItems: "center", marginTop: 80 }}>
          <FontAwesome5 name="user-graduate" size={250} color="black" />
          <Text style={styles.titleText}>AI Teacher</Text>
        </View>

        <View
          style={{
            width: "80%",
            gap: 20,
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              padding: 20,
            }}
          >
            <Text
              style={{
                alignSelf: "flex-start",
                fontSize: normalize(20),
                fontWeight: "600",
                color: "black",
              }}
            >
              Nome:
            </Text>
            <View style={[styles.inputContainer, getSoftShadow()]}>
              <TextInput
                /* O "as any" ignora o erro*/
                style={[styles.input, { outlineStyle: "none" } as any]}
                placeholder="Nome"
                placeholderTextColor="#ccc"
                value={nome}
                onChangeText={(nome) => setNome(nome)}
                returnKeyType="done"
              // onSubmitEditing={() => handleLogin(senha)} // Agora ENTER envia o login
              />
            </View>
          </View>

          <View
            style={{
              width: "100%",
              padding: 20,
            }}
          >
            <Text
              style={{
                alignSelf: "flex-start",
                fontSize: normalize(20),
                fontWeight: "600",
                color: "black",
              }}
            >
              Email:
            </Text>
            <View style={[styles.inputContainer, getSoftShadow()]}>
              <TextInput
                /* O "as any" ignora o erro*/
                style={[styles.input, { outlineStyle: "none" } as any]}
                placeholder="Email"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={(email) => setEmail(email)}
                returnKeyType="done"
              // onSubmitEditing={() => handleLogin(senha)} // Agora ENTER envia o login
              />
            </View>
          </View>
          <View
            style={{
              width: "100%",
              padding: 20,
            }}
          >
            <Text
              style={{
                alignSelf: "flex-start",
                fontSize: normalize(20),
                fontWeight: "600",
                color: "black",
              }}
            >
              Senha:
            </Text>
            <View style={[styles.inputContainer, getSoftShadow()]}>
              <TextInput
                style={[styles.input, { outlineStyle: "none" } as any]}
                placeholder="Senha"
                placeholderTextColor="#ccc"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={(senha) => setSenha(senha)}
                returnKeyType="done"
              // onSubmitEditing={() => handleLogin(senha)} // Agora ENTER envia o login
              />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <FontAwesome5
                  name={mostrarSenha ? "eye-slash" : "eye"}
                  size={30}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.button, getSoftShadow()]}
            onPress={async () => {
              try {
                await cadastrarUsuario(email, senha, nome);
                router.push("./cadastro");
              } catch (error: any) {
                setErro(error.message); // Captura o erro da API
                setMostrarErro(true); // Exibe a mensagem de erro
              }
            }}
          >
            <Text style={[styles.buttonText]}>Realizar cadastro</Text>
          </TouchableOpacity>
          {mostrarErro && <Text style={{ fontSize: normalize(20) }}>{erro}</Text>}
        </View>
      </View>
    </ScrollView>
  );
}

// Sombra forte (para elevation)
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
  elevation: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white", // necessário para sombra
    padding: 30,
    paddingBottom: 100,
    borderRadius: 20,
    margin: 20,
  },
  titleText: {
    fontSize: 50,
    fontWeight: '600',
    color: "black",
  },
  input: {
    flex: 1,
    fontSize: 35,
    maxWidth: "95%",
    height: 70,
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderWidth: 1,
    borderColor: "#319594",
    borderRadius: 8,
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#2596be",
    paddingHorizontal: 20,
    borderRadius: 100,
    width: "40%",
    height: "12%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 35,
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
