export interface Secao {
  titulo: string;
  cor: string;
  itens: {
    titulo: string;
    descricao: string;
  }[];
}
