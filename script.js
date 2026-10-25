/* ==================================================================
   MAR DE FIGURINHAS - LÓGICA DO JOGO
   Tudo em JavaScript puro, sem bibliotecas e sem internet.

   Como este arquivo está organizado:
     1. Configurações
     2. Pixel art (desenhos dos bichos em "mapas de pixels")
     3. Figurinhas
     4. PERGUNTAS  <-- é aqui que você troca os textos-modelo
     5. Estado da partida
     6. Funções de desenho (telas)
     7. Fluxo do jogo (responder, avançar, reiniciar)
     8. Cenário decorativo
     9. Capa de apresentação (bandeira do Equador)
    10. Seta de voltar
    11. Nome do jogador
    12. Cronômetro e pontuação
    13. Ranking (armazenamento e tela)
    14. Início
   ================================================================== */

"use strict";

/* ------------------------------------------------------------------
   1. CONFIGURAÇÕES
   ------------------------------------------------------------------ */
const EMBARALHAR_PERGUNTAS = true;     // true = ordem das perguntas muda a cada partida
const EMBARALHAR_ALTERNATIVAS = true;  // true = posição das alternativas muda a cada partida
const TEMPO_REVELACAO = 1100;          // ms mostrando certo/errado antes de ir para a Tela 3
const PONTOS_POR_ACERTO = 100;         // regra da pontuação: 100 pontos por resposta certa
const TEMPO_TRAVA_INICIAL = 450;       // ms em que os botões ignoram cliques ao aparecer uma pergunta

/* ------------------------------------------------------------------
   2. PIXEL ART
   Cada desenho é uma lista de linhas. Cada letra é um pixel e
   "." é espaço vazio. As cores de cada letra ficam na paleta.
   ------------------------------------------------------------------ */
const COR_SILHUETA = "#051322"; // cor das figurinhas ainda bloqueadas

const PIXELS_TARTARUGA = [
  "................",
  "................",
  "...KKKKKKKK.....",
  "..KSSSYSSSSK....",
  ".KSSYYSSYYSSKKK.",
  ".KSYYSSSSYYSKGGK",
  ".KSSSYYSSSSSGGEK",
  ".KSSYSSSSSSSGGGK",
  "..KKKKKKKKKKGKK.",
  "..KGGK....KGGK..",
  "..KGGK....KGGK..",
  "...KK......KK...",
  "................",
  "................",
  "................",
  "................"
];

const PIXELS_PEIXE = [
  "................",
  "......KYYYYK....",
  "......KKKKKK....",
  "....KKOOOSOOKK..",
  "KK.KOOOOSOOOOOK.",
  "KOOKOOOOSOOOEBOK",
  "KOOKOOOOSOOOOOOK",
  "KK.KOOOOSOOOOOK.",
  "....KKOOOSOOKK..",
  "......KYYYYK....",
  "......KKKKKK....",
  "................",
  "................",
  "................",
  "................",
  "................"
];

const PIXELS_AGUA_VIVA = [
  "................",
  ".....DDDDDD.....",
  "...DDPPPPPPDD...",
  "..DPPHHPPPPPPD..",
  "..DPHPPPPPPPPD..",
  "..DPPPPPPPPPPD..",
  "..DDPPPPPPPPDD..",
  "...DDDDDDDDDD...",
  "...D.D.DD.D.D...",
  "....D.D..D.D....",
  "...D.D..D.D.D...",
  "....D.D.D...D...",
  "................",
  "................",
  "................",
  "................"
];

const PIXELS_POLVO = [
  "................",
  "....DDDDDDDD....",
  "...DRRRRRRRRD...",
  "..DRRRRRRRRRRD..",
  "..DRRWWRRWWRRD..",
  "..DRRWBRRWBRRD..",
  "..DRRRRRRRRRRD..",
  "...DRRRRRRRRD...",
  "..DRRDRRRRDRRD..",
  ".DRD.DRRRRD.DRD.",
  "DRRD..DRRD..DRRD",
  "DRD...DRRD...DRD",
  "................",
  "................",
  "................",
  "................"
];

const PIXELS_CARANGUEJO = [
  "................",
  ".DDD........DDD.",
  "DCCD..W..W..DCCD",
  "DCCD..B..B..DCCD",
  ".DD.DDDDDDDD.DD.",
  "...DCCCCCCCCD...",
  "..DCCHCCCCHCCD..",
  "..DCCCCCCCCCCD..",
  "...DCCCCCCCCD...",
  "....DDDDDDDD....",
  "..D.D.D..D.D.D..",
  ".D.D.......D.D..",
  "................",
  "................",
  "................",
  "................"
];

const PIXELS_CORAL = [
  "................",
  ".HP.....HP...HP.",
  ".HP..HP.HP...HP.",
  ".PPP.PP.PP..PPP.",
  "..PPDPP.PD.PPP..",
  "...PPPPPPPPPP...",
  "....PPPPPPPP....",
  ".....PDPPDP.....",
  "......PPPP......",
  "...SSSSSSSSSS...",
  "..SSSTSSSSSTSS..",
  "..TTTTTTTTTTTT..",
  "................",
  "................",
  "................",
  "................"
];

const PIXELS_BAIACU = [
  "................",
  "....S..SS..S....",
  "....KKKKKKKK....",
  "..SKYYYYYYYYKS..",
  "..KYHHYYYYYYYK..",
  ".SKYEBYYYYBEYKS.",
  "..KYEBYYYYBEYK..",
  "..KYPYYMMYYPYK..",
  ".SKHHHHHHHHHHKS.",
  "..KHHHHHHHHHHK..",
  "..SKHHHHHHHHKS..",
  "....KKKKKKKK....",
  "....S..SS..S....",
  "................",
  "................",
  "................"
];

const PIXELS_ESTRELA = [
  "................",
  ".......KK.......",
  "......KOOK......",
  "......KOHK......",
  ".KKKKKKOOKKKKKK.",
  "KOOHOOOHOOHOOOOK",
  ".KOOOHOOOOHOOOK.",
  "..KOOOOHOOOOOK..",
  "...KOOOOOOOOK...",
  "...KOOHOOOOOK...",
  "..KOOOOKKOOOOK..",
  "..KOHOK..KOHOK..",
  ".KOOOK....KOOOK.",
  ".KKKK......KKKK.",
  "................",
  "................"
];

const PIXELS_ALGA = [
  "...G..",
  "..GG..",
  "..G...",
  ".GG...",
  ".GG...",
  "..GG..",
  "..GG..",
  "..G...",
  ".GG...",
  ".GG..."
];

/* Paletas: cada letra dos desenhos acima vira uma cor */
const PALETA_TARTARUGA = { K: "#0B2F2A", S: "#2F9E64", Y: "#FFD166", G: "#70E1C1", E: "#071B33" };
const PALETA_PEIXE     = { K: "#5A2A12", O: "#FF8A3D", S: "#F2F7FC", Y: "#FFD166", E: "#F2F7FC", B: "#071B33" };
const PALETA_AGUA_VIVA = { D: "#7B52D3", P: "#C6A8FF", H: "#F2F7FC" };
const PALETA_POLVO     = { D: "#8E2D5E", R: "#E0679C", W: "#F2F7FC", B: "#071B33" };
const PALETA_CARANGUEJO = { D: "#7A1F16", C: "#E8553E", H: "#FF9A7A", W: "#F2F7FC", B: "#071B33" };
const PALETA_CORAL     = { P: "#FF9966", H: "#FFC59E", D: "#C25A33", S: "#E3C58B", T: "#B8975E" };
const PALETA_ALGA      = { G: "#3FBF8F" };
const PALETA_ESTRELA   = { K: "#8E3A1E", O: "#FF7A45", H: "#FFD9A8" };
const PALETA_BAIACU    = { K: "#7A4A12", S: "#E0872A", Y: "#FFD166", H: "#FFF1C9", E: "#F2F7FC", B: "#071B33", M: "#E8553E", P: "#FF9A7A" };

/* Variações do peixe, só para enfeitar o cenário */
const PALETA_PEIXE_AMARELO = { K: "#6B4F00", O: "#FFD166", S: "#F2F7FC", Y: "#FF8A3D", E: "#F2F7FC", B: "#071B33" };
const PALETA_PEIXE_AZUL    = { K: "#06364A", O: "#28C7D9", S: "#F2F7FC", Y: "#70E1C1", E: "#F2F7FC", B: "#071B33" };

/**
 * Transforma um mapa de pixels em uma imagem SVG (texto HTML).
 * - Corta as bordas vazias para o desenho ficar centralizado.
 * - Se "silhueta" for true, pinta tudo com uma cor escura (figurinha bloqueada).
 */
function desenharSprite(pixels, paleta, silhueta) {
  let minX = 999, minY = 999, maxX = -1, maxY = -1;

  // 1) Descobre a área realmente ocupada pelo desenho
  pixels.forEach(function (linha, y) {
    for (let x = 0; x < linha.length; x++) {
      if (linha[x] !== ".") {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  });

  // 2) Cria um retângulo para cada sequência de pixels da mesma cor
  let retangulos = "";
  pixels.forEach(function (linha, y) {
    let x = 0;
    while (x < linha.length) {
      const letra = linha[x];
      if (letra === ".") { x++; continue; }
      let fim = x;
      while (fim + 1 < linha.length && linha[fim + 1] === letra) fim++;
      const cor = silhueta ? COR_SILHUETA : (paleta[letra] || "#FF00FF");
      retangulos += '<rect x="' + x + '" y="' + y + '" width="' + (fim - x + 1) + '" height="1" fill="' + cor + '"/>';
      x = fim + 1;
    }
  });

  const largura = maxX - minX + 1;
  const altura = maxY - minY + 1;
  return '<svg class="sprite" viewBox="' + minX + " " + minY + " " + largura + " " + altura +
    '" shape-rendering="crispEdges" aria-hidden="true" focusable="false">' + retangulos + "</svg>";
}

/* ------------------------------------------------------------------
   3. FIGURINHAS (a ordem aqui é a ordem do álbum)
   ------------------------------------------------------------------ */
const FIGURINHAS = [
  { id: "tartaruga",  nome: "Tartaruga",  pixels: PIXELS_TARTARUGA,  paleta: PALETA_TARTARUGA },
  { id: "peixe",      nome: "Peixe",      pixels: PIXELS_PEIXE,      paleta: PALETA_PEIXE },
  { id: "aguaviva",   nome: "Água-viva",  pixels: PIXELS_AGUA_VIVA,  paleta: PALETA_AGUA_VIVA },
  { id: "polvo",      nome: "Polvo",      pixels: PIXELS_POLVO,      paleta: PALETA_POLVO },
  { id: "caranguejo", nome: "Caranguejo", pixels: PIXELS_CARANGUEJO, paleta: PALETA_CARANGUEJO },
  { id: "coral",      nome: "Coral",      pixels: PIXELS_CORAL,      paleta: PALETA_CORAL },
  { id: "baiacu",     nome: "Baiacu",     pixels: PIXELS_BAIACU,     paleta: PALETA_BAIACU },
  { id: "estrela",    nome: "Estrela-do-mar", pixels: PIXELS_ESTRELA, paleta: PALETA_ESTRELA }
];

function buscarFigurinha(id) {
  return FIGURINHAS.find(function (f) { return f.id === id; });
}

/* ------------------------------------------------------------------
   4. PERGUNTAS
   Por enquanto são textos-modelo. Para colocar as perguntas reais,
   troque os textos de cada bloco. Regras:
     - "alternativas": de 3 a 4 textos.
     - "correta": posição da alternativa certa na lista (0 = a primeira).
     - "figurinha": qual figurinha o jogador ganha ao acertar
                    (tartaruga, peixe, aguaviva, polvo, caranguejo, coral, baiacu ou estrela),
                    ou null se a pergunta não der figurinha.
                    Cada pergunta deve ter uma figurinha diferente.
   ------------------------------------------------------------------ */
const PERGUNTAS = [
  {
    texto: "Pergunta 1",
    alternativas: ["Resposta certa 1", "Resposta errada 1A", "Resposta errada 1B"],
    correta: 0,
    explicacao: "Explicação 1",
    figurinha: "peixe"
  },
  {
    texto: "Pergunta 2",
    alternativas: ["Resposta certa 2", "Resposta errada 2A", "Resposta errada 2B"],
    correta: 0,
    explicacao: "Explicação 2",
    figurinha: "polvo"
  },
  {
    texto: "Pergunta 3",
    alternativas: ["Resposta certa 3", "Resposta errada 3A", "Resposta errada 3B"],
    correta: 0,
    explicacao: "Explicação 3",
    figurinha: "coral"
  },
  {
    texto: "Pergunta 4",
    alternativas: ["Resposta certa 4", "Resposta errada 4A", "Resposta errada 4B"],
    correta: 0,
    explicacao: "Explicação 4",
    figurinha: "aguaviva"
  },
  {
    texto: "Pergunta 5",
    alternativas: ["Resposta certa 5", "Resposta errada 5A", "Resposta errada 5B"],
    correta: 0,
    explicacao: "Explicação 5",
    figurinha: "tartaruga"
  },
  {
    texto: "Pergunta 6",
    alternativas: ["Resposta certa 6", "Resposta errada 6A", "Resposta errada 6B"],
    correta: 0,
    explicacao: "Explicação 6",
    figurinha: "caranguejo"
  },
  {
    // Pergunta 7: a recompensa é a estrela-do-mar.
    texto: "Pergunta 7",
    alternativas: ["Resposta certa 7", "Resposta errada 7A", "Resposta errada 7B"],
    correta: 0,
    explicacao: "Explicação 7",
    figurinha: "estrela"
  },
  {
    // Pergunta 8: a recompensa é o baiacu.
    texto: "Pergunta 8",
    alternativas: ["Resposta certa 8", "Resposta errada 8A", "Resposta errada 8B"],
    correta: 0,
    explicacao: "Explicação 8",
    figurinha: "baiacu"
  }
];

/* Mensagens da tela final, de acordo com a fração de figurinhas */
function mensagemFinal(conquistadas, total) {
  const fracao = conquistadas / total;
  if (fracao === 1) return "Álbum completo! Você é um verdadeiro explorador do oceano!";
  if (fracao >= 0.66) return "Mergulho incrível! Faltou pouco para completar o álbum!";
  if (fracao >= 0.33) return "Bom mergulho! Ainda há figurinhas escondidas no fundo do mar!";
  if (fracao > 0) return "Você começou sua coleção! Que tal mergulhar de novo?";
  return "Todo explorador começa devagar. Tente de novo e conquiste figurinhas!";
}

/* ------------------------------------------------------------------
   5. ESTADO DA PARTIDA
   Tudo o que muda durante o jogo fica neste único objeto.
   Ao começar uma nova partida ele é recriado do zero, então o
   próximo visitante nunca herda pontos ou figurinhas do anterior.
   ------------------------------------------------------------------ */
let contadorDePartidas = 0;
let estado = null;

/** Sorteia a ordem de uma lista (embaralhamento de Fisher-Yates). */
function embaralhar(lista) {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const guardado = lista[i];
    lista[i] = lista[j];
    lista[j] = guardado;
  }
  return lista;
}

function criarEstadoInicial() {
  // Copia as perguntas para não alterar a lista original
  const perguntas = PERGUNTAS.map(function (p) {
    return {
      texto: p.texto,
      explicacao: p.explicacao,
      figurinha: p.figurinha,
      alternativas: p.alternativas.map(function (texto, posicao) {
        return { texto: texto, correta: posicao === p.correta };
      })
    };
  });

  if (EMBARALHAR_ALTERNATIVAS) perguntas.forEach(function (p) { embaralhar(p.alternativas); });
  if (EMBARALHAR_PERGUNTAS) embaralhar(perguntas);

  contadorDePartidas++;
  return {
    id: contadorDePartidas,  // identifica a partida (ignora "timers" de partidas antigas)
    perguntas: perguntas,
    indice: 0,               // pergunta atual
    jogador: "",             // nome do jogador desta partida
    acertos: 0,              // quantidade de respostas certas
    pontos: 0,               // pontuação final (acertos x PONTOS_POR_ACERTO)
    inicioMs: 0,             // horário em que a pergunta 1 apareceu
    tempoTotalMs: 0,         // duração da partida (definida ao terminar)
    resultadoSalvo: false,   // o resultado desta partida já foi para o ranking?
    resultadoId: null,       // identificação do resultado (para destacar no ranking)
    salvando: null,          // promessa do salvamento em andamento
    figurinhas: [],          // ids das figurinhas conquistadas
    respondida: false,       // já escolheu uma alternativa nesta pergunta?
    aceitaClique: false      // os botões já podem ser clicados?
  };
}

/* ------------------------------------------------------------------
   6. FUNÇÕES DE DESENHO DAS TELAS
   ------------------------------------------------------------------ */
function $(id) { return document.getElementById(id); }

/** Mostra uma tela ("menu", "quiz", "resposta" ou "final") e esconde as outras. */
function mostrarTela(nome, idDoBotaoPrincipal) {
  document.querySelectorAll(".tela").forEach(function (tela) { tela.classList.remove("ativa"); });
  $("tela-" + nome).classList.add("ativa");
  document.body.dataset.tela = nome;
  atualizarSetaVoltar();
  if (idDoBotaoPrincipal) $(idDoBotaoPrincipal).focus({ preventScroll: true });
}

/**
 * Cria uma figurinha (moldura + desenho + nome).
 * tamanho: "mini", "media" ou "grande".
 */
function criarFigurinha(figurinha, conquistada, tamanho) {
  const elemento = document.createElement("div");
  elemento.className = "figurinha " + tamanho + " " + (conquistada ? "conquistada" : "bloqueada");

  const moldura = document.createElement("div");
  moldura.className = "moldura";
  moldura.innerHTML = desenharSprite(figurinha.pixels, figurinha.paleta, !conquistada);

  if (!conquistada) {
    const interrogacao = document.createElement("span");
    interrogacao.className = "interrogacao";
    interrogacao.textContent = "?";
    moldura.appendChild(interrogacao);
  }

  const nome = document.createElement("div");
  nome.className = "nome";
  nome.textContent = conquistada ? figurinha.nome : "???";

  elemento.appendChild(moldura);
  elemento.appendChild(nome);
  return elemento;
}

/** Atualiza a faixa de figurinhas (Tela 4) que aparece durante o quiz. */
function desenharFaixa(idDaNova) {
  const caixa = $("faixa-slots");
  caixa.innerHTML = "";
  FIGURINHAS.forEach(function (figurinha) {
    const conquistada = estado.figurinhas.indexOf(figurinha.id) !== -1;
    const slot = criarFigurinha(figurinha, conquistada, "mini");
    if (figurinha.id === idDaNova) slot.classList.add("nova");
    caixa.appendChild(slot);
  });
  $("faixa-contador").textContent = estado.figurinhas.length + " de " + FIGURINHAS.length + " figurinhas";
}

/** Mostra a pergunta atual (Tela 2). */
function desenharPergunta() {
  const pergunta = estado.perguntas[estado.indice];
  const total = estado.perguntas.length;

  // Número da pergunta e barra de progresso
  $("rotulo-pergunta").textContent = "PERGUNTA " + (estado.indice + 1) + " DE " + total;
  const barra = $("barra-progresso");
  barra.innerHTML = "";
  barra.style.setProperty("--n", total);
  for (let i = 0; i < total; i++) {
    const bloco = document.createElement("div");
    bloco.className = "bloco" + (i < estado.indice ? " feito" : "") + (i === estado.indice ? " atual" : "");
    barra.appendChild(bloco);
  }

  // Texto da pergunta
  $("texto-pergunta").textContent = pergunta.texto;

  // Alternativas
  const caixa = $("alternativas");
  caixa.innerHTML = "";
  caixa.className = "alternativas travado" + (pergunta.alternativas.length > 3 ? " duas-colunas" : "");

  const letras = ["A", "B", "C", "D"];
  pergunta.alternativas.forEach(function (alternativa, posicao) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "alternativa";

    const letra = document.createElement("span");
    letra.className = "letra";
    letra.textContent = letras[posicao];

    const texto = document.createElement("span");
    texto.textContent = alternativa.texto;

    botao.appendChild(letra);
    botao.appendChild(texto);
    botao.addEventListener("click", function () { responder(posicao); });
    caixa.appendChild(botao);
  });

  // Trava curta: evita que um clique duplo no botão anterior responda sem querer
  estado.respondida = false;
  estado.aceitaClique = false;
  const partida = estado.id;
  const indiceDaPergunta = estado.indice;
  setTimeout(function () {
    if (estado && estado.id === partida && estado.indice === indiceDaPergunta) {
      estado.aceitaClique = true;
      caixa.classList.remove("travado");
    }
  }, TEMPO_TRAVA_INICIAL);
}

/** Cria as estrelinhas de pixel em volta da figurinha conquistada. */
function criarFaiscas(palco) {
  const quantidade = 10;
  for (let i = 0; i < quantidade; i++) {
    const angulo = (Math.PI * 2 * i) / quantidade;
    const raio = 46 + (i % 2) * 6;
    const faisca = document.createElement("i");
    faisca.className = "faisca";
    faisca.style.left = (50 + Math.cos(angulo) * raio * 0.9) + "%";
    faisca.style.top = (46 + Math.sin(angulo) * raio) + "%";
    faisca.style.animationDelay = (0.9 + (i % 5) * 0.13) + "s";
    palco.appendChild(faisca);
  }
}

/** Mostra o resultado da pergunta e a recompensa (Tela 3). */
function mostrarResposta(pergunta, acertou, novaFigurinha) {
  const figurinha = pergunta.figurinha ? buscarFigurinha(pergunta.figurinha) : null;
  const resposta = pergunta.alternativas.find(function (a) { return a.correta; });

  $("painel-resultado").className = "painel " + (acertou ? "acerto" : "erro") + (figurinha ? "" : " sem-figurinha");
  $("titulo-resultado").textContent = acertou ? "ACERTOU!" : "QUASE!";

  // Mensagem sobre a figurinha (some quando a pergunta não tem figurinha)
  const aviso = $("aviso-figurinha");
  if (!figurinha) {
    aviso.textContent = "";
  } else {
    aviso.textContent = acertou ? "Nova figurinha desbloqueada!" : "Figurinha ainda bloqueada";
  }
  aviso.hidden = !figurinha;

  const linhaCerta = $("resposta-certa");
  linhaCerta.hidden = acertou;
  linhaCerta.textContent = "Resposta certa: " + resposta.texto;

  $("explicacao").textContent = pergunta.explicacao;

  // Figurinha (colorida se acertou, silhueta se errou)
  const palco = $("palco");
  palco.innerHTML = "";
  palco.hidden = !figurinha;
  if (figurinha) {
    palco.className = "palco " + (acertou ? "palco-ganhou" : "palco-perdeu");
    palco.appendChild(criarFigurinha(figurinha, acertou, "grande"));
    if (acertou) criarFaiscas(palco);
  }

  const ehUltima = estado.indice + 1 >= estado.perguntas.length;
  $("btn-proxima").textContent = ehUltima ? "VER RESULTADO" : "PRÓXIMA";

  desenharFaixa(novaFigurinha);
  mostrarTela("resposta", "btn-proxima");
}

/** Mostra o resultado final com a coleção (Tela 5). */
function mostrarFinal() {
  pararCronometro(); // fim do quiz: o tempo total fica registrado e o relógio para
  registrarResultadoUmaVez(); // vai para o ranking (nunca mais de uma vez por partida)
  const total = FIGURINHAS.length;
  const conquistadas = estado.figurinhas.length;

  $("final-jogador").textContent = estado.jogador;
  $("final-pontos").textContent = estado.pontos;
  $("final-tempo").textContent = formatarTempo(estado.tempoTotalMs);
  $("final-contagem").textContent = conquistadas + " de " + total + " figurinhas";
  $("final-mensagem").textContent = mensagemFinal(conquistadas, total);

  const album = $("album-final");
  album.innerHTML = "";
  album.style.setProperty("--colunas", total);
  FIGURINHAS.forEach(function (figurinha) {
    const conquistada = estado.figurinhas.indexOf(figurinha.id) !== -1;
    album.appendChild(criarFigurinha(figurinha, conquistada, "media"));
  });

  mostrarTela("final", "btn-jogar-novamente");
  travarBotoes([$("btn-jogar-novamente"), $("btn-ranking")]); // evita clique duplo acidental
}

/* ------------------------------------------------------------------
   7. FLUXO DO JOGO
   ------------------------------------------------------------------ */

/** Começa uma partida nova, com tudo zerado, para o jogador informado. */
function iniciarPartida(nomeDoJogador) {
  estado = criarEstadoInicial();
  estado.jogador = nomeDoJogador;
  desenharFaixa(null);
  desenharPergunta();
  mostrarTela("quiz");
  iniciarCronometro(); // o tempo só começa a contar aqui, com a pergunta 1 na tela
}

/** Chamada quando o jogador clica em uma alternativa. */
function responder(posicao) {
  // Só aceita UMA resposta por pergunta
  if (!estado || !estado.aceitaClique || estado.respondida) return;
  estado.respondida = true;
  estado.aceitaClique = false;
  atualizarSetaVoltar();

  const pergunta = estado.perguntas[estado.indice];
  const acertou = pergunta.alternativas[posicao].correta;

  // Trava todos os botões e pinta certo/errado
  const botoes = $("alternativas").querySelectorAll("button");
  botoes.forEach(function (botao, i) {
    botao.disabled = true;
    if (pergunta.alternativas[i].correta) botao.classList.add("correta");
    else if (i === posicao) botao.classList.add("errada");
    else botao.classList.add("apagada");
  });

  // Pontuação e figurinha (nunca repete uma figurinha na mesma partida)
  let novaFigurinha = null;
  if (acertou) {
    estado.acertos++;
    estado.pontos += PONTOS_POR_ACERTO;
    if (pergunta.figurinha && estado.figurinhas.indexOf(pergunta.figurinha) === -1) {
      estado.figurinhas.push(pergunta.figurinha);
      novaFigurinha = pergunta.figurinha;
    }
  }

  // Depois de um instante, mostra a Tela 3
  const partida = estado.id;
  setTimeout(function () {
    if (estado && estado.id === partida) mostrarResposta(pergunta, acertou, novaFigurinha);
  }, TEMPO_REVELACAO);
}

/** Botão PRÓXIMA / VER RESULTADO. */
function avancar() {
  if (!estado || !estado.respondida) return;

  if (estado.indice + 1 < estado.perguntas.length) {
    estado.indice++;
    desenharPergunta();
    mostrarTela("quiz");
  } else {
    mostrarFinal();
  }
}

/* ------------------------------------------------------------------
   8. CENÁRIO DECORATIVO (bolhas, peixes, corais e algas)
   ------------------------------------------------------------------ */
function montarCenario() {
  // Bolhas quadradas
  const bolhas = $("bolhas");
  for (let i = 0; i < 16; i++) {
    const bolha = document.createElement("span");
    const tamanho = 0.4 + Math.random() * 0.7;
    bolha.className = "bolha";
    bolha.style.width = tamanho + "rem";
    bolha.style.height = tamanho + "rem";
    bolha.style.left = Math.random() * 100 + "%";
    bolha.style.setProperty("--dur", 8 + Math.random() * 10 + "s");
    bolha.style.animationDelay = -Math.random() * 18 + "s";
    bolhas.appendChild(bolha);
  }

  // Bichos que passam pela tela (sentido: "direita" ou "esquerda")
  const nadadores = [
    { pixels: PIXELS_PEIXE,      paleta: PALETA_PEIXE_AMARELO, topo: "16%", larg: "5rem",  dur: "28s", atraso: "-6s",  sentido: "direita" },
    { pixels: PIXELS_PEIXE,      paleta: PALETA_PEIXE_AZUL,    topo: "34%", larg: "4rem",  dur: "36s", atraso: "-22s", sentido: "esquerda" },
    { pixels: PIXELS_TARTARUGA,  paleta: PALETA_TARTARUGA,     topo: "52%", larg: "9rem",  dur: "55s", atraso: "-14s", sentido: "direita" },
    { pixels: PIXELS_PEIXE,      paleta: PALETA_PEIXE,         topo: "68%", larg: "3.5rem", dur: "30s", atraso: "-3s", sentido: "esquerda" }
  ];
  const caixaNadadores = $("nadadores");
  nadadores.forEach(function (n) {
    const el = document.createElement("div");
    el.className = "nadador " + n.sentido;
    el.style.top = n.topo;
    el.style.setProperty("--larg", n.larg);
    el.style.setProperty("--dur", n.dur);
    el.style.setProperty("--atraso", n.atraso);
    el.innerHTML = '<div class="corpo">' + desenharSprite(n.pixels, n.paleta, false) + "</div>";
    caixaNadadores.appendChild(el);
  });

  // Caranguejo andando de lado no chão de areia
  const caranguejo = document.createElement("div");
  caranguejo.className = "nadador chao";
  caranguejo.style.setProperty("--larg", "5rem");
  caranguejo.style.setProperty("--dur", "40s");
  caranguejo.innerHTML = desenharSprite(PIXELS_CARANGUEJO, PALETA_CARANGUEJO, false);
  caixaNadadores.appendChild(caranguejo);

  // Corais e algas fixos no fundo
  const itens = [
    { tipo: "alga",  x: 1,  alt: "6rem" },
    { tipo: "coral", x: 5,  alt: "7rem" },
    { tipo: "alga",  x: 13, alt: "5rem" },
    { tipo: "alga",  x: 29, alt: "6.5rem" },
    { tipo: "coral", x: 22, alt: "5.5rem" },
    { tipo: "alga",  x: 61, alt: "5.5rem" },
    { tipo: "alga",  x: 73, alt: "6.5rem" },
    { tipo: "coral", x: 83, alt: "7.5rem" },
    { tipo: "alga",  x: 95, alt: "6rem" }
  ];
  const fundo = $("fundo-marinho");
  itens.forEach(function (item) {
    const el = document.createElement("div");
    el.className = "fixo " + item.tipo;
    el.style.left = item.x + "%";
    el.style.height = item.alt;
    el.innerHTML = item.tipo === "alga"
      ? desenharSprite(PIXELS_ALGA, PALETA_ALGA, false)
      : desenharSprite(PIXELS_CORAL, PALETA_CORAL, false);
    fundo.appendChild(el);
  });
}

/* ------------------------------------------------------------------
   9. CAPA DE APRESENTAÇÃO
   Bandeira do Equador em pixel art, montada por código:
   amarelo (metade de cima), azul e vermelho, com o brasão no centro.
   ------------------------------------------------------------------ */
const PALETA_BANDEIRA_EQUADOR = {
  Y: "#FFDD00", // faixa amarela
  B: "#034EA2", // faixa azul
  R: "#ED1C24", // faixa vermelha
  C: "#3A2A1A", // condor
  D: "#6B4B12", // contorno do brasão
  L: "#8FD3FF", // céu
  U: "#FFB400", // sol
  M: "#F2F7FC", // montanha
  N: "#3FA34D", // terra
  V: "#2F7BD6"  // rio
};

// Brasão simplificado: condor em cima e escudo embaixo (8 pixels de largura)
const PIXELS_BRASAO = [
  "C..CC..C",
  ".CCCCCC.",
  "..CCCC..",
  ".DDDDDD.",
  "DLLUULLD",
  "DLLMMLLD",
  "DLMMMMLD",
  "DNNNNNND",
  "DNVVVVND",
  "DNNVVNND",
  ".DNNNND.",
  "..DDDD.."
];

/** Monta o desenho da bandeira (30 x 20 pixels, proporção 3:2). */
function criarPixelsBandeira() {
  const largura = 30;
  const altura = 20;
  const linhas = [];

  // Faixas: metade de cima amarela, depois azul e vermelha (1/4 cada)
  for (let y = 0; y < altura; y++) {
    const letra = y < altura / 2 ? "Y" : (y < (altura * 3) / 4 ? "B" : "R");
    linhas.push(new Array(largura).fill(letra));
  }

  // Coloca o brasão no centro
  const inicioX = Math.floor((largura - PIXELS_BRASAO[0].length) / 2);
  const inicioY = 3;
  PIXELS_BRASAO.forEach(function (linha, y) {
    for (let x = 0; x < linha.length; x++) {
      if (linha[x] !== ".") linhas[inicioY + y][inicioX + x] = linha[x];
    }
  });

  return linhas.map(function (linha) { return linha.join(""); });
}

/** Do botão INICIAR JOGO da capa para o menu principal. */
function irParaMenu() {
  mostrarTela("menu");
  // Trava curta: um clique duplo em INICIAR JOGO não pode começar a partida sem querer
  const botaoJogar = $("btn-jogar");
  botaoJogar.style.pointerEvents = "none";
  setTimeout(function () { botaoJogar.style.pointerEvents = ""; }, TEMPO_TRAVA_INICIAL);
}

/* ------------------------------------------------------------------
   10. SETA DE VOLTAR
   Só aparece onde voltar é seguro:
     - Menu: volta para a capa.
     - Tela de nome: volta para o menu.
     - Ranking: volta para a tela final.
     - Pergunta 1, ainda sem resposta: volta para o menu (nada a perder).
   Nas demais telas ela fica escondida, porque voltar poderia pular
   perguntas ou apagar os pontos e as figurinhas da partida.
   ------------------------------------------------------------------ */
const PIXELS_SETA = [
  "....W....",
  "...WW....",
  "..WWW....",
  ".WWWWWWWW",
  "WWWWWWWWW",
  ".WWWWWWWW",
  "..WWW....",
  "...WW....",
  "....W...."
];
const PALETA_SETA = { W: "#071B33" };

/** A partida está na pergunta 1 e ainda sem resposta? (então sair não perde nada) */
function estaNaPrimeiraPerguntaSemResposta() {
  return !!estado && estado.indice === 0 && !estado.respondida;
}

/** Mostra ou esconde a seta de acordo com a tela atual. */
function atualizarSetaVoltar() {
  const tela = document.body.dataset.tela;
  const visivel = tela === "menu" || tela === "nome" || tela === "ranking" || (tela === "quiz" && estaNaPrimeiraPerguntaSemResposta());
  $("btn-voltar").hidden = !visivel;
}

/** Clique na seta. */
function voltar() {
  const tela = document.body.dataset.tela;

  // Trava curta: um clique duplo não pode voltar duas telas de uma vez
  const botao = $("btn-voltar");
  botao.style.pointerEvents = "none";
  setTimeout(function () { botao.style.pointerEvents = ""; }, TEMPO_TRAVA_INICIAL);

  if (tela === "menu") {
    mostrarTela("capa");
  } else if (tela === "nome") {
    mostrarTela("menu");
  } else if (tela === "ranking") {
    mostrarTela("final"); // a tela final continua como estava, sem registrar nada de novo
  } else if (tela === "quiz" && estaNaPrimeiraPerguntaSemResposta()) {
    pararCronometro();
    liberarNomeUtilizado(estado.jogador); // o nome volta a ficar disponível
    estado = null; // descarta a partida que mal começou; JOGAR cria uma nova
    mostrarTela("menu");
  }
}

/* ------------------------------------------------------------------
   11. NOME DO JOGADOR
   Tela entre o menu e o quiz. O nome vale só para a partida que
   vai começar: a cada nova partida o campo volta vazio.
   Um nome não pode se repetir na sessão da aba (sorteado ou digitado).
   ------------------------------------------------------------------ */
const APELIDOS = [
  "PolvoNinja", "BaiacuSupremo", "TartarugaTurbo", "ReiDosOceanos",
  "RainhaDoRecife", "CapitãoCoral", "ÁguaVivaVeloz", "CaranguejoCraque",
  "EstrelaCósmica", "MestreDosMares", "PeixeRelâmpago", "BaiacuBravo",
  "PolvoGamer", "TartarugaNinja", "ExploradorAbissal", "SuperCoral",
  "PirataDoRecife", "MergulhadorPro", "CaranguejoRei", "EstrelaBrilhante",
  "TubarãoSimpático", "DragãoMarinho", "ReiDoRecife", "CavaloMarinhoMax"
];

/** Tira espaços sobrando do começo, do fim e do meio do nome. */
function limparNome(texto) {
  return texto.replace(/\s+/g, " ").trim();
}

/* ===== CAMADA DE NOMES UTILIZADOS (a parte que poderá virar banco de dados) =====
   Guarda os nomes que já começaram uma partida nesta sessão da aba.
   Por enquanto usa sessionStorage (só esta aba, neste navegador).
   Para um banco compartilhado no futuro, reescreva apenas as funções
   desta camada; as telas e o sorteio continuam iguais. As quatro
   primeiras são "async" de propósito, porque um banco também será. */

const CHAVE_NOMES = "marDeFigurinhas.nomesUtilizados";
let nomesEmMemoria = [];          // reserva, usada só se o sessionStorage estiver bloqueado
let usarSoMemoriaNomes = false;

/** Deixa o nome "comparável": sem acentos, sem maiúsculas e sem espaços sobrando. */
function normalizarNome(nome) {
  return nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

/** Lê a lista de nomes guardados (função interna da camada). */
function lerNomesGuardados() {
  if (usarSoMemoriaNomes) return nomesEmMemoria.slice();
  try {
    const texto = window.sessionStorage.getItem(CHAVE_NOMES);
    if (texto === null) return [];
    const lista = JSON.parse(texto);
    return Array.isArray(lista) ? lista.filter(function (n) { return typeof n === "string"; }) : [];
  } catch (erro) {
    usarSoMemoriaNomes = true;
    return nomesEmMemoria.slice();
  }
}

/** Grava a lista de nomes (função interna da camada). */
function gravarNomesGuardados(lista) {
  nomesEmMemoria = lista.slice();
  if (usarSoMemoriaNomes) return;
  try {
    window.sessionStorage.setItem(CHAVE_NOMES, JSON.stringify(lista));
  } catch (erro) {
    usarSoMemoriaNomes = true;
  }
}

/** Devolve todos os nomes já utilizados. */
async function listarNomesUtilizados() {
  return lerNomesGuardados();
}

/** Este nome já foi utilizado nesta sessão? */
async function nomeJaUtilizado(nome) {
  const chave = normalizarNome(nome);
  return lerNomesGuardados().some(function (usado) { return normalizarNome(usado) === chave; });
}

/** Marca o nome como utilizado (sem duplicar). */
async function registrarNomeUtilizado(nome) {
  if (await nomeJaUtilizado(nome)) return;
  const lista = lerNomesGuardados();
  lista.push(nome);
  gravarNomesGuardados(lista);
}

/** Libera um nome (usado quando a partida é descartada na pergunta 1). */
async function liberarNomeUtilizado(nome) {
  const chave = normalizarNome(nome);
  gravarNomesGuardados(lerNomesGuardados().filter(function (usado) { return normalizarNome(usado) !== chave; }));
}

/** Escolhe um apelido ao acaso entre os disponíveis (evita repetir o que já está no campo). */
function sortearApelido(disponiveis, atual) {
  let novo;
  do {
    novo = disponiveis[Math.floor(Math.random() * disponiveis.length)];
  } while (novo === atual && disponiveis.length > 1);
  return novo;
}

/** Abre a tela de nome com o campo vazio (nunca herda o nome anterior). */
function irParaNome() {
  pararCronometro();
  const campo = $("campo-nome");
  campo.value = "";
  $("aviso-nome").textContent = "";
  mostrarTela("nome");

  // Trava curta: um clique duplo no botão anterior não pode apertar SORTEAR ou JOGAR sem querer
  [$("btn-sortear"), $("btn-comecar")].forEach(function (botao) {
    botao.style.pointerEvents = "none";
    setTimeout(function () { botao.style.pointerEvents = ""; }, TEMPO_TRAVA_INICIAL);
  });

  campo.focus({ preventScroll: true });
}

/** Botão SORTEAR NOME: coloca um apelido no campo (que ainda pode ser editado). */
async function sortearNome() {
  const campo = $("campo-nome");
  const usados = (await listarNomesUtilizados()).map(normalizarNome);
  const disponiveis = APELIDOS.filter(function (apelido) {
    return usados.indexOf(normalizarNome(apelido)) === -1;
  });

  // Acabaram os apelidos: avisa e sugere a alternativa, sem repetir nenhum nome
  if (disponiveis.length === 0) {
    $("aviso-nome").textContent = "Acabaram os apelidos disponíveis! Digite o seu próprio nome.";
    campo.focus({ preventScroll: true });
    return;
  }

  campo.value = sortearApelido(disponiveis, limparNome(campo.value));
  $("aviso-nome").textContent = "";
  campo.focus({ preventScroll: true });
}

let verificandoNome = false; // impede dois cliques seguidos de começarem duas partidas

/** Botão JOGAR da tela de nome: só começa com um nome que ainda não foi usado. */
async function comecarPartida() {
  if (verificandoNome) return;
  verificandoNome = true;
  try {
    const campo = $("campo-nome");
    const nome = limparNome(campo.value);
    if (!nome) {
      $("aviso-nome").textContent = "Digite um nome ou sorteie um!";
      campo.focus({ preventScroll: true });
      return;
    }
    if (await nomeJaUtilizado(nome)) {
      $("aviso-nome").textContent = "\u201C" + nome + "\u201D já foi usado nesta sessão. Escolha outro nome ou sorteie um!";
      campo.focus({ preventScroll: true });
      return;
    }
    await registrarNomeUtilizado(nome); // o nome fica reservado a partir de agora
    iniciarPartida(nome);
  } finally {
    verificandoNome = false;
  }
}

/* ------------------------------------------------------------------
   12. CRONÔMETRO E PONTUAÇÃO
   - O tempo começa quando a pergunta 1 aparece e para ao terminar o quiz.
   - Ele é calculado por horário (fim - início), por isso é exato.
   - Pontuação: PONTOS_POR_ACERTO (100) por resposta certa, sem desconto
     por erro. Com 8 perguntas, o máximo é 800 pontos.
   ------------------------------------------------------------------ */
let relogio = null; // guarda o temporizador enquanto o cronômetro está rodando

/** Transforma milissegundos em "mm:ss". */
function formatarTempo(ms) {
  const totalSegundos = Math.floor(ms / 1000);
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return String(minutos).padStart(2, "0") + ":" + String(segundos).padStart(2, "0");
}

/** Atualiza o número que aparece no canto da tela. */
function atualizarCronometro() {
  if (estado && relogio) $("cron-valor").textContent = formatarTempo(Date.now() - estado.inicioMs);
}

/** Liga o cronômetro (chamado só quando a pergunta 1 aparece). */
function iniciarCronometro() {
  pararCronometro();
  estado.inicioMs = Date.now();
  estado.tempoTotalMs = 0;
  relogio = setInterval(atualizarCronometro, 250);
  $("cron-valor").textContent = "00:00";
}

/** Desliga o cronômetro e registra o tempo total da partida. */
function pararCronometro() {
  if (!relogio) return;
  clearInterval(relogio);
  relogio = null;
  if (estado) estado.tempoTotalMs = Date.now() - estado.inicioMs;
}

/* ------------------------------------------------------------------
   13. RANKING
   Guarda os resultados (nome, pontos e tempo) e mostra os 5 melhores.

   O armazenamento está todo na "CAMADA DE ARMAZENAMENTO" logo abaixo.
   Por enquanto usa o sessionStorage: os resultados duram enquanto a aba
   estiver aberta (sobrevivem a F5) e NÃO vão para o localStorage.
   Para trocar por um banco de dados no futuro, basta reescrever as
   quatro funções dessa camada; o resto do jogo não precisa mudar.
   ------------------------------------------------------------------ */
const RANKING_TAMANHO = 5;   // quantos resultados aparecem no ranking
const LIMITE_GUARDADO = 50;  // quantos resultados ficam guardados no máximo
const CHAVE_RANKING = "marDeFigurinhas.resultados";

/* ===== CAMADA DE ARMAZENAMENTO (a parte que será trocada pelo banco) ===== */

let resultadosEmMemoria = []; // reserva, usada só se o navegador bloquear o sessionStorage
let usarSoMemoria = false;    // vira true se o sessionStorage não estiver disponível

/** Confere se um item lido do armazenamento tem o formato esperado. */
function resultadoValido(r) {
  return !!r && typeof r.id === "string" && typeof r.nome === "string" &&
    Number.isFinite(r.pontos) && Number.isFinite(r.tempoMs) && Number.isFinite(r.criadoEm);
}

/** Lê todos os resultados guardados. */
function lerTodosOsResultados() {
  if (usarSoMemoria) return resultadosEmMemoria.slice();
  try {
    const texto = window.sessionStorage.getItem(CHAVE_RANKING);
    if (texto === null) return [];
    const lista = JSON.parse(texto);
    return Array.isArray(lista) ? lista.filter(resultadoValido) : [];
  } catch (erro) {
    usarSoMemoria = true; // sessionStorage indisponível: segue só com a memória
    return resultadosEmMemoria.slice();
  }
}

/** Grava a lista inteira de resultados. */
function gravarTodosOsResultados(lista) {
  resultadosEmMemoria = lista.slice();
  if (usarSoMemoria) return;
  try {
    window.sessionStorage.setItem(CHAVE_RANKING, JSON.stringify(lista));
  } catch (erro) {
    usarSoMemoria = true; // sem sessionStorage: o jogo segue normalmente usando só a memória
  }
}

/**
 * Salva UM resultado. Formato: { id, nome, pontos, tempoMs, criadoEm }.
 * É "async" de propósito: um banco de dados também será assíncrono.
 */
async function salvarResultado(resultado) {
  const lista = lerTodosOsResultados();
  lista.push(resultado);
  gravarTodosOsResultados(ordenarResultados(lista).slice(0, LIMITE_GUARDADO));
  return resultado;
}

/** Devolve os melhores resultados, já ordenados (também "async"). */
async function obterMelhoresResultados(limite) {
  return ordenarResultados(lerTodosOsResultados()).slice(0, limite);
}

/* ===== REGRAS DO RANKING (valem com qualquer armazenamento) ===== */

/**
 * Maior pontuação primeiro. Se empatar, menor tempo na frente.
 * Se ainda empatar, quem terminou antes fica na frente.
 */
function ordenarResultados(lista) {
  return lista.slice().sort(function (a, b) {
    return (b.pontos - a.pontos) || (a.tempoMs - b.tempoMs) || (a.criadoEm - b.criadoEm);
  });
}

/** Registra o resultado da partida atual, no máximo UMA vez por partida. */
function registrarResultadoUmaVez() {
  if (!estado || estado.resultadoSalvo) return;
  estado.resultadoSalvo = true;

  const resultado = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    nome: estado.jogador,
    pontos: estado.pontos,
    tempoMs: estado.tempoTotalMs,
    criadoEm: Date.now()
  };
  estado.resultadoId = resultado.id;
  estado.salvando = salvarResultado(resultado);
}

/* ===== TELA DO RANKING ===== */

/** Desabilita cliques por um instante (evita clique duplo acidental). */
function travarBotoes(botoes) {
  botoes.forEach(function (botao) {
    botao.style.pointerEvents = "none";
    setTimeout(function () { botao.style.pointerEvents = ""; }, TEMPO_TRAVA_INICIAL);
  });
}

/** Cria uma linha do ranking (resultado = null deixa a posição vazia). */
function criarLinhaRanking(posicao, resultado, idDestaque) {
  const linha = document.createElement("div");
  linha.className = "linha-rank pos-" + posicao + (resultado ? "" : " vazia");

  const pos = document.createElement("span");
  pos.className = "pos";
  pos.textContent = posicao;

  const nome = document.createElement("span");
  nome.className = "nome-rank";
  nome.textContent = resultado ? resultado.nome : "---";

  const pontos = document.createElement("span");
  pontos.className = "pts";
  pontos.textContent = resultado ? resultado.pontos : "---";

  const tempo = document.createElement("span");
  tempo.className = "tempo";
  tempo.textContent = resultado ? formatarTempo(resultado.tempoMs) : "--:--";

  if (resultado && resultado.id === idDestaque) {
    linha.classList.add("destaque");
    const voce = document.createElement("span");
    voce.className = "voce";
    voce.textContent = "VOCÊ";
    nome.appendChild(voce);
  }

  linha.appendChild(pos);
  linha.appendChild(nome);
  linha.appendChild(pontos);
  linha.appendChild(tempo);
  return linha;
}

/** Botão VER RANKING (tela final): busca os melhores e abre a tela. */
async function abrirRanking() {
  const partida = estado ? estado.id : null;
  if (estado && estado.salvando) await estado.salvando; // garante que o resultado já foi guardado
  const melhores = await obterMelhoresResultados(RANKING_TAMANHO);
  if (estado && estado.id !== partida) return; // outra partida começou nesse meio tempo

  const lista = $("lista-ranking");
  lista.innerHTML = "";
  const idDestaque = estado ? estado.resultadoId : null;
  for (let i = 0; i < RANKING_TAMANHO; i++) {
    lista.appendChild(criarLinhaRanking(i + 1, melhores[i] || null, idDestaque));
  }

  mostrarTela("ranking");
  travarBotoes([$("btn-ranking-menu")]);
}

/* ------------------------------------------------------------------
   14. INÍCIO
   ------------------------------------------------------------------ */
montarCenario();
$("bandeira-equador").innerHTML = desenharSprite(criarPixelsBandeira(), PALETA_BANDEIRA_EQUADOR, false);
$("btn-voltar").innerHTML = desenharSprite(PIXELS_SETA, PALETA_SETA, false);
$("btn-voltar").addEventListener("click", voltar);
$("btn-iniciar").addEventListener("click", irParaMenu);
$("btn-jogar").addEventListener("click", irParaNome);
$("btn-sortear").addEventListener("click", sortearNome);
$("btn-comecar").addEventListener("click", comecarPartida);
$("campo-nome").addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") comecarPartida();
});
$("campo-nome").addEventListener("input", function () { $("aviso-nome").textContent = ""; });
$("btn-proxima").addEventListener("click", avancar);
$("btn-jogar-novamente").addEventListener("click", irParaNome);
$("btn-ranking").addEventListener("click", abrirRanking);
$("btn-ranking-menu").addEventListener("click", function () { mostrarTela("menu"); });
mostrarTela("capa"); // o jogo sempre abre pela capa
