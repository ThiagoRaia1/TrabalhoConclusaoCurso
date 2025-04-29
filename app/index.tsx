import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Text, TextInput } from "react-native-paper";

export default function Login() {
  const login = () => {
    console.log("Login pressionado");
    // Aqui você pode validar os campos e navegar, etc.
  };
  return (
    <View style={styles.container}>
      <View style={[styles.loginArea, getStrongShadow()]}>
        <View style={styles.loginContent}>
          <Text style={styles.titleText}>AI Teacher</Text>

          <View style={[styles.inputContainer, getSoftShadow()]}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ccc"
              returnKeyType="done"
              onSubmitEditing={login} // Agora ENTER aqui também envia o login
            />
          </View>

          <View style={[styles.inputContainer, getSoftShadow()]}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#ccc"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={login} // Agora ENTER aqui também envia o login
            />
          </View>

          <TouchableOpacity style={[styles.button, getSoftShadow()]}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.imageArea}></View>
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
  },
  titleText: {
    fontSize: 40,
    color: "black",
    marginBottom: 20,
  },
  loginContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 5,
    width: "100%",
    borderWidth: 1,
    borderColor: "#319594",
    borderRadius: 8,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 20,
    backgroundColor: "transparent",
    color: "black",
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
    fontSize: 20,
    fontWeight: "700",
  },
});
