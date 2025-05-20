import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TopBarMenu from "../components/TopBarMenu";
import { useAuth } from "../../context/auth";
import { useNormalize } from "../../utils/normalize";
import { atualizarUsuario } from "../../services/atualizarUsuarioApi";
import Carregando from "../components/Carregando";
import * as Animatable from "react-native-animatable";
import { autenticarLogin } from "../../context/api";

export default function MeuPerfil() {
  const { usuario, setUsuario } = useAuth();
  const [nome, setNome] = useState(usuario.nome);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [editando, setEditando] = useState(false);
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [backupUsuario, setBackupUsuario] = useState(nome);
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [erros, setErros] = useState<{
    nome?: string;
    senhaAtual?: string;
  }>({});

  const validarCampos = () => {
    const novosErros: {
      nome?: string;
      senhaAtual?: string;
    } = {};

    if (!nome.trim()) novosErros.nome = "Nome é obrigatório.";

    if (editando && !senhaAtual.trim())
      novosErros.senhaAtual = "Senha atual é obrigatória.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const { normalize, normalizeFontWeight } = useNormalize();

  const dynamicStyles = {
    title: {
      fontSize: normalize({ base: 28 }),
      fontWeight: normalizeFontWeight({ max: 700 }),
      color: "#333",
      marginTop: 10,
    },
    label: {
      fontSize: normalize({ base: 8, max: 24 }),
      fontWeight: normalizeFontWeight({ max: 500 }),
      marginBottom: 6,
    },
    input: {
      fontSize: normalize({ base: 7, max: 20 }),
      color: "#333",
    },
    buttonText: {
      fontSize: normalize({ base: 7, min: 20, max: 20 }),
      fontWeight: normalizeFontWeight({ min: 400, max: 500 }),
      color: "white",
    },
  };

  const toggleEditar = async () => {
    if (editando) {
      if (!validarCampos()) return;

      setCarregando(true);
      try {
        await autenticarLogin(usuario.login, senhaAtual);
        const usuarioAtualizado = await atualizarUsuario(
          usuario.login,
          nome,
          novaSenha || senhaAtual
        );
        setUsuario({ ...usuario, nome: usuarioAtualizado.nome });
        setEditando(false);
        setSenhaAtual("");
        setNovaSenha("");
        alert("Dados atualizados com sucesso!");
      } catch (erro: any) {
        if (erro.message === "Erro ao autenticar usuario") {
          setErros((prev) => ({
            ...prev,
            senhaAtual: "Senha incorreta.",
          }));
        }
      } finally {
        setCarregando(false);
      }
    } else {
      setBackupUsuario(nome);
      setEditando(true);
    }
  };

  const cancelarEdicao = () => {
    setNome(backupUsuario);
    setSenhaAtual("");
    setNovaSenha("");
    setEditando(false);
  };

  return (
    <View style={styles.container}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Animatable.View
          animation="fadeInUp"
          duration={700}
          style={[styles.card, getShadow()]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("./menuPrincipal")}
          >
            <MaterialIcons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>

          <View style={styles.header}>
            <FontAwesome5 name="user" size={80} color="#2596be" />
            <Text style={dynamicStyles.title}>Meu Perfil</Text>
          </View>

          <View style={styles.form}>
            <View>
              <Text style={dynamicStyles.label}>Nome</Text>
              <View
                style={[
                  styles.inputContainer,
                  editando && { backgroundColor: "white" },
                ]}
              >
                <TextInput
                  style={[
                    dynamicStyles.input,
                    styles.inputField,
                    { outlineStyle: "none" } as any,
                  ]}
                  value={nome}
                  onChangeText={setNome}
                  editable={editando}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>
            {erros.nome && (
              <Text style={{ color: "red", marginTop: -15 }}>{erros.nome}</Text>
            )}

            <View>
              <Text style={dynamicStyles.label}>Email</Text>
              <View style={[styles.inputContainer, styles.inputDisabled]}>
                <TextInput
                  style={[
                    dynamicStyles.input,
                    styles.inputField,
                    { outlineStyle: "none" } as any,
                  ]}
                  value={usuario.login}
                  editable={false}
                />
              </View>
            </View>

            <View>
              <Text style={dynamicStyles.label}>Senha atual</Text>
              <View
                style={[
                  styles.inputContainer,
                  editando && { backgroundColor: "white" },
                ]}
              >
                <TextInput
                  style={[
                    dynamicStyles.input,
                    styles.inputField,
                    { outlineStyle: "none" } as any,
                  ]}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#aaa"
                  value={senhaAtual}
                  onChangeText={setSenhaAtual}
                  secureTextEntry={!mostrarSenhaAtual}
                  editable={editando}
                />
                <TouchableOpacity
                  onPress={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                >
                  <FontAwesome5
                    name={mostrarSenhaAtual ? "eye-slash" : "eye"}
                    size={18}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {erros.senhaAtual && (
              <Text style={{ color: "red", marginTop: -15 }}>
                {erros.senhaAtual}
              </Text>
            )}

            <View>
              <Text style={dynamicStyles.label}>Nova senha</Text>
              <View
                style={[
                  styles.inputContainer,
                  editando && { backgroundColor: "white" },
                ]}
              >
                <TextInput
                  style={[
                    dynamicStyles.input,
                    styles.inputField,
                    { outlineStyle: "none" } as any,
                  ]}
                  placeholder="Deixe em branco para manter sua senha inalterada"
                  placeholderTextColor="#aaa"
                  value={novaSenha}
                  onChangeText={setNovaSenha}
                  secureTextEntry={!mostrarNovaSenha}
                  editable={editando}
                />
                <TouchableOpacity
                  onPress={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                >
                  <FontAwesome5
                    name={mostrarNovaSenha ? "eye-slash" : "eye"}
                    size={18}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.button} onPress={toggleEditar}>
                <Text style={dynamicStyles.buttonText}>
                  {editando ? "Salvar" : "Editar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => (editando ? cancelarEdicao() : router.back())}
              >
                <Text style={dynamicStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
      {carregando && <Carregando />}
    </View>
  );
}

function getShadow() {
  if (Platform.OS === "android") return { elevation: 12 };
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    };
  }
  if (Platform.OS === "web")
    return { boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.2)" };
  return {};
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f4f9",
  },
  card: {
    flexGrow: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 60,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
  },
  header: {
    alignItems: "center",
    gap: 12,
  },
  form: {
    width: "100%",
    maxWidth: 600,
    gap: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderColor: "#2596be",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputDisabled: {
    backgroundColor: "#eee",
  },
  inputField: {
    flex: 1,
    paddingRight: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    height: "15%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0FA5E9",
    borderRadius: 50,
    alignItems: "center",
    height: "100%",
    maxHeight: 40,
    width: "50%",
    maxWidth: 200,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#ff4d4d",
    borderColor: "#d32f2f",
  },
});
