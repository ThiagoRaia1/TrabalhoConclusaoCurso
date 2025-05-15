import axios from "axios";
import { LOCALHOST_URL } from "../services/urlApi";

export async function autenticarLogin(login: string, senha: string) {
  try {
    const response = await axios.post(`${LOCALHOST_URL}/usuario/login`, { login, senha });
    console.log(response.data);
    return response.data; // já vem sem senha e _id
  } catch (error) {
    throw new Error("Erro ao autenticar usuario");
  }
}
