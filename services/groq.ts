import axios from "axios";
import { IFase } from "./roadmaps";

const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

const api = axios.create({
  baseURL: "https://api.groq.com/openai/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

// Gera o roadmap
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
Você é um assistente que gera roadmaps de estudo detalhados em formato JSON. Siga estas instruções:

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
11. **A descrição dos itens deve conter uma explicação detalhada de seu título**

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
          "descricao": "Aprenda como montar o tabuleiro (casa branca no canto direito) e conheça as peças: rei, dama (rainha), torres, bispos, cavalos e peões. São 16 peças por jogador.",
          "concluido": false
        },
        {
          "titulo": "Movimentos das Peças",
          "descricao": "O rei move-se uma casa em qualquer direção; a dama em qualquer direção por várias casas; a torre em linha reta; o bispo nas diagonais; o cavalo em 'L' (duas casas e uma perpendicular); o peão avança uma casa (duas na primeira jogada), captura na diagonal.",
          "concluido": false
        },
        {
          "titulo": "Objetivo do Jogo",
          "descricao": "O objetivo é dar xeque-mate no rei adversário, ou seja, colocá-lo sob ataque direto sem possibilidade de fuga. A partida pode terminar em empate por afogamento, repetição ou falta de material.",
          "concluido": false
        },
        {
          "titulo": "Regras Especiais",
          "descricao": "Aprenda o roque (movimento especial entre rei e torre), a promoção de peão (chegando ao fim do tabuleiro vira dama, torre, bispo ou cavalo), e a captura 'en passant' (peão captura outro que avançou duas casas).",
          "concluido": false
        },
        {
          "titulo": "Conceitos Básicos de Abertura",
          "descricao": "Desenvolva rapidamente cavalos e bispos, controle o centro (e4, d4, e5, d5), evite mover a mesma peça várias vezes e proteja o rei com o roque.",
          "concluido": false
        },
        {
          "titulo": "Primeiros Mates",
          "descricao": "Aprenda mates básicos como mate do corredor, mate com dama e rei, mate com duas torres, e mate do pastor (4 lances, educativo).",
          "concluido": false
        }
      ]
    },
    {
      "titulo": "🟡 Estratégias e Táticas (Intermediário)",
      "cor": "#fef9c3",
      "itens": [
        {
          "titulo": "Táticas Fundamentais",
          "descricao": "Treine padrões de táticas como garfo (especialmente com cavalo), cravada (peça presa atrás de peça mais valiosa), ataque duplo, descoberto e raios-x. Use exercícios para fixar.",
          "concluido": false
        },
        {
          "titulo": "Controle do Centro",
          "descricao": "Entenda a importância estratégica de dominar o centro do tabuleiro para permitir mobilidade e controle das ações do adversário.",
          "concluido": false
        },
        {
          "titulo": "Casas Fracas e Colunas Abertas",
          "descricao": "Identifique e explore fraquezas como casas não defendidas ou colunas abertas, ideais para as torres controlarem o jogo.",
          "concluido": false
        },
        {
          "titulo": "Aberturas Mais Jogadas",
          "descricao": "Estude linhas populares como Abertura Italiana (e4 e5 Cf3 Cc6 Bc4), Defesa Siciliana (e4 c5), e Gambito da Dama (d4 d5 c4). Saiba os princípios por trás delas.",
          "concluido": false
        },
        {
          "titulo": "Planejamento no Meio-Jogo",
          "descricao": "Crie planos com base na posição. Avalie quais peças trocar, onde atacar e como melhorar suas peças. Entenda a coordenação entre peças.",
          "concluido": false
        },
        {
          "titulo": "Finais Básicos e Intermediários",
          "descricao": "Aprenda finais como torre contra rei, peão passado, oposição, regra do quadrado e finais de torre e peões.",
          "concluido": false
        },
        {
          "titulo": "Erros Comuns e Como Evitá-los",
          "descricao": "Evite erros como jogar sem um plano, mover muitas peças de peão, não proteger o rei e fazer trocas ruins. Sempre pergunte: 'o que meu adversário quer fazer?'",
          "concluido": false
        }
      ]
    },
    {
      "titulo": "🔵 Pensamento Estratégico e Competição (Avançado)",
      "cor": "#bfdbfe",
      "itens": [
        {
          "titulo": "Avaliação de Posições",
          "descricao": "Avalie posições com base em material, segurança do rei, atividade das peças, estrutura de peões e iniciativa. Decida com base nesses fatores.",
          "concluido": false
        },
        {
          "titulo": "Estudo de Partidas Clássicas",
          "descricao": "Revise partidas de mestres como Bobby Fischer, Garry Kasparov e Magnus Carlsen para entender como aplicam princípios de xadrez.",
          "concluido": false
        },
        {
          "titulo": "Treinamento Tático Avançado",
          "descricao": "Use plataformas como Lichess ou Chess.com para resolver táticas complexas diariamente. Trabalhe cálculo e previsão de jogadas.",
          "concluido": false
        },
        {
          "titulo": "Domínio de Aberturas Repertório Pessoal",
          "descricao": "Monte um repertório de aberturas com base no seu estilo. Aprenda linhas profundas e os planos associados a cada variante.",
          "concluido": false
        },
        {
          "titulo": "Gestão do Tempo e Relógio",
          "descricao": "Pratique jogar com relógio. Aprenda a gerenciar tempo por lance e a lidar com pressão em partidas rápidas.",
          "concluido": false
        },
        {
          "titulo": "Preparação para Torneios",
          "descricao": "Entenda o ambiente competitivo: regulamentos, empates, controle de tempo, conduta. Prepare-se física e psicologicamente.",
          "concluido": false
        },
        {
          "titulo": "Análise de Suas Partidas",
          "descricao": "Após cada jogo, analise o que deu certo e errado. Use engines para entender erros, mas reflita antes de ver a máquina.",
          "concluido": false
        },
        {
          "titulo": "Psicologia no Xadrez",
          "descricao": "Treine controle emocional, foco, paciência e capacidade de se recuperar de erros. Muitos jogos são decididos pela mente, não só pelas jogadas.",
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

export const gerarQuiz = async (fase: IFase) => {
  try {
    const resposta = await api.post("/chat/completions", {
      model: "llama3-8b-8192", // Modelo gratuito e rápido da Groq
      messages: [
        {
          role: "system",
          content: `
            Você é um assistente que gera um quiz em formato JSON 
            sobre o tema e conteúdo que lhe for informado. Siga estas instruções:
1. Retorne **apenas** um objeto JSON válido, no exato formato abaixo.
2. Não adicione mensagens fora do JSON. Sem saudações, comentários ou explicações.
3. Certifique-se de que o JSON possa ser convertido usando \`JSON.parse\`, sem erros.
4. **Nunca omita colchetes, vírgulas ou aspas.**
5. Faça também as alternativas e a resposta correta, a resposta correta **deve** estar entre as alternativas

Exemplo exato de estrutura JSON (apenas modelo, substitua pelo conteúdo gerado):

{
  pergunta: "Quantas peças tem cada jogador no início do jogo de xadrez?",
  alternativas: ["12", "14", "18", "16"],
  respostaCorreta: "16",
},
{
  pergunta: "Qual peça se move em forma de 'L' no xadrez?",
  alternativas: ["Peão", "Bispo", "Cavalo", "Torre"],
  respostaCorreta: "Cavalo",
},
{
  pergunta: "O que significa dar 'xeque-mate'?",
  alternativas: [
    "Capturar todas as peças do oponente",
    "Colocar o rei adversário em xeque e capturá-lo",
    "Colocar o rei adversário sob ataque direto sem chance de escapar",
    "Encurralar a dama do oponente",
  ],
  respostaCorreta:
    "Colocar o rei adversário sob ataque direto sem chance de escapar",
},
{
  pergunta: "Qual das opções a seguir é uma regra especial do xadrez?",
  alternativas: [
    "Avanço triplo do peão",
    "Recuo da torre com promoção",
    "Movimento circular do bispo",
    "Captura 'en passant'",
  ],
  respostaCorreta: "Captura 'en passant'",
},
{
  pergunta: "O que é uma boa prática na fase de abertura?",
  alternativas: [
    "Mover o rei várias vezes",
    "Focar apenas nos peões da borda",
    "Desenvolver rapidamente cavalos e bispos",
    "Evitar o roque",
  ],
  respostaCorreta: "Desenvolver rapidamente cavalos e bispos",
},
{
  pergunta:
    "Qual dos seguintes é um tipo de finalização simples no xadrez?",
  alternativas: [
    "Mate do en passant",
    "Mate do peão",
    "Mate do pastor",
    "Mate do bispo",
  ],
  respostaCorreta: "Mate do pastor",
}
            `,
        },
        {
          role: "user",
          content: JSON.stringify(fase),
        },
      ],
      temperature: 0.7,
    });

    // console.log(JSON.stringify(fase))

    console.log(resposta.data.choices[0].message.content);
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
