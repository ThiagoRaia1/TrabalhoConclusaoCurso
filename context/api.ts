import axios from "axios";

export async function autenticarLogin(login: string, senha: string) {
  try {
    const response = await axios.post(`${process.env.API_URL}/usuario/login`, { login, senha });
    console.log(response.data);
    return response.data; // já vem sem senha e _id
  } catch (error) {
    console.warn(error);
    throw new Error("Erro ao autenticar aluno");
  }
}