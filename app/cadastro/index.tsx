import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  ViewStyle,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { cadastrarUsuario } from "../../services/cadastroApi";
import { useNormalize } from "../../utils/normalize";
import Carregando from "../components/carregando";
import * as Animatable from "react-native-animatable";

export default function Cadastro() {
  const { width } = useWindowDimensions();
  const isWide = width > 700;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState<{
    nome?: string;
    email?: string;
    senha?: string;
  }>({});
  const [carregando, setCarregando] = useState(false);

  const { normalize, normalizeHeight, normalizeFontWeight } = useNormalize();

  const dynamicStyles = {
    titleText: {
      fontSize: normalize({ base: 28 }),
      fontWeight: normalizeFontWeight({ max: 700 }),
      color: "black",
    },
    label: {
      fontSize: normalize({ base: 8 }),
      fontWeight: normalizeFontWeight({ max: 400 }),
      color: "#222",
      marginBottom: 5,
    },
    inputText: {
      flex: 1,
      fontSize: normalize({ base: 7 }),
      fontWeight: normalizeFontWeight({ max: 400 }),
      color: "#000",
    },
    buttonText: {
      fontSize: normalize({ base: 7 }),
      fontWeight: normalizeFontWeight({ max: 600 }),
      color: "white",
    },
    errorText: {
      fontSize: normalize({ base: 6 }),
      color: "red",
      marginTop: 10,
    },
  };

  const validarCampos = () => {
    const novosErros: { nome?: string; email?: string; senha?: string } = {};

    if (!nome.trim()) novosErros.nome = "Nome é obrigatório.";
    if (!email.trim()) {
      novosErros.email = "Email é obrigatório.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) novosErros.email = "Email inválido.";
    }

    if (!senha.trim()) novosErros.senha = "Senha é obrigatória.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ccc" }}>
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
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push("./")}
              >
                <MaterialIcons name="arrow-back" size={28} color="#333" />
              </TouchableOpacity>

              <View style={styles.logoArea}>
                <Text style={dynamicStyles.titleText}>Cadastro</Text>
              </View>

              <View style={styles.form}>
                {[
                  { label: "Nome", value: nome, setter: setNome },
                  { label: "Email", value: email, setter: setEmail },
                ].map((field, i) => (
                  <View key={i} style={styles.inputGroup}>
                    <Text style={dynamicStyles.label}>{field.label}:</Text>
                    <View
                      style={[
                        styles.inputBox,
                        getSoftShadow(),
                        erros[
                          field.label.toLowerCase() as "nome" | "email"
                        ] && { borderColor: "red" },
                      ]}
                    >
                      <TextInput
                        style={[
                          dynamicStyles.inputText,
                          { height: normalizeHeight({ base: 15 }) },
                          Platform.OS === "web" &&
                            ({ outlineStyle: "none" } as any),
                        ]}
                        placeholder={field.label}
                        placeholderTextColor="#aaa"
                        value={field.value}
                        onChangeText={field.setter}
                      />
                    </View>
                    {erros[field.label.toLowerCase() as "nome" | "email"] && (
                      <Text style={dynamicStyles.errorText}>
                        {erros[field.label.toLowerCase() as "nome" | "email"]}
                      </Text>
                    )}
                  </View>
                ))}

                <View style={styles.inputGroup}>
                  <Text style={dynamicStyles.label}>Senha:</Text>
                  <View
                    style={[
                      styles.inputBox,
                      getSoftShadow(),
                      erros.senha && { borderColor: "red" },
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
                      onChangeText={setSenha}
                    />
                    <TouchableOpacity
                      onPress={() => setMostrarSenha(!mostrarSenha)}
                    >
                      <FontAwesome5
                        name={mostrarSenha ? "eye-slash" : "eye"}
                        size={20}
                        color="#000"
                      />
                    </TouchableOpacity>
                  </View>
                  {erros.senha && (
                    <Text style={dynamicStyles.errorText}>{erros.senha}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.button, getSoftShadow()]}
                  onPress={async () => {
                    if (!validarCampos()) return;

                    try {
                      setCarregando(true);
                      await cadastrarUsuario(nome, email, senha);
                      alert("Usuário cadastrado com sucesso!");
                      setNome("");
                      setEmail("");
                      setSenha("");
                      setErros({});
                      router.push("./");
                    } catch (err: any) {
                      setErros({ email: err.message }); // ou personalizar melhor o erro vindo da API
                    } finally {
                      setCarregando(false);
                    }
                  }}
                >
                  <Text style={dynamicStyles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
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
    padding: 20,
    justifyContent: "center",
  },
  containerWide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  containerNarrow: {
    flexDirection: "column",
  },
  card: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    borderRadius: 20,
    padding: 30,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 10,
  },
  form: {
    gap: 25,
    marginTop: 10,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 10,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#319594",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2596be",
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});

// Sombras
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
