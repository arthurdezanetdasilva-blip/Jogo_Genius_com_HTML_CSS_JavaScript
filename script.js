const botoes = document.querySelectorAll(".btn");
const iniciar = document.getElementById("start");
const mensagem = document.getElementById("msg");
const rodadaTxt = document.getElementById("round");
const bestTxt = document.getElementById("best");

let sequencia = [];
let jogador = [];
let rodada = 0;
let jogando = false;
let recorde = localStorage.getItem("recorde") || 0;

bestTxt.innerHTML = recorde;

/* ========= SOM CORRIGIDO ========= */

let audioCtx = null;

function ativarSom(){

if(!audioCtx){
audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

if(audioCtx.state === "suspended"){
audioCtx.resume();
}

}

function tocarSom(freq, tempo = 0.35){

if(!audioCtx) return;

const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();

osc.type = "square";
osc.frequency.value = freq;

osc.connect(gain);
gain.connect(audioCtx.destination);

gain.gain.setValueAtTime(0.25, audioCtx.currentTime);

gain.gain.exponentialRampToValueAtTime(
0.001,
audioCtx.currentTime + tempo
);

osc.start();
osc.stop(audioCtx.currentTime + tempo);
}

function somCor(cor){

const notas = [
329.63,
261.63,
220.00,
164.81
];

tocarSom(notas[cor],0.30);
}

function somErro(){

tocarSom(180,0.25);

setTimeout(()=>{
tocarSom(130,0.35);
},220);

}

function somVitoria(){

tocarSom(440,0.15);

setTimeout(()=>{
tocarSom(523,0.15);
},140);

setTimeout(()=>{
tocarSom(659,0.20);
},280);

}

/* INICIAR */
iniciar.onclick = ()=>{

ativarSom();   // ESSENCIAL

sequencia = [];
rodada = 0;

proximaRodada();

}

/* NOVA RODADA */
function proximaRodada(){

jogador = [];
rodada++;

rodadaTxt.innerHTML = rodada;

const cor = Math.floor(Math.random()*4);

sequencia.push(cor);

mensagem.innerHTML = "Observe a sequência...";

mostrarSequencia();

}

/* MOSTRAR */
function mostrarSequencia(){

jogando = false;

sequencia.forEach((cor,i)=>{

setTimeout(()=>{
piscar(cor);
},(i+1)*700);

});

setTimeout(()=>{
jogando = true;
mensagem.innerHTML = "Sua vez!";
},sequencia.length*700+400);

}

/* PISCAR */
function piscar(i){

const botao = botoes[i];

botao.classList.add("active");

somCor(i);

setTimeout(()=>{
botao.classList.remove("active");
},400);

}

/* CLIQUES */
botoes.forEach((botao,i)=>{

botao.onclick = ()=>{

if(!jogando) return;

ativarSom();

piscar(i);

jogador.push(i);

verificar(jogador.length-1);

}

});

/* VERIFICAR */
function verificar(pos){

if(jogador[pos] != sequencia[pos]){
derrota();
return;
}

if(jogador.length == sequencia.length){

somVitoria();

mensagem.innerHTML = "Boa! Próxima rodada...";

setTimeout(()=>{
proximaRodada();
},1000);

}

}

/* GAME OVER */
function derrota(){

somErro();

if(rodada > recorde){

recorde = rodada;
localStorage.setItem("recorde",recorde);
bestTxt.innerHTML = recorde;

}

jogando = false;

alert("GAME OVER");

sequencia = [];
rodada = 0;
rodadaTxt.innerHTML = 0;

}