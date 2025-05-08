import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
  ViewStyle,
  StyleProp,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useAuth } from "../../context/auth";
import TopBarMenu, { MenuSuspenso } from "../components/topBar";
import { useNormalize } from "../../utils/normalize";
import { atualizarUsuario } from "./api"; // ajuste o caminho conforme necessário

export default function MeuPerfil() {
  const { usuario, setUsuario } = useAuth();
  const [nome, setNome] = useState(usuario.nome);
  const [senha, setSenha] = useState("");
  const [backupUsuario, setBackupUsuario] = useState({
    nome: usuario.nome,
    login: usuario.login,
    senha: senha,
  });
  console.log(backupUsuario);
  const [editando, setEditando] = useState(false);
  const [menuVisivel, setMenuVisivel] = useState(false);

  const { normalize, normalizeHeight, normalizeFontWeight } = useNormalize();

  const dynamicStyles = {
    text: {
      fontSize: normalize({ base: 8 }),
      fontWeight: normalizeFontWeight({ max: 400 }),
      marginBottom: 5,
    },
    erroText: {
      fontSize: normalize({ base: 5 }),
      color: "red",
      marginTop: 10,
    },
    titleText: {
      fontSize: normalize({ base: 28 }),
      fontWeight: normalizeFontWeight({ max: 700 }),
      color: "black",
    },
    ButtonText: {
      fontSize: normalize({ base: 10, min: 10 }),
      color: "white",
      fontWeight: normalizeFontWeight({ min: 300, max: 600 }),
    },
  };

  const toggleEditar = async () => {
    if (editando) {
      try {
        const usuarioAtualizado = await atualizarUsuario(
          backupUsuario.login,
          nome,
          usuario.login,
          senha
        );

        setUsuario({
          ...usuario,
          nome: usuarioAtualizado.nome,
        });

        setSenha(senha)

        setBackupUsuario({ nome, login: usuario.login, senha });
        alert("Dados atualizados com sucesso!");
      } catch (erro: any) {
        alert("Erro ao atualizar os dados: " + erro.message);
      }
    } else {
      setBackupUsuario({ nome, login: usuario.login, senha });
    }
    setEditando(!editando);
  };

  const cancelarEdicao = () => {
    setNome(backupUsuario.nome);
    setSenha(backupUsuario.senha);
    alert("Edição cancelada.");
    setEditando(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: "#ccc" }]}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
      <View style={[styles.elevation, getStrongShadow()]}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <FontAwesome5 name="user" size={80} color="black" />
          <Text style={dynamicStyles.titleText}>Meu Perfil</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.labelInputBlock}>
            <Text style={dynamicStyles.text}>Nome:</Text>

            <View
              style={[
                styles.inputContainer,
                getSoftShadow(),
                !editando && { backgroundColor: "#eee" },
              ]}
            >
              <TextInput
                style={[
                  dynamicStyles.text,
                  styles.input,
                  { outlineStyle: "none" } as any,
                  { height: normalizeHeight({ base: 15 }) },
                ]} // Usando a função normalizeHeight
                value={nome}
                onChangeText={setNome}
                editable={editando}
              />
            </View>
          </View>

          <View style={styles.labelInputBlock}>
            <Text style={dynamicStyles.text}>Email:</Text>
            <View
              style={[
                styles.inputContainer,
                getSoftShadow(),
                { backgroundColor: "#eee" },
              ]}
            >
              <TextInput
                style={[
                  dynamicStyles.text,
                  styles.input,
                  { outlineStyle: "none" } as any,
                  { height: normalizeHeight({ base: 15 }) },
                ]} // Usando a função normalizeHeight
                value={usuario.login}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.labelInputBlock}>
            <Text style={dynamicStyles.text}>Senha:</Text>
            <View
              style={[
                styles.inputContainer,
                getSoftShadow(),
                !editando && { backgroundColor: "#eee" },
              ]}
            >
              <TextInput
                style={[
                  dynamicStyles.text,
                  styles.input,
                  { outlineStyle: "none" } as any,
                  { height: normalizeHeight({ base: 15 }) },
                ]} // Usando a função normalizeHeight
                placeholder="Insira sua senha atual para mantê-la."
                placeholderTextColor={'#a1a1a1'}
                value={senha}
                secureTextEntry
                onChangeText={setSenha}
                editable={editando}
              />
              <FontAwesome5 name="lock" size={20} color="black" />
            </View>
          </View>

          <View style={{ minWidth: "40%" }}>
            <TouchableOpacity
              style={[
                styles.Button,
                getSoftShadow(),
                { height: normalizeHeight({ base: 15 }) },
              ]}
              onPress={toggleEditar}
            >
              <Text
                style={dynamicStyles.ButtonText} // Usando a função normalizeHeight
              >
                {editando ? "Salvar" : "Editar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.Button,
                getSoftShadow(),
                { height: normalizeHeight({ base: 15 }) },
              ]}
              onPress={() => (!editando ? router.back() : cancelarEdicao())}
            >
              <Text
                style={dynamicStyles.ButtonText} // Usando a função normalizeHeight
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {menuVisivel && <MenuSuspenso />}
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
  logoutButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    gap: 30,
    paddingTop: 10,
  },
  labelInputBlock: {
    width: "60%",
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
    color: "#333",
  },
  Button: {
    marginTop: 20,
    backgroundColor: "#2596be",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
