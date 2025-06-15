const GAME_TIME_LIMIT = 20; // seconds
const TARGET_SCORE = 15;

const screens = document.querySelectorAll('.screen');
const choose_flower_btns = document.querySelectorAll('.choose-flower-btn');
const start_btn = document.getElementById('start-btn');
const game_area = document.getElementById('game-area');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');
const messageText = document.getElementById('message-text');
const restart_btn = document.getElementById('restart-btn');

let seconds = 0;
let score = 0;
let selected_flower = {};
let timerInterval = null;
let gameActive = false;

function showScreen(idx) {
  screens.forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });
}

start_btn.addEventListener('click', () => showScreen(1));

choose_flower_btns.forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    selected_flower = {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt')
    };
    showScreen(2);
    setTimeout(() => {
      startGame();
      createFlower();
    }, 600);
  });
});

function startGame() {
  seconds = 0;
  score = 0;
  timeEl.textContent = 'Time: 00:00';
  scoreEl.textContent = 'Score: 0';
  message.classList.remove('visible');
  restart_btn.style.display = "none";
  game_area.innerHTML = '';
  gameActive = true;
  timerInterval = setInterval(increaseTime, 1000);
}

function increaseTime() {
  seconds++;
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  timeEl.textContent = `Time: ${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  if (seconds >= GAME_TIME_LIMIT) {
    gameOver();
  }
}

function createFlower() {
  if (!gameActive) return;
  const flower = document.createElement('div');
  flower.classList.add('flower');
  const { x, y } = getRandomLocation();
  flower.style.top = `${y}px`;
  flower.style.left = `${x}px`;
  flower.innerHTML = `<img src="${selected_flower.src}" alt="${selected_flower.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;
  flower.addEventListener('click', catchFlower);
  game_area.appendChild(flower);
}

function getRandomLocation() {
  const areaRect = game_area.getBoundingClientRect();
  const maxX = areaRect.width - 100;
  const maxY = areaRect.height - 100;
  const x = Math.random() * maxX + 50;
  const y = Math.random() * maxY + 50;
  return { x, y };
}

function catchFlower(e) {
  if (!gameActive) return;
  increaseScore();
  this.classList.add('caught');
  setTimeout(() => this.remove(), 400);
  addFlowers();
}

function addFlowers() {
  setTimeout(createFlower, 700);
  setTimeout(createFlower, 1200);
}

function increaseScore() {
  score++;
  scoreEl.textContent = `Score: ${score}`;
  // Agar user target score pehle hi achieve kar le to turant jeet dikhayein
  if (score >= TARGET_SCORE && seconds <= GAME_TIME_LIMIT) {
    winGame();
  }
}

function winGame() {
  gameActive = false;
  clearInterval(timerInterval);
  game_area.innerHTML = '';
  messageText.innerHTML = `<strong>Congratulations! 🎉</strong><br>You caught <span style="color:var(--accent);font-size:1.3em;">${score}</span> flowers in <span style="color:var(--accent);font-size:1.3em;">${seconds}</span> seconds.<br><b>You Win!</b>`;
  message.classList.add('visible');
  restart_btn.style.display = "inline-block";
}

function gameOver() {
  gameActive = false;
  clearInterval(timerInterval);
  game_area.innerHTML = '';
  if (score >= TARGET_SCORE) {
    // Agar 20 sec me 15 ya usse zyada catch ho gaye, to winGame call ho chuka hoga
    return;
  }
  messageText.innerHTML = `<strong>Game Over!</strong><br>You only caught <span style="color:var(--accent);font-size:1.3em;">${score}</span> flowers.<br><b>Try Again!</b>`;
  message.classList.add('visible');
  restart_btn.style.display = "inline-block";
}

restart_btn.addEventListener('click', () => {
  showScreen(0);
  setTimeout(() => {
    screens[0].classList.add('active');
  }, 200);
});

window.addEventListener('resize', () => {
  // Optionally, reposition flowers on resize
});

showScreen(0);
