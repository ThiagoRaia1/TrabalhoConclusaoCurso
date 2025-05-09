interface IItem {
    titulo: string;
    descricao: string;
    concluido: boolean
}

interface IFase {
    titulo: string;
    cor: string;
    itens: IItem[];
}

export interface IRoadmap {
    _id: string
    titulo: string,
    usuarioLogin: string
    fases: IFase[];
}


const API_URL = `http://localhost:3000/roadmap`;

export async function getRoadmap(tema: string, login: string): Promise<IRoadmap> {
    try {
        const resposta = await fetch(`${API_URL}/${tema}/${login}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.message || "Erro ao carregar aulas");
        }

        // Retorne a resposta como um objeto JSON que será do tipo Roadmap
        const dados: IRoadmap = await resposta.json();
        return dados;  // Retorne os dados aqui
    } catch (erro: any) {
        console.log("Erro ao carregar roadmap: ", erro.message);
        throw erro;
    }
}
