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
      this.currentQuestion = 0
    },
    cacheElements() {
      this.$createQuizeForm = document.getElementById('form');
      this.$quizCategory = document.querySelector('.catergory')
      this.$quizDifficulty = document.querySelector('.difficulty')
      this.$quizTags = document.querySelector('.tags')
      this.$quizAmount = document.querySelector('.amount')
      this.$quizQuestions = document.getElementById('quiz-questions')
      this.$quizAnswers = document.querySelector('.quiz-answers')
      this.$quizCounter = document.querySelector('.counter')
      this.$nextQuestion = document.querySelector('.nextQuestion')
      this.$answerList = document.querySelector('.answerList')
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
        this.fetchQuizzAPI()
      })
      this.$nextQuestion.addEventListener('click', (e) => {
        e.preventDefault()
        this.currentQuestion = this.currentQuestion + 1
        this.createQuizQuestions(this.quizQuestionArray)
        this.questionSkipped()
      })
    },
    async fetchQuizzAPI() {
      //example URL
      // https://quizapi.io/api/v1/questions?apiKey=YOUR_API_KEY&category=linux&difficulty=Easy&limit=10&tags=HTML,JavaScript

      // console.log(`${QUIZZ_API}?apiKey=${QUIZZ_TOKEN}&category=${this.$quizCategory.value}&difficulty=${this.$quizDifficulty.value}&limit=${this.$quizAmount.value}`)
      await fetch(`${QUIZZ_API}?apiKey=${QUIZZ_TOKEN}&category=${this.$quizCategory.value}&difficulty=${this.$quizDifficulty.value}&limit=${this.$quizAmount.value}`)
        .then(response => response.json())
        .then(json => {
          this.quizQuestionArray = json
          this.createQuizQuestions(this.quizQuestionArray)
        })
        .catch(error => console.log(error))
    },
    createQuizQuestions(data) {
      this.$quizQuestions.innerHTML = ""
      this.$quizQuestions.innerHTML += `<li><p>${data[this.currentQuestion].question}</p></li>`
      this.$quizCounter.innerHTML = `<p>${this.currentQuestion}/${data.length}</p>`
      this.createHTMLForAnswers(data)
    },
    createHTMLForAnswers(data) {
      this.$quizAnswers.innerHTML = ""
      this.correctAnswer = data[this.currentQuestion].correct_answer
      console.log(data[this.currentQuestion])
      console.log(`correct answer${data[this.currentQuestion].correct_answer}`)
      for (var key in data[this.currentQuestion].answers) {
        if (data[this.currentQuestion].answers.hasOwnProperty(key) && data[this.currentQuestion].answers[key] !== null) {
          console.log(key + " -> " + data[this.currentQuestion].answers[key]);
          this.$quizAnswers.innerHTML += `<li data-answer="${key}" class="answer_card">${data[this.currentQuestion].answers[key]} <br> ${key}</li>`
        }
      }

      this.$selectedAnswer = document.querySelectorAll('.answer_card')
      this.$selectedAnswer.forEach((answer) => {
        answer.addEventListener('click', (e) => {
          let answerID = e.target.dataset.answer
          this.checkAnswer(answerID, this.correctAnswer)
          this.createQuizQuestions(this.quizQuestionArray)
        })
      })
    },
    checkAnswer(answerID, data){
      console.log(answerID)
      this.currentQuestion = this.currentQuestion + 1
      if (answerID === data){
        this.questionCorrect()
      } else {
        this.questionwrong()
      }
    },
    questionCorrect(){
      console.log("CORRECT")
      this.$answerList.innerHTML += `<h2>CORRECT</h2>`
    },
    questionwrong(){
      console.log("Better luck next time!")
      this.$answerList.innerHTML += `<h2>WRONG</h2>`
    },
    questionSkipped(){
      console.log("Question Skipped")
      this.$answerList.innerHTML += `<h2>SKIPPED</h2>`
    }
  }
  app.initialize()
})();