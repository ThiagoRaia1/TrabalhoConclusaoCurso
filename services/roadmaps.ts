import { LOCALHOST_URL } from "./urlApi";

export interface IItem {
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
    .trim()
    .normalize("NFD") // separa caracteres de acentos
    .replace(/[\u0300-\u036f]/g, "") // remove os acentos
    .toUpperCase(); // coloca em maiúsculo

  console.log(titulo);
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

export async function atualizarDescricaoItem(
  temaStr: string,
  usuario: string,
  faseIndex: number,
  itemIndex: number,
  novaDescricao: string
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
          novaDescricao,
        }),
      }
    );
  } catch (e) {
    console.warn("Erro ao atualizar banco:", e);
  }
}

/*
export async function editarItemDescricao(
  titulo: string,
  login: string,
  novaDescricao: string
) {
  try {
    // Verifica se já existe um roadmap com o novo título
    await getRoadmap(await normalizeTituloRoadmap(titulo), login);
    // Se não lançou erro, significa que já existe => impedimos o PATCH
    throw new Error("Já existe um roadmap com esse título");
  } catch (erro: any) {
    if (erro.message === "Já existe um roadmap com esse título") {
      throw erro
    } else {
      try {
        titulo = await normalizeTituloRoadmap(titulo);
        const resposta = await fetch(
          `${LOCALHOST_URL}/roadmap/${encodeURIComponent(
            titulo
          )}/${encodeURIComponent(login)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tema: titulo }),
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
  */
