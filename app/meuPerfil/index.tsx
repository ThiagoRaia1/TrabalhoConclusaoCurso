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
import TopBarMenu, { MenuSuspenso } from "../components/topBar";
import { useAuth } from "../../context/auth";
import { useNormalize } from "../../utils/normalize";
import { atualizarUsuario } from "../../services/atualizarUsuarioApi";
import Carregando from "../components/carregando";
import * as Animatable from "react-native-animatable";

export default function MeuPerfil() {
  const { usuario, setUsuario } = useAuth();
  const [nome, setNome] = useState(usuario.nome);
  const [senha, setSenha] = useState("");
  const [editando, setEditando] = useState(false);
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [backupUsuario, setBackupUsuario] = useState({
    nome: usuario.nome,
    login: usuario.login,
    senha: senha,
  });
  const [carregando, setCarregando] = useState(false);

  const { normalize, normalizeFontWeight } = useNormalize();

  const dynamicStyles = {
    title: {
      fontSize: normalize({ base: 28 }),
      fontWeight: normalizeFontWeight({ max: 700 }),
      color: "#333",
      marginTop: 10,
    },
    label: {
      fontSize: normalize({ base: 10 }),
      fontWeight: normalizeFontWeight({ max: 500 }),
      marginBottom: 6,
    },
    input: {
      fontSize: normalize({ base: 10 }),
      color: "#333",
    },
    buttonText: {
      fontSize: normalize({ base: 10, min: 25 }),
      fontWeight: normalizeFontWeight({ min: 400, max: 700 }),
      color: "white",
    },
  };

  const toggleEditar = async () => {
    if (editando) {
      try {
        setCarregando(true);
        const usuarioAtualizado = await atualizarUsuario(
          backupUsuario.login,
          nome,
          usuario.login,
          senha
        );
        setUsuario({ ...usuario, nome: usuarioAtualizado.nome });
      } catch (erro: any) {
        alert("Erro ao atualizar os dados: " + erro.message);
      } finally {
        setCarregando(false);
        setSenha("");
        setEditando(false);
        alert("Dados atualizados com sucesso!");
      }
    } else {
      setBackupUsuario({ nome, login: usuario.login, senha });
      setEditando(true);
    }
  };

  const cancelarEdicao = () => {
    setNome(backupUsuario.nome);
    setSenha("");
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
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>

          <View style={styles.header}>
            <FontAwesome5 name="user" size={80} color="#2596be" />
            <Text style={dynamicStyles.title}>Meu Perfil</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
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

            <View style={styles.inputGroup}>
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

            <View style={styles.inputGroup}>
              <Text style={dynamicStyles.label}>Senha</Text>
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
                  placeholder="Digite atual sua senha para mantê-la."
                  placeholderTextColor="#aaa"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                  editable={editando}
                />
                <FontAwesome5 name="lock" size={18} color="#555" />
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
        {carregando && <Carregando />}
      </ScrollView>
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
    marginTop: 30,
    gap: 12,
  },
  form: {
    width: "100%",
    maxWidth: 600,
    gap: 20,
    marginTop: 10,
  },
  inputGroup: {
    gap: 6,
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
    gap: 12,
    marginTop: 10,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: "#0FA5E9",
    borderRadius: 50,
    alignItems: "center",
    minHeight: 40,
    height: '100%',
    maxHeight: 50,
    justifyContent: 'center'
  },
  cancelButton: {
    backgroundColor: "#ff4d4d",
    borderColor: "#d32f2f",
  },
});
