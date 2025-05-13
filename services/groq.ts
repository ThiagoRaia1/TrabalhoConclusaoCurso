// src/services/groq.ts
import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

const api = axios.create({
  baseURL: "https://api.groq.com/openai/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

export const enviarPrompt = async (prompt: string) => {
  try {
    const resposta = await api.post("/chat/completions", {
      // llama3-8b-8192
      // Requests per minute: 30
      // Requests per day: 14.400	
      // Tokens per minute: 6.000
      // Tokens per day: 500.000
      model: "llama3-8b-8192", // Modelo gratuito e rápido da Groq
      messages: [
        {
          role: "system",
          content: `
            Você é um assistente que gera roadmaps de estudo no formato passo a passo com recursos. 
            Responda sempre em português (Brasil) e retorne um json nesse exato mesmo formato, 
            dispense outras mensagens. Se julgar o prompt inválido para criação do json, avise com a
            mensagem "Prompt inválido."
            (Adicione quantos itens julgar necessário para ter um passo a passo detalhado):
            {
              "titulo": "Xadrez",
              "usuarioLogin": "",
              "fases": [
                {
                  "titulo": "🟢 Fundamentos do Xadrez (Iniciante)",
                  "cor": "#d1fae5",
                  "itens": [
                    {
                      "titulo": "Tabuleiro e Peças",
                      "descricao": "Aprenda como montar o tabuleiro (casa branca no canto direito) e conheça as peças: rei, dama (rainha), torres, bispos, cavalos e peões. São 16 peças por jogador.",
                      "concluido": false
                    },
                  ]
                }
                {
                  "titulo": "🟡 Estratégias e Táticas (Intermediário)",
                  "cor": "#fef9c3",
                  "itens": [
                    {
                      "titulo": "Táticas Fundamentais",
                      "descricao": "Treine padrões de táticas como garfo (especialmente com cavalo), cravada (peça presa atrás de peça mais valiosa), ataque duplo, descoberto e raios-x. Use exercícios para fixar.",
                      "concluido": false
                    },
                  ]
                }
                {
                  "titulo": "🔵 Pensamento Estratégico e Competição (Avançado)",
                  "cor": "#bfdbfe",
                  "itens": [
                    {
                      "titulo": "Avaliação de Posições",
                      "descricao": "Avalie posições com base em material, segurança do rei, atividade das peças, estrutura de peões e iniciativa. Decida com base nesses fatores.",
                      "concluido": false
                    },
                  ]
                }
            }
                `,
        },
        {
          role: "user",
          content: prompt, // Envia o prompt real do usuário
        },
      ],
      temperature: 0.7,
    });

    // A resposta correta está em 'choices[0].message.content'
    return resposta.data.choices[0].message.content;

  } catch (erro: any) {
    if (erro.response?.status === 429) {
      return "Você fez muitas requisições em pouco tempo. Tente novamente em instantes.";
    }
    console.error("Erro na API:", erro.response?.data || erro.message);
    return `Erro ao gerar resposta. ${erro.message}`;
  }
};
