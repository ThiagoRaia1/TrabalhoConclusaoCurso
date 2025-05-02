import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { router } from "expo-router";

export default function MenuPrincipal() {
  const [menuVisivel, setMenuVisivel] = useState(false);

  const alternarMenu = () => {
    setMenuVisivel(!menuVisivel);
  };
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flexDirection: "row", gap: 40 }}>
          <Text style={[styles.topBarText]}>AI TEACHER</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 40 }}>
          <Text style={styles.topBarText}>Topo</Text>
          <Text style={styles.topBarText}>Topo</Text>
          <Text style={styles.topBarText}>Topo</Text>
          <TouchableOpacity onPress={alternarMenu}>
            <FontAwesome name="user-circle" size={70} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text
            style={[styles.topBarText, { color: "black", alignSelf: "center" }]}
          >
            Crie seu primeiro Roadmap!
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { outlineStyle: "none" } as any]}
              placeholder="Digite o prompt para criação do roadmap"
              placeholderTextColor="#ccc"
              // onChangeText={(text) => setSenha(text)}
              returnKeyType="done"
              // onSubmitEditing={() => handleLogin(senha)} // Agora ENTER envia o login
            />
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Gerar Roadmap</Text>
          </TouchableOpacity>
          {/* Adicione mais itens para ver o scroll funcionando */}
        </ScrollView>

        {menuVisivel && (
          <View style={styles.menuSuspenso}>
            <TouchableOpacity
              onPress={() => {
                router.push("./meuPerfil");
              }}
            >
              <Text style={styles.menuItem}>Meu Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                router.push("./");
              }}
            >
              <Text style={styles.menuItem}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 100,
    flexDirection: "row",
    backgroundColor: "#242E3F",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 50,
  },
  topBarText: {
    color: "white",
    fontSize: 30,
    alignSelf: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    gap: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    width: "50%",
    borderWidth: 1,
    borderColor: "#319594",
    borderRadius: 8,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 26,
    maxWidth: "95%",
    height: 70,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#2596be",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    width: "20%",
    minHeight: "5%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  menuSuspenso: {
    position: "absolute",
    right: 30,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 5, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 10,
    zIndex: 1000,
    width: 300,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
