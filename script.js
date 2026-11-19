const questions = [
  {phase:'FASE 1 · INICIANTE',name:'O primeiro conjunto',text:'O que é um conjunto matemático?',answers:['Uma coleção de elementos','Uma operação de divisão','Uma sequência obrigatoriamente infinita','Um número negativo'],correct:0,explain:'Um conjunto é uma coleção de elementos que possuem alguma característica ou relação em comum.'},
  {phase:'FASE 1 · INICIANTE',name:'Pertencimento',text:'Se A = {2, 4, 6, 8}, qual afirmação está correta?',answers:['5 ∈ A','4 ∈ A','9 ∈ A','1 ∈ A'],correct:1,explain:'O número 4 está dentro do conjunto A. Por isso, 4 ∈ A.'},
  {phase:'FASE 1 · INICIANTE',name:'Conjunto especial',text:'Qual conjunto possui apenas um elemento?',answers:['Conjunto vazio','Conjunto infinito','Conjunto unitário','Conjunto universo'],correct:2,explain:'O conjunto unitário possui exatamente um elemento.'},
  {phase:'FASE 2 · INTERMEDIÁRIO',name:'União dos conjuntos',text:'A = {1, 2, 3} e B = {3, 4, 5}. Qual é A ∪ B?',answers:['{3}','{1, 2, 3, 4, 5}','{1, 2}','{4, 5}'],correct:1,explain:'A união reúne todos os elementos dos dois conjuntos, sem repetir os que aparecem em ambos.'},
  {phase:'FASE 2 · INTERMEDIÁRIO',name:'Interseção',text:'A = {1, 2, 3, 4} e B = {3, 4, 5, 6}. Qual é A ∩ B?',answers:['{1, 2}','{5, 6}','{1, 2, 3, 4, 5, 6}','{3, 4}'],correct:3,explain:'A interseção reúne somente os elementos que aparecem nos dois conjuntos: 3 e 4.'},
  {phase:'FASE 2 · INTERMEDIÁRIO',name:'Olho no diagrama!',text:'Observe o diagrama. Qual região representa a interseção A ∩ B?',answers:['Somente a região A','A região compartilhada pelos dois círculos','Somente a região B','Toda a área fora dos círculos'],correct:1,explain:'A interseção é a parte em comum entre A e B, onde estão os elementos compartilhados.',diagram:true},
  {phase:'FASE 3 · AVANÇADO',name:'Diferença',text:'A = {1, 2, 3, 4} e B = {3, 4, 5, 6}. Quanto vale A − B?',answers:['{1, 2}','{3, 4}','{5, 6}','{1, 2, 3, 4, 5, 6}'],correct:0,explain:'A − B contém os elementos que estão em A, mas não estão em B: 1 e 2.'},
  {phase:'FASE 3 · AVANÇADO',name:'Desafio da turma',text:'Em uma turma, 18 alunos gostam de futebol, 12 de basquete e 5 gostam dos dois. Quantos gostam de pelo menos um dos esportes?',answers:['30 alunos','25 alunos','35 alunos','20 alunos'],correct:1,explain:'Fazemos 18 + 12 − 5 = 25. Subtraímos os 5 porque eles foram contados nas duas modalidades.'},
  {phase:'FASE 3 · AVANÇADO',name:'O último desafio',text:'A = {a, b, c} e B = {d, e, f}. Como são chamados esses conjuntos?',answers:['Iguais','Unitários','Disjuntos','Infinitos'],correct:2,explain:'Eles são disjuntos porque não possuem nenhum elemento em comum.'}
];

const $ = id => document.getElementById(id);
let index = 0, scores = [0,0], team = 0, answered = false, timer = null, seconds = 20;
let names = ['Equipe Azul','Equipe Vermelha'];

function pointsFor(i) { return i < 3 ? 10 : i < 6 ? 20 : 30; }
function stopTimer() { if (timer) clearInterval(timer); timer = null; }
function updateScores() {
  $('scoreA').textContent = scores[0]; $('scoreB').textContent = scores[1];
}
function startGame() {
  names = [$('teamA').value.trim() || 'Equipe Azul', $('teamB').value.trim() || 'Equipe Vermelha'];
  $('labelA').textContent = names[0].toUpperCase();
  $('labelB').textContent = names[1].toUpperCase();
  $('setup').classList.add('hidden'); $('result').classList.add('hidden'); $('play').classList.remove('hidden');
  index = 0; scores = [0,0]; team = 0; updateScores(); renderQuestion();
}
function renderQuestion() {
  stopTimer(); answered = false; seconds = 20;
  const q = questions[index];
  $('level').textContent = q.phase; $('counter').textContent = `QUESTÃO ${index+1}/${questions.length}`;
  $('progressBar').style.width = `${(index+1)/questions.length*100}%`;
  $('questionName').textContent = q.name; $('questionText').textContent = q.text;
  $('points').textContent = `+${pointsFor(index)} pts`;
  $('turnLabel').textContent = `VEZ DE ${names[team].toUpperCase()}`;
  $('diagram').classList.toggle('hidden', !q.diagram);
  $('feedback').className = 'feedback hidden'; $('feedback').textContent = '';
  $('nextBtn').classList.add('hidden'); $('timerBtn').classList.remove('hidden');
  $('timerBtn').disabled = false; $('timerBtn').textContent = '⌛ INICIAR 20s';
  $('timerText').textContent = 'Cronômetro: pronto para iniciar';
  const letters = ['A','B','C','D'];
  $('answers').innerHTML = '';
  q.answers.forEach((answer,i) => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.innerHTML = `<span class="letter">${letters[i]}</span><span></span>`;
    button.querySelector('span:last-child').textContent = answer;
    button.addEventListener('click', () => chooseAnswer(i));
    $('answers').appendChild(button);
  });
}
function chooseAnswer(choice) {
  if (answered) return;
  answered = true; stopTimer();
  const q = questions[index], correct = choice === q.correct;
  if (correct) scores[team] += pointsFor(index);
  updateScores();
  [...$('answers').children].forEach((button,i) => {
    button.disabled = true;
    if (i === q.correct) button.classList.add('correct');
    else if (i === choice) button.classList.add('wrong');
  });
  $('feedback').className = `feedback ${correct ? 'good' : 'bad'}`;
  $('feedback').innerHTML = `<strong>${correct ? 'RESPOSTA CORRETA! +' + pointsFor(index) + ' PONTOS' : 'RESPOSTA INCORRETA!'}</strong><br>${q.explain}`;
  $('timerBtn').classList.add('hidden');
  $('nextBtn').classList.remove('hidden');
  $('nextBtn').textContent = index === questions.length-1 ? 'VER RESULTADO →' : 'PRÓXIMA QUESTÃO →';
}
function startTimer() {
  if (answered || timer) return;
  $('timerBtn').disabled = true;
  seconds = 20; $('timerText').textContent = `Tempo restante: ${seconds}s`;
  timer = setInterval(() => {
    seconds--;
    $('timerText').textContent = `Tempo restante: ${seconds}s`;
    if (seconds <= 0) {
      stopTimer();
      $('timerText').textContent = 'Tempo esgotado!';
      chooseTimeout();
    }
  },1000);
}
function chooseTimeout() {
  if (answered) return;
  answered = true;
  const q = questions[index];
  [...$('answers').children].forEach((button,i) => {
    button.disabled = true;
    if (i === q.correct) button.classList.add('correct');
  });
  $('feedback').className = 'feedback bad';
  $('feedback').innerHTML = `<strong>TEMPO ESGOTADO!</strong><br>${q.explain}`;
  $('timerBtn').classList.add('hidden'); $('nextBtn').classList.remove('hidden');
  $('nextBtn').textContent = index === questions.length-1 ? 'VER RESULTADO →' : 'PRÓXIMA QUESTÃO →';
}
function nextQuestion() {
  stopTimer();
  if (index === questions.length-1) return showResult();
  index++; team = 1-team; renderQuestion();
}
function showResult() {
  $('play').classList.add('hidden'); $('result').classList.remove('hidden');
  $('finalLabelA').textContent = names[0].toUpperCase(); $('finalLabelB').textContent = names[1].toUpperCase();
  $('finalScoreA').textContent = scores[0]; $('finalScoreB').textContent = scores[1];
  if (scores[0] === scores[1]) {
    $('winner').textContent = 'EMPATE!';
    $('resultMessage').textContent = 'As duas equipes tiveram a mesma pontuação. Grande partida!';
  } else {
    const winner = scores[0] > scores[1] ? 0 : 1;
    $('winner').textContent = `${names[winner].toUpperCase()} VENCEU!`;
    $('resultMessage').textContent = 'Parabéns! Vocês dominaram os conjuntos matemáticos.';
  }
}
$('startBtn').addEventListener('click', startGame);
$('timerBtn').addEventListener('click', startTimer);
$('nextBtn').addEventListener('click', nextQuestion);
$('restartBtn').addEventListener('click', () => {
  stopTimer(); $('result').classList.add('hidden'); $('setup').classList.remove('hidden');
});
