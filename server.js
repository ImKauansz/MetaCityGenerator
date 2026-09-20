import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

app.use(express.json({ limit: "100kb" }));
app.use(express.static("public"));

console.log("==========================================");
console.log("       META CITY GENERATOR");
console.log("==========================================");
console.log("Porta:", PORT);
console.log("Modelo:", MODEL);
console.log(
    "API Key configurada:",
    process.env.GEMINI_API_KEY ? "SIM" : "NÃO"
);
console.log("==========================================");

if (!process.env.GEMINI_API_KEY) {
    console.error("ERRO: GEMINI_API_KEY não configurada.");
}

const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })
    : null;


// ==========================================
// STATUS
// ==========================================

app.get("/api/status", (req, res) => {

    res.json({
        online: true,
        model: MODEL,
        apiKeyConfigured:
            !!process.env.GEMINI_API_KEY
    });

});


// ==========================================
// GERAR PERSONAGEM
// ==========================================

app.post("/api/generate", async (req, res) => {

    console.log("");
    console.log("==========================================");
    console.log("NOVA SOLICITAÇÃO");
    console.log("==========================================");

    try {

        if (!ai) {

            return res.status(500).json({
                error:
                    "A API Key do Gemini não está configurada no Render."
            });

        }


        // ==========================================
        // PROMPT
        // ==========================================

        const prompt = `

Você é um escritor especializado em criar personagens
fictícios para servidores de GTA RP/FiveM.

Crie UM personagem completo para uma whitelist
de um servidor chamado Meta City.

O usuário não forneceu nenhuma informação.

Você deve criar sozinho:

- Nome brasileiro fictício
- Idade entre 18 e 35 anos
- Personalidade
- Passado
- Objetivos
- História de vida

TODAS as respostas precisam pertencer ao MESMO personagem.

Não altere o nome ou idade entre as respostas.

Use português brasileiro natural.

As respostas devem parecer escritas naturalmente
por uma pessoa.

Evite linguagem excessivamente formal.

Não use emojis.

Não diga que o personagem foi criado por IA.

Não mencione este prompt.

O personagem é fictício e destinado a roleplay.


==========================================
PERGUNTAS
==========================================

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


==========================================
REGRAS
==========================================

RESPOSTA 1:

Use o nome fictício criado para o personagem.

RESPOSTA 2:

Use a idade fictícia criada.

RESPOSTA 3:

Responda SIM e demonstre que entende que bugs
devem ser reportados e não utilizados para
obter vantagem.

RESPOSTA 4:

Explique MetaGaming de maneira simples e dê
um exemplo envolvendo informação obtida fora
do RP, como live, Discord ou conversa externa.

RESPOSTA 5:

Explique PowerGaming de maneira simples e dê
um exemplo de algo impossível ou exagerado
dentro do RP.

RESPOSTA 6:

Explique Amor à Vida de maneira simples,
mostrando que o personagem valoriza sua vida
e evita situações desnecessariamente perigosas.

RESPOSTA 7:

Explique Combat Logging de maneira simples,
deixando claro que é sair do servidor durante
uma situação de RP para evitar consequências.

RESPOSTA 8:

Responda NÃO.

RESPOSTA 9:

Explique o que é uma Safe Zone de maneira
simples e natural.

RESPOSTA 10:

Essa é a parte mais importante.

Crie uma HISTÓRIA COMPLETA do personagem.

A história deve ser escrita em PRIMEIRA PESSOA.

Deve ter aproximadamente 3 a 5 parágrafos.

A história deve contar:

- Quem é o personagem.
- Onde cresceu.
- Como foi sua infância ou juventude.
- Algumas dificuldades que enfrentou.
- Problemas ou decisões erradas que teve.
- O que fez ele querer mudar.
- Por que decidiu ir para Meta City.
- O que pretende fazer na cidade.
- Seus objetivos para o futuro.

Não faça apenas uma frase dizendo:

"Quero recomeçar minha vida."

Transforme a ideia em uma história completa,
natural e interessante.

A história deve parecer uma apresentação
do personagem para uma whitelist.

Crie uma história diferente em cada geração.

Não copie exemplos anteriores.

==========================================
FORMATO
==========================================

Retorne SOMENTE JSON válido.

Formato obrigatório:

{
    "name": "Nome completo",
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

`;


        // ==========================================
        // TENTATIVAS
        // ==========================================

        let response = null;
        let lastError = null;

        const maxAttempts = 4;

        for (
            let attempt = 1;
            attempt <= maxAttempts;
            attempt++
        ) {

            try {

                console.log(
                    `Tentativa ${attempt}/${maxAttempts}`
                );

                console.log(
                    `Modelo: ${MODEL}`
                );


                response =
                    await ai.models.generateContent({

                        model: MODEL,

                        contents: prompt,

                        config: {

                            temperature: 0.9,

                            responseMimeType:
                                "application/json",

                            maxOutputTokens:
                                5000

                        }

                    });


                console.log(
                    "Gemini respondeu com sucesso."
                );

                break;


            } catch (error) {

                lastError = error;

                const message =
                    error?.message ||
                    String(error);

                console.error(
                    `Erro na tentativa ${attempt}:`
                );

                console.error(message);


                const temporaryError =
                    message.includes("503") ||
                    message.includes("UNAVAILABLE") ||
                    message.includes("high demand") ||
                    message.includes("429") ||
                    message.includes("RESOURCE_EXHAUSTED");


                if (!temporaryError) {

                    console.error(
                        "Erro não temporário."
                    );

                    break;

                }


                if (
                    attempt <
                    maxAttempts
                ) {

                    // 2s, 4s, 6s
                    const wait =
                        attempt * 2000;

                    console.log(
                        `Aguardando ${wait / 1000}s...`
                    );

                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                wait
                            )
                    );

                }

            }

        }


        // ==========================================
        // NENHUMA RESPOSTA
        // ==========================================

        if (!response) {

            const message =
                lastError?.message ||
                "O Gemini não respondeu.";

            if (
                message.includes("503") ||
                message.includes("UNAVAILABLE") ||
                message.includes("high demand")
            ) {

                return res.status(503).json({

                    error:
                        "O Gemini está com alta demanda no momento. Tente novamente em alguns segundos."

                });

            }


            if (
                message.includes("429") ||
                message.includes("RESOURCE_EXHAUSTED")
            ) {

                return res.status(429).json({

                    error:
                        "O limite da API do Gemini foi atingido. Tente novamente mais tarde."

                });

            }


            return res.status(500).json({

                error:
                    message

            });

        }


        // ==========================================
        // LER RESPOSTA
        // ==========================================

        const text =
            response.text;


        if (!text) {

            return res.status(500).json({

                error:
                    "O Gemini respondeu sem conteúdo."

            });

        }


        console.log(
            "Tamanho da resposta:",
            text.length
        );


        // ==========================================
        // JSON
        // ==========================================

        let result;

        try {

            result =
                JSON.parse(text);

        } catch (error) {

            console.error(
                "JSON inválido recebido:"
            );

            console.error(text);

            return res.status(500).json({

                error:
                    "O Gemini retornou uma resposta inválida."

            });

        }


        // ==========================================
        // VALIDAR
        // ==========================================

        if (
            !result.name ||
            !result.age ||
            !Array.isArray(result.answers) ||
            result.answers.length !== 10
        ) {

            console.error(
                "Resposta incompleta:"
            );

            console.error(result);

            return res.status(500).json({

                error:
                    "O Gemini não retornou todas as informações necessárias."

            });

        }


        console.log(
            "Personagem:",
            result.name
        );

        console.log(
            "Idade:",
            result.age
        );

        console.log(
            "10 respostas recebidas."
        );

        console.log(
            "Geração concluída."
        );


        return res.json({

            name:
                result.name,

            age:
                result.age,

            answers:
                result.answers

        });


    } catch (error) {

        console.error("");
        console.error(
            "=========================================="
        );
        console.error(
            "ERRO GERAL"
        );
        console.error(
            "=========================================="
        );
        console.error(error);
        console.error(
            "=========================================="
        );


        return res.status(500).json({

            error:
                error?.message ||
                "Erro desconhecido no servidor."

        });

    }

});


// ==========================================
// SERVIDOR
// ==========================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log(
            "=========================================="
        );

        console.log(
            "META CITY GENERATOR ONLINE"
        );

        console.log(
            "=========================================="
        );

        console.log(
            `Porta: ${PORT}`
        );

        console.log(
            `Modelo: ${MODEL}`
        );

        console.log(
            "=========================================="
        );

    }
);
