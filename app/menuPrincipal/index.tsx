import { View, Text, StyleSheet, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function MenuPrincipal() {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        
      <View style={{flexDirection: 'row'}}>
        <Text>aaaaa</Text>
      </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.topBarText}>Topo</Text>
          <Text style={styles.topBarText}>Topo</Text>
          <Text style={styles.topBarText}>Topo</Text>
          <FontAwesome name="user-circle" size={70} color="white" />
        </View>
      </View>

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text>Conteúdo</Text>
          <Text>Conteúdo</Text>
          <Text>Conteúdo</Text>
          {/* Adicione mais itens para ver o scroll funcionando */}
        </ScrollView>
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
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  topBarText: {
    color: "white",
    fontSize: 30,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});
