const quizData = [
    {
        q: "HTML stands for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlinks Text Mark Language",
            "None of these"
        ],
        ans: 0
    },
    {
        q: "CSS is used for?",
        options: [
            "Database",
            "Logic",
            "Styling",
            "Networking"
        ],
        ans: 2
    },
    {
        q: "Which tag is used for JavaScript?",
        options: ["<js>", "<script>", "<javascript>", "<code>"],
        ans: 1
    },
    {
        q: "Which company developed Java?",
        options: ["Google", "Microsoft", "Sun Microsystems", "Apple"],
        ans: 2
    },
    {
        q: "HTML is a ____ language?",
        options: ["Programming", "Markup", "Styling", "Database"],
        ans: 1
    },
    {
        q: "CSS stands for?",
        options: [
            "Creative Style Sheets",
            "Cascading Style Sheets",
            "Colorful Style Sheets",
            "Computer Style Sheets"
        ],
        ans: 1
    },
    {
        q: "Which symbol is used for id selector?",
        options: [".", "#", "*", "&"],
        ans: 1
    },
    {
        q: "JavaScript runs on?",
        options: ["Server", "Browser", "Compiler", "Database"],
        ans: 1
    },
    {
        q: "Which HTML tag is used for images?",
        options: ["<img>", "<image>", "<pic>", "<photo>"],
        ans: 0
    },
    {
        q: "Which is NOT a programming language?",
        options: ["Python", "Java", "HTML", "C"],
        ans: 2
    }
];

let index = 0;
let score = 0;
let answered = false;

const question = document.getElementById("question");
const options = document.querySelectorAll(".option");
const nextBtn = document.getElementById("nextBtn");
const qNumber = document.getElementById("q-number");
const scoreText = document.getElementById("score");
const resultBox = document.querySelector(".result-box");
const quizBox = document.querySelector(".quiz-box");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart");

function loadQuiz() {
    answered = false;
    nextBtn.disabled = true;

    let q = quizData[index];
    question.innerText = q.q;
    qNumber.innerText = `Question ${index + 1} / ${quizData.length}`;
    scoreText.innerText = `Score: ${score}`;

    options.forEach((btn, i) => {
        btn.innerText = q.options[i];
        btn.className = "option";
        btn.onclick = () => checkAnswer(i);
    });
}

function checkAnswer(selected) {
    if (answered) return;
    answered = true;
    nextBtn.disabled = false;

    if (selected === quizData[index].ans) {
        options[selected].classList.add("correct");
        score++;
    } else {
        options[selected].classList.add("wrong");
        options[quizData[index].ans].classList.add("correct");
    }

    scoreText.innerText = `Score: ${score}`;
}

nextBtn.onclick = () => {
    index++;
    if (index < quizData.length) {
        loadQuiz();
    } else {
        quizBox.classList.add("hidden");
        resultBox.classList.remove("hidden");
        finalScore.innerText = `Your Score: ${score} / ${quizData.length}`;
    }
};

restartBtn && (restartBtn.onclick = () => {
    index = 0;
    score = 0;
    quizBox.classList.remove("hidden");
    resultBox.classList.add("hidden");
    loadQuiz();
});

loadQuiz();
