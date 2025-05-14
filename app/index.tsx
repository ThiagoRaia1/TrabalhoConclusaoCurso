import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  ScrollView,
  KeyboardAvoidingView,
  ViewStyle,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as Animatable from "react-native-animatable";
import { useAuth } from "../context/auth";
import { useNormalize } from "../utils/normalize";
import { router } from "expo-router";
import Carregando from "./components/carregando";

export default function Login() {
  const { usuario, handleLogin, setUsuario } = useAuth();
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const { width } = useWindowDimensions();
  const isWide = width > 700;

  const { normalize, normalizeHeight, normalizeFontWeight, normalizeIconSize } =
    useNormalize();

  const dynamicStyles = {
    text: {
      fontSize: normalize({ base: 8 }),
      fontWeight: normalizeFontWeight({ max: 400 }),
      color: "#222",
      marginBottom: 5,
    },
    titleText: {
      fontSize: normalize({ base: 28 }),
      fontWeight: normalizeFontWeight({ max: 600 }),
      color: "black",
      marginTop: -20,
    },
    inputText: {
      flex: 1,
      fontSize: normalize({ base: 7 }),
      fontWeight: normalizeFontWeight({ max: 400 }),
      color: "#000",
    },
    buttonText: {
      color: "white",
      fontSize: normalize({ base: 6 }),
      fontWeight: normalizeFontWeight({ max: 600 }),
    },
  };

  const backgroundColor = "#fff";
  const cardColor = "#fff";
  const inputBg = "#fff";
  const borderColor = "#319594";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={[
              styles.container,
              isWide ? styles.containerWide : styles.containerNarrow,
            ]}
          >
            <Animatable.View
              animation="fadeInUp"
              duration={800}
              style={[
                styles.loginArea,
                getStrongShadow(),
                { backgroundColor: cardColor },
              ]}
            >
              <View style={styles.loginContent}>
                <FontAwesome5
                  name="user-graduate"
                  size={normalizeIconSize(50, undefined, 150)}
                  color="black"
                />
                <Text style={dynamicStyles.titleText}>A.I. Teacher</Text>

                <View style={{ width: "100%", gap: 40 }}>
                  <View>
                    <Text style={dynamicStyles.text}>Email:</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        getSoftShadow(),
                        { backgroundColor: inputBg, borderColor },
                      ]}
                    >
                      <TextInput
                        style={[
                          dynamicStyles.inputText,
                          { height: normalizeHeight({ base: 15 }) },
                          Platform.OS === "web" &&
                            ({ outlineStyle: "none" } as any),
                        ]}
                        placeholder="Email"
                        placeholderTextColor="#aaa"
                        value={usuario.login}
                        onChangeText={(text) =>
                          setUsuario({ ...usuario, login: text })
                        }
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          setCarregando(true);
                          handleLogin(senha);
                        }}
                      />
                    </View>
                  </View>

                  <View>
                    <Text style={dynamicStyles.text}>Senha:</Text>
                    <View
                      style={[
                        styles.inputContainer,
                        getSoftShadow(),
                        { backgroundColor: inputBg, borderColor },
                      ]}
                    >
                      <TextInput
                        style={[
                          dynamicStyles.inputText,
                          { height: normalizeHeight({ base: 15 }) },
                          Platform.OS === "web" &&
                            ({ outlineStyle: "none" } as any),
                        ]}
                        placeholder="Senha"
                        placeholderTextColor="#aaa"
                        secureTextEntry={!mostrarSenha}
                        value={senha}
                        onChangeText={(text) => setSenha(text)}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          setCarregando(true);
                          handleLogin(senha);
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => setMostrarSenha(!mostrarSenha)}
                      >
                        <FontAwesome5
                          name={mostrarSenha ? "eye-slash" : "eye"}
                          size={normalizeIconSize(5)}
                          color="#000"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, getSoftShadow()]}
                    onPress={() => router.push("./cadastro")}
                  >
                    <Text style={dynamicStyles.buttonText}>Cadastre-se</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, getSoftShadow()]}
                    onPress={() => {
                      setCarregando(true);
                      handleLogin(senha);
                    }}
                  >
                    <Text style={dynamicStyles.buttonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animatable.View>
          </View>
        </ScrollView>
        {carregando && <Carregando />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  containerWide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  containerNarrow: {
    flexDirection: "column",
  },
  loginArea: {
    padding: 30,
    borderRadius: 20,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  loginContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 20,
    marginTop: 30,
  },
  button: {
    flex: 1,
    backgroundColor: "#2596be",
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});

// Sombra forte
const getStrongShadow = (): ViewStyle => {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
    };
  } else if (Platform.OS === "android") {
    return { elevation: 20 };
  } else {
    return { boxShadow: "0px 10px 30px rgba(0,0,0,0.4)" } as any;
  }
};

// Sombra leve
const getSoftShadow = (): ViewStyle => {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    };
  } else if (Platform.OS === "android") {
    return { elevation: 6 };
  } else {
    return { boxShadow: "0px 4px 10px rgba(0,0,0,0.2)" } as any;
  }
};
