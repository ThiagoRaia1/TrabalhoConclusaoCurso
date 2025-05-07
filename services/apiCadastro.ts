import axios from "axios";

const API_URL = `http://localhost:3000/usuario`;

export default async function cadastrarUsuario(
  nome: string,
  login: string,
  senha: string
) {
  try {
    const response = await axios.post(`${API_URL}`, {
      nome,
      login,
      senha,
    });
    console.log("Usuário cadastrado:", response.data);
  } catch (error: any) {
    const mensagens = error?.response?.data?.message;
    if (Array.isArray(mensagens)) {
      throw new Error(mensagens[0]); // Exibe a primeira mensagem
    }
    throw new Error("Erro ao cadastrar usuário");
  }
}
