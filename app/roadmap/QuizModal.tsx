import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as Animatable from "react-native-animatable";

interface Pergunta {
  pergunta: string;
  alternativas: string[];
  respostaCorreta: string;
}

interface QuizModalProps {
  visivel: boolean;
  perguntas: Pergunta[];
  respostasUsuario: string[];
  setRespostasUsuario: (respostas: string[]) => void;
  respostasConfirmadas: boolean;
  setRespostasConfirmadas: (confirmado: boolean) => void;
  onFechar: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({
  visivel,
  perguntas,
  respostasUsuario,
  setRespostasUsuario,
  respostasConfirmadas,
  setRespostasConfirmadas,
  onFechar,
}) => {
  if (!visivel) return null;

  const totalAcertos = perguntas.filter(
    (item, idx) => respostasUsuario[idx] === item.respostaCorreta
  ).length;

  return (
    <View style={styles.modalOverlay}>
      <Animatable.View
        animation="fadeInUp"
        duration={700}
        style={styles.modalQuizBox}
      >
        <ScrollView style={{ maxHeight: "80%", paddingHorizontal: 20 }}>
          {perguntas.map((item, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <Text style={styles.modalQuizText}>
                {index + 1}. {item.pergunta}
              </Text>

              {item.alternativas.map((alternativa, i) => {
                const selecionada = respostasUsuario[index] === alternativa;
                const correta = item.respostaCorreta === alternativa;

                let backgroundColor = "#eee";
                if (respostasConfirmadas) {
                  if (selecionada && correta) backgroundColor = "#c8e6c9";
                  else if (selecionada && !correta) backgroundColor = "#ffcdd2";
                  else if (correta) backgroundColor = "#c8e6c9";
                } else if (selecionada) {
                  backgroundColor = "#bbdefb";
                }

                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      if (!respostasConfirmadas) {
                        const novasRespostas = [...respostasUsuario];
                        novasRespostas[index] = alternativa;
                        setRespostasUsuario(novasRespostas);
                      }
                    }}
                    style={{
                      padding: 8,
                      marginVertical: 4,
                      borderRadius: 6,
                      backgroundColor,
                    }}
                  >
                    <Text>{alternativa}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          {!respostasConfirmadas ? (
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: "#28a745" }]}
              onPress={() => setRespostasConfirmadas(true)}
            >
              <Text style={styles.modalCloseText}>Confirmar respostas</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              Acertos: {totalAcertos} de {perguntas.length}
            </Text>
          )}

          <TouchableOpacity style={styles.modalCloseButton} onPress={onFechar}>
            <Text style={styles.modalCloseText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default QuizModal;

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.4)",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalQuizBox: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: "90%",
    maxHeight: "70%",
    justifyContent: "center",
    gap: 10,
  },
  modalQuizText: {
    fontSize: 20,
    marginBottom: 10,
  },
  modalCloseButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 6,
    width: "70%",
    maxWidth: 400,
  },
  modalCloseText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },
});
