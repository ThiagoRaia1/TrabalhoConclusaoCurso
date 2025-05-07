import { Secao } from "../types/secao";
import { cores } from "../constants/cores";

const secoes: Secao[] = [
  {
    titulo: "🟢 Fundamentos da Programação (Iniciante)",
    cor: cores.iniciante,
    itens: [
      {
        titulo: "O que é programação?",
        descricao: `\tProgramar é dar instruções para o computador executar tarefas. 
  \tEssas instruções são escritas em linguagens de programação.`,
      },
      {
        titulo: "Variáveis e tipos de dados",
        descricao: `\tVariáveis armazenam valores usados pelo programa.\n
  \tExemplos de tipos:\n
  \t• Inteiros (int): números sem casas decimais\n
  \t• Reais (float): números com casas decimais\n
  \t• Texto (string): sequência de caracteres\n
  \t• Booleano (bool): verdadeiro ou falso`,
      },
      {
        titulo: "Operadores",
        descricao: `\tUsados para realizar cálculos e comparações.\n
  \t• Aritméticos: +, -, *, /, %\n
  \t• Relacionais: ==, !=, >, <\n
  \t• Lógicos: &&, ||, !`,
      },
      {
        titulo: "Entrada e saída de dados",
        descricao: `\tEntrada: receber informações do usuário (ex: prompt, input).\n
  \tSaída: mostrar informações (ex: print, console.log).`,
      },
    ],
  },
  {
    titulo: "🟡 Estruturas e Lógica (Intermediário)",
    cor: cores.intermediario,
    itens: [
      {
        titulo: "Condicionais",
        descricao: `\tPermitem executar diferentes blocos de código com base em condições.\n
  \tExemplo:\n
  \tif (idade >= 18) {\n
  \t\tconsole.log("Maior de idade");\n
  \t} else {\n
  \t\tconsole.log("Menor de idade");\n
  \t}`,
      },
      {
        titulo: "Laços de repetição",
        descricao: `\tPermitem repetir um bloco de código várias vezes.\n
  \tExemplos:\n
  \t• for: laço com contador\n
  \t• while: laço com condição\n
  \t• do...while: executa pelo menos uma vez`,
      },
      {
        titulo: "Funções",
        descricao: `\tFunções agrupam instruções reutilizáveis.\n
  \tExemplo:\n
  \tfunction somar(a, b) {\n
  \t\treturn a + b;\n
  \t}`,
      },
      {
        titulo: "Listas e vetores",
        descricao: `\tEstruturas que armazenam múltiplos valores.\n
  \tExemplo em JavaScript:\n
  \tlet numeros = [1, 2, 3, 4];`,
      },
    ],
  },
  {
    titulo: "🔵 Conceitos Avançados (Avançado)",
    cor: cores.avancado,
    itens: [
      {
        titulo: "Programação orientada a objetos (POO)",
        descricao: `\tModelo baseado em objetos e classes.\n
  \tConceitos:\n
  \t• Classe: molde para criar objetos\n
  \t• Objeto: instância com atributos e métodos\n
  \t• Herança, encapsulamento e polimorfismo`,
      },
      {
        titulo: "Recursão",
        descricao: `\tFunção que chama a si mesma para resolver um problema.\n
  \tÚtil para algoritmos como fatorial, Fibonacci, etc.`,
      },
      {
        titulo: "Algoritmos e complexidade",
        descricao: `\tEstudo de eficiência de algoritmos.\n
  \t• Complexidade de tempo (ex: O(n))\n
  \t• Complexidade de espaço\n
  \tAjuda a escrever código mais rápido e eficiente.`,
      },
      {
        titulo: "Estruturas de dados",
        descricao: `\tTécnicas de organização de dados:\n
  \t• Pilha (stack), fila (queue)\n
  \t• Árvores, grafos\n
  \t• Mapas, conjuntos (sets)`,
      },
    ],
  },
];

export default secoes;
