var tela;
var c;

var canhao;
var laser;
var alien;
var barreira;
var projetil;
var nave;
var score = 0;
var vidas = 3;
var invaders = 55;

const primeiraVida = document.querySelector(".vida-Um");
const segundaVida = document.querySelector(".vida-Dois");
const terceiraVida = document.querySelector(".vida-tres");

var naveY = 15;
var naveX = 0;
var projetilX = 0;
var projetilY = 0;
var canhaoX = 180;
var canhaoY = 530;
var laserX = 200;
var laserY = 510;
var alienX = 0;
var alienY = 0;
var inicioLaser = false;
var impactoLaserX;
var laserMovendo;
var intervalo = 40;
var posicao = 0;
var projetilFoiDisparado = false;
const projetilVel = 1.5;
const velAlien = 0.5;
var dateProjetil = 0;
var projetilMovendo;
var naveComecou = false;
var acertouNaveEspecial = false;

var alienLinhas = [10, 38, 66, 94, 122, 150, 178, 206, 234, 262, 290];
var alienColunas = [55, 85, 115, 145, 175];
var aliensRestantes = [];

const C_ALTURA = 600;
const C_LARGURA = 400;

const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;

// var localStorageRanking = JSON.parse(localStorage.getItem("ranking"));

onkeydown = moverCanhao; // Define função chamada ao se pressionar uma tecla

iniciar(); // Chama função inicial do jogo

// efeitos sonoros:
var alienDestroyed = new Howl({
  urls: ["Sounds/alienDestroyed.mp3"],
  volume: 0.5,
});
var shipDestroyed = new Howl({
  urls: ["Sounds/shipDestroyed.mp3"],
  volume: 0.5,
});
var upperAlienMov = new Howl({
  urls: ["Sounds/upperAlien.mp3"],
});
var shoot = new Howl({
  urls: ["Sounds/shoot.mp3"],
  volume: 0.1,
});
var youLose = new Howl({
  urls: ["Sounds/youLose.mp3"],
});
var youWon = new Howl({
  urls: ["Sounds/youWin.mp3"],
});
var backMusic = new Howl({
  urls: ["Sounds/backsound.mp3"],
  autoplay: true,
  volume: 0.5,
});
var alienMov = new Howl({
  urls: ["Sounds/alienMov.mp3"],
  onplay: isPlaying,
});

function isPlaying() {
  if (alienMov.playing()) {
    setTimeout(isPlaying, 1000);
  }
}

// Sub-rotinas (funções)

function iniciar() {
  tela = document.getElementById("tela");
  c = tela.getContext("2d");

  c.fillStyle = "#0d0e47";
  c.fillRect(0, 0, C_LARGURA, C_ALTURA);

  posicionarAlien();
  moverNave();
  carregarImagens();

  setInterval("moverAliens()", intervalo);
  setInterval("alienAtingido()", 6);
}

function posicionarAlien() {
  for (var i = 0; i < alienLinhas.length; i++) {
    for (var j = 0; j < alienColunas.length; j++) {
      var novoAlien = {
        posX: alienLinhas[i],
        posY: alienColunas[j],
        foiAtingido: false,
        nivel: j,
      };

      if (j > 2) {
        novoAlien.pontos = 10;
      } else if (j > 0) {
        novoAlien.pontos = 20;
      } else {
        novoAlien.pontos = 40;
      }

      aliensRestantes[aliensRestantes.length] = novoAlien;
    }
  }
}

function carregarImagens() {
  canhao = new Image();
  canhao.src = "sprites/nave.png";
  canhao.onload = function () {
    c.drawImage(canhao, canhaoX, canhaoY);
  };

  laser = new Image();
  laser.src = "sprites/laser.png";

  projetil = new Image();
  projetil.src = "sprites/tiroAlien.gif";

  alien = new Image();
  alien.src = "sprites/alienShip.png";

  middleAlien = new Image();
  middleAlien.src = "sprites/middleAlien.png";

  upperAlien = new Image();
  upperAlien.src = "sprites/upperAlien.png";

  nave = new Image();
  nave.src = "sprites/alien2.png";

  barreira = new Image();
  barreira.src = "sprites/barreira.png";
  barreira.onload = function () {
    posicionarBarreiras();
  };
}
function posicionarBarreiras() {
  c.fillRect(125, 480, 40, 40);
  c.drawImage(barreira, 70, 480);
  c.drawImage(barreira, 180, 480);
  c.drawImage(barreira, 290, 480);
}

function moverAliens() {
  if (posicao <= 65) {
    alienX += velAlien;
    posicao += velAlien;
  } else if (posicao > 65 && posicao <= 80) {
    alienX += velAlien;
    alienY += velAlien;
    posicao += velAlien;
  } else if (posicao > 80 && posicao <= 147) {
    alienX -= velAlien;
    posicao += velAlien;
  } else if (posicao > 147 && posicao < 162) {
    alienX -= velAlien;
    alienY += velAlien;
    posicao += velAlien;
  } else {
    posicao = 0;
  }

  for (var i = 0; i < aliensRestantes.length; i++) {
    if (!aliensRestantes[i].foiAtingido) {
      c.fillRect(
        alienX + aliensRestantes[i].posX,
        alienY + aliensRestantes[i].posY,
        30,
        30
      );
      if (aliensRestantes[i].nivel > 2) {
        c.drawImage(
          alien,
          alienX + aliensRestantes[i].posX,
          alienY + aliensRestantes[i].posY
        );
      } else if (aliensRestantes[i].nivel > 0) {
        c.drawImage(
          middleAlien,
          alienX + aliensRestantes[i].posX,
          alienY + aliensRestantes[i].posY
        );
      } else {
        c.drawImage(
          upperAlien,
          alienX + aliensRestantes[i].posX,
          alienY + aliensRestantes[i].posY
        );
      }

      if (aliensRestantes[i].posY + alienY + 23 >= 470) {
        youLose.play();
        fimDeJogo();
      }
    }
  }

  if (Date.now() > 1500 + dateProjetil) {
    for (let i = 0; i < aliensRestantes.length; i++) {
      if (!aliensRestantes[i].foiAtingido) {
        posicionarProjetil();
        break;
      }
    }
    dateProjetil = Date.now();
  }
}

function alienAtingido() {
  for (var i = 0; i < aliensRestantes.length; i++) {
    if (
      laserY >= alienY + aliensRestantes[i].posY &&
      laserY <= alienY + aliensRestantes[i].posY + 20 &&
      impactoLaserX >= alienX + aliensRestantes[i].posX - 5 &&
      impactoLaserX <= alienX + aliensRestantes[i].posX + 18
    ) {
      if (!aliensRestantes[i].foiAtingido) {
        c.fillStyle = "#0d0e47";
        c.fillRect(
          alienX + aliensRestantes[i].posX - 1,
          alienY + aliensRestantes[i].posY - 1,
          30,
          30
        );
        invaders--;
        aliensRestantes[i].foiAtingido = true;
        c.fillRect(impactoLaserX, laserY, 6, 19);
        laserY = 0;

        setInterval("moverAliens()", 400);

        score += aliensRestantes[i].pontos;

        //efeito sonoro
        alienDestroyed.play();

        if (invaders == 0) {
          youWon.play();
          fimDeJogo();
        }
      }
    }
  }
}

function fimDeJogo() {
  canhaoX = 180;
  laserX = 193;
  laserY = 520;
  alienX = 0;
  alienY = 0;
  posicao = 0;
  aliensRestantes = [];
  inicioLaser = false;

  c.fillStyle = "#0d0e47";
  c.fillRect(0, 0, C_LARGURA, C_ALTURA);

  c.textAlign = "center";
  c.font = "50px Monaco,monospace";
  c.fillStyle = "#EEEE";
  c.fillText("Fim de Jogo", C_LARGURA / 2, C_ALTURA / 2);
  onkeydown = null;
  //efeito sonoro
  backMusic.stop();

  updateLocalStorage();
}

function moverCanhao(tecla) {
  var codigo = tecla.keyCode;

  if (codigo == TECLA_DIREITA && canhaoX <= 360) {
    c.fillStyle = "#0d0e47";
    c.fillRect(canhaoX, 530, 50, 50);
    canhaoX += 8;
    laserX += 8;
    c.drawImage(canhao, canhaoX, canhaoY);
  }

  if (codigo == TECLA_ESQUERDA && canhaoX >= 9) {
    c.fillStyle = "#0d0e47";
    c.fillRect(canhaoX, 530, 50, 50);
    canhaoX -= 8;
    laserX -= 8;
    c.drawImage(canhao, canhaoX, canhaoY);
  }

  if (codigo == TECLA_ACIMA && !inicioLaser) {
    inicioLaser = true;
    c.drawImage(laser, laserX, laserY);
    impactoLaserX = laserX;
    laserMovendo = setInterval("dispararLaser()", 10);
  }
}

function dispararLaser() {
  if (inicioLaser && laserY >= 60) {
    laserY -= 10;
    shoot.play();
    c.fillStyle = "#0d0e47";
    c.fillRect(impactoLaserX, laserY + 10, 6, 19);
    if (laserY >= 70) {
      c.drawImage(laser, impactoLaserX, laserY);
    }
  }

  if (laserY < 60) {
    clearInterval(laserMovendo);
    inicioLaser = false;
    laserY = 500;
  }
}

function updateLocalStorage() {
  var pessoa = {
    nome: prompt("Nome: "),
    pontos: score,
  };

  // resgatando valor do ranking
  let ranking = localStorage.getItem("ranking");

  if (ranking) {
    // transformar em objeto javascript
    let arrayRanking = JSON.parse(ranking);
    arrayRanking.push(pessoa);
    bubbleSort(arrayRanking);
    console.log(arrayRanking);
    localStorage.setItem("ranking", JSON.stringify(arrayRanking));
  } else {
    let arr = [pessoa];
    localStorage.setItem("ranking", JSON.stringify(arr));
  }
}

function bubbleSort(v) {
  var aux;

  for (var i = 0; i < v.length - 1; i++) {
    for (var j = 0; j < v.length - 1 - i; j++) {
      if (v[j].pontos < v[j + 1].pontos) {
        aux = v[j];
        v[j] = v[j + 1];
        v[j + 1] = aux;
      }
    }
  }
}

function projetilAcertouCanhao() {
  if (
    projetilY - 27 >= canhaoY &&
    projetilY - 27 <= canhaoY + 30 &&
    projetilX >= canhaoX - 5 &&
    projetilX <= canhaoX + 40
  ) {
    shipDestroyed.play();
    vidas--;
    if (vidas == 0) {
      youLose.play();
      fimDeJogo();
    }
    return true;
  }
  return false;
}

function preparaAtirador() {
  const colunaAtiradora = Math.floor(Math.random() * alienLinhas.length);

  for (let j = alienColunas.length - 1; j >= 0; j--) {
    const linhaAtual = j % 5;
    const indiceAlienAtual = colunaAtiradora * 5 + linhaAtual;
    var alienAtual = aliensRestantes[indiceAlienAtual];
    if (!alienAtual.foiAtingido) {
      return alienAtual;
    }
  }
  return preparaAtirador();
}

function posicionarProjetil() {
  if (!projetilFoiDisparado) {
    var alienAtual = preparaAtirador();
    projetilFoiDisparado = true;
    projetilY = alienY + alienAtual.posY + 68;
    projetilX = alienX + alienAtual.posX + 5;
    projetilMovendo = setInterval(disparaProjetil, 6, alienAtual, projetilX);
  }
}

function removeVida(vidas) {
  if (vidas == 2) {
    primeiraVida.classList.add("perder-vida", "sumir");
  }
  if (vidas == 1) {
    segundaVida.classList.add("perder-vida", "sumir");
  }
  if (vidas == 0) {
    terceiraVida.classList.add("perder-vida", "sumir");
  }
}

function disparaProjetil(alienAtual, posX) {
  c.fillRect(posX, projetilY - projetilVel - 27, 10, 10);
  c.drawImage(projetil, posX, projetilY - 27);

  projetilY += projetilVel;

  if (projetilAcertouCanhao()) {
    clearInterval(projetilMovendo);
    projetilFoiDisparado = false;
    c.clearRect(posX, projetilY - 27, 10, 10);
    if (vidas != 0) {
      c.drawImage(canhao, canhaoX, canhaoY);
    }
  }

  removeVida(vidas);

  if (projetilY >= C_ALTURA + 100) {
    clearInterval(projetilMovendo);
    projetilFoiDisparado = false;
    projetilY = alienY + alienAtual.posY + 10;
  }
}

// Nave - superior -------------------
function defineChanceAparecerNave() {
  if (naveComecou) return;

  let chanceNaveAparecer = parseFloat(Math.random().toFixed(1));
  if (chanceNaveAparecer <= 1) {
    naveComecou = true;
    acertouNaveEspecial = false;
    naveX = 0;
  }
}

function laserAcertouNave() {
  if (
    laserY <= naveY + 30 &&
    laserY !== 0 &&
    laserY >= naveY &&
    impactoLaserX >= naveX &&
    impactoLaserX + 6 <= naveX + 55
  ) {
    acertouNaveEspecial = true;
    alienDestroyed.play();

    naveComecou = false;
    c.clearRect(naveX, naveY, 400, 37);
    c.clearRect(impactoLaserX, laserY, 6, 19);
    laserY = 0;
    const pontoNave = Math.floor(Math.random() * 40) + 40;
    score += pontoNave;
  }
}

function moverNave() {
  if (!naveComecou) return;

  laserAcertouNave();
  upperAlienMov.play();
  naveX += 3; // vel. da nave

  if (naveX > 400) {
    naveComecou = false;
  }

  if (acertouNaveEspecial) return;

  c.clearRect(naveX + 3, naveY, 52, 37);
  c.drawImage(nave, naveX, naveY);
}
