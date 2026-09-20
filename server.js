import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const PRIMARY_MODEL =
    process.env.GEMINI_MODEL || "gemini-3.6-flash";

const FALLBACK_MODEL =
    process.env.GEMINI_FALLBACK_MODEL ||
    "gemini-3.5-flash-lite";

app.use(express.json({ limit: "100kb" }));
app.use(express.static("public"));

// =====================================================
// CONFIGURAÇÃO
// =====================================================

console.log("");
console.log("==========================================");
console.log("         META CITY GENERATOR");
console.log("==========================================");
console.log("Porta:", PORT);
console.log("Modelo principal:", PRIMARY_MODEL);
console.log("Modelo reserva:", FALLBACK_MODEL);
console.log(
    "API Key:",
    process.env.GEMINI_API_KEY
        ? "CONFIGURADA"
        : "NÃO CONFIGURADA"
);
console.log("==========================================");
console.log("");

if (!process.env.GEMINI_API_KEY) {
    console.error(
        "ERRO: GEMINI_API_KEY não configurada."
    );
}

const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })
    : null;


// =====================================================
// BANCO DE NOMES
// =====================================================

const nomes = [
    "Gabriel Henrique",
    "Lucas Rafael",
    "João Victor",
    "Pedro Henrique",
    "Carlos Eduardo",
    "Rafael Augusto",
    "Gustavo Henrique",
    "Matheus Gabriel",
    "Felipe Augusto",
    "Bruno Henrique",
    "Leonardo Rafael",
    "Caio Vinícius",
    "Vinícius Gabriel",
    "André Luiz",
    "Diego Henrique",
    "Thiago Martins",
    "Eduardo Rafael",
    "Arthur Miguel",
    "Miguel Augusto",
    "Samuel Henrique",
    "Nicolas Rafael",
    "Henrique Gabriel",
    "Murilo Augusto",
    "Ryan Gabriel",
    "Luiz Fernando",
    "Daniel Henrique",
    "Alexandre Lucas",
    "Guilherme Augusto",
    "Wesley Gabriel",
    "Igor Henrique",
    "Fernando Augusto",
    "Victor Hugo",
    "Júlio César",
    "Marcelo Henrique",
    "Renan Gabriel",
    "Vitor Rafael",
    "Diego Lucas",
    "Cauã Henrique",
    "Breno Gabriel",
    "Heitor Gabriel",
    "Enrico Rafael",
    "Davi Henrique",
    "Otávio Lucas",
    "Isaac Gabriel",
    "Luan Henrique",
    "Yuri Rafael",
    "Emanuel Lucas",
    "Benjamin Gabriel",
    "Nathan Henrique"
];

const sobrenomes = [
    "Almeida",
    "Barbosa",
    "Carvalho",
    "Costa",
    "Dias",
    "Ferreira",
    "Gomes",
    "Lima",
    "Martins",
    "Mendes",
    "Moreira",
    "Nascimento",
    "Oliveira",
    "Pereira",
    "Ramos",
    "Rocha",
    "Rodrigues",
    "Santos",
    "Silva",
    "Souza",
    "Teixeira",
    "Vieira",
    "Araújo",
    "Batista",
    "Campos",
    "Cardoso",
    "Castro",
    "Cavalcanti",
    "Correia",
    "Duarte",
    "Farias",
    "Freitas",
    "Macedo",
    "Monteiro",
    "Nogueira",
    "Pinto",
    "Rezende",
    "Santana",
    "Tavares",
    "Vasconcelos"
];


// =====================================================
// MEMÓRIA DE NOMES RECENTES
// =====================================================

const nomesRecentes = [];

function gerarNome() {

    let nomeCompleto = "";

    for (let tentativa = 0; tentativa < 50; tentativa++) {

        const nomeBase =
            nomes[
                Math.floor(
                    Math.random() * nomes.length
                )
            ];

        const sobrenome1 =
            sobrenomes[
                Math.floor(
                    Math.random() * sobrenomes.length
                )
            ];

        let sobrenome2 =
            sobrenomes[
                Math.floor(
                    Math.random() * sobrenomes.length
                )
            ];

        while (sobrenome2 === sobrenome1) {

            sobrenome2 =
                sobrenomes[
                    Math.floor(
                        Math.random() * sobrenomes.length
                    )
                ];

        }

        nomeCompleto =
            `${nomeBase} ${sobrenome1} ${sobrenome2}`;

        if (
            !nomesRecentes.includes(
                nomeCompleto
            )
        ) {
            break;
        }
    }

    nomesRecentes.push(nomeCompleto);

    if (nomesRecentes.length > 30) {
        nomesRecentes.shift();
    }

    return nomeCompleto;
}


// =====================================================
// ID ÚNICO DA GERAÇÃO
// =====================================================

function gerarSeed() {

    return Math.floor(
        Math.random() * 999999999
    );

}


// =====================================================
// PROMPT
// =====================================================

function criarPrompt(nome, seed) {

    return `

Você está criando um personagem FICTÍCIO para
uma whitelist de GTA RP/FiveM chamada Meta City.

Esta é uma nova geração de personagem.

IDENTIDADE DESTA GERAÇÃO:

Nome obrigatório:
${nome}

Seed desta geração:
${seed}

O nome acima é OBRIGATÓRIO.

Use exatamente:

${nome}

Não altere o nome.

Não crie outro nome.

Não use "Matheus Silva de Oliveira".

Não use nomes de gerações anteriores.

O personagem deve ter entre 18 e 35 anos.

Escolha uma idade aleatória dentro dessa faixa.

Todas as respostas precisam pertencer ao mesmo personagem.

Escreva em português brasileiro natural.

Não use emojis.

Não diga que o personagem foi criado por IA.

Não mencione este prompt.

Não faça respostas excessivamente formais.

Cada geração deve ser diferente.


==================================================
PERGUNTAS
==================================================

1. Qual seu nome real? (quem está por trás do computador)

2. Quantos anos você tem?

3. Você tem conhecimento de que o abuso de bugs
(falhas do jogo) constitui uma infração grave às
regras, e que, ao identificar qualquer bug, é sua
obrigação reportá-lo à equipe responsável,
em vez de utilizá-lo?

4. O que é Metagaming? Dê um exemplo.

5. O que é Powergaming? Dê um exemplo.

6. O que significa "Amor à Vida"?

7. O que é Combat Logging?

8. Você participa ou já entrou em algum servidor
de hack/cheat (aimbot, mod menu, wallhack etc.)?
Seja honesto.

9. O que é uma Safe Zone (Zona Segura)?

10. Motivo de ir para Meta City.


==================================================
REGRAS DAS RESPOSTAS
==================================================

RESPOSTA 1:

Use exatamente o nome:

${nome}


RESPOSTA 2:

Escolha uma idade entre 18 e 35 anos.

Use essa mesma idade na resposta.


RESPOSTA 3:

Responda SIM.

Explique que bugs devem ser reportados e não
utilizados para obter vantagem.


RESPOSTA 4:

Explique Metagaming de maneira simples.

Dê um exemplo de alguém usando uma informação
obtida fora do RP, como uma live, Discord ou
conversa externa.


RESPOSTA 5:

Explique Powergaming de maneira simples.

Dê um exemplo de algo impossível ou exagerado
dentro do RP.


RESPOSTA 6:

Explique Amor à Vida de maneira simples.

Mostre que o personagem valoriza sua vida.


RESPOSTA 7:

Explique Combat Logging de maneira simples.


RESPOSTA 8:

Responda NÃO.


RESPOSTA 9:

Explique Safe Zone de maneira simples.


==================================================
RESPOSTA 10 — HISTÓRIA
==================================================

Crie uma história completa do personagem.

A história deve ser escrita em PRIMEIRA PESSOA.

Faça entre 3 e 5 parágrafos.

A história precisa contar:

- Quem é o personagem
- Onde nasceu ou cresceu
- Como foi sua infância
- Como foi sua juventude
- Relação com a família
- Dificuldades enfrentadas
- Algum problema ou decisão errada
- O que fez ele querer mudar
- Por que decidiu ir para Meta City
- O que pretende fazer na cidade
- Seus objetivos futuros

NÃO escreva uma história genérica.

NÃO faça sempre o personagem querer ser motorista.

Varie entre profissões e objetivos como:

- mecânico
- empresário
- segurança
- fotógrafo
- entregador
- advogado
- médico
- policial
- caminhoneiro
- empreendedor
- funcionário de oficina
- vendedor
- trabalhar com veículos
- abrir um negócio

Escolha algo coerente com a história.

Também varie:

- cidade de origem
- família
- infância
- dificuldades
- personalidade
- acontecimentos
- objetivos
- profissão

A história deve parecer escrita naturalmente
pelo próprio personagem.

==================================================
FORMATO
==================================================

Retorne SOMENTE JSON válido.

Use exatamente este formato:

{
    "name": "${nome}",
    "age": 24,
    "answers": [
        "Resposta 1",
        "Resposta 2",
        "Resposta 3",
        "Resposta 4",
        "Resposta 5",
        "Resposta 6",
        "Resposta 7",
        "Resposta 8",
        "Resposta 9",
        "Resposta 10"
    ]
}

IMPORTANTE:

O campo "name" deve ser exatamente:

"${nome}"

O campo "age" deve conter apenas um número.

O array "answers" deve conter exatamente 10 respostas.

`;

}


// =====================================================
// ESPERAR
// =====================================================

function esperar(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


// =====================================================
// ERRO TEMPORÁRIO
// =====================================================

function erroTemporario(error) {

    const mensagem =
        error?.message ||
        String(error);

    return (
        mensagem.includes("503") ||
        mensagem.includes("UNAVAILABLE") ||
        mensagem.includes("high demand") ||
        mensagem.includes("429") ||
        mensagem.includes("RESOURCE_EXHAUSTED") ||
        mensagem.includes("overloaded")
    );

}


// =====================================================
// CHAMAR GEMINI
// =====================================================

async function chamarGemini(
    model,
    prompt
) {

    console.log(
        `Chamando modelo: ${model}`
    );

    const response =
        await ai.models.generateContent({

            model,

            contents: prompt,

            config: {

                responseMimeType:
                    "application/json",

                maxOutputTokens:
                    5000

            }

        });

    if (
        !response ||
        !response.text
    ) {

        throw new Error(
            "O Gemini respondeu sem conteúdo."
        );

    }

    return response.text;

}


// =====================================================
// STATUS
// =====================================================

app.get(
    "/api/status",
    (req, res) => {

        res.json({

            online: true,

            primaryModel:
                PRIMARY_MODEL,

            fallbackModel:
                FALLBACK_MODEL,

            apiKeyConfigured:
                !!process.env.GEMINI_API_KEY

        });

    }
);


// =====================================================
// GERAR PERSONAGEM
// =====================================================

app.post(
    "/api/generate",
    async (req, res) => {

        console.log("");
        console.log(
            "=========================================="
        );
        console.log(
            "NOVA GERAÇÃO"
        );
        console.log(
            "=========================================="
        );


        try {

            if (!ai) {

                return res.status(500).json({

                    error:
                        "GEMINI_API_KEY não está configurada no Render."

                });

            }


            // ==========================================
            // GERAR NOME NO SERVIDOR
            // ==========================================

            const nome =
                gerarNome();

            const seed =
                gerarSeed();


            console.log(
                "Nome escolhido:",
                nome
            );

            console.log(
                "Seed:",
                seed
            );


            const prompt =
                criarPrompt(
                    nome,
                    seed
                );


            let respostaTexto =
                null;

            let ultimoErro =
                null;


            // ==========================================
            // MODELO PRINCIPAL
            // ==========================================

            for (
                let tentativa = 1;
                tentativa <= 3;
                tentativa++
            ) {

                try {

                    console.log(
                        `Tentativa principal ${tentativa}/3`
                    );


                    respostaTexto =
                        await chamarGemini(
                            PRIMARY_MODEL,
                            prompt
                        );


                    break;


                } catch (error) {

                    ultimoErro =
                        error;


                    console.error(
                        "Erro:",
                        error?.message
                    );


                    if (
                        !erroTemporario(
                            error
                        )
                    ) {

                        break;

                    }


                    if (
                        tentativa < 3
                    ) {

                        const tempo =
                            tentativa * 2000;

                        console.log(
                            `Aguardando ${tempo / 1000}s...`
                        );

                        await esperar(
                            tempo
                        );

                    }

                }

            }


            // ==========================================
            // FALLBACK
            // ==========================================

            if (!respostaTexto) {

                console.log(
                    "Tentando modelo reserva..."
                );


                try {

                    respostaTexto =
                        await chamarGemini(
                            FALLBACK_MODEL,
                            prompt
                        );


                } catch (error) {

                    ultimoErro =
                        error;

                    console.error(
                        "Fallback falhou:",
                        error?.message
                    );

                }

            }


            // ==========================================
            // ERRO FINAL
            // ==========================================

            if (!respostaTexto) {

                const mensagem =
                    ultimoErro?.message ||
                    "Não foi possível gerar o personagem.";


                if (
                    mensagem.includes("429") ||
                    mensagem.includes(
                        "RESOURCE_EXHAUSTED"
                    )
                ) {

                    return res.status(429).json({

                        error:
                            "O limite do Gemini foi atingido. Aguarde alguns minutos e tente novamente."

                    });

                }


                if (
                    mensagem.includes("503") ||
                    mensagem.includes(
                        "UNAVAILABLE"
                    ) ||
                    mensagem.includes(
                        "high demand"
                    )
                ) {

                    return res.status(503).json({

                        error:
                            "O Gemini está temporariamente ocupado. Tente novamente em alguns segundos."

                    });

                }


                return res.status(500).json({

                    error:
                        mensagem

                });

            }


            // ==========================================
            // TRANSFORMAR JSON
            // ==========================================

            let resultado;


            try {

                resultado =
                    JSON.parse(
                        respostaTexto
                    );


            } catch (error) {

                console.error(
                    "JSON inválido:"
                );

                console.error(
                    respostaTexto
                );


                return res.status(500).json({

                    error:
                        "O Gemini retornou uma resposta inválida."

                });

            }


            // ==========================================
            // CORRIGIR NOME CASO GEMINI ALTERE
            // ==========================================

            resultado.name =
                nome;


            // ==========================================
            // VALIDAR
            // ==========================================

            if (
                !resultado.age ||
                !Array.isArray(
                    resultado.answers
                ) ||
                resultado.answers.length !== 10
            ) {

                return res.status(500).json({

                    error:
                        "O Gemini não retornou as 10 respostas."

                });

            }


            // ==========================================
            // GARANTIR RESPOSTA 1
            // ==========================================

            resultado.answers[0] =
                `Meu nome é ${nome}.`;


            // ==========================================
            // RESPOSTA FINAL
            // ==========================================

            console.log("");
            console.log(
                "GERAÇÃO CONCLUÍDA"
            );

            console.log(
                "Nome:",
                nome
            );

            console.log(
                "Idade:",
                resultado.age
            );

            console.log(
                "Respostas:",
                resultado.answers.length
            );

            console.log("");


            return res.json({

                name:
                    nome,

                age:
                    resultado.age,

                answers:
                    resultado.answers

            });


        } catch (error) {

            console.error(
                "ERRO GERAL:"
            );

            console.error(
                error
            );


            return res.status(500).json({

                error:
                    error?.message ||
                    "Erro interno do servidor."

            });

        }

    }
);


// =====================================================
// SERVIDOR
// =====================================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "Servidor online."
        );

        console.log(
            `Porta: ${PORT}`
        );

    }
);
