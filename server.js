import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Modelo principal
const PRIMARY_MODEL =
    process.env.GEMINI_MODEL || "gemini-3.6-flash";

// Modelo reserva
const FALLBACK_MODEL =
    process.env.GEMINI_FALLBACK_MODEL ||
    "gemini-3.5-flash-lite";

app.use(express.json({ limit: "100kb" }));
app.use(express.static("public"));


console.log("==========================================");
console.log("       META CITY GENERATOR");
console.log("==========================================");
console.log("Porta:", PORT);
console.log("Modelo principal:", PRIMARY_MODEL);
console.log("Modelo reserva:", FALLBACK_MODEL);
console.log(
    "API Key:",
    process.env.GEMINI_API_KEY ? "CONFIGURADA" : "NÃO CONFIGURADA"
);
console.log("==========================================");


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


// ==========================================
// STATUS
// ==========================================

app.get("/api/status", (req, res) => {

    res.json({

        online: true,

        primaryModel:
            PRIMARY_MODEL,

        fallbackModel:
            FALLBACK_MODEL,

        apiKeyConfigured:
            !!process.env.GEMINI_API_KEY

    });

});


// ==========================================
// PROMPT
// ==========================================

function createPrompt() {      const seed = Math.floor(         Math.random() * 999999999     );      const nomes = [         "Gabriel Henrique",         "Lucas Rafael",         "João Victor",         "Pedro Henrique",         "Carlos Eduardo",         "Rafael Augusto",         "Gustavo Henrique",         "Matheus Gabriel",         "Felipe Augusto",         "Bruno Henrique",         "Leonardo Rafael",         "Caio Vinícius",         "Vinícius Gabriel",         "André Luiz",         "Diego Henrique",         "Thiago Martins",         "Eduardo Rafael",         "Arthur Miguel",         "Miguel Augusto",         "Enzo Gabriel",         "Samuel Henrique",         "Nicolas Rafael",         "Henrique Gabriel",         "Murilo Augusto",         "Ryan Gabriel",         "Luiz Fernando",         "Daniel Henrique",         "Alexandre Lucas",         "Guilherme Augusto",         "Wesley Gabriel",         "Igor Henrique",         "Fernando Augusto",         "Victor Hugo",         "Júlio César",         "Marcelo Henrique",         "Renan Gabriel",         "Vitor Rafael",         "Diego Lucas",         "Cauã Henrique",         "Breno Gabriel"     ];      const sobrenomes = [         "Almeida",         "Barbosa",         "Carvalho",         "Costa",         "Dias",         "Ferreira",         "Gomes",         "Lima",         "Martins",         "Mendes",         "Moreira",         "Nascimento",         "Oliveira",         "Pereira",         "Ramos",         "Rocha",         "Rodrigues",         "Santos",         "Silva",         "Souza",         "Teixeira",         "Vieira",         "Araújo",         "Batista",         "Campos",         "Cardoso",         "Castro",         "Cavalcanti",         "Correia",         "Duarte",         "Farias",         "Freitas",         "Macedo",         "Monteiro",         "Nogueira",         "Pinto",         "Rezende",         "Santana",         "Tavares",         "Vasconcelos"     ];       // Usa uma combinação diferente a cada geração     const nomeBase =         nomes[             Math.floor(                 Math.random() * nomes.length             )         ];      const sobrenome1 =         sobrenomes[             Math.floor(                 Math.random() * sobrenomes.length             )         ];      let sobrenome2 =         sobrenomes[             Math.floor(                 Math.random() * sobrenomes.length             )         ];       // Evita sobrenome duplicado     while (         sobrenome2 === sobrenome1     ) {          sobrenome2 =             sobrenomes[                 Math.floor(                     Math.random() * sobrenomes.length                 )             ];      }       const nomeSugerido =         `${nomeBase} ${sobrenome1} ${sobrenome2}`;       return `  Você é responsável por criar personagens FICTÍCIOS diferentes para uma whitelist de GTA RP/FiveM chamada Meta City.  SEED ÚNICA DESTA GERAÇÃO: ${seed}  NOME SUGERIDO PARA ESTA GERAÇÃO: ${nomeSugerido}  IMPORTANTE:  O nome sugerido acima deve ser usado como base para o personagem desta geração.  Não use nomes de personagens gerados anteriormente.  Não use sempre nomes como: "Matheus Silva de Oliveira".  O sistema precisa variar os nomes.  Pode usar o nome sugerido exatamente ou fazer pequenas alterações naturais, mas NÃO repita nomes anteriores.  Crie um personagem completo.  O personagem deve possuir:  - Nome brasileiro fictício - Idade entre 18 e 35 anos - Personalidade - Passado - Objetivos - História de vida  TODAS as respostas precisam pertencer ao MESMO personagem.  O nome e a idade precisam ser exatamente os mesmos em todas as respostas.  Escreva em português brasileiro natural.  Não use emojis.  Não diga que o personagem foi criado por IA.  Não mencione este prompt.  Evite respostas excessivamente formais.   ========================================== PERGUNTAS ==========================================  1. Qual seu nome real? (quem está por trás do computador)  2. Quantos anos você tem?  3. Você tem conhecimento de que o abuso de bugs (falhas do jogo) constitui uma infração grave às regras, e que, ao identificar qualquer bug, é sua obrigação reportá-lo à equipe responsável, em vez de utilizá-lo?  4. O que é Metagaming? Dê um exemplo.  5. O que é Powergaming? Dê um exemplo.  6. O que significa "Amor à Vida"?  7. O que é Combat Logging?  8. Você participa ou já entrou em algum servidor de hack/cheat (aimbot, mod menu, wallhack etc.)? Seja honesto.  9. O que é uma Safe Zone (Zona Segura)?  10. Motivo de ir para Meta City.   ========================================== REGRAS ==========================================  RESPOSTA 1:  Use o nome do personagem criado para esta geração.  RESPOSTA 2:  Use a idade criada para o personagem.  RESPOSTA 3:  Responda SIM e mostre que entende que bugs devem ser reportados e não utilizados.  RESPOSTA 4:  Explique Metagaming de forma simples e dê um exemplo envolvendo informação obtida fora do RP.  RESPOSTA 5:  Explique Powergaming de forma simples e dê um exemplo de algo impossível ou exagerado dentro do RP.  RESPOSTA 6:  Explique Amor à Vida de forma simples.  RESPOSTA 7:  Explique Combat Logging de forma simples.  RESPOSTA 8:  Responda NÃO.  RESPOSTA 9:  Explique Safe Zone de maneira simples.  RESPOSTA 10:  Crie uma HISTÓRIA COMPLETA do personagem.  A história deve ser escrita em PRIMEIRA PESSOA.  Faça 3 a 5 parágrafos.  Conte:  - Quem é o personagem - Onde cresceu - Infância - Juventude - Dificuldades - Problemas que enfrentou - Decisões erradas - O que fez ele querer mudar - Por que foi para Meta City - O que pretende fazer na cidade - Seus objetivos futuros  A história precisa ser diferente em cada geração.  Não faça uma história genérica.  Varie:  - profissão desejada - cidade de origem - família - dificuldades - personalidade - objetivos - acontecimentos do passado  Não escreva sempre que o personagem quer ser motorista.  Crie histórias naturais e diferentes.   ========================================== FORMATO ==========================================  Retorne SOMENTE JSON válido.  {     "name": "Nome completo",     "age": 24,     "answers": [         "Resposta 1",         "Resposta 2",         "Resposta 3",         "Resposta 4",         "Resposta 5",         "Resposta 6",         "Resposta 7",         "Resposta 8",         "Resposta 9",         "Resposta 10"     ] }  `; }

    return `

Crie um personagem FICTÍCIO completo para uma
whitelist de GTA RP/FiveM chamada Meta City.

O personagem deve ser totalmente inventado.

Crie sozinho:

- Nome brasileiro fictício
- Idade entre 18 e 35 anos
- Personalidade
- Passado
- Objetivos
- História de vida

TODAS as respostas devem pertencer ao MESMO personagem.

O nome e a idade precisam permanecer exatamente
iguais em todas as respostas.

Escreva em português brasileiro natural.

Não use emojis.

Não diga que foi criado por IA.

Não mencione este prompt.

Evite respostas excessivamente formais.

==========================================
PERGUNTAS
==========================================

1. Qual seu nome real? (quem está por trás do computador)

2. Quantos anos você tem?

3. Você tem conhecimento de que o abuso de bugs
(falhas do jogo) constitui uma infração grave às
regras, e que, ao identificar qualquer bug, é sua
obrigação reportá-lo à equipe responsável, em vez
de utilizá-lo?

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

1:
Use o nome fictício criado.

2:
Use a idade fictícia criada.

3:
Responda SIM e mostre que entende que bugs
devem ser reportados e não utilizados.

4:
Explique Metagaming de forma simples e dê
um exemplo de informação obtida fora do RP,
como uma live ou Discord.

5:
Explique Powergaming de forma simples e dê
um exemplo de algo impossível ou exagerado
dentro do RP.

6:
Explique Amor à Vida de forma simples,
mostrando que o personagem valoriza sua vida.

7:
Explique Combat Logging de forma simples,
mostrando que é sair do servidor durante uma
situação de RP para evitar consequências.

8:
Responda NÃO.

9:
Explique Safe Zone de forma simples.

10:
Crie uma HISTÓRIA COMPLETA do personagem.

A história deve ser escrita em PRIMEIRA PESSOA.

Deve possuir aproximadamente 3 a 5 parágrafos.

Conte:

- Quem é o personagem
- Onde cresceu
- Como foi sua infância
- Como foi sua juventude
- Dificuldades que enfrentou
- Problemas ou decisões erradas
- O que fez ele querer mudar
- Por que decidiu ir para Meta City
- O que pretende fazer na cidade
- Seus objetivos

Não escreva apenas:
"Quero recomeçar minha vida."

Transforme o motivo de ir para Meta City
em uma história completa.

Cada geração deve criar uma história diferente.

==========================================
FORMATO
==========================================

Retorne SOMENTE JSON válido.

Formato:

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
}


// ==========================================
// FUNÇÃO GEMINI
// ==========================================

async function generateWithModel(
    model,
    prompt
) {

    console.log(
        `Tentando modelo: ${model}`
    );


    const response =
        await ai.models.generateContent({

            model: model,

            contents: prompt,

            config: {

                responseMimeType:
                    "application/json",

                maxOutputTokens:
                    5000

            }

        });


    if (!response || !response.text) {

        throw new Error(
            "O Gemini respondeu sem conteúdo."
        );

    }


    return response.text;

}


// ==========================================
// VERIFICAR SE É ERRO TEMPORÁRIO
// ==========================================

function isTemporaryError(error) {

    const message =
        error?.message ||
        String(error);


    return (

        message.includes("503") ||

        message.includes("UNAVAILABLE") ||

        message.includes("high demand") ||

        message.includes("429") ||

        message.includes("RESOURCE_EXHAUSTED") ||

        message.includes("overloaded")

    );

}


// ==========================================
// ESPERA
// ==========================================

function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


// ==========================================
// GERAR
// ==========================================

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


            const prompt =
                createPrompt();


            let text = null;

            let lastError = null;


            // ==========================================
            // MODELO PRINCIPAL
            // ==========================================

            for (
                let attempt = 1;
                attempt <= 3;
                attempt++
            ) {

                try {

                    console.log(
                        `Principal: tentativa ${attempt}/3`
                    );


                    text =
                        await generateWithModel(
                            PRIMARY_MODEL,
                            prompt
                        );


                    break;


                } catch (error) {

                    lastError =
                        error;


                    console.error(
                        `Erro principal ${attempt}:`,
                        error?.message
                    );


                    if (
                        !isTemporaryError(
                            error
                        )
                    ) {

                        break;

                    }


                    if (
                        attempt < 3
                    ) {

                        const delay =
                            attempt * 2000;


                        console.log(
                            `Aguardando ${delay}ms...`
                        );


                        await sleep(
                            delay
                        );

                    }

                }

            }


            // ==========================================
            // FALLBACK
            // ==========================================

            if (!text) {

                console.log(
                    "=========================================="
                );

                console.log(
                    "MODELO PRINCIPAL INDISPONÍVEL"
                );

                console.log(
                    `Tentando fallback: ${FALLBACK_MODEL}`
                );

                console.log(
                    "=========================================="
                );


                try {

                    text =
                        await generateWithModel(
                            FALLBACK_MODEL,
                            prompt
                        );


                    console.log(
                        "Fallback funcionou!"
                    );


                } catch (fallbackError) {

                    lastError =
                        fallbackError;


                    console.error(
                        "Erro no fallback:",
                        fallbackError?.message
                    );

                }

            }


            // ==========================================
            // TODOS FALHARAM
            // ==========================================

            if (!text) {

                const message =
                    lastError?.message ||
                    "Nenhum modelo respondeu.";


                if (
                    message.includes("429") ||
                    message.includes("RESOURCE_EXHAUSTED")
                ) {

                    return res.status(429).json({

                        error:
                            "O limite da API do Gemini foi atingido. Tente novamente em alguns minutos."

                    });

                }


                if (
                    message.includes("503") ||
                    message.includes("UNAVAILABLE") ||
                    message.includes("high demand")
                ) {

                    return res.status(503).json({

                        error:
                            "Os modelos do Gemini estão temporariamente ocupados. Aguarde alguns segundos e tente novamente."

                    });

                }


                return res.status(500).json({

                    error:
                        message

                });

            }


            // ==========================================
            // PARSE JSON
            // ==========================================

            let result;


            try {

                result =
                    JSON.parse(text);


            } catch (error) {

                console.error(
                    "JSON recebido:"
                );

                console.error(
                    text
                );


                return res.status(500).json({

                    error:
                        "O Gemini retornou um formato inválido."

                });

            }


            // ==========================================
            // VALIDAR
            // ==========================================

            if (
                !result.name ||
                !result.age ||
                !Array.isArray(
                    result.answers
                ) ||
                result.answers.length !== 10
            ) {

                console.error(
                    "Resposta incompleta:",
                    result
                );


                return res.status(500).json({

                    error:
                        "O Gemini não retornou todas as informações."

                });

            }


            console.log(
                "=========================================="
            );

            console.log(
                "SUCESSO"
            );

            console.log(
                "Nome:",
                result.name
            );

            console.log(
                "Idade:",
                result.age
            );

            console.log(
                "Respostas:",
                result.answers.length
            );

            console.log(
                "=========================================="
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


// ==========================================
// START
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
            `Principal: ${PRIMARY_MODEL}`
        );

        console.log(
            `Fallback: ${FALLBACK_MODEL}`
        );

        console.log(
            "=========================================="
        );

    }
);
