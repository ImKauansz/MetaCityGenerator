import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

if (!process.env.GEMINI_API_KEY) {
    console.error("ERRO: GEMINI_API_KEY não encontrada.");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json({ limit: "100kb" }));
app.use(express.static("public"));

app.post("/api/generate", async (req, res) => {
    try {
        const prompt = `
Você é um escritor especializado em criar personagens fictícios para servidores de GTA RP/FiveM.

Sua tarefa é criar UM personagem completo e coerente para responder a um formulário de whitelist de um servidor chamado Meta City.

O usuário NÃO forneceu nome, idade ou história.

Portanto, você deve criar tudo sozinho.

IMPORTANTE:
- O personagem é totalmente fictício.
- Crie um nome brasileiro natural.
- Crie uma idade entre 18 e 35 anos.
- Crie uma personalidade coerente.
- Crie uma história de vida consistente.
- Todas as respostas devem falar do MESMO personagem.
- Não troque nome, idade ou acontecimentos entre as respostas.
- Use português brasileiro natural.
- Não use linguagem excessivamente formal.
- Evite respostas que pareçam geradas por IA.
- As respostas devem parecer escritas por uma pessoa normal.
- Não use emojis.
- Não coloque títulos dentro das respostas.
- Não explique o processo de geração.
- Não mencione que o personagem foi criado por inteligência artificial.

O personagem pode ter tido dificuldades na vida e cometido erros no passado, mas a história precisa ser coerente e não exagerada.

A história deve ser interessante, mas não precisa ser enorme.

PERGUNTAS DO FORMULÁRIO:

1. Qual seu nome real? (quem está por trás do computador)
2. Quantos anos você tem?
3. Você tem conhecimento de que o abuso de bugs (falhas do jogo) constitui uma infração grave às regras, e que, ao identificar qualquer bug, é sua obrigação reportá-lo à equipe responsável, em vez de utilizá-lo?
4. O que é Metagaming? Dê um exemplo.
5. O que é Powergaming? Dê um exemplo.
6. O que significa "Amor à Vida"?
7. O que é Combat Logging?
8. Você participa ou já entrou em algum servidor de hack/cheat (aimbot, mod menu, wallhack etc.)? Seja honesto — como parte do nosso processo de segurança, verificamos servidores públicos em comum no seu Discord. Omitir informação aqui é motivo de reprovação.
9. O que é uma Safe Zone (Zona Segura)?
10. Motivo de ir para Meta City.

REGRAS DAS RESPOSTAS:

RESPOSTA 1:
Como essa pergunta se refere à pessoa real atrás do computador, use um nome fictício criado para este formulário.

RESPOSTA 2:
Use a idade fictícia criada para o personagem.

RESPOSTA 3:
Responda claramente que SIM e demonstre que o personagem entende que bugs devem ser reportados e não utilizados para benefício próprio.

RESPOSTA 4:
Explique MetaGaming de forma simples e dê um exemplo natural envolvendo informação obtida fora do RP, como live, Discord ou conversa externa.

RESPOSTA 5:
Explique PowerGaming de forma simples e dê um exemplo envolvendo uma situação impossível ou exagerada dentro do RP.

RESPOSTA 6:
Explique Amor à Vida de forma simples, mostrando que o personagem valoriza a própria vida e evita situações em que colocaria sua vida em risco sem motivo.

RESPOSTA 7:
Explique Combat Logging de forma simples, deixando claro que é sair do servidor durante uma situação de RP para evitar suas consequências.

RESPOSTA 8:
Responda NÃO.

RESPOSTA 9:
Explique que Safe Zone é uma área onde determinadas ações de RP, principalmente ações violentas ou criminosas, são proibidas pelas regras do servidor.

RESPOSTA 10:
Essa é a parte MAIS IMPORTANTE.

Crie uma história completa do personagem em primeira pessoa.

A história deve ter aproximadamente 3 a 5 parágrafos.

Ela deve contar:
- Quem é o personagem.
- Onde cresceu.
- Como foi sua vida.
- Algumas dificuldades que enfrentou.
- O que aconteceu para ele decidir mudar de vida.
- Por que decidiu ir para Meta City.
- O que pretende fazer na cidade.
- Seus objetivos para o futuro.

A história deve ter um estilo parecido com uma apresentação pessoal de personagem de RP.

Não faça apenas:
"Quero recomeçar minha vida e trabalhar como motorista."

Transforme o motivo em uma história completa e natural.

EXEMPLO DE ESTILO:

"Meu nome é Carlos Eduardo, mas pode me chamar de Cadu. Cresci em uma região simples de São Paulo, onde desde cedo aprendi que as coisas nunca foram fáceis. Minha família sempre fez o possível para me dar uma vida digna, mas conforme fui crescendo acabei tomando algumas decisões erradas e me aproximando de pessoas que não tinham boas intenções.

Com o tempo, comecei a perceber que aquele caminho estava me levando para um lugar onde eu não queria estar. Vi pessoas próximas perderem oportunidades e até a própria liberdade por causa de escolhas ruins. Foi então que percebi que precisava mudar antes que fosse tarde demais.

Decidi deixar aquela fase para trás e procurar uma nova oportunidade. Foi assim que ouvi falar de Meta City e resolvi tentar começar minha vida novamente. Cheguei na cidade sabendo que teria que correr atrás de tudo do zero, mas também sabendo que essa poderia ser minha oportunidade de fazer as coisas de uma maneira diferente.

Agora meu objetivo é trabalhar honestamente, conquistar meu espaço e construir uma vida tranquila. Pretendo procurar um emprego como motorista, segurança ou em alguma outra área que me permita crescer. Sei que não vai ser fácil, mas estou disposto a trabalhar e enfrentar os desafios que aparecerem."

Não copie esse exemplo. Crie uma história diferente para cada geração.

RETORNE SOMENTE JSON VÁLIDO.

FORMATO OBRIGATÓRIO:

{
  "name": "Nome do personagem",
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

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                temperature: 0.95,
                responseMimeType: "application/json",
                maxOutputTokens: 5000
            }
        });

        const text = response.text;

        if (!text) {
            throw new Error("O Gemini não retornou conteúdo.");
        }

        let result;

        try {
            result = JSON.parse(text);
        } catch {
            console.error("Resposta inválida do Gemini:");
            console.error(text);

            return res.status(500).json({
                error: "O Gemini retornou um JSON inválido."
            });
        }

        if (
            !result.name ||
            !result.age ||
            !Array.isArray(result.answers) ||
            result.answers.length !== 10
        ) {
            return res.status(500).json({
                error: "O Gemini não retornou todas as informações necessárias."
            });
        }

        res.json({
            name: result.name,
            age: result.age,
            answers: result.answers
        });

    } catch (error) {
        console.error("");
        console.error("======================================");
        console.error("ERRO GEMINI");
        console.error("======================================");
        console.error(error);
        console.error("");

        res.status(500).json({
            error: "Erro ao conectar com o Gemini. Verifique sua API Key, modelo ou limite da API."
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("==========================================");
    console.log("       META CITY GENERATOR");
    console.log("==========================================");
    console.log("");
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Modelo: ${MODEL}`);
    console.log("");
});
