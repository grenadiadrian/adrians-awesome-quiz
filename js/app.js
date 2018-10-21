import Question from "./Question.js"
import Quiz from "./Quiz.js"

const App = (() => {
    // cache the DOM
    const quizEl = document.querySelector(".jabquiz")
    const quizQuestionEl = document.querySelector(".jabquiz__question")
    const trackerEl = document.querySelector(".jabquiz__tracker")
    const tracker2El = document.querySelector(".jabquiz__tracker2")
    const taglineEl = document.querySelector(".jabquiz__tagline")
    const choicesEl = document.querySelector(".jabquiz__choices")
    const progressInnerEl = document.querySelector(".progress__inner")
    const nextButtonEl = document.querySelector(".next")
    const restartButtonEl = document.querySelector(".restart")

    // Question bank for Quiz

    const q1 = new Question(
        "What year was I born?",
        ["1981", "1982", "1983", "1984"],
        2
    )
    const q2 = new Question(
        "Who is my favorite celebrity chef?",
        ["Gordon Ramsay", "Bobby Flay", "Emeril Lagasse", "Alton Brown"],
        0
    )
    const q3 = new Question(
        "My all-time favorite RPG is?",
        ["Final Fantasy X", "Chrono Trigger", "Super Mario RPG", "Final Fantasy VII"],
        3
    )
    const q4 = new Question(
        "My favorite hip-hop artist in high school was who?",
        ["Jay-Z", "DMX", "Eminem", "Snoop Dogg"],
        1
    )
    const q5 = new Question(
        "In college, my first lead role was in which play?",
        ["Proof", "Fences", "Romeo & Juliet", "Pinocchio"],
        0
    )
    const q6 = new Question(
        "Which Ninja Turtle is my favorite?",
        ["Leonardo", "Donatello", "Raphael", "Michaelangelo"],
        0
    )
    const q7 = new Question(
        "What's my favorite dinosaur?",
        ["Tyrannosaurus Rex", "Triceratops", "Ankylosaurus", "Stegosaurus"],
        2
    )
    const q8 = new Question(
        "What's my favorite pizza topping combination?",
        ["Supreme", "Sausage & Bell Peppers", "Ham & Pineapple", "Pepperoni & Jalapeño Peppers"],
        3
    )
    const q9 = new Question(
        "What is my favorite TV show of all-time?",
        ["Martin", "The Wire", "Living Single", "Seinfeld"],
        1
    )
    const q10 = new Question(
        "My favorite Wrestlemania of all-time is?",
        ["Wrestlemania X", "Wrestlemania XIV", "Wrestlemania X-Seven", "Wrestlemania XIX"],
        2
    )

    // Initialize the Quiz
    const quiz = new Quiz([q1, q2, q3, q4, q5, q6, q7, q8, q9, q10])

    const listeners = _ => {
        nextButtonEl.addEventListener("click", () => {
            const selectedRadioElem = document.querySelector('input[name="choice"]:checked')
            if (selectedRadioElem) {
                const key = Number(selectedRadioElem.getAttribute("data-order"))
                quiz.guess(key)
                renderAll()
            }
        })

        restartButtonEl.addEventListener("click", () => {
            quiz.reset()
            renderAll()
            setValue(taglineEl, `Pick an option below...`)
            nextButtonEl.style.opacity = 1 // restores "Next" button
        })
    }

    const setValue = (elem, value) => {
        elem.innerHTML = value
    }

    const renderQuestion = _ => {
        const question = quiz.getCurrentQuestion().question
        setValue(quizQuestionEl, question)
        quizQuestionEl.innerHTML = question
    }

    const renderChoicesElements = _ => {
        let markup = ""
        const currentChoices = quiz.getCurrentQuestion().choices
        currentChoices.forEach((elem, index) => {
            markup += `
                <li class="jabquiz__choice">
                    <input type="radio" name="choice" class="jabquiz__input" data-order="${index}" id="choice${index}">
                    <label for="choice${index}" class="jabquiz__label">
                    <i></i>
                    <span>${elem}</span>
                    </label>
                </li>
            `
        })

        setValue(choicesEl, markup)
    }

    const renderTracker = _ => {
        const index = quiz.currentIndex
        setValue(trackerEl, `${index + 1} of ${quiz.questions.length}`)
    }

    const getPercentage = (num1, num2) => {
        return Math.round((num1 / num2) * 100)
    }

    const launch = (width, maxPercent) => {
        let loadingBar = setInterval(function() {
            if (width > maxPercent) {
                clearInterval(loadingBar)
            } else {
                width++
                progressInnerEl.style.width = width + "%"
            }
        }, 3)
    }

    const renderProgress = _ => {
        const currentWidth = getPercentage(quiz.currentIndex, quiz.questions.length)
        launch(0, currentWidth)
    }

    const scoreChat = () => {
        let finalScore = getPercentage(quiz.score, quiz.questions.length)
        if (finalScore >= 80) {
            return `I'm impressed you know me so well!`
        } else if (finalScore >= 70) {
            return `Not bad. Not bad at all.`
        } else if (finalScore >= 60) {
            return `For real? How long have you known me!?`
        } else {
            return `Damn, that's shameful!`
        }
    }

    const renderEndScreen = _ => {
        setValue(quizQuestionEl, `Your results`)
        setValue(taglineEl, `Thanks for playing!`)
        setValue(trackerEl, `You scored ${getPercentage(quiz.score, quiz.questions.length)}%`)
        setValue(tracker2El, scoreChat())
        nextButtonEl.style.opacity = 0
        renderProgress()
    }

    const renderAll = _ => {
        if (quiz.hasEnded()) {
            renderEndScreen()
        } else {
            renderQuestion()
            renderChoicesElements()
            renderTracker()
            renderProgress()
        }
    }

    return {
        renderAll: renderAll,
        listeners: listeners
    }
})()

App.renderAll()
App.listeners()