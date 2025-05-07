import { View } from "react-native";
import TopBarMenu from "../components/topBar";
import { useState } from "react";

export default function MeuPerfil() {
  const [menuVisivel, setMenuVisivel] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TopBarMenu menuVisivel={menuVisivel} setMenuVisivel={setMenuVisivel} />
    </View>
  );
}
