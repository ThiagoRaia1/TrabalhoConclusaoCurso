const quizXadrez = {
  iniciante: [
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
    },
  ],
  intermediario: [
    {
      pergunta: "O que é um 'garfo' no xadrez?",
      alternativas: [
        "Quando duas peças ocupam a mesma casa",
        "Quando uma peça ameaça duas ou mais ao mesmo tempo",
        "Quando o rei e a torre trocam de lugar",
        "Quando o peão avança duas casas",
      ],
      respostaCorreta: "Quando uma peça ameaça duas ou mais ao mesmo tempo",
    },
    {
      pergunta: "Por que controlar o centro do tabuleiro é importante?",
      alternativas: [
        "Permite capturar mais peões adversários",
        "Facilita a promoção de peões",
        "Permite maior mobilidade e controle das ações",
        "Garante que o rei fique no centro do jogo",
      ],
      respostaCorreta: "Permite maior mobilidade e controle das ações",
    },
    {
      pergunta: "O que são colunas abertas no xadrez?",
      alternativas: [
        "Colunas sem peças próprias, ideais para as torres",
        "Colunas com todos os peões alinhados",
        "Colunas onde não se pode mover peças",
        "Colunas onde só os bispos atuam",
      ],
      respostaCorreta: "Colunas sem peças próprias, ideais para as torres",
    },
    {
      pergunta: "Qual das seguintes é uma abertura popular no xadrez?",
      alternativas: [
        "Ataque do Rei Solitário",
        "Defesa da Torre Alta",
        "Gambito da Dama",
        "Variante do Peão Duplo",
      ],
      respostaCorreta: "Gambito da Dama",
    },
    {
      pergunta: "Qual é uma boa prática no meio-jogo?",
      alternativas: [
        "Ficar trocando peças sem pensar",
        "Fazer movimentos aleatórios com peões",
        "Criar planos com base na posição e coordenação das peças",
        "Evitar desenvolver cavalos e bispos",
      ],
      respostaCorreta:
        "Criar planos com base na posição e coordenação das peças",
    },
    {
      pergunta: "O que é a 'regra do quadrado' nos finais de jogo?",
      alternativas: [
        "Uma regra sobre a movimentação do rei em forma de quadrado",
        "Um conceito usado para saber se o rei alcança um peão passado",
        "Uma estratégia para alinhar peças em quadrado",
        "Uma regra para capturar peças em colunas centrais",
      ],
      respostaCorreta:
        "Um conceito usado para saber se o rei alcança um peão passado",
    },
    {
      pergunta: "Qual é um erro comum no xadrez?",
      alternativas: [
        "Fazer o roque cedo",
        "Trocar peças com vantagem",
        "Jogar sem um plano definido",
        "Manter o rei seguro",
      ],
      respostaCorreta: "Jogar sem um plano definido",
    },
  ],
  avancado: [
    {
      pergunta:
        "Quais fatores devem ser considerados na avaliação de posições?",
      alternativas: [
        "Apenas o número de peças capturadas",
        "Material e número de peões promovidos",
        "Segurança do rei, atividade das peças, estrutura de peões, iniciativa e material",
        "Tempo gasto e número de jogadas feitas",
      ],
      respostaCorreta:
        "Segurança do rei, atividade das peças, estrutura de peões, iniciativa e material",
    },
    {
      pergunta:
        "Por que é importante estudar partidas clássicas de grandes mestres?",
      alternativas: [
        "Para copiar exatamente os movimentos deles",
        "Para entender como eles aplicam princípios estratégicos em diferentes contextos",
        "Porque são obrigatórias em torneios",
        "Para memorizar posições raras",
      ],
      respostaCorreta:
        "Para entender como eles aplicam princípios estratégicos em diferentes contextos",
    },
    {
      pergunta: "Qual é o objetivo do treinamento tático avançado?",
      alternativas: [
        "Melhorar a memória visual do tabuleiro",
        "Resolver apenas táticas simples para se manter afiado",
        "Aumentar a velocidade de movimentos",
        "Trabalhar o cálculo e a previsão precisa de jogadas",
      ],
      respostaCorreta: "Trabalhar o cálculo e a previsão precisa de jogadas",
    },
    {
      pergunta: "Por que montar um repertório de aberturas é importante?",
      alternativas: [
        "Para impressionar o adversário com nomes de variantes",
        "Porque todo mestre tem um",
        "Para jogar sempre os mesmos lances em todas as partidas",
        "Para escolher linhas que combinem com seu estilo e facilitar o planejamento",
      ],
      respostaCorreta:
        "Para escolher linhas que combinem com seu estilo e facilitar o planejamento",
    },
    {
      pergunta:
        "O que envolve a gestão eficiente do tempo em partidas com relógio?",
      alternativas: [
        "Evitar olhar o relógio durante o jogo",
        "Jogar sempre muito rápido para guardar tempo",
        "Gerenciar o tempo por lance e lidar bem com a pressão",
        "Pedir tempo extra ao árbitro",
      ],
      respostaCorreta: "Gerenciar o tempo por lance e lidar bem com a pressão",
    },
    {
      pergunta: "O que é essencial na preparação para torneios de xadrez?",
      alternativas: [
        "Apenas decorar aberturas longas",
        "Conhecer regulamentos, se preparar física e psicologicamente",
        "Focar em partidas online rápidas",
        "Evitar estudar partidas antigas",
      ],
      respostaCorreta:
        "Conhecer regulamentos, se preparar física e psicologicamente",
    },
    {
      pergunta: "Por que analisar suas próprias partidas é importante?",
      alternativas: [
        "Para saber se o adversário trapaceou",
        "Para tentar repetir os mesmos movimentos nas próximas partidas",
        "Para entender seus erros e acertos e melhorar continuamente",
        "Porque é obrigatório em torneios",
      ],
      respostaCorreta:
        "Para entender seus erros e acertos e melhorar continuamente",
    },
    {
      pergunta:
        "Como a psicologia influencia no desempenho em partidas de xadrez?",
      alternativas: [
        "Afeta apenas jogadores iniciantes",
        "Ajuda a prever os lances do adversário",
        "É irrelevante, já que o jogo depende só de cálculo",
        "Controlar emoções e manter o foco pode decidir partidas difíceis",
      ],
      respostaCorreta:
        "Controlar emoções e manter o foco pode decidir partidas difíceis",
    },
  ],
};
