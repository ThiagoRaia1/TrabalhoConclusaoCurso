import axios from "axios";

const API_URL = `http://localhost:3000/usuario`;

export async function cadastrarUsuario(login: string, senha: string, nome: string) {
  try {
    const response = await axios.post(`${API_URL}`, {
      login,
      senha,
      nome,
    });
    console.log("Usuário cadastrado:", response.data);
  } catch (error: any) {
    console.error("Erro ao cadastrar usuário:", error.response);
    throw new error(error.message)
  }
}
