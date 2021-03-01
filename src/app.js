/**
 * The Main Application
 */

import { APP_TITLE } from './consts.js';
document.title = APP_TITLE;
const QUIZZ_API = 'https://quizapi.io/api/v1/questions'
const QUIZZ_TOKEN = '4RcuHM8t2dGMZxEK9z1YKBw3SrXW5GH4WfVq1eTQ'
// https://quizapi.io/api/v1/questions?apiKey=YOUR_API_KEY&category=linux&difficulty=Easy&limit=10&tags=HTML,JavaScript
const app = () =>
{
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
    initialize(){
      this.cacheElements();
      this.registerListeners();
      this.currentQuestion = 0
    },
    cacheElements(){
      this.$createQuizeForm = document.getElementById('form');
      this.$quizCategory = document.querySelector('.catergory')
      this.$quizDifficulty = document.querySelector('.difficulty')
      this.$quizTags = document.querySelector('.tags')
      this.$quizAmount = document.querySelector('.amount')
      this.$quizQuestions = document.getElementById('quiz-questions')
      this.$quizAnswers = document.getElementById('quiz-answers')
      this.$quizCounter = document.querySelector('.counter')
      this.$nextQuestion = document.querySelector('#test')
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
      })
    },
    async fetchQuizzAPI(){
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
      this.$quizQuestions.innerHTML +=`<li><p>${data[this.currentQuestion].question}</p></li>`
      this.createHTMLForAnswers(data)
    },
    // createHTMLForAnswers(data) {
    //   this.$quizAnswers.innerHTML = ""
    //   console.log(data[this.currentQuestion].answers)
    //   for (let [key, value] of data[this.currentQuestion].answers) {
    //     console.log(`${key}: ${value}`);
    //   }

    // }
  }
  app.initialize()
})();