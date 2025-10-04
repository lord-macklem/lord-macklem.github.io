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



//Intro window
const introWindow = document.getElementById("game-intro");
const introCountdownDisplay = document.getElementById("intro-countdown-display");

//Round window
const roundWindow = document.getElementById("game-round");
const roundNumberDisplay = document.getElementById("round-number-display");
const rule1Display = document.getElementById("rule-1-display");
const rule2Display = document.getElementById("rule-2-display");
const guessCountdownDisplay = document.getElementById("guess-countdown-display");
const guessInput = document.getElementById("guess-input");

//Round summary window
const roundSummaryWindow = document.getElementById("game-round-summary");
const roundSummaryHappyCat = document.getElementById("rs-happy-cat");
const roundSummaryThumbsUpCat = document.getElementById("rs-thumbs-up-cat");
const roundSummarySadCat = document.getElementById("rs-sad-cat");
const roundScoreDiv = document.getElementById("round-score-div");
const roundScoreDisplay = document.getElementById("round-score-display");
const roundScoreBreakdownDisplay = document.getElementById("round-score-breakdown-display");
const encouragementText = document.getElementById("encouragement-text");
const nextRoundOrResultsText = document.getElementById("next-round-or-results-text");
const nextRoundCountdownDisplay = document.getElementById("next-round-countdown-display");

//Game summary window
const summaryWindow = document.getElementById("game-summary");
const gameSummaryHappyCat = document.getElementById("gs-happy-cat");
const gameSummaryThumbsUpCat = document.getElementById("gs-thumbs-up-cat");
const gameSummarySadCat = document.getElementById("gs-sad-cat");
const scoreDisplay = document.getElementById("score-display");
const congratulationsText = document.getElementById("congratulations-text");
const highscoreDiv = document.getElementById("highscore-div");
const highscorePreviousDisplay = document.getElementById("highscore-previous-display");
const highscoreDisplay = document.getElementById("highscore-display");
const highscoreDateDisplay = document.getElementById("highscore-date-display");

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var introCountdown = 0;
var introCountdownInterval;

var guessCountdown = 0;
var guessCountdownInterval;

var nextRoundCountdown = 0;
var nextRoundCountdownInterval;
var score = 0;
var guess = "";
var valid = false;
var catSimilarity = 0;
var roundID = 0;
var ruleID = 0;
var rule1Type = 0;
var rule2Type = 0;
const ruleNames = ["STARTS WITH","MUST HAVE","CAN'T HAVE","ENDS IN"];

var SCBDictionary;
loadDictionary();
var rules;
loadRules();

var highscore;
var highscoreDate;

async function loadDictionary() {
    let x = await fetch("dictionary.json");
    let y = await x.json();
    dictionary = y;
}

async function loadRules() {
    let x = await fetch("rules.json");
    let y = await x.json();
    rules = y;
}

function loadHighscore() {
    if (localStorage.getItem("highscore") != null) {
        highscore = parseInt(localStorage.getItem("highscore"));
        highscoreDate = localStorage.getItem("highscoreDate");
    } else {
        highscore = -1;
        highscoreDate = "Never";
    }
}

//Begins the game, displaying the intro countdown
function startGame() {
    roundID = 0;
    score = 0;
    loadHighscore();
    summaryWindow.style.display = "none";
    introWindow.style.display = "block";
    introCountdown = 5;
    introCountdownDisplay.innerHTML = "5";
    introCountdownInterval = window.setInterval(decrementIntroCountdown, 1000);
}

//Decrement intro countdown for first round
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

//Begin a round
function beginNextRound() {
    roundID ++;
    ruleID = Math.floor(Math.random()*10)+(roundID-1)*10;
    rule1Type = rules["rule1Type"][ruleID];
    rule2Type = rules["rule2Type"][ruleID];
    rule1Letters = rules["rule1Letters"][ruleID];
    rule2Letters = rules["rule2Letters"][ruleID];
    roundNumberDisplay.innerHTML = roundID;
    rule1Display.innerHTML = ruleNames[rule1Type]+" \""+rule1Letters.toUpperCase()+"\", ";
    rule2Display.innerHTML = ruleNames[rule2Type]+" \""+rule2Letters.toUpperCase()+"\"";
    rule1Display.style.opacity = 1.0;
    rule2Display.style.opacity = 1.0;
    guessCountdown = 15;
    guessCountdownDisplay.innerHTML = "15";
    guessInput.value = "";
    roundWindow.style.display = "block";
    guessInput.focus();
    guessCountdownInterval = window.setInterval(decrementGuessCountdown, 1000);
}

function checkRules(guess) {
    return (checkRule(rule1Type, rule1Letters, guess) && checkRule(rule2Type, rule2Letters, guess));
}

function checkRule(type, letters, guess) {
    if (type==0) {
        return guess.startsWith(letters);
    }
    if (type==1) {
        return guess.includes(letters);
    }
    if (type==2) {
        return !guess.includes(letters);
    }
    if (type==3) {
        return guess.endsWith(letters);
    }
}

//Checks word guess against rules, greying out those which are fulfilled
function checkGuess() {
    guess = guessInput.value.toLowerCase();
    if (guess == "") {
        rule1Display.style.opacity = 1.0;
        rule2Display.style.opacity = 1.0;
    } else {
        if (checkRule(rule1Type, rule1Letters, guess)) {
            rule1Display.style.opacity = 0.5;
        } else {
            rule1Display.style.opacity = 1.0;
        }
        if (checkRule(rule2Type, rule2Letters, guess)) {
            rule2Display.style.opacity = 0.5;
        } else {
            rule2Display.style.opacity = 1.0;
        }
    }
}


//Detect enter key for submitting guess early
guessInput.addEventListener("keypress", function(event) {
    if (event.key == "Enter" && guessInput.value != "" && checkRules(guessInput.value.toLowerCase())) {
        submitGuess();
    }
});

//Countdown to end of round
function decrementGuessCountdown() {
    if (guessCountdown > 1) {
        guessCountdown -= 1;
        guessCountdownDisplay.innerHTML = guessCountdown;
    } else {
        submitGuess();
    }
}

//Submits word guess, ending round
function submitGuess() {
    guess = guessInput.value.toLowerCase();
    var cosineSimilarity = dictionary[guess]
    if (cosineSimilarity == undefined || !checkRules(guess)) {
        valid = false;
        catSimilarity = 0;
    } else {
        valid = true;
        catSimilarity = Math.round(cosineSimilarity*100);
        score += 10 + catSimilarity;
    }
    window.clearInterval(guessCountdownInterval);
    roundWindow.style.display = "none";
    displayRoundSummary();
}

//Displays round summary page
function displayRoundSummary() {
    roundScoreDisplay.innerHTML = score;
    var catTier;
    if (!valid) {
        catTier = 0;
        roundScoreDiv.style.color = "#FF7F7F";
        roundScoreBreakdownDisplay.innerHTML = "Invalid word, no points :("
        encouragementText.innerHTML = "Don't give up! You can do it, little kitty!";
    } else {
        roundScoreBreakdownDisplay.innerHTML = "Valid word: +10, Cat similarity: +"+catSimilarity;
        if (catSimilarity >= 40) {
            roundScoreDiv.style.color = "#84E291";
            catTier = 2;
            encouragementText.innerHTML = "Purrfection! You're the cat's meow!";
        } else {
            roundScoreDiv.style.color = "#FFFF4C";
            catTier = 1;
            encouragementText.innerHTML = "Not bad! Keep going, paws-itively awesome!";
        }
    }
    roundSummaryHappyCat.style.display = (catTier == 2)? "block" : "none";
    roundSummaryThumbsUpCat.style.display = (catTier == 1)? "block" : "none";
    roundSummarySadCat.style.display = (catTier == 0)? "block" : "none";
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

//Cooldown from round summary to next round (or results)
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

function saveHighscore() {
    localStorage.setItem("highscore", score);
    var date = new Date();
    var dateString = weekdays[date.getDay()]+" "+date.getDate()+" "+months[date.getMonth()]+" "+date.getFullYear();
    localStorage.setItem("highscoreDate", dateString);
}

//Displays game summary (results)
function displayGameSummary() {
    scoreDisplay.innerHTML = score;
    var catTier = 0;
    if (highscore == -1) { //No highscore set
        highscoreDiv.style.display = "none";
        saveHighscore();
    } else {
        highscoreDiv.style.display = "block";
        highscoreDisplay.innerHTML = highscore;
        highscoreDateDisplay.innerHTML = highscoreDate;
        if (score > highscore) { //Do we say "your highscore" or "your previous highscore"
            highscorePreviousDisplay.style.display = "inline";
            saveHighscore();
        } else {
            highscorePreviousDisplay.style.display = "none";
        }
    }
    if (highscore > -1 && score > highscore) { //If we got a new highscore, automatic happy cat
        catTier = 2;
        congratulationsText.innerHTML = "That's a new highscore!"
    } else if (score < 200) { // 0 - 199
        catTier = 0;
        congratulationsText.innerHTML = "You can do better next time, I believe in you!"
    } else if (score < 300) { // 200 - 299
        catTier = 1;
        congratulationsText.innerHTML = "Not bad!"
    } else if (score < 400) { // 300 - 399
        catTier = 2;
        congratulationsText.innerHTML = "Well done!"
    } else { // 400+
        catTier = 2;
        congratulationsText.innerHTML = "That's a-meow-zing!"
    }
    gameSummaryHappyCat.style.display = (catTier == 2)? "block" : "none";
    gameSummaryThumbsUpCat.style.display = (catTier == 1)? "block" : "none";
    gameSummarySadCat.style.display = (catTier == 0)? "block" : "none";
    summaryWindow.style.display = "block";
}