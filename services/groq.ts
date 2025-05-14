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

export const enviarPrompt = async (prompt: string, usuarioLogin: string) => {
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
Você é um assistente que gera roadmaps de estudo detalhados em formato JSON. Siga estas instruções com exatidão:

1. Retorne **apenas** um objeto JSON válido, no exato formato abaixo.
2. Não adicione mensagens fora do JSON. Sem saudações, comentários ou explicações.
3. Certifique-se de que o JSON possa ser convertido usando \`JSON.parse\`, sem erros.
4. **Nunca omita colchetes, vírgulas ou aspas.**
5. **Se o tema não permitir a criação de um roadmap útil ou coerente**, responda com **exatamente**:
   "Prompt inválido."
6. Use o valor de \`usuarioLogin\` como: "${usuarioLogin}".
7. O campo \`titulo\` deve ser **exatamente** "${prompt}" — não traduza, altere ou adapte.
8. Adicione **quantos itens forem necessários** para uma explicação completa e detalhada, de modo que cada fase cubra os conceitos de forma abrangente.
9. Cada fase deve ser mais detalhada do que apenas um item, se necessário. Utilize exemplos, explicações e subtópicos.
10. **Não altere os emojis nos títulos** das fases. Eles devem ser exatamente:
   - 🟢 para Iniciante
   - 🟡 para Intermediário
   - 🔵 para Avançado

Exemplo exato de estrutura JSON (apenas modelo, substitua pelo conteúdo gerado):

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
          "descricao": "Aprenda como montar o tabuleiro e conhecer as peças.",
          "concluido": false
        }
      ]
    },
    {
      "titulo": "🟡 Estratégias (Intermediário)",
      "cor": "#fef9c3",
      "itens": [
        {
          "titulo": "Ataques Básicos",
          "descricao": "Estude garfos, cravadas e descobertas.",
          "concluido": false
        }
      ]
    },
    {
      "titulo": "🔵 Competição (Avançado)",
      "cor": "#bfdbfe",
      "itens": [
        {
          "titulo": "Avaliação de Posições",
          "descricao": "Entenda estruturas de peões e planos de longo prazo.",
          "concluido": false
        }
      ]
    }
  ]
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
