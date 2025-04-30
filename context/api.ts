import axios from "axios";

const API_URL = `http://localhost:3000/usuario`;

export async function autenticarLogin(login: string, senha: string) {
  try {
    const response = await axios.post(`${API_URL}/login`, { login, senha });
    console.log(response.data);
    return response.data; // já vem sem senha e _id
  } catch (error) {
    console.warn(error);
    throw new Error("Erro ao autenticar usuario");
  }
}
