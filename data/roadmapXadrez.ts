import { Secao } from "../types/secao";
import { cores } from "../constants/cores";

const secoes: Secao[] = [
  {
    titulo: "🟢 Fundamentos do Xadrez (Iniciante)",
    cor: cores.iniciante,
    itens: [
      {
        titulo: "Objetivo do jogo",
        descricao: `
  \tO xadrez é vencido ao dar xeque-mate no rei inimigo — isso significa que o rei está sob ataque direto (xeque) e não pode escapar por nenhum movimento legal. 
  \tO objetivo não é capturar todas as peças do oponente, mas colocar o rei em xeque-mate.`,
      },
      {
        titulo: "Tabuleiro e posicionamento",
        descricao: `
  \tO tabuleiro é uma grade 8x8 (64 casas), com cores alternadas (branca e preta). A casa inferior direita deve ser branca. As peças se organizam assim:\n
  \tSegunda fileira: 8 peões.\n
  \tPrimeira fileira: torre, cavalo, bispo, dama, rei, bispo, cavalo, torre.\n
  \tDama vai na cor da peça (dama branca na casa branca, dama preta na casa preta).`,
      },
      {
        titulo: "As peças e seus movimentos",
        descricao: `
  \tPeão: anda 1 casa à frente (ou 2, no primeiro movimento), mas captura na diagonal. 
  \tPeão não anda para trás.\n
  \tTorre: anda quantas casas quiser na horizontal ou vertical.\n
  \tCavalo: anda em “L” (duas casas em uma direção e uma na perpendicular) e pula sobre outras peças.\n
  \tBispo: anda na diagonal, quantas casas quiser.\n
  \tDama: combina torre + bispo (movimento em qualquer direção reta).\n
  \tRei: anda 1 casa em qualquer direção. Deve ser protegido a todo custo.`,
      },
      {
        titulo: "Regras especiais",
        descricao: `\tRoque: troca de posição do rei com uma torre. O rei anda 2 casas para o lado da torre, 
  e a torre salta por cima dele. Só é possível se:\n
  \tNenhuma peça tiver se movido.\n
  \tNão houver peças entre eles.\n
  \tO rei não estiver em xeque nem passar por casas atacadas.\n
  \tPromoção: se um peão alcança a 8ª fileira, ele é promovido a qualquer peça 
  (geralmente uma dama).\n
  \tEn passant: se um peão avança 2 casas e para ao lado de um peão inimigo, esse peão pode 
  capturá-lo como se tivesse andado 1 casa, mas apenas no lance seguinte.`,
      },
    ],
  },
  {
    titulo: "🟡 Estratégias Básicas (Intermediário)",
    cor: cores.intermediario,
    itens: [
      {
        titulo: "Desenvolvimento",
        descricao: `\tNo início, seu foco deve ser desenvolver suas peças rápido e com eficiência, especialmente cavalos e bispos, para controlar o centro e preparar o roque.`,
      },
      {
        titulo: "Controle do centro",
        descricao: `\tO centro do tabuleiro (casas d4, d5, e4, e5) é onde a ação acontece. Controlá-lo permite:\n
  \tMaior mobilidade.\n
  \tMaior domínio tático.\n
  \tAcesso fácil a qualquer lado do tabuleiro.\n`,
      },
      {
        titulo: "Segurança do rei",
        descricao: `\tUm rei exposto é vulnerável. O roque protege o rei e conecta suas torres, tornando-as mais ativas.`,
      },
      {
        titulo: "Coordenação de peças",
        descricao: `\tPeças que trabalham juntas (ex: torre e dama alinhadas, cavalo e bispo pressionando a mesma casa) são muito mais fortes do que peças isoladas.`,
      },
      {
        titulo: "Evitar erros comuns",
        descricao: `\tSair com a dama cedo a expõe a ataques.\n
  \tMover peões demais pode criar fraquezas.\n
  \tTrocar peças sem necessidade pode enfraquecer sua posição.`,
      },
    ],
  },
  {
    titulo: "🔵 Táticas de Xadrez (Intermediário–Avançado)",
    cor: cores.avancado,
    itens: [
      {
        titulo: "Táticas básicas",
        descricao: `\tGarfo: uma peça ataca duas (ex: cavalo atacando rei e torre).
  
  \tCravada: uma peça não pode se mover sem expor outra mais valiosa (ex: bispo cravando cavalo contra o rei).
  
  \tAtaque descoberto: mover uma peça revela um ataque de outra (ex: mover peão e descobrir torre atrás).
  
  \tAtaque duplo: dois ataques feitos em um único lance.`,
      },
      {
        titulo: "Combinações",
        descricao: `
  Sequência de lances forçados (sacrifícios, ataques múltiplos) que levam a ganho de material ou xeque-mate.
          `,
      },
      {
        titulo: "Cálculo de variantes",
        descricao: `
  Capacidade de visualizar lances futuros com precisão. Jogadores mais fortes “enxergam” 4, 5 ou mais lances à frente, considerando as respostas do adversário.
          `,
      },
    ],
  },
];

export default secoes;
