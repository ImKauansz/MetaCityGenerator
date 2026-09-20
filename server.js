import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

if (!process.env.GEMINI_API_KEY) {
    console.error("");
    console.error("======================================");
    console.error(" ERRO: API KEY DO GEMINI NÃO ENCONTRADA");
    console.error("======================================");
    console.error("");
    console.error("Crie um arquivo .env e coloque:");
    console.error("GEMINI_API_KEY=SUA_CHAVE_AQUI");
    console.error("");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json({ limit: "100kb" }));

app.use(express.static("public"));


// ==========================================
// GERAR RESPOSTAS
// ==========================================

app.post("/api/generate", async (req, res) => {

    try {

        const {
            perguntas,
            nivel
        } = req.body;


        if (!Array.isArray(perguntas)) {

            return res.status(400).json({
                error: "As perguntas não foram enviadas corretamente."
            });

        }


        if (perguntas.length !== 10) {

            return res.status(400).json({
                error: "É necessário enviar exatamente 10 perguntas."
            });

        }


        let instrucaoNivel = "";

        if (nivel === "leve") {

            instrucaoNivel = `
Faça alterações pequenas.
Mantenha bastante da estrutura original.
Apenas deixe a resposta mais natural.
`;

        } else if (nivel === "alto") {

            instrucaoNivel = `
Mude bastante a construção das frases.
Use palavras diferentes e uma estrutura diferente.
Ainda assim, preserve completamente o significado original.
`;

        } else {

            instrucaoNivel = `
Faça uma reescrita natural.
Altere a construção das frases e algumas palavras.
Não altere o significado original.
`;

        }


        const prompt = `
Você é um assistente de escrita para um formulário de entrada
de um servidor de roleplay chamado Meta City.

Sua função é REESCREVER as respostas fornecidas pelo usuário.

${instrucaoNivel}

REGRAS:

1. Não invente informações pessoais.

2. Não invente idade, nome, experiências ou acontecimentos.

3. Não mude "Sim" para "Não" ou "Não" para "Sim".

4. Não altere o significado da resposta.

5. Não invente informações para deixar a resposta maior.

6. Use português brasileiro natural.

7. Evite linguagem excessivamente formal.

8. As respostas devem parecer escritas normalmente por uma pessoa.

9. Na pergunta 10, responda somente o motivo de ir para Meta City.
Não crie uma história completa.

10. Não coloque comentários explicando o que você fez.

11. Retorne SOMENTE JSON válido.

FORMATO OBRIGATÓRIO:

{
  "answers": [
    "resposta 1",
    "resposta 2",
    "resposta 3",
    "resposta 4",
    "resposta 5",
    "resposta 6",
    "resposta 7",
    "resposta 8",
    "resposta 9",
    "resposta 10"
  ]
}


PERGUNTAS:

${perguntas.map((item, index) => {

    return `
${index + 1}.
PERGUNTA: ${item.question}
RESPOSTA BASE: ${item.answer}
`;

}).join("\n")}

Agora gere o JSON.
`;


        const response = await ai.models.generateContent({

            model: MODEL,

            contents: prompt,

            config: {
                temperature: 0.8,
                responseMimeType: "application/json",
                maxOutputTokens: 2500
            }

        });


        const text = response.text;


        if (!text) {

            return res.status(500).json({
                error: "O Gemini não retornou nenhuma resposta."
            });

        }


        let result;

        try {

            result = JSON.parse(text);

        } catch (error) {

            console.error("JSON inválido recebido do Gemini:");
            console.error(text);

            return res.status(500).json({
                error: "O Gemini retornou uma resposta inválida."
            });

        }


        if (
            !result.answers ||
            !Array.isArray(result.answers) ||
            result.answers.length !== 10
        ) {

            return res.status(500).json({
                error: "O Gemini não retornou as 10 respostas."
            });

        }


        res.json({
            answers: result.answers
        });


    } catch (error) {

        console.error("");
        console.error("ERRO GEMINI:");
        console.error(error);
        console.error("");


        res.status(500).json({

            error:
                "Erro ao conectar com o Gemini. Verifique sua API Key, internet ou limite da API."

        });

    }

});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {

    console.log("");
    console.log("==========================================");
    console.log("       META CITY GENERATOR");
    console.log("==========================================");
    console.log("");
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log(`Modelo: ${MODEL}`);
    console.log("");
    console.log("Deixe esta janela aberta enquanto usar o site.");
    console.log("");

});
