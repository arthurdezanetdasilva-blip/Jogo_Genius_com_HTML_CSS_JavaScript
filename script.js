const botoes = document.querySelectorAll(".btn");
const iniciar = document.getElementById("start");
const modo = document.getElementById("modo");
const mensagem = document.getElementById("msg");
const rodadaTxt = document.getElementById("round");
const bestTxt = document.getElementById("best");
const rankingDiv = document.getElementById("ranking");
const resetRank = document.getElementById("resetRank");

let sequencia = [];
let jogador = [];
let rodada = 0;
let jogando = false;
let bloqueado = false;

let recorde = Number(localStorage.getItem("recorde")) || 0;
let ranking = JSON.parse(localStorage.getItem("rankingGenius")) || [];

bestTxt.innerHTML = recorde;

/* SOM */
let audioCtx = null;

function ativarSom(){

if(!audioCtx){
audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

if(audioCtx.state === "suspended"){
audioCtx.resume();
}

}

function tocar(freq,tempo=0.20){

if(!audioCtx) return;

const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();

osc.type="square";
osc.frequency.value=freq;

osc.connect(gain);
gain.connect(audioCtx.destination);

gain.gain.setValueAtTime(0.22,audioCtx.currentTime);

gain.gain.exponentialRampToValueAtTime(
0.001,
audioCtx.currentTime+tempo
);

osc.start();
osc.stop(audioCtx.currentTime+tempo);

}

function somCor(i){
const notas=[329,261,220,164];
tocar(notas[i]);
}

function somErro(){
tocar(180,0.15);
setTimeout(()=>{ tocar(120,0.28); },180);
}

/* RANKING */
function mostrarRanking(){

let html = "";

if(ranking.length === 0){

for(let i=1;i<=5;i++){
html += `<p>${i}º ---</p>`;
}

}else{

ranking.forEach((item,i)=>{

let medalha = "";

if(i==0) medalha="🥇 ";
else if(i==1) medalha="🥈 ";
else if(i==2) medalha="🥉 ";

html += `<p>${medalha}${i+1}º ${item.nome} - ${item.pontos}</p>`;

});

for(let i=ranking.length+1;i<=5;i++){
html += `<p>${i}º ---</p>`;
}

}

rankingDiv.innerHTML = html;

}

mostrarRanking();

function salvarRanking(pontos){

let nome = prompt("Digite seu nome:");

if(!nome || nome.trim()==""){
nome = "Jogador";
}

ranking.push({
nome:nome,
pontos:pontos
});

ranking.sort((a,b)=> b.pontos-a.pontos);

ranking = ranking.slice(0,5);

localStorage.setItem(
"rankingGenius",
JSON.stringify(ranking)
);

mostrarRanking();

}

resetRank.onclick = ()=>{

if(confirm("Deseja apagar ranking?")){

ranking = [];
localStorage.removeItem("rankingGenius");
mostrarRanking();

}

};

/* MODOS */
function velocidade(){

if(modo.value=="facil") return 850;
if(modo.value=="medio") return 550;
if(modo.value=="dificil") return 300;

return 550;

}

/* INICIAR */
iniciar.onclick = ()=>{

if(bloqueado) return;

ativarSom();

iniciar.disabled = true;
modo.disabled = true;

sequencia = [];
jogador = [];
rodada = 0;

proximaRodada();

};

/* NOVA RODADA */
function proximaRodada(){

jogador = [];
rodada++;

rodadaTxt.innerHTML = rodada;

sequencia.push(Math.floor(Math.random()*4));

mensagem.innerHTML = "Observe a sequência...";

mostrarSequencia();

}

/* MOSTRAR */
function mostrarSequencia(){

jogando = false;
bloqueado = true;

let tempo = velocidade();

sequencia.forEach((cor,i)=>{

setTimeout(()=>{
piscar(cor);
},(i+1)*tempo);

});

setTimeout(()=>{

jogando = true;
bloqueado = false;
mensagem.innerHTML = "Sua vez!";

},sequencia.length*tempo+250);

}

/* PISCAR */
function piscar(i){

const botao = botoes[i];

botao.classList.add("active");

somCor(i);

setTimeout(()=>{
botao.classList.remove("active");
},220);

}

/* CLIQUE */
botoes.forEach((botao,i)=>{

botao.onclick = ()=>{

if(!jogando || bloqueado) return;

ativarSom();

piscar(i);

jogador.push(i);

verificar(jogador.length-1);

};

});

/* VERIFICAR */
function verificar(pos){

if(jogador[pos] !== sequencia[pos]){
derrota();
return;
}

if(jogador.length === sequencia.length){

mensagem.innerHTML = "Boa! Próxima rodada...";

setTimeout(()=>{
proximaRodada();
},700);

}

}

/* DERROTA */
function derrota(){

somErro();

salvarRanking(rodada);

if(rodada > recorde){
recorde = rodada;
localStorage.setItem("recorde",recorde);
bestTxt.innerHTML = recorde;
}

alert("GAME OVER");

iniciar.disabled = false;
modo.disabled = false;

sequencia = [];
jogador = [];
rodada = 0;

rodadaTxt.innerHTML = 0;
mensagem.innerHTML = "Clique em iniciar para jogar";

bloqueado = false;
jogando = false;

}