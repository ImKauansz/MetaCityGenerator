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

app.get("/api/status", (req, res) => {
    res.json({
        online: true,
        model: MODEL,
        apiKeyConfigured: !!process.env.GEMINI_API_KEY
    });
});

app.post("/api/generate", async (req, res) => {

    console.log("");
    console.log("==========================================");
    console.log("NOVA SOLICITAÇÃO DE GERAÇÃO");
    console.log("==========================================");

    try {

        if (!ai) {
            console.error("API KEY NÃO CONFIGURADA.");

            return res.status(500).json({
                error: "A API Key do Gemini não está configurada no Render."
            });
        }

        const prompt = `
Crie um personagem fictício completo para uma whitelist de GTA RP/FiveM chamada Meta City.

O usuário não forneceu nenhuma informação.

Você deve criar sozinho:

- Nome brasileiro fictício
- Idade entre 18 e 35 anos
- Personalidade
- Passado
- Objetivos
- História coerente

TODAS as respostas precisam pertencer ao MESMO personagem.

Não altere o nome ou idade entre as respostas.

Use português brasileiro natural.

Não use emojis.

Não diga que o personagem foi criado por IA.

Não faça respostas extremamente formais.

As respostas devem parecer escritas naturalmente por uma pessoa.

PERGUNTAS:

1. Qual seu nome real? (quem está por trás do computador)

2. Quantos anos você tem?

3. Você tem conhecimento de que o abuso de bugs (falhas do jogo) constitui uma infração grave às regras, e que, ao identificar qualquer bug, é sua obrigação reportá-lo à equipe responsável, em vez de utilizá-lo?

4. O que é Metagaming? Dê um exemplo.

5. O que é Powergaming? Dê um exemplo.

6. O que significa "Amor à Vida"?

7. O que é Combat Logging?

8. Você participa ou já entrou em algum servidor de hack/cheat (aimbot, mod menu, wallhack etc.)? Seja honesto.

9. O que é uma Safe Zone (Zona Segura)?

10. Motivo de ir para Meta City.

REGRAS:

Resposta 1:
Use o nome fictício criado para o personagem.

Resposta 2:
Use a idade fictícia criada.

Resposta 3:
Responda SIM e mostre que entende que bugs devem ser reportados e não utilizados.

Resposta 4:
Explique MetaGaming de maneira simples e dê um exemplo envolvendo informação obtida fora do RP.

Resposta 5:
Explique PowerGaming de maneira simples e dê um exemplo de algo impossível ou exagerado dentro do RP.

Resposta 6:
Explique Amor à Vida de maneira simples.

Resposta 7:
Explique Combat Logging de maneira simples.

Resposta 8:
Responda NÃO.

Resposta 9:
Explique o que é uma Safe Zone de maneira simples.

Resposta 10:
Crie uma HISTÓRIA COMPLETA do personagem.

A resposta 10 deve ter aproximadamente 3 a 5 parágrafos.

Conte:

- Quem é o personagem.
- Onde cresceu.
- Como foi sua infância/juventude.
- Dificuldades que enfrentou.
- Decisões erradas ou problemas que passou.
- O que fez ele querer mudar.
- Por que decidiu ir para Meta City.
- O que pretende fazer na cidade.
- Quais são seus objetivos.

A história deve ser em primeira pessoa.

Não faça apenas uma frase dizendo que quer trabalhar.

Transforme o motivo em uma história de personagem completa.

Crie uma história diferente em cada geração.

RETORNE SOMENTE JSON VÁLIDO.

FORMATO:

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

        console.log("Enviando solicitação para Gemini...");
        console.log("Modelo utilizado:", MODEL);

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                temperature: 0.9,
                responseMimeType: "application/json",
                maxOutputTokens: 5000
            }
        });

        console.log("Gemini respondeu.");

        const text = response.text;

        if (!text) {
            throw new Error(
                "O Gemini respondeu sem conteúdo."
            );
        }

        console.log("Tamanho da resposta:", text.length);

        let result;

        try {
            result = JSON.parse(text);
        } catch (jsonError) {

            console.error("ERRO AO INTERPRETAR JSON:");
            console.error(text);

            return res.status(500).json({
                error: "O Gemini retornou uma resposta inválida."
            });
        }

        if (
            !result.name ||
            !result.age ||
            !Array.isArray(result.answers) ||
            result.answers.length !== 10
        ) {
            console.error(
                "Resposta incompleta do Gemini:",
                result
            );

            return res.status(500).json({
                error: "O Gemini não retornou todas as respostas."
            });
        }

        console.log("Personagem:", result.name);
        console.log("Idade:", result.age);
        console.log("10 respostas recebidas.");
        console.log("Geração concluída com sucesso.");

        return res.json({
            name: result.name,
            age: result.age,
            answers: result.answers
        });

    } catch (error) {

        console.error("");
        console.error("==========================================");
        console.error("ERRO GEMINI");
        console.error("==========================================");
        console.error(error);
        console.error("==========================================");
        console.error("");

        return res.status(500).json({
            error:
                error?.message ||
                "Erro desconhecido ao conectar com o Gemini."
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("==========================================");
    console.log("SERVIDOR ONLINE");
    console.log("==========================================");
    console.log(`Porta: ${PORT}`);
    console.log(`Modelo: ${MODEL}`);
    console.log("");
});
