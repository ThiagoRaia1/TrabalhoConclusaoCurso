import { LOCALHOST_URL } from "./urlApi";

interface IItem {
  titulo: string;
  descricao: string;
  concluido: boolean;
}

export interface IFase {
  titulo: string;
  cor: string;
  itens: IItem[];
}

export interface IRoadmap {
  titulo: string;
  usuarioLogin: string;
  fases: IFase[];
}

export async function normalizeTituloRoadmap(titulo: string) {
  titulo = titulo
    .normalize("NFD") // separa caracteres de acentos
    .replace(/[\u0300-\u036f]/g, "") // remove os acentos
    .toUpperCase(); // coloca em maiúsculo

  return titulo;
}

export async function createRoadmap(roadmap: IRoadmap) {
  try {
    // Remove acentos e coloca em maiúsculo
    roadmap.titulo = await normalizeTituloRoadmap(roadmap.titulo);

    // Agora, você envia o conteúdo para o backend
    const resposta = await fetch(`${LOCALHOST_URL}/roadmap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roadmap), // Envia o roadmap obtido
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.message || "Erro ao criar o roadmap");
    }

    const result = await resposta.json();
    console.log("Roadmap salvo no banco:", result);
    return result;
  } catch (error) {
    console.error("Erro ao criar roadmap no backend:", error);
    throw error;
  }
}

export async function getRoadmap(
  tema: string,
  login: string
): Promise<IRoadmap> {
  try {
    const resposta = await fetch(`${LOCALHOST_URL}/roadmap/${tema}/${login}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resposta.status === 404) throw new Error("Roadmap não encontrado");

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.message || "Erro ao carregar aulas");
    }

    // Retorne a resposta como um objeto JSON que será do tipo Roadmap
    const dados: IRoadmap = await resposta.json();
    return dados; // Retorne os dados aqui
  } catch (erro: any) {
    console.log("Erro ao carregar roadmap: ", erro.message);
    throw erro;
  }
}

// Atualiza no banco o campo "conclusao" quando o checkbox do item for marcado
export async function atualizarStatusConclusao(
  temaStr: string,
  usuario: string,
  faseIndex: number,
  itemIndex: number,
  concluido: boolean
) {
  try {
    await fetch(
      `${LOCALHOST_URL}/roadmap/${temaStr}/${faseIndex}/${itemIndex}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioLogin: usuario,
          concluido,
        }),
      }
    );
  } catch (e) {
    console.warn("Erro ao atualizar banco:", e);
  }
}
