console.log('[DevMrnice] Flappy Bird');


const som_HIT = new Audio();
som_HIT.src = './Efeitos/efeitos_hit.wav';
 
const som_PULA = new Audio();
som_PULA.src = './Efeitos/efeitos_pulo.wav'
const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

// [Chao]
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height  -112,
    atualiza(){
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;

      // console.log('[chao.x]', chao.x);
      // console.log('[repeteEm]',repeteEm);
      // console.log('[movimentacao]', movimentacao % repeteEm);
      
      chao.x = movimentacao % repeteEm;
    },
    
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );

      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    },
  };
  return chao;
};

function fazColisao(flappyBird, chao){
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY){
    return true;
  }
  return false;
}

function criaFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.5 ,
    pula(){
      console.log('agr pula passaro');
      //console.log('antes',flappyBird.velocidade)
      flappyBird.velocidade = - flappyBird.pulo;
      //console.log('after',flappyBird.velocidade)
      som_PULA.play();
    },
    gravidade: 0.10,
    velocidade: 0,
    
    atualiza(){
      if (fazColisao(flappyBird, globais.chao)){
          console.log('faz colisao');
          som_HIT.play();
          setTimeout(()=>{
            mudaParaTela(Telas.INICIO)

          },200);
          
          return;
        }
      
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      //console.log(flappyBird.y);
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    }
    
  }
  return flappyBird;
}

///[mensagemGetReady]
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width/2)- 174 /2,
  y: 50,
   desenha() {
     contexto.drawImage( 
       sprites,
       mensagemGetReady.sX, mensagemGetReady.sY,
       mensagemGetReady.w, mensagemGetReady.h,
       mensagemGetReady.x, mensagemGetReady.y,
       mensagemGetReady.w, mensagemGetReady.h
     );
   }
}

//
//[Telas]
//
const globais ={};
let telaAtiva = {};
function mudaParaTela(novaTela){
  telaAtiva  = novaTela;

  if(telaAtiva.inicializa()){
    inicializa()

  }
}

const Telas = {
  INICIO: {
    inicializa(){
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha()
      mensagemGetReady.desenha();
      
    },
    click(){
      mudaParaTela(Telas.JOGO);
      
    },
    atualiza() {
      globais.chao.atualiza();
    }
    
  }
};

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click(){
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.flappyBird.atualiza();
    globais.chao.atualiza();
  }
};

function loop() {  

    telaAtiva.desenha();
    telaAtiva.atualiza();    
    requestAnimationFrame(loop);
}

window.addEventListener('click', function(){
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});
mudaParaTela(Telas.INICIO);
loop();