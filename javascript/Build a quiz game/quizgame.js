
const questions = [
    {
        category: "Science",
        question: "What planet is known as the Red Planet?",
        choices: ["Mars", "Venus", "Jupiter"],
        answer: "Mars"
    },
    {
        category: "History",
        question: "Who was the first President of the United States?",
        choices: ["George Washington", "Thomas Jefferson", "Abraham Lincoln"],
        answer: "George Washington"
    },
    {
        category: "Geography",
        question: "What is the largest ocean on Earth?",
        choices: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean"],
        answer: "Pacific Ocean"
    },
    {
        category: "Technology",
        question: "What does HTML stand for?",
        choices: [
            "HyperText Markup Language",
            "HighText Machine Language",
            "HyperTool Markup Language"
        ],
        answer: "HyperText Markup Language"
    },
    {
        category: "Math",
        question: "What is 7 × 8?",
        choices: ["54", "56", "64"],
        answer: "56"
    }
];


function getRandomQuestion(questionsArray) {
    const randomIndex = Math.floor(Math.random() * questionsArray.length);
    return questionsArray[randomIndex];
}

function getRandomComputerChoice(choicesArray) {
    const randomIndex = Math.floor(Math.random() * choicesArray.length);
    return choicesArray[randomIndex];
}


function getResults(questionObject, computerChoice) {
    if (computerChoice === questionObject.answer) {
        return "The computer's choice is correct!";
    } else {
        return `The computer's choice is wrong. The correct answer is: ${questionObject.answer}`;
    }
}