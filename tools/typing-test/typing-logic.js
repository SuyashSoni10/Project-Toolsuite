'use strict';

const textDisplay = document.getElementById('text-display');
const hiddenInput = document.getElementById('hidden-input');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const speedGauge = document.getElementById('speed-gauge');
const scoreList = document.getElementById('score-list');

const sampleTexts = [
    "Digital circuits rely on logic gates to process binary information effectively.",
    "Calculus provides the mathematical framework for understanding change and motion.",
    "Efficient algorithms are the backbone of high-frequency trading systems.",
    "Clean code and consistent version control are essential for open source projects."
];

let timer = 60;
let interval = null;
let isStarted = false;
let charIndex = 0;
let mistakes = 0;

let totalTyped = 0;
let totalMistakes = 0;

// 1. Leaderboard Logic
function updateLeaderboard(wpm, acc) {
    let scores = JSON.parse(localStorage.getItem('typing_scores')) || [];
    scores.push({ wpm, acc, date: new Date().toLocaleDateString() });
    scores.sort((a, b) => b.wpm - a.wpm);
    scores = scores.slice(0, 5); // Keep top 5
    localStorage.setItem('typing_scores', JSON.stringify(scores));
    renderLeaderboard();
}

function renderLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('typing_scores')) || [];
    scoreList.innerHTML = scores.map(s => `
        <div class="score-row">
            <span>${s.wpm} WPM (${s.acc}%)</span>
            <span>${s.date}</span>
        </div>
    `).join('') || '<p>No scores yet. Start typing!</p>';
}

function loadNewSentence() {
    const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

    textDisplay.innerHTML = text
        .split("")
        .map(c => `<span class="char">${c}</span>`)
        .join("");

    const firstChar = textDisplay.querySelector('.char');
    if (firstChar) {
        firstChar.classList.add('current');
    }

    charIndex = 0;
    hiddenInput.value = "";
}

// 2. Test Logic
function initTest() {
    clearInterval(interval);

    timer = 60;
    charIndex = 0;
    mistakes = 0;
    totalTyped = 0;
    totalMistakes = 0;
    isStarted = false;

    wpmDisplay.innerText = "0";
    accuracyDisplay.innerText = "100%";
    timerDisplay.innerText = "60s";
    speedGauge.style.width = "0%";
    hiddenInput.value = "";
    hiddenInput.disabled = false;

    loadNewSentence();
    renderLeaderboard();
}

hiddenInput.addEventListener('input', () => {
    const chars = textDisplay.querySelectorAll('.char');

    if (!isStarted) {
        startTimer();
        isStarted = true;
    }

    const inputLen = hiddenInput.value.length;

    // Handle backspace
    if (inputLen < charIndex) {
        while (charIndex > inputLen) {
            charIndex--;
            totalTyped--;

            if (chars[charIndex].classList.contains('incorrect')) {
                mistakes--;
                totalMistakes--;
                chars[charIndex].classList.add('was-incorrect');
            }

            chars[charIndex].classList.remove('correct', 'incorrect');

            if (chars[charIndex + 1]) {
                chars[charIndex + 1].classList.remove('current');
            }
        }

        chars[charIndex].classList.add('current');
        calculateStats();
        return;
    }

    const typedChar = hiddenInput.value[charIndex];
    if (typedChar == null) return;

    if (typedChar === chars[charIndex].innerText) {
        chars[charIndex].classList.add('correct');
    } else {
        mistakes++;
        totalMistakes++;
        chars[charIndex].classList.add('incorrect');
    }

    totalTyped++;

    chars[charIndex].classList.remove('current');
    charIndex++;

    if (charIndex < chars.length) {
        chars[charIndex].classList.add('current');
    } else {
        // Sentence completed → load another one
        loadNewSentence();
    }

    calculateStats();
});

function startTimer() {
    interval = setInterval(() => {
        if (timer > 0) {
            timer--;
            timerDisplay.innerText = timer + "s";
            calculateStats();
        } else { finishTest(); }
    }, 1000);
}

function calculateStats() {
    const timeElapsed = (60 - timer) || 1;

    const correctChars = totalTyped - totalMistakes;

    const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));

    const acc = totalTyped === 0
        ? 100
        : Math.round((correctChars / totalTyped) * 100);

    wpmDisplay.innerText = wpm || 0;
    accuracyDisplay.innerText = acc + "%";

    const gaugeWidth = Math.min((wpm / 80) * 100, 100);
    speedGauge.style.width = gaugeWidth + "%";
}

function finishTest() {
    clearInterval(interval);
    hiddenInput.disabled = true;

    updateLeaderboard(
        parseInt(wpmDisplay.innerText),
        parseInt(accuracyDisplay.innerText)
    );
}

document.addEventListener('click', () => hiddenInput.focus());
document.getElementById('reset-btn').onclick = () => {
    hiddenInput.disabled = false;
    initTest();
    hiddenInput.focus();
};

initTest();