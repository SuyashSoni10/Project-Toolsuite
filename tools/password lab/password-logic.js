'use strict';

const passInput = document.getElementById('passInput');
const meterBar = document.getElementById('meter-bar');
const statusText = document.getElementById('status-text');
const entropyVal = document.getElementById('entropy-val');
const poolVal = document.getElementById('pool-val');
const timeVal = document.getElementById('time-val');
const vulnsDiv = document.getElementById('vulnerabilities');

passInput.addEventListener('input', analyze);

function analyze() {
    const val = passInput.value;
    if (!val) return reset();

    let pool = 0;
    if (/[a-z]/.test(val)) pool += 26;
    if (/[A-Z]/.test(val)) pool += 26;
    if (/[0-9]/.test(val)) pool += 10;
    if (/[^A-Za-z0-9]/.test(val)) pool += 32;

    // Calculate Raw Entropy
    let entropy = val.length * Math.log2(pool);
    
    // PATTERN PENALTIES
    const issues = [];
    if (/^[A-Z][a-z]+[0-9]$/.test(val)) {
        entropy -= 10; 
        issues.push("Common 'Capital + word + number' pattern.");
    }
    if (/(.)\1\1/.test(val)) {
        entropy -= 15;
        issues.push("Repeated characters (aaa) are easy to guess.");
    }
    if (/123|abc|qwerty|asdf/i.test(val)) {
        entropy -= 20;
        issues.push("Common keyboard sequences detected.");
    }

    // Ensure entropy doesn't go below 0
    entropy = Math.max(0, entropy);

    updateDisplay(val, entropy, pool, issues);
}

function updateDisplay(val, entropy, pool, issues) {
    // UI Colors based on Entropy
    // UI state based on Entropy
let color = "var(--status-critical)";
let status = "CRITICAL";
let statusClass = "status-critical";

if (entropy > 40) {
    color = "var(--status-weak)";
    status = "WEAK";
    statusClass = "status-weak";
}

if (entropy > 60) {
    color = "var(--status-fair)";
    status = "FAIR";
    statusClass = "status-fair";
}

if (entropy > 80) {
    color = "var(--status-strong)";
    status = "STRONG";
    statusClass = "status-strong";
}

if (entropy > 110) {
    color = "var(--status-elite)";
    status = "ELITE";
    statusClass = "status-elite";
}

    meterBar.style.width = Math.min(entropy, 100) + "%";
meterBar.style.backgroundColor = color;

statusText.innerText = `STATUS: ${status}`;

// Remove any previous status class
statusText.classList.remove(
    "status-critical",
    "status-weak",
    "status-fair",
    "status-strong",
    "status-elite"
);

// Apply the new one
statusText.classList.add(statusClass);
statusText.style.color = color;

    entropyVal.innerText = Math.floor(entropy) + " bits";
    poolVal.innerText = pool;
    
    // Crack Time: Assumes 100 Trillion guesses/sec (Modern GPU Cluster)
    const seconds = Math.pow(2, entropy) / 1e14;
    timeVal.innerText = formatTime(seconds);
    
    timeVal.classList.remove("time-danger", "time-safe");

if (entropy < 60) {
    timeVal.classList.add("time-danger");
} else {
    timeVal.classList.add("time-safe");
}

    vulnsDiv.innerHTML = issues.length ? 
        issues.map(i => `<div class="issue">${i}</div>`).join('') : 
        "No obvious patterns detected. Good.";
}

function formatTime(s) {
    if (s < 1) return "Instant";
    if (s < 60) return Math.floor(s) + "s";
    if (s < 3600) return Math.floor(s/60) + "m";
    if (s < 86400) return Math.floor(s/3600) + "h";
    if (s < 31536000) return Math.floor(s/86400) + "d";
    if (s < 31536000000) return Math.floor(s/31536000) + " years";
    return "Centuries";
}

function reset() {
    meterBar.style.width = "0%";
    meterBar.style.backgroundColor = "";

    statusText.innerText = "STATUS: WAITING";

    statusText.classList.remove(
        "status-critical",
        "status-weak",
        "status-fair",
        "status-strong",
        "status-elite"
    );

    statusText.style.color = "";

    entropyVal.innerText = "0 bits";
    poolVal.innerText = "0";

    timeVal.innerText = "Instant";
    timeVal.classList.remove("time-danger", "time-safe");
    timeVal.style.color = "";

    vulnsDiv.innerHTML = "No patterns detected.";
}
