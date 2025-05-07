// src/services/openai.ts
import axios from "axios";

const API_KEY = "api salva em outro local rs"; // Substitua pela sua chave real

const api = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

export const enviarPrompt = async (prompt: string) => {
  try {
    const resposta = await api.post("/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um assistente útil para gerar roadmaps de estudo.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    return resposta.data.choices[0].message.content;
  } catch (erro: any) {
    if (erro.response?.status === 429) {
      return "Você fez muitas requisições em pouco tempo. Tente novamente em instantes.";
    }
    console.error("Erro na API:", erro);
    return `Erro ao gerar resposta. ${erro}`;
  }
};
