import axios from "axios";
import { LOCALHOST_URL } from "./urlApi";
import { getRoadmap, normalizeTituloRoadmap } from "./roadmaps";

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
  const res = await fetch(
    `${LOCALHOST_URL}/roadmap/${encodeURIComponent(login)}/${encodeURIComponent(
      titulo
    )}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error("Falha ao excluir roadmap");
  }
}

export async function editarTituloRoadmap(
  tituloAtual: string,
  login: string,
  novoTitulo: string
) {
  try {
    // Verifica se já existe um roadmap com o novo título
    await getRoadmap(await normalizeTituloRoadmap(novoTitulo), login);
    // Se não lançou erro, significa que já existe => impedimos o PATCH
    throw new Error("Já existe um roadmap com esse título");
  } catch (erro: any) {
    if (erro.message === "Já existe um roadmap com esse título") {
      throw erro
    } else {
      try {
        novoTitulo = await normalizeTituloRoadmap(novoTitulo);
        const resposta = await fetch(
          `${LOCALHOST_URL}/roadmap/${encodeURIComponent(
            tituloAtual
          )}/${encodeURIComponent(login)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tema: novoTitulo }),
          }
        );

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
  }
}
