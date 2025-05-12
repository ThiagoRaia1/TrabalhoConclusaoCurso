import axios from 'axios';
import { LOCALHOST_URL } from '../../services/urlApi';

export type Roadmap = {
  titulo: string;
  usuarioLogin: string;
  fases: any[];
};

export async function fetchRoadmapsByLogin(login: string): Promise<Roadmap[]> {
  try {
    const res = await axios.get(`${LOCALHOST_URL}/roadmap`);
    const roadmaps: Roadmap[] = Array.isArray(res.data) ? res.data : [res.data];
    return roadmaps.filter((r) => r.usuarioLogin === login);
  } catch (err) {
    console.error("Erro ao buscar roadmaps:", err);
    return [];
  }
}

export async function deleteRoadmapByTitulo(titulo: string, login: string) {
  const res = await fetch(`${LOCALHOST_URL}/roadmap/${login}/${encodeURIComponent(titulo)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Falha ao excluir roadmap");
  }
}

