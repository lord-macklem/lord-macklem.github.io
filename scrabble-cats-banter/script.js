const bgCheckers = document.getElementById("bgcheckers");;
const menu = document.getElementById("menu");
const howItWorks = document.getElementById("how-it-works");
const game = document.getElementById("game");
var bgx = 0;

function moveBackground() {
    if (bgx >= 500) {
        bgx = 0;
    } else {
        bgx += 1;
    }
    bgCheckers.style.backgroundPositionX = bgx+"px";
}
setInterval(moveBackground, 15);

function openMenu() {
    menu.style.display = "block";
    howItWorks.style.display = "none";
    game.style.display = "none";
}

function openHowItWorks() {
    menu.style.display = "none";
    howItWorks.style.display = "block";
    game.style.display = "none";
}

function openGame() {
    menu.style.display = "none";
    howItWorks.style.display = "none";
    game.style.display = "block";
    startGame();
}




const introWindow = document.getElementById("game-intro");
const introCountdownDisplay = document.getElementById("intro-countdown-display");

const roundWindow = document.getElementById("game-round");
const roundNumberDisplay = document.getElementById("round-number-display");
const guessCountdownDisplay = document.getElementById("guess-countdown-display");
const guessInput = document.getElementById("guess-input");

const roundSummaryWindow = document.getElementById("game-round-summary");
const roundScoreDisplay = document.getElementById("round-score-display");
const roundScoreBreakdownDisplay = document.getElementById("round-score-breakdown-display");
const encouragementText = document.getElementById("encouragement-text");
const nextRoundOrResultsText = document.getElementById("next-round-or-results-text");
const nextRoundCountdownDisplay = document.getElementById("next-round-countdown-display");

const summaryWindow = document.getElementById("game-summary");
const congratulationsText = document.getElementById("congratulations-text");
const highscoreDiv = document.getElementById("highscore-div");
const highscoreDisplay = document.getElementById("highscore-display");

var introCountdown = 0;
var introCountdownInterval;

var guessCountdown = 0;
var guessCountdownInterval;

var nextRoundCountdown = 0;
var nextRoundCountdownInterval;

var score = 0;
var roundID = 0;


var gameClock = 0;
var SCBDictionary = loadDictionary();

async function loadDictionary() {
    let x = await fetch("dictionary.json");
    let y = await x.json();
    return y;
}

function startGame() {
    roundID = 0;
    score = 0;
    summaryWindow.style.display = "none";
    introWindow.style.display = "block";
    introCountdown = 5;
    introCountdownDisplay.innerHTML = "5";
    introCountdownInterval = window.setInterval(decrementIntroCountdown, 1000);
}

function decrementIntroCountdown() {
    if (introCountdown > 1) {
        introCountdown -= 1;
        introCountdownDisplay.innerHTML = introCountdown;
    } else {
        window.clearInterval(introCountdownInterval);
        introWindow.style.display = "none";
        beginNextRound();
    }
}

function beginNextRound() {
    roundID ++;
    roundNumberDisplay.innerHTML = roundID;
    guessCountdown = 15;
    guessCountdownDisplay.innerHTML = "15";
    guessInput.value = "";
    roundWindow.style.display = "block";
    guessInput.focus();
    guessCountdownInterval = window.setInterval(decrementGuessCountdown, 1000);
}

function decrementGuessCountdown() {
    if (guessCountdown > 1) {
        guessCountdown -= 1;
        guessCountdownDisplay.innerHTML = guessCountdown;
    } else {
        submitGuess();
    }
}

guessInput.addEventListener("keypress", function(event) {
    if (event.key == "Enter") {
        submitGuess();
    }
});

function submitGuess() {
    window.clearInterval(guessCountdownInterval);
    roundWindow.style.display = "none";
    displayRoundSummary();
}

function displayRoundSummary() {
    if (roundID < 10) {
        nextRoundOrResultsText.innerHTML = "Next round";
    } else {
        nextRoundOrResultsText.innerHTML = "Results";
    }
    nextRoundCountdown = 5;
    nextRoundCountdownDisplay.innerHTML = "5";
    roundSummaryWindow.style.display = "block";
    nextRoundCountdownInterval = window.setInterval(decrementNextRoundCountdown, 1000);
}

function decrementNextRoundCountdown() {
    if (nextRoundCountdown > 1) {
        nextRoundCountdown -= 1;
        nextRoundCountdownDisplay.innerHTML = nextRoundCountdown;
    } else {
        window.clearInterval(nextRoundCountdownInterval);
        roundSummaryWindow.style.display = "none";
        if (roundID < 10) {
            beginNextRound();
        } else {
            displayGameSummary();
        }
    }
}

function displayGameSummary() {
    summaryWindow.style.display = "block";
}