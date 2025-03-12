// DOM Elements
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

// Game Variables
let score = 0;
let currentQuestion = {};
let timerInterval;
let secondsElapsed = 0;
let isGameActive = false;
let waitingForNextQuestion = false; // Flag to track waiting state

// Toggle game elements based on game state
function toggleGameElements(state) {
    answerInput.disabled = !state;
    submitButton.disabled = !state;
    startBtn.disabled = state;
    stopBtn.disabled = !state;
}

// Initialize game
function initGame() {
    score = 0;
    secondsElapsed = 0;
    isGameActive = true;
    waitingForNextQuestion = false;
    scoreElement.textContent = score;
    updateTimer();
    startTimer();
    generateNewQuestion();
    answerInput.value = '';
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
    toggleGameElements(true);
    answerInput.focus();
}

// Stop game
function stopGame() {
    isGameActive = false;
    waitingForNextQuestion = false;
    clearInterval(timerInterval);
    toggleGameElements(false);
    questionElement.textContent = "Game Stopped!";
    
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    const timeString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    feedbackElement.textContent = `Final Score: ${score} | Time: ${timeString}`;
    feedbackElement.className = 'feedback';
}

// Generate a new random calculation question
function generateNewQuestion() {
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
    waitingForNextQuestion = false;
    
    const difficultyFactor = Math.min(Math.floor(score / 10) + 1, 5);
    let operationPool = ['+', '+', '-', '-'];
    if (difficultyFactor >= 2) operationPool.push('*', '*');
    if (difficultyFactor >= 3) operationPool.push('/');
    if (difficultyFactor >= 4) operationPool.push('*', '/');
    
    const operation = operationPool[Math.floor(Math.random() * operationPool.length)];
    let num1, num2, answer;
    
    switch (operation) {
        case '+':
            num1 = Math.floor(Math.random() * (20 * difficultyFactor)) + 1;
            num2 = Math.floor(Math.random() * (20 * difficultyFactor)) + 1;
            answer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * (20 * difficultyFactor)) + (10 * difficultyFactor);
            num2 = Math.floor(Math.random() * (10 * difficultyFactor)) + 1;
            if (num2 > num1) [num1, num2] = [num2, num1];
            answer = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(Math.random() * (4 + difficultyFactor)) + 1;
            num2 = Math.floor(Math.random() * (4 + difficultyFactor)) + 1;
            answer = num1 * num2;
            break;
        case '/':
            num2 = Math.floor(Math.random() * (5 + difficultyFactor)) + 1;
            answer = Math.floor(Math.random() * (5 + difficultyFactor)) + 1;
            num1 = num2 * answer;
            break;
    }
    
    currentQuestion = { text: `${num1} ${operation} ${num2}`, answer: answer };
    questionElement.textContent = currentQuestion.text;
    
    // Make sure input is enabled when new question is presented
    answerInput.disabled = false;
    submitButton.disabled = false;
}

// Check the user's answer
function checkAnswer() {
    if (!isGameActive || waitingForNextQuestion) return;
    
    const userAnswer = parseInt(answerInput.value);
    
    if (isNaN(userAnswer)) {
        feedbackElement.textContent = 'Please enter a valid number!';
        feedbackElement.className = 'feedback incorrect';
        answerInput.value = '';
        answerInput.focus();
        return;
    }
    
    if (userAnswer === currentQuestion.answer) {
        score++;
        scoreElement.textContent = score;
        feedbackElement.textContent = 'Correct!';
        feedbackElement.className = 'feedback correct';
        
        // Set waiting state and disable inputs
        waitingForNextQuestion = true;
        answerInput.disabled = true;
        submitButton.disabled = true;
        
        setTimeout(() => {
            generateNewQuestion();
            answerInput.value = '';
            answerInput.focus();
        }, 500);
    } else {
        feedbackElement.textContent = `Incorrect! The answer was ${currentQuestion.answer}.`;
        feedbackElement.className = 'feedback incorrect';
        
        // Set waiting state and disable inputs
        waitingForNextQuestion = true;
        answerInput.disabled = true;
        submitButton.disabled = true;
        
        setTimeout(() => {
            generateNewQuestion();
            answerInput.value = '';
            answerInput.focus();
        }, 1500);
    }
}

// Timer functions
function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        updateTimer();
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Event Listeners
startBtn.addEventListener('click', initGame);
stopBtn.addEventListener('click', stopGame);
submitButton.addEventListener('click', checkAnswer);

answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});

answerInput.addEventListener('paste', (e) => {
    e.preventDefault();
    feedbackElement.textContent = 'Pasting is not allowed!';
    feedbackElement.className = 'feedback incorrect';
});

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    toggleGameElements(false);
    questionElement.textContent = "Press Start to begin!";
});
