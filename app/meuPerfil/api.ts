import { LOCALHOST_URL } from "../../services/urlApi";

const API_URL = `${LOCALHOST_URL}/usuario`;

export async function atualizarUsuario(
  loginAtual: string,
  nome: string,
  login: string,
  senha: string
) {
  try {
    const resposta = await fetch(`${API_URL}/${loginAtual}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, login, senha }),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.message || "Erro ao atualizar usuário");
    }

    const usuarioAtualizado = await resposta.json();
    return usuarioAtualizado;
  } catch (erro: any) {
    console.error("Erro ao atualizar usuário:", erro.message);
    throw erro;
  }
}
