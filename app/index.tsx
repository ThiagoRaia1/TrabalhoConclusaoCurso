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
import Carregando from "./components/Carregando";

export default function Login() {
  const { usuario, handleLogin, setUsuario } = useAuth();
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const { width } = useWindowDimensions();
  const isWide = width > 700;

  const { normalize, normalizeFontWeight, normalizeIconSize } = useNormalize();

  const dynamicStyles = {
    label: {
      fontSize: normalize({ base: 7, min: 24 }),
      fontWeight: normalizeFontWeight({ max: 500 }),
      color: "#444",
      marginBottom: 6,
    },
    inputText: {
      width: "85%",
      fontSize: normalize({ base: 4, min: 20 }),
      fontWeight: normalizeFontWeight({ max: 400 }),
      color: "#000",
    },
    buttonText: {
      color: "white",
      fontSize: normalize({ base: 6, min: 18, max: 22 }),
      fontWeight: normalizeFontWeight({ max: 600 }),
    },
    titleText: {
      fontSize: normalize({ base: 24 }),
      fontWeight: normalizeFontWeight({ max: 700 }),
      color: "#222",
      marginVertical: 10,
    },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
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
              duration={700}
              style={[styles.card, getStrongShadow()]}
            >
              <View style={styles.cardContent}>
                <FontAwesome5
                  name="user-graduate"
                  size={normalizeIconSize(60)}
                  color="black"
                />
                <Text style={dynamicStyles.titleText}>A.I. Teacher</Text>

                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={dynamicStyles.label}>Email</Text>
                    <View style={[styles.inputContainer, getSoftShadow()]}>
                      <TextInput
                        style={[
                          dynamicStyles.inputText,
                          { width: "100%" },
                          Platform.OS === "web" &&
                            ({ outlineStyle: "none" } as any),
                        ]}
                        placeholder="Digite seu email"
                        placeholderTextColor="#aaa"
                        value={usuario.login}
                        onChangeText={(text) =>
                          setUsuario({ ...usuario, login: text })
                        }
                        keyboardType="email-address"
                        returnKeyType="next"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={dynamicStyles.label}>Senha</Text>
                    <View style={[styles.inputContainer, getSoftShadow()]}>
                      <TextInput
                        style={[
                          dynamicStyles.inputText,
                          Platform.OS === "web" &&
                            ({ outlineStyle: "none" } as any),
                        ]}
                        placeholder="Digite sua senha"
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

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: "#666" }]}
                      onPress={() => router.push("./cadastro")}
                    >
                      <Text style={dynamicStyles.buttonText}>Cadastre-se</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: "#2596be" }]}
                      onPress={async () => {
                        try {
                          setCarregando(true);
                          await handleLogin(senha);
                        } finally {
                          setCarregando(false);
                        }
                      }}
                    >
                      <Text style={dynamicStyles.buttonText}>Login</Text>
                    </TouchableOpacity>
                  </View>
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
    padding: 24,
    justifyContent: "center",
  },
  containerWide: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  containerNarrow: {
    flexDirection: "column",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    padding: 30,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignSelf: "center",
  },
  cardContent: {
    alignItems: "center",
    gap: 20,
  },
  form: {
    width: "100%",
    gap: 20,
    marginTop: 10,
  },
  inputGroup: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#319594",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    justifyContent: "space-between",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    minHeight: 45,
    height: "100%",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});

// Sombras fortes
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

// Sombras leves
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
