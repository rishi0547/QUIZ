// ═══════════════════════════════════════════════════════════════
// PROFESSIONAL QUIZ APPLICATION - PRODUCTION READY
// ═══════════════════════════════════════════════════════════════

// Quiz Data with Explanations
const quizData = [
    {
        q: "HTML stands for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlinks Text Mark Language",
            "None of these"
        ],
        ans: 0,
        explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
    },
    {
        q: "CSS is used for?",
        options: [
            "Database",
            "Logic",
            "Styling",
            "Networking"
        ],
        ans: 2,
        explanation: "CSS (Cascading Style Sheets) is used for styling and designing the visual presentation of web pages."
    },
    {
        q: "Which tag is used for JavaScript?",
        options: ["<js>", "<script>", "<javascript>", "<code>"],
        ans: 1,
        explanation: "The <script> tag is used to embed or reference JavaScript code in HTML documents."
    },
    {
        q: "Which company developed Java?",
        options: ["Google", "Microsoft", "Sun Microsystems", "Apple"],
        ans: 2,
        explanation: "Java was originally developed by Sun Microsystems (now owned by Oracle Corporation)."
    },
    {
        q: "HTML is a ____ language?",
        options: ["Programming", "Markup", "Styling", "Database"],
        ans: 1,
        explanation: "HTML is a markup language, not a programming language. It structures content but doesn't perform logic."
    },
    {
        q: "CSS stands for?",
        options: [
            "Creative Style Sheets",
            "Cascading Style Sheets",
            "Colorful Style Sheets",
            "Computer Style Sheets"
        ],
        ans: 1,
        explanation: "CSS stands for Cascading Style Sheets, emphasizing its cascading nature of style application."
    },
    {
        q: "Which symbol is used for id selector in CSS?",
        options: [".", "#", "*", "&"],
        ans: 1,
        explanation: "The hash (#) symbol is used to select elements by their ID in CSS."
    },
    {
        q: "JavaScript primarily runs on?",
        options: ["Server", "Browser", "Compiler", "Database"],
        ans: 1,
        explanation: "JavaScript primarily runs in web browsers, though it can also run on servers (Node.js)."
    },
    {
        q: "Which HTML tag is used for images?",
        options: ["<img>", "<image>", "<pic>", "<photo>"],
        ans: 0,
        explanation: "The <img> tag is the standard HTML element for embedding images."
    },
    {
        q: "Which is NOT a programming language?",
        options: ["Python", "Java", "HTML", "C"],
        ans: 2,
        explanation: "HTML is a markup language, not a programming language. Python, Java, and C are programming languages."
    }
];

// ═══════════════════════════════════════════════════════════════
// QUIZ APPLICATION CLASS - OOP APPROACH
// ═══════════════════════════════════════════════════════════════

class QuizApp {
    constructor() {
        // Quiz State
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.answered = false;
        this.userAnswers = [];
        this.timePerQuestion = 20; // default
        this.timerInterval = null;
        this.remainingTime = 0;
        this.difficulty = 'medium';
        
        // DOM Elements
        this.elements = {
            difficultySelector: document.getElementById('difficulty-selector'),
            startQuizBtn: document.getElementById('start-quiz-btn'),
            quizBox: document.querySelector('.quiz-box'),
            resultBox: document.getElementById('result'),
            reviewSection: document.getElementById('review-section'),
            question: document.getElementById('question'),
            optionsContainer: document.getElementById('options-container'),
            options: document.querySelectorAll('.option'),
            nextBtn: document.getElementById('nextBtn'),
            prevBtn: document.getElementById('prevBtn'),
            qNumber: document.getElementById('q-number'),
            scoreText: document.getElementById('score'),
            progressBar: document.getElementById('progress-bar'),
            timerText: document.getElementById('timer-text'),
            timerCircle: document.getElementById('timer-circle'),
            finalScore: document.getElementById('final-score'),
            resultDetails: document.getElementById('result-details'),
            restartBtn: document.getElementById('restart'),
            reviewBtn: document.getElementById('review-answers'),
            closeReviewBtn: document.getElementById('close-review'),
            reviewContainer: document.getElementById('review-container'),
            themeToggle: document.getElementById('theme-toggle')
        };
        
        this.init();
    }

    // ───────────────────────────────────────────────────────────
    // INITIALIZATION
    // ───────────────────────────────────────────────────────────
    
    init() {
        this.loadTheme();
        this.attachEventListeners();
        this.loadProgress();
        this.setupDifficultySelection();
    }

    attachEventListeners() {
        // Difficulty and Start
        this.elements.startQuizBtn?.addEventListener('click', () => this.startQuiz());
        
        // Navigation
        this.elements.nextBtn?.addEventListener('click', () => this.nextQuestion());
        this.elements.prevBtn?.addEventListener('click', () => this.previousQuestion());
        
        // Results
        this.elements.restartBtn?.addEventListener('click', () => this.restartQuiz());
        this.elements.reviewBtn?.addEventListener('click', () => this.showReview());
        this.elements.closeReviewBtn?.addEventListener('click', () => this.closeReview());
        
        // Theme Toggle
        this.elements.themeToggle?.addEventListener('click', () => this.toggleTheme());
        
        // Keyboard Navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    setupDifficultySelection() {
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.level;
                this.timePerQuestion = parseInt(btn.dataset.time);
            });
        });
    }

    // ───────────────────────────────────────────────────────────
    // THEME MANAGEMENT
    // ───────────────────────────────────────────────────────────
    
    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        const themeIcon = this.elements.themeToggle?.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = isLight ? '☀️' : '🌙';
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            const themeIcon = this.elements.themeToggle?.querySelector('.theme-icon');
            if (themeIcon) themeIcon.textContent = '☀️';
        }
    }

    // ───────────────────────────────────────────────────────────
    // QUIZ FLOW CONTROL
    // ───────────────────────────────────────────────────────────
    
    startQuiz() {
        // Randomize questions
        this.questions = this.shuffleArray([...quizData]);
        
        // Reset state
        this.currentIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.answered = false;
        
        // Hide difficulty selector, show quiz
        this.elements.difficultySelector?.classList.add('hidden');
        this.elements.quizBox?.classList.remove('hidden');
        this.elements.resultBox?.classList.add('hidden');
        
        this.loadQuestion();
        this.saveProgress();
    }

    loadQuestion() {
        if (this.currentIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        this.answered = false;
        this.elements.nextBtn.disabled = true;
        
        const currentQ = this.questions[this.currentIndex];
        
        // Update question text
        this.elements.question.textContent = currentQ.q;
        
        // Update progress indicators
        this.elements.qNumber.textContent = `Question ${this.currentIndex + 1} / ${this.questions.length}`;
        this.elements.scoreText.textContent = `Score: ${this.score}`;
        
        // Update progress bar
        const progressPercent = ((this.currentIndex + 1) / this.questions.length) * 100;
        this.elements.progressBar.style.width = `${progressPercent}%`;
        
        // Shuffle and load options
        const shuffledOptions = this.shuffleOptionsWithAnswer(currentQ.options, currentQ.ans);
        
        this.elements.options.forEach((btn, i) => {
            btn.textContent = shuffledOptions.options[i];
            btn.className = 'option';
            btn.disabled = false;
            btn.onclick = () => this.checkAnswer(i, shuffledOptions.correctIndex);
        });
        
        // Store correct index for this question
        this.questions[this.currentIndex].shuffledCorrectIndex = shuffledOptions.correctIndex;
        
        // Start timer
        this.startTimer();
        
        // Enable/disable prev button
        this.elements.prevBtn.disabled = this.currentIndex === 0;
        
        // Add animation
        this.elements.quizBox?.classList.add('animate-in');
        setTimeout(() => this.elements.quizBox?.classList.remove('animate-in'), 600);
    }

    checkAnswer(selectedIndex, correctIndex) {
        if (this.answered) return;
        
        this.answered = true;
        this.stopTimer();
        this.elements.nextBtn.disabled = false;
        
        // Store user answer
        this.userAnswers.push({
            question: this.questions[this.currentIndex].q,
            options: Array.from(this.elements.options).map(btn => btn.textContent),
            userAnswer: selectedIndex,
            correctAnswer: correctIndex,
            isCorrect: selectedIndex === correctIndex,
            explanation: this.questions[this.currentIndex].explanation
        });
        
        // Visual feedback
        if (selectedIndex === correctIndex) {
            this.elements.options[selectedIndex].classList.add('correct');
            this.score++;
            this.elements.scoreText.textContent = `Score: ${this.score}`;
        } else {
            this.elements.options[selectedIndex].classList.add('wrong');
            this.elements.options[correctIndex].classList.add('correct');
        }
        
        // Disable all options
        this.elements.options.forEach(btn => btn.disabled = true);
        
        this.saveProgress();
    }

    nextQuestion() {
        if (!this.answered) return;
        
        this.currentIndex++;
        if (this.currentIndex < this.questions.length) {
            this.loadQuestion();
        } else {
            this.showResults();
        }
    }

    previousQuestion() {
        if (this.currentIndex > 0 && this.answered) {
            this.currentIndex--;
            this.loadQuestion();
        }
    }

    // ───────────────────────────────────────────────────────────
    // TIMER SYSTEM (CRITICAL FEATURE)
    // ───────────────────────────────────────────────────────────
    
    startTimer() {
        this.remainingTime = this.timePerQuestion;
        this.updateTimerDisplay();
        
        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            this.updateTimerDisplay();
            
            // Warning states
            if (this.remainingTime <= 5 && this.remainingTime > 0) {
                this.elements.timerText?.classList.add('warning');
                this.elements.timerCircle?.classList.add('warning');
            }
            
            if (this.remainingTime <= 3) {
                this.elements.timerText?.classList.add('danger');
                this.elements.timerCircle?.classList.add('danger');
            }
            
            // Time's up
            if (this.remainingTime <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        // Update text
        this.elements.timerText.textContent = this.remainingTime;
        
        // Update circular progress
        const circumference = 2 * Math.PI * 32; // radius = 32
        const progress = (this.remainingTime / this.timePerQuestion) * circumference;
        this.elements.timerCircle.style.strokeDashoffset = circumference - progress;
        
        // Reset warning classes when time resets
        if (this.remainingTime === this.timePerQuestion) {
            this.elements.timerText?.classList.remove('warning', 'danger');
            this.elements.timerCircle?.classList.remove('warning', 'danger');
        }
    }

    handleTimeUp() {
        this.stopTimer();
        
        if (!this.answered) {
            // Mark as answered but no score
            this.answered = true;
            this.elements.nextBtn.disabled = false;
            
            // Store unanswered
            this.userAnswers.push({
                question: this.questions[this.currentIndex].q,
                options: Array.from(this.elements.options).map(btn => btn.textContent),
                userAnswer: -1,
                correctAnswer: this.questions[this.currentIndex].shuffledCorrectIndex,
                isCorrect: false,
                explanation: this.questions[this.currentIndex].explanation
            });
            
            // Show correct answer
            const correctIndex = this.questions[this.currentIndex].shuffledCorrectIndex;
            this.elements.options[correctIndex]?.classList.add('correct');
            
            // Disable all options
            this.elements.options.forEach(btn => btn.disabled = true);
            
            // Auto advance after 2 seconds
            setTimeout(() => {
                this.nextQuestion();
            }, 2000);
        }
    }

    // ───────────────────────────────────────────────────────────
    // RESULTS & REVIEW
    // ───────────────────────────────────────────────────────────
    
    showResults() {
        this.stopTimer();
        this.elements.quizBox?.classList.add('hidden');
        this.elements.resultBox?.classList.remove('hidden');
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        // Update result icon based on performance
        const resultIcon = this.elements.resultBox?.querySelector('.result-icon');
        if (resultIcon) {
            if (percentage >= 80) resultIcon.textContent = '🎉';
            else if (percentage >= 60) resultIcon.textContent = '👍';
            else if (percentage >= 40) resultIcon.textContent = '😐';
            else resultIcon.textContent = '😢';
        }
        
        // Display score
        this.elements.finalScore.textContent = `Your Score: ${this.score} / ${this.questions.length}`;
        
        // Display details
        this.elements.resultDetails.innerHTML = `
            <p><strong>Correct Answers:</strong> ${this.score}</p>
            <p><strong>Incorrect Answers:</strong> ${this.questions.length - this.score}</p>
            <p><strong>Percentage:</strong> ${percentage}%</p>
            <p><strong>Difficulty:</strong> ${this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1)}</p>
            <p><strong>Performance:</strong> ${this.getPerformanceLevel(percentage)}</p>
        `;
        
        // Save to localStorage
        this.saveScore(percentage);
        this.clearProgress();
    }

    getPerformanceLevel(percentage) {
        if (percentage >= 90) return 'Excellent 🌟';
        if (percentage >= 80) return 'Very Good 💪';
        if (percentage >= 70) return 'Good 👏';
        if (percentage >= 60) return 'Average 📚';
        if (percentage >= 40) return 'Below Average 📖';
        return 'Needs Improvement 💡';
    }

    showReview() {
        this.elements.resultBox?.classList.add('hidden');
        this.elements.reviewSection?.classList.remove('hidden');
        
        this.elements.reviewContainer.innerHTML = this.userAnswers.map((ans, index) => {
            const isCorrect = ans.isCorrect;
            const wasUnanswered = ans.userAnswer === -1;
            
            return `
                <div class="review-item ${isCorrect ? 'correct-answer' : 'wrong-answer'}">
                    <div class="review-question">
                        <strong>Q${index + 1}:</strong> ${ans.question}
                    </div>
                    <div class="review-options">
                        ${ans.options.map((opt, i) => {
                            let className = 'review-option';
                            if (i === ans.correctAnswer) className += ' correct-option';
                            if (i === ans.userAnswer) className += ' user-selected';
                            return `<div class="${className}">${opt}</div>`;
                        }).join('')}
                    </div>
                    ${wasUnanswered ? '<p style="color: var(--warning); margin-top: 10px;">⏱ Time ran out - No answer selected</p>' : ''}
                    <div class="review-explanation">
                        <strong>Explanation:</strong> ${ans.explanation}
                    </div>
                </div>
            `;
        }).join('');
    }

    closeReview() {
        this.elements.reviewSection?.classList.add('hidden');
        this.elements.resultBox?.classList.remove('hidden');
    }

    restartQuiz() {
        this.elements.resultBox?.classList.add('hidden');
        this.elements.reviewSection?.classList.add('hidden');
        this.elements.difficultySelector?.classList.remove('hidden');
        this.clearProgress();
    }

    // ───────────────────────────────────────────────────────────
    // UTILITY FUNCTIONS
    // ───────────────────────────────────────────────────────────
    
    shuffleArray(array) {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    }

    shuffleOptionsWithAnswer(options, correctIndex) {
        const optionsWithIndex = options.map((opt, i) => ({ opt, isCorrect: i === correctIndex }));
        const shuffled = this.shuffleArray(optionsWithIndex);
        const newCorrectIndex = shuffled.findIndex(item => item.isCorrect);
        
        return {
            options: shuffled.map(item => item.opt),
            correctIndex: newCorrectIndex
        };
    }

    handleKeyboard(e) {
        // Only handle keyboard when quiz is active
        if (this.elements.quizBox?.classList.contains('hidden')) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'Enter':
                if (!this.elements.nextBtn.disabled) this.nextQuestion();
                break;
            case 'ArrowLeft':
                if (!this.elements.prevBtn.disabled) this.previousQuestion();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                const optionIndex = parseInt(e.key) - 1;
                if (!this.answered && this.elements.options[optionIndex]) {
                    this.elements.options[optionIndex].click();
                }
                break;
        }
    }

    // ───────────────────────────────────────────────────────────
    // LOCAL STORAGE (PERSISTENCE)
    // ───────────────────────────────────────────────────────────
    
    saveProgress() {
        const progress = {
            currentIndex: this.currentIndex,
            score: this.score,
            userAnswers: this.userAnswers,
            difficulty: this.difficulty,
            timePerQuestion: this.timePerQuestion,
            questions: this.questions
        };
        localStorage.setItem('quizProgress', JSON.stringify(progress));
    }

    loadProgress() {
        const saved = localStorage.getItem('quizProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            // Optionally implement resume functionality
            // For now, we'll just clear it on page load
            // You can add a "Resume Quiz" button if needed
        }
    }

    clearProgress() {
        localStorage.removeItem('quizProgress');
    }

    saveScore(percentage) {
        const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
        scores.push({
            score: this.score,
            total: this.questions.length,
            percentage: percentage,
            difficulty: this.difficulty,
            date: new Date().toISOString()
        });
        localStorage.setItem('quizScores', JSON.stringify(scores));
    }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZE APPLICATION
// ═══════════════════════════════════════════════════════════════

let quizApp;

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        quizApp = new QuizApp();
    });
} else {
    quizApp = new QuizApp();
}

// Prevent memory leaks - clean up timers on page unload
window.addEventListener('beforeunload', () => {
    if (quizApp && quizApp.timerInterval) {
        quizApp.stopTimer();
    }
});
