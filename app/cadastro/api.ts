import axios from "axios";
import { LOCALHOST_URL } from "../../services/urlApi";

const API_URL = `${LOCALHOST_URL}/usuario`;

export async function cadastrarUsuario(
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
      throw new Error(mensagens[0]);
    }
    if (typeof mensagens === "string") {
      throw new Error(mensagens);
    }
    console.log(error.message);
    throw new Error("Erro ao cadastrar usuário");
  }
}
