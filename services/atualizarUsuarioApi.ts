import { LOCALHOST_URL } from "./urlApi";

export async function atualizarUsuario(
  loginAtual: string,
  nome: string,
  senha: string
) {
  try {
    const resposta = await fetch(`${LOCALHOST_URL}/usuario/${loginAtual}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, senha }),
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
