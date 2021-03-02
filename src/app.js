/**
 * The Main Application
 */

import {
  APP_TITLE
} from './consts.js';
document.title = APP_TITLE;
const QUIZZ_API = 'https://quizapi.io/api/v1/questions'
const QUIZZ_TOKEN = '4RcuHM8t2dGMZxEK9z1YKBw3SrXW5GH4WfVq1eTQ'
// https://quizapi.io/api/v1/questions?apiKey=YOUR_API_KEY&category=linux&difficulty=Easy&limit=10&tags=HTML,JavaScript
const app = () => {
  // set the app title
  document.title = APP_TITLE;

  // TODO: create your application

  const textContainer = document.createElement('div');
  textContainer.className = "text-container";
  textContainer.innerHTML = "A Basic JavaScript Starter Template"

  // add to the app container
  const appContainer = document.getElementById('app');
  appContainer.append(textContainer);
};

// start the app
// app();

(() => {
  const app = {
    initialize() {
      this.cacheElements();
      this.registerListeners();
      this.currentQuestion = 0;
      this.questionWrong = 0;
      this.questionRight = 0;
      this.questionSkip = 0;
      this.myAnswers = [];
    },
    cacheElements() {
      this.$createQuizeForm = document.getElementById('form');
      this.$quizCategory = document.querySelector('.catergory')
      this.$quizDifficulty = document.querySelector('.difficulty')
      this.$quizTags = document.querySelector('.tags')
      this.$quizAmount = document.querySelector('.amount')
      this.$quizQuestions = document.querySelector('.quiz-questions')
      this.$quizArea = document.querySelector('quiz-area')
      this.$quizAnswers = document.querySelector('.quiz-answers')
      this.$quizCounter = document.querySelector('.counter')
      this.$nextQuestion = document.querySelector('.nextQuestion')
      this.$skipQuestion = document.querySelector('.skipQuestion')
      this.$answerList = document.querySelector('.answerList')
      this.$preQuizHeader = document.querySelector('.preQuiz-header')
      this.$startNewQuiz = document.querySelector('.restart-quiz')
      this.$startNewQuizEnd = document.querySelector('.restart-quiz-end')
      this.$clearGameArea = document.querySelectorAll('.clear')
      this.$results = document.querySelector('.results')
      this.$resultsList = document.querySelector('.results-list')
      this.$quizBody = document.querySelector('.quiz-body')
      this.$startNewQuiz.style.display = "none"
      this.$nextQuestion.style.display = "none"
      this.$skipQuestion.style.display = "none"
      this.$results.style.display = "none"
    },
    registerListeners() {
      this.$createQuizeForm.addEventListener('click', (e) => {
        e.preventDefault()
        console.log("------Filter Value's------")
        console.log(this.$quizCategory.value)
        console.log(this.$quizDifficulty.value)
        console.log(this.$quizTags.value)
        console.log(this.$quizAmount.value)
        console.log("-------------")
        this.$nextQuestion.style.display = "block"
        this.$startNewQuiz.style.display = "block"
        this.$skipQuestion.style.display = "block"
        this.fetchQuizzAPI()
      })
      this.$skipQuestion.addEventListener('click', (e) => {
        e.preventDefault()
        this.currentQuestion = this.currentQuestion + 1
        this.createQuizQuestions(this.quizQuestionArray)
        this.questionSkipped()
      })
      this.$startNewQuiz.addEventListener('click', (e) => {
        this.restartQuiz()
        this.$startNewQuiz.style.display = "none"
        this.$nextQuestion.style.display = "none"
        this.$skipQuestion.style.display = "none"
      })
      this.$startNewQuizEnd.addEventListener('click', (e) => {
        this.restartQuiz()
        this.$startNewQuiz.style.display = "none"
        this.$nextQuestion.style.display = "none"
        this.$skipQuestion.style.display = "none"
      })
      this.$nextQuestion.addEventListener("click", (e) => {
        this.checkAnswer(this.answerID, this.correctAnswer)
        this.createQuizQuestions(this.quizQuestionArray)
      })
    },
    restartQuiz(){
      this.currentQuestion = 0
      this.questionWrong = 0
      this.questionRight = 0
      this.questionSkip = 0
      this.myAnswers = [];
      this.$preQuizHeader.style.display = "flex"
      this.$quizBody.style.display = "block"
      this.$results.style.display = "none"
      this.$clearGameArea.forEach(clear => {
        clear.innerHTML = ""
      })
    },
    async fetchQuizzAPI() {

      //example URL
      // https://quizapi.io/api/v1/questions?apiKey=YOUR_API_KEY&category=linux&difficulty=Easy&limit=10&tags=HTML,JavaScript

      // console.log(`${QUIZZ_API}?apiKey=${QUIZZ_TOKEN}&category=${this.$quizCategory.value}&difficulty=${this.$quizDifficulty.value}&limit=${this.$quizAmount.value}`)
      await fetch(`${QUIZZ_API}?apiKey=${QUIZZ_TOKEN}&category=${this.$quizCategory.value}&difficulty=${this.$quizDifficulty.value}&limit=${this.$quizAmount.value}`)
        .then(response => response.json())
        .then(json => {
          console.log(json)
          this.quizQuestionArray = json
          this.createQuizQuestions(this.quizQuestionArray)
        })
        .catch(error => console.log(error))
    },
    createQuizQuestions(data) {
      if (this.currentQuestion !== data.length){
        this.$quizQuestions.innerHTML = ""
        this.$preQuizHeader.style.display = "none"
        this.$quizQuestions.innerHTML += `<li><p>${data[this.currentQuestion].question}</p></li>`
        this.$quizCounter.innerHTML = `<p class="wrapper">Questions skipped: ${this.questionSkip}/${data.length} || Question Right: ${this.questionRight}/${data.length} || Question Wrong: ${this.questionWrong}/${data.length} || Quiz Length: ${this.currentQuestion}/${data.length} || </p> <p id="timer"></p>`
        this.createHTMLForAnswers(data);
      } else {
        this.quizEnd(data);
      }
    },
    createHTMLForAnswers(data) {
      this.createTimer()
      this.$quizAnswers.innerHTML = ""
      this.correctAnswer = data[this.currentQuestion].correct_answer
      console.log(data[this.currentQuestion])
      console.log(`correct answer${data[this.currentQuestion].correct_answer}`)
      for (var key in data[this.currentQuestion].answers) {
        if (data[this.currentQuestion].answers.hasOwnProperty(key) && data[this.currentQuestion].answers[key] !== null) {
          this.$quizAnswers.innerHTML += `<li data-answer="${key}" class="answer_card container">
          <h2>${data[this.currentQuestion].answers[key]}</h2>
          <h3>${key}</h3></li>`
        }
      }

      this.$selectedAnswer = document.querySelectorAll('.answer_card')
      this.$selectedAnswer.forEach((answer) => {
        answer.addEventListener('click', (e) => {
         this.answerID = e.target.dataset.answer
          console.log(this.answerID)
            e.target.classList.toggle("active")
        })
      })
    },
    createTimer(){
      let timeLeft = 15;
      let elem = document.getElementById('timer');
      let timerId = setInterval(countdown, 1000);
      
      function countdown() {
          if (timeLeft === 0) {
            this.questionSkipped()
            clearTimeout(timerId);
          } else {
              elem.innerHTML = `Time Left!: ${timeLeft}`;
              timeLeft--;
          }
      }
      

    },
    checkAnswer(answerID, data){
      console.log(answerID)
      this.currentQuestion = this.currentQuestion + 1
      console.log(this.myAnswers)
      this.myAnswers.push(answerID)
      if (answerID === data){
        this.questionCorrect()
      } else {
        this.questionwrong()
      }
    },
    questionCorrect(){
      console.log("CORRECT")
      this.$answerList.innerHTML += `<h2>${this.currentQuestion}. CORRECT</h2>`
      this.questionRight = this.questionRight + 1
    },
    questionwrong(){
      console.log("Better luck next time!")
      this.$answerList.innerHTML += `<h2>${this.currentQuestion}. WRONG</h2>`
      this.questionWrong = this.questionWrong + 1
    },
    questionSkipped(){
      console.log("Question Skipped")
      this.$answerList.innerHTML += `<h2>${this.currentQuestion}. SKIPPED</h2>`
      this.questionSkip = this.questionSkip + 1
    },
    quizEnd(data){ 
      this.$quizBody.style.display = "none"
      this.myAnswers.map(answer => {
        this.$results.style.display = "block"
        let endGame = data.map(question => {
          return `<li style="list-style=none">
          <h2> The Question: ${question.question}</h2>
          <h3>The correct answer: ${question.correct_answer}</h3>
          <p> your answer: ${answer}</p>
          </li> `
        }).join(' ')
        this.$resultsList.innerHTML = `<ul>
        ${endGame}
        </ul>`
      })
    }
  }
  app.initialize()
})();