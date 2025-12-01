// Game data - Questions from Q_A file with correct answers
const questions = [
    {
        question: "شُيّد فيها مسجد على أنقاض معبد روماني وكنيسة بيزنطية؟",
        answer: "دمشق"
    },
    {
        question: "أجدد محافظة سورية",
        answer: "ريف دمشق"
    },
    {
        question: "سوقها يمتد لنحو 13 كم",
        answer: "حلب"
    },
    {
        question: "لم تقدر عليها قوة عظمى أثناء الثورة",
        answer: "إدلب"
    },
    {
        question: "ذكرت في التوراة سفر الملوك الثاني 14:25–26",
        answer: "حماة"
    },
    {
        question: "ولدت فيها الامبراطورة \"جوليا دومنا\"",
        answer: "حمص"
    },
    {
        question: "جبل العرب",
        answer: "السويداء"
    },
    {
        question: "محمود الجوابرة - حسام عياش",
        answer: "درعا"
    },
    {
        question: "معرض حي للدمار الذي خلفه الاحتلال",
        answer: "القنيطرة"
    },
    {
        question: "تقع ام الطنافس الفوقا في....",
        answer: "اللاذقية"
    },
    {
        question: "البر القريب من أرادوس؟",
        answer: "طرطوس"
    },
    {
        question: "كانت بشكل مؤقت عاصمة للخلافة العباسية",
        answer: "الرقة"
    },
    {
        question: "يقسمها نهر الفرات إلى \"الجزيرة\" و \"الشامية\"",
        answer: "دير الزور"
    },
    {
        question: "سلة غذاء سوريا",
        answer: "الحسكة"
    }
];

// Encryption keys
const encryptionKeys = [
    "08122024", // Key 1
    "18032011", // Key 2
    "17041946", // Key 3
    "15032011"  // Key 4
];

// Game state
let gameState = {
    currentQuestion: 0,
    score: 0,
    currentScreen: 'welcome-screen',
    correctAnswerObj: false
};

// DOM Elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    question: document.getElementById('question-screen'),
    encryption1: document.getElementById('encryption-screen-1'),
    encryption2: document.getElementById('encryption-screen-2'),
    encryption3: document.getElementById('encryption-screen-3'),
    encryption4: document.getElementById('encryption-screen-4'),
    win: document.getElementById('win-screen')
};

const elements = {
    titleText: document.getElementById('title-text'),
    startBtn: document.getElementById('start-btn'),
    questionScreen: document.getElementById("question-screen"),
    currentQuestionSpan: document.getElementById('current-question'),
    questionText: document.getElementById('question-text'),
    answerInput: document.getElementById('answer-input'),
    submitAnswer: document.getElementById('submit-answer'),
    nextBtn: document.getElementById('next-btn'),
    progress: document.getElementById('progress'),
    keyInput1: document.getElementById('key-input-1'),
    keyInput2: document.getElementById('key-input-2'),
    keyInput3: document.getElementById('key-input-3'),
    keyInput4: document.getElementById('key-input-4'),
    submitKey1: document.getElementById('submit-key-1'),
    submitKey2: document.getElementById('submit-key-2'),
    submitKey3: document.getElementById('submit-key-3'),
    submitKey4: document.getElementById('submit-key-4'),
    keyError1: document.getElementById('key-error-1'),
    keyError2: document.getElementById('key-error-2'),
    keyError3: document.getElementById('key-error-3'),
    keyError4: document.getElementById('key-error-4'),
    answerFeedback: document.getElementById('answer-feedback'),
    restartBtn: document.getElementById('restart-btn')
};

// Initialize game
function initGame() {    
    // Event listeners
    elements.startBtn.addEventListener('click', startGame);
    elements.nextBtn.addEventListener('click', nextQuestion);
    
    // Encryption key event listeners
    elements.submitKey1.addEventListener('click', () => checkEncryptionKey(1));
    elements.submitKey2.addEventListener('click', () => checkEncryptionKey(2));
    elements.submitKey3.addEventListener('click', () => checkEncryptionKey(3));
    elements.submitKey4.addEventListener('click', () => checkEncryptionKey(4));
    
    // Enter key for encryption inputs
    elements.keyInput1.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkEncryptionKey(1);
    });
    elements.keyInput2.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkEncryptionKey(2);
    });
    elements.keyInput3.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkEncryptionKey(3);
    });
    elements.keyInput4.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkEncryptionKey(4);
    });
    
    elements.restartBtn.addEventListener('click', resetGame);
    
    // Add answer submit event listeners
    elements.submitAnswer.addEventListener('click', submitAnswer);
    elements.answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitAnswer();
    });
}

// Start the game
function startGame() {
    showScreen('question-screen');
    loadQuestion();
    updateProgress();
}

// Show a specific screen
function showScreen(screenId) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the requested screen
    screens[getScreenKey(screenId)].classList.add('active');
    gameState.currentScreen = screenId;
}

// Get screen key from ID
function getScreenKey(screenId) {
    const keyMap = {
        'welcome-screen': 'welcome',
        'question-screen': 'question',
        'encryption-screen-1': 'encryption1',
        'encryption-screen-2': 'encryption2',
        'encryption-screen-3': 'encryption3',
        'encryption-screen-4': 'encryption4',
        'win-screen': 'win'
    };
    return keyMap[screenId] || 'welcome';
}

// Load current question
function loadQuestion() {
    if (gameState.currentQuestion >= questions.length) return;

    const question = questions[gameState.currentQuestion];
    elements.questionText.textContent = question.question;
    elements.currentQuestionSpan.textContent = gameState.currentQuestion + 1;

    // Reset answer input and feedback
    elements.answerInput.value = '';
    elements.answerInput.disabled = false;
    elements.answerFeedback.classList.add('hidden');
    elements.answerFeedback.classList.remove('correct', 'incorrect');

    gameState.answered = false;
    elements.nextBtn.classList.add('hidden');
}

// Submit answer
function submitAnswer() {
    if (gameState.answered) return;

    const userAnswer = elements.answerInput.value.trim();
    const correctAnswer = questions[gameState.currentQuestion].answer;

    // Check if answer is correct (case insensitive comparison)
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        elements.answerFeedback.textContent = 'صحيح';
        elements.answerFeedback.classList.remove('incorrect');
        elements.answerFeedback.classList.add('correct');
        gameState.answered = true;
        setTimeout(() => {
            elements.nextBtn.classList.remove('hidden');
        }, 1000);
        gameState.score++;
    } else {
        elements.answerFeedback.textContent = `الإجابة خاطئة`;
        elements.answerFeedback.classList.remove('correct');
        elements.answerFeedback.classList.add('incorrect');
        elements.answerFeedback.style.animation = 'shakeNormal 0.5s';
        setTimeout(() => {
            elements.answerFeedback.style.animation = '';
        }, 500);
    }

    elements.answerFeedback.classList.remove('hidden');
}

// Move to next question
function nextQuestion() {
    gameState.currentQuestion++;
    
    // Check specific questions for the "Hacked" state
    if (gameState.currentQuestion === 3 || 
        gameState.currentQuestion === 6 || 
        gameState.currentQuestion === 11 || 
        gameState.currentQuestion === questions.length) {
        
        // Show the specific encryption screen
        if (gameState.currentQuestion === 3) showScreen('encryption-screen-1');
        else if (gameState.currentQuestion === 6) showScreen('encryption-screen-2');
        else if (gameState.currentQuestion === 11) showScreen('encryption-screen-3');
        else showScreen('encryption-screen-4');

        elements.titleText.textContent = "تم اختراق البرنامج";
        elements.titleText.style.color = "#ff0000ff";

        // FIX: Add the class instead of setting URL directly
        document.body.classList.add('hacked-mode');
        
    } else {
        loadQuestion();
        updateProgress();
    }
}

// Check encryption key
function checkEncryptionKey(keyNumber) {
    let inputElement, errorElement, expectedKey, nextScreen;
    
    switch(keyNumber) {
        case 1:
            inputElement = elements.keyInput1;
            errorElement = elements.keyError1;
            expectedKey = encryptionKeys[0];
            nextScreen = 'question-screen';
            break;
        case 2:
            inputElement = elements.keyInput2;
            errorElement = elements.keyError2;
            expectedKey = encryptionKeys[1];
            nextScreen = 'question-screen';
            break;
        case 3:
            inputElement = elements.keyInput3;
            errorElement = elements.keyError3;
            expectedKey = encryptionKeys[2];
            nextScreen = 'question-screen';
            break;
        case 4:
            inputElement = elements.keyInput4;
            errorElement = elements.keyError4;
            expectedKey = encryptionKeys[3];
            nextScreen = 'win-screen';
            break;
    }
    
    const enteredKey = inputElement.value.trim();
    
    if (enteredKey === expectedKey) {
        // Reset the input and hide error
        inputElement.value = '';
        errorElement.classList.add('hidden');

        document.body.classList.remove('hacked-mode');
        
        if (keyNumber === 4) {
            // For the final key, show the win screen
            showScreen(nextScreen);
        } else {
            // Update the question number to the next one after the key requirement
            if (keyNumber === 1) gameState.currentQuestion = 3; 
            else if (keyNumber === 2) gameState.currentQuestion = 6; 
            else if (keyNumber === 3) gameState.currentQuestion = 11; 
            
            loadQuestion();
            updateProgress();
            showScreen(nextScreen);
            elements.titleText.textContent = "لغز المحافظات السورية";
            elements.titleText.style.color = "#ffffff"; 
        }
    } else {
        // Show error
        errorElement.classList.remove('hidden');
        // Shake animation for error
        inputElement.style.animation = 'shake 0.5s';
        setTimeout(() => {
            inputElement.style.animation = '';
        }, 500);
    }
}

// Update progress bar
function updateProgress() {
    const progressPercent = ((gameState.currentQuestion) / questions.length) * 100;
    elements.progress.style.width = `${progressPercent}%`;
}

// Reset game
function resetGame() {
    gameState = {
        currentQuestion: 0,
        score: 0,
        currentScreen: 'welcome-screen',
        answered: false
    };
    
    // FIX: Remove hacked mode class
    document.body.classList.remove('hacked-mode');
    
    // Reset title color
    elements.titleText.textContent = "لغز المحافظات السورية";
    elements.titleText.style.color = "#ffffff";

    showScreen('welcome-screen');
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add shake animation to the style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes shakeNormal {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
    `;
    document.head.appendChild(style);
    
    initGame();
});