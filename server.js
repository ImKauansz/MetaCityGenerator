import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "100kb" }));
app.use(express.static("public"));

const nomes = [
  "Gabriel Henrique", "Lucas Rafael", "Joao Victor", "Pedro Henrique", "Carlos Eduardo",
  "Rafael Augusto", "Gustavo Henrique", "Matheus Gabriel", "Felipe Augusto", "Bruno Henrique",
  "Leonardo Rafael", "Caio Vinicius", "Vinicius Gabriel", "Andre Luiz", "Diego Henrique",
  "Thiago Martins", "Eduardo Rafael", "Arthur Miguel", "Miguel Augusto", "Samuel Henrique",
  "Nicolas Rafael", "Henrique Gabriel", "Murilo Augusto", "Ryan Gabriel", "Luiz Fernando",
  "Daniel Henrique", "Alexandre Lucas", "Guilherme Augusto", "Wesley Gabriel", "Igor Henrique",
  "Fernando Augusto", "Victor Hugo", "Julio Cesar", "Marcelo Henrique", "Renan Gabriel",
  "Vitor Rafael", "Diego Lucas", "Caua Henrique", "Breno Gabriel", "Heitor Gabriel",
  "Enrico Rafael", "Davi Henrique", "Otavio Lucas", "Isaac Gabriel", "Luan Henrique",
  "Yuri Rafael", "Emanuel Lucas", "Benjamin Gabriel", "Nathan Henrique"
];

const sobrenomes = [
  "Almeida", "Barbosa", "Carvalho", "Costa", "Dias", "Ferreira", "Gomes", "Lima", "Martins",
  "Mendes", "Moreira", "Nascimento", "Oliveira", "Pereira", "Ramos", "Rocha", "Rodrigues",
  "Santos", "Silva", "Souza", "Teixeira", "Vieira", "Araujo", "Batista", "Campos", "Cardoso",
  "Castro", "Cavalcanti", "Correia", "Duarte", "Farias", "Freitas", "Macedo", "Monteiro",
  "Nogueira", "Pinto", "Rezende", "Santana", "Tavares", "Vasconcelos"
];

const origens = [
  "Campinas", "Sorocaba", "Santos", "Sao Jose dos Campos", "Ribeirao Preto", "Jundiai",
  "Guarulhos", "Osasco", "Sao Bernardo do Campo", "Curitiba", "Belo Horizonte", "Londrina",
  "Goiania", "Florianopolis", "Joinville", "Uberlandia"
];

const familias = [
  "uma familia simples e muito unida", "uma casa movimentada, sempre cheia de parentes",
  "uma familia pequena que sempre valorizou trabalho e respeito", "uma familia trabalhadora, com pouca sobra no fim do mes",
  "meus avos e minha mae, que foram minha principal base", "meus pais e dois irmaos, com quem aprendi a dividir responsabilidades"
];

const infancias = [
  "Passei boa parte da infancia jogando bola na rua e ajudando em casa quando precisava.",
  "Minha infancia foi tranquila, mas desde cedo aprendi que as coisas tinham que ser conquistadas com esforco.",
  "Cresci em bairro simples, fiz muitos amigos e sempre gostei de desmontar e consertar coisas por curiosidade.",
  "Quando era mais novo eu era bem quieto, observava muito e gostava de fotografia, carros e tecnologia.",
  "Tive uma infancia bem comum, dividida entre escola, amigos e pequenas responsabilidades dentro de casa."
];

const dificuldades = [
  "Quando fiquei mais velho, passei por uma fase complicada depois de perder um emprego e acumular algumas dividas.",
  "Na juventude, me envolvi com amizades que me faziam perder tempo e quase deixei meus objetivos de lado.",
  "Depois de uma discussao seria dentro de casa, percebi que eu precisava amadurecer e assumir melhor minhas escolhas.",
  "Por algum tempo trabalhei sem saber o que realmente queria e acabei gastando dinheiro demais com coisas que nao precisava.",
  "Tive uma fase em que tentei resolver tudo sozinho, me afastei da familia e percebi tarde que estava tomando decisoes ruins."
];

const viradas = [
  "Foi quando decidi organizar minha vida, voltar a ouvir minha familia e construir algo com mais calma.",
  "Aquilo serviu como um choque de realidade e me fez mudar minha postura.",
  "Depois disso, comecei a pensar mais no longo prazo e parei de procurar atalhos.",
  "Essa fase me ensinou a ter mais paciencia, responsabilidade e a pensar antes de agir.",
  "A partir dali eu coloquei como meta recomecar do jeito certo e provar para mim mesmo que conseguia evoluir."
];

const carreiras = [
  { area: "mecanica", objetivo: "trabalhar em uma oficina, aprender mais sobre carros e no futuro abrir meu proprio negocio" },
  { area: "fotografia", objetivo: "trabalhar com fotografia, conhecer pessoas e montar um estudio proprio no futuro" },
  { area: "seguranca", objetivo: "entrar na area de seguranca, ganhar experiencia e construir uma carreira respeitada" },
  { area: "empreendedorismo", objetivo: "comecar como vendedor e juntar dinheiro para abrir uma empresa" },
  { area: "logistica", objetivo: "trabalhar com entregas e transporte, crescer na area e futuramente ter meu proprio veiculo de trabalho" },
  { area: "direito", objetivo: "buscar oportunidades ligadas ao direito, criar contatos e construir uma carreira solida" },
  { area: "saude", objetivo: "trabalhar na area da saude e, com o tempo, conquistar uma posicao de mais responsabilidade" },
  { area: "policia", objetivo: "seguir uma carreira policial, respeitando as regras e tentando fazer um trabalho correto" },
  { area: "veiculos", objetivo: "trabalhar com compra, venda e manutencao de veiculos e depois abrir uma loja" }
];

const nomesRecentes = [];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function gerarNome() {
  let nomeCompleto = "";
  for (let tentativa = 0; tentativa < 60; tentativa++) {
    const base = pick(nomes);
    const sobrenome1 = pick(sobrenomes);
    let sobrenome2 = pick(sobrenomes);
    while (sobrenome2 === sobrenome1) sobrenome2 = pick(sobrenomes);
    nomeCompleto = `${base} ${sobrenome1} ${sobrenome2}`;
    if (!nomesRecentes.includes(nomeCompleto)) break;
  }
  nomesRecentes.push(nomeCompleto);
  if (nomesRecentes.length > 35) nomesRecentes.shift();
  return nomeCompleto;
}

function gerarHistoria(nome, idade) {
  const origem = pick(origens);
  const familia = pick(familias);
  const infancia = pick(infancias);
  const dificuldade = pick(dificuldades);
  const virada = pick(viradas);
  const carreira = pick(carreiras);

  return `Meu nome e ${nome}, tenho ${idade} anos e cresci em ${origem}, dentro de ${familia}. ${infancia} Sempre fui uma pessoa que prefere observar primeiro e agir depois, e isso acabou moldando bastante meu jeito de lidar com os problemas.\n\nNa juventude comecei a buscar minha independencia e fiz alguns trabalhos diferentes para ganhar meu proprio dinheiro. ${dificuldade} ${virada}\n\nDecidi ir para Meta City porque quero um recomeco de verdade, conhecer gente nova e construir uma historia sem depender do que ja aconteceu comigo antes. Quero chegar com calma, trabalhar e conquistar meu espaco de forma natural, sem querer pular etapas.\n\nMeu plano e ${carreira.objetivo}. Nao espero que tudo aconteca rapido: quero criar boas relacoes, aproveitar as oportunidades que aparecerem e fazer meu nome na cidade pelas escolhas que eu fizer daqui para frente.`;
}

function gerarPersonagem() {
  const nome = gerarNome();
  const idade = Math.floor(Math.random() * 18) + 18;

  const respostas = [
    `Meu nome e ${nome}.`,
    `Tenho ${idade} anos.`,
    "Sim. Tenho conhecimento de que abusar de bugs e uma infracao grave. Se eu encontrar alguma falha, devo reportar para a equipe responsavel e nao usar isso para conseguir qualquer tipo de vantagem.",
    "Metagaming e usar dentro do RP uma informacao que meu personagem nao descobriu no jogo. Um exemplo seria ver em uma live ou no Discord onde uma pessoa esta e ir direto ate o local usando essa informacao.",
    "Powergaming e forcar uma acao impossivel ou exagerada, ignorando os limites do personagem ou da situacao. Por exemplo, sofrer um acidente muito grave e continuar agindo normalmente como se nada tivesse acontecido.",
    "Amor a Vida significa valorizar a vida do personagem e agir como uma pessoa agiria diante de um risco real. Em uma situacao de perigo, eu devo priorizar minha sobrevivencia e nao me colocar em risco sem necessidade.",
    "Combat Logging e sair do servidor de proposito durante uma acao ou confronto para fugir das consequencias do RP. O correto e permanecer na situacao e concluir a cena.",
    "Nao. Nao participo e nao entrei em servidor de hack ou cheat, como aimbot, mod menu ou wallhack.",
    "Safe Zone e uma area protegida onde existem regras especiais para evitar acoes agressivas ou abusivas. Nesses locais eu devo respeitar as limitacoes definidas pelo servidor e manter o RP adequado.",
    gerarHistoria(nome, idade)
  ];

  return { name: nome, age: idade, answers: respostas, mode: "local" };
}

app.get("/api/status", (req, res) => {
  res.json({ online: true, mode: "local", ai: false, engine: "Astroz Local Engine" });
});

app.post("/api/generate", (req, res) => {
  try {
    return res.json(gerarPersonagem());
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Nao foi possivel gerar o personagem." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Meta City Generator online na porta ${PORT}`);
  console.log("Modo: local / sem IA");
});
