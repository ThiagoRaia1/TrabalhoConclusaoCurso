const secoes = [
  {
    titulo: "🟢 Fundamentos da Programação (Iniciante)",
    cor: "#d1fae5",
    itens: [
      {
        titulo: "O que é programação?",
        descricao:
          "Programar é dar instruções para o computador executar tarefas. Essas instruções são escritas em linguagens de programação.",
        concluido: false,
      },
      {
        titulo: "Variáveis e tipos de dados",
        descricao:
          "Variáveis armazenam valores usados pelo programa. Exemplos de tipos:\n• Inteiros (int): números sem casas decimais\n• Reais (float): números com casas decimais\n• Texto (string): sequência de caracteres\n• Booleano (bool): verdadeiro ou falso",
        concluido: false,
      },
      {
        titulo: "Operadores",
        descricao:
          "Usados para realizar cálculos e comparações.\n• Aritméticos: +, -, *, /, %\n• Relacionais: ==, !=, >, <\n• Lógicos: &&, ||, !",
        concluido: false,
      },
      {
        titulo: "Entrada e saída de dados",
        descricao:
          "Entrada: receber informações do usuário (ex: prompt, input).\nSaída: mostrar informações (ex: print, console.log).",
        concluido: false,
      },
    ],
  },
  {
    titulo: "🟡 Estruturas e Lógica (Intermediário)",
    cor: "#fef9c3",
    itens: [
      {
        titulo: "Condicionais",
        descricao:
          'Permitem executar diferentes blocos de código com base em condições.\nExemplo:\nif (idade >= 18) {\n  console.log("Maior de idade");\n} else {\n  console.log("Menor de idade");\n}',
        concluido: false,
      },
      {
        titulo: "Laços de repetição",
        descricao:
          "Permitem repetir um bloco de código várias vezes.\nExemplos:\n• for: laço com contador\n• while: laço com condição\n• do...while: executa pelo menos uma vez",
        concluido: false,
      },
      {
        titulo: "Funções",
        descricao:
          "Funções agrupam instruções reutilizáveis.\nExemplo:\nfunction somar(a, b) {\n  return a + b;\n}",
        concluido: false,
      },
      {
        titulo: "Listas e vetores",
        descricao:
          "Estruturas que armazenam múltiplos valores.\nExemplo em JavaScript:\nlet numeros = [1, 2, 3, 4];",
        concluido: false,
      },
    ],
  },
  {
    titulo: "🔵 Conceitos Avançados (Avançado)",
    cor: "#bfdbfe",
    itens: [
      {
        titulo: "Programação orientada a objetos (POO)",
        descricao:
          "Modelo baseado em objetos e classes.\nConceitos:\n• Classe: molde para criar objetos\n• Objeto: instância com atributos e métodos\n• Herança, encapsulamento e polimorfismo",
        concluido: false,
      },
      {
        titulo: "Recursão",
        descricao:
          "Função que chama a si mesma para resolver um problema.\nÚtil para algoritmos como fatorial, Fibonacci, etc.",
        concluido: false,
      },
      {
        titulo: "Algoritmos e complexidade",
        descricao:
          "Estudo de eficiência de algoritmos.\n• Complexidade de tempo (ex: O(n))\n• Complexidade de espaço\nAjuda a escrever código mais rápido e eficiente.",
        concluido: false,
      },
      {
        titulo: "Estruturas de dados",
        descricao:
          "Técnicas de organização de dados:\n• Pilha (stack), fila (queue)\n• Árvores, grafos\n• Mapas, conjuntos (sets)",
        concluido: false,
      },
    ],
  },
];

export default secoes;
