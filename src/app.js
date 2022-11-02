/**
 * The Main Application
 */

import {
  APP_TITLE,
  CATEGORIES,
  DIFFICULTIES,
  QUIZZ_API,
  QUIZZ_TOKEN,
} from './consts.js';
(() => {
  const app = {
    initialize() {
      this.cacheElements();
      this.createFilters()
      this.registerListeners();
      this.currentQuestion = 0;
      this.questionWrong = 0;
      this.questionRight = 0;
      this.questionSkip = 0;
      this.myAnswers = [];
      document.title = APP_TITLE;
    },
    cacheElements() {
      this.$createQuizeForm = document.getElementById('form');
      this.$preQuizHeader = document.querySelector('.preQuiz-header')
      //values
      this.$quizCategory = document.querySelector('.catergory')
      this.$quizDifficulty = document.querySelector('.difficulty')
      this.$quizTags = document.querySelector('.tags')
      this.$quizAmount = document.querySelector('.amount')
      this.$quizQuestions = document.querySelector('.quiz-questions')
      this.$quizArea = document.querySelector('quiz-area')
      this.$quizAnswers = document.querySelector('.quiz-answers')
      this.$quizCounter = document.querySelector('.counter')
      //buttons
      this.$nextQuestion = document.querySelector('.nextQuestion')
      this.$skipQuestion = document.querySelector('.skipQuestion')
      this.$answerList = document.querySelector('.answerList')
      this.$startNewQuiz = document.querySelector('.restart-quiz')
      this.$startNewQuizEnd = document.querySelector('.restart-quiz-end')
      //end quiz display
      this.$clearGameArea = document.querySelectorAll('.clear')
      this.$results = document.querySelector('.results')
      this.$resultsList = document.querySelector('.results-list')
      this.$quizBody = document.querySelector('.quiz-body')
      this.$startNewQuiz.style.display = "none"
      this.$nextQuestion.style.display = "none"
      this.$skipQuestion.style.display = "none"
      this.$results.style.display = "none"
    },
    createFilters() {
      CATEGORIES.map(cat => {
        this.$quizCategory.innerHTML += `<option value="${cat}">${cat}</option>`
      })
      DIFFICULTIES.map(dif => {
        this.$quizDifficulty.innerHTML += `<option value="${dif}">${dif}</option>`
      })
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
        clearInterval(this.timer);
        e.preventDefault()
        this.currentQuestion = this.currentQuestion + 1
        this.myAnswers.push("Skipped")
        this.createQuizQuestions(this.quizQuestionArray)
        this.questionSkipped()
      })
      this.$startNewQuiz.addEventListener('click', (e) => {
        this.restartQuiz()
        clearInterval(this.timer);
        this.$startNewQuiz.style.display = "none"
        this.$nextQuestion.style.display = "none"
        this.$skipQuestion.style.display = "none"
      })
      this.$startNewQuizEnd.addEventListener('click', (e) => {
        this.restartQuiz()
        clearInterval(this.timer);
        this.$startNewQuiz.style.display = "none"
        this.$nextQuestion.style.display = "none"
        this.$skipQuestion.style.display = "none"
      })
      this.$nextQuestion.addEventListener("click", (e) => {
        clearInterval(this.timer);
        this.checkAnswer(this.answerID, this.correctAnswer)
        this.createQuizQuestions(this.quizQuestionArray)
      })
    },
    restartQuiz() {
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
      this.answerID = 
      console.log(data)
      clearInterval(this.timer);
      if (this.currentQuestion !== data.length) {
        this.$quizQuestions.innerHTML = ""
        this.$preQuizHeader.style.display = "none"
        this.$quizQuestions.innerHTML += `<li><p>${data[this.currentQuestion].question}</p></li>`
        this.$quizCounter.innerHTML = `<p class="wrapper">Questions skipped: ${this.questionSkip}/${data.length} || Question Right: ${this.questionRight}/${data.length} || Question Wrong: ${this.questionWrong}/${data.length} || Quiz Length: ${this.currentQuestion}/${data.length} || </p> <p id="timer"></p>`
        this.createTimer()
        this.createHTMLForAnswers(data);
      } else {
        this.quizEnd(data);
      }
    },
    createHTMLForAnswers(data) {
      this.$quizAnswers.innerHTML = ""
      this.correctAnswer = data[this.currentQuestion].correct_answer
      console.log(data[this.currentQuestion])
      console.log(`correct answer${data[this.currentQuestion].correct_answer}`)
      for (var key in data[this.currentQuestion].answers) {
        if (data[this.currentQuestion].answers.hasOwnProperty(key) && data[this.currentQuestion].answers[key] !== null) {
          this.$quizAnswers.innerHTML += `<li data-answer="${key}" data-value="${data[this.currentQuestion].answers[key]}" class="answer_card container">
          <h2>${data[this.currentQuestion].answers[key]}</h2>
          <h3>${key}</h3></li>`
        }
      }

      this.$selectedAnswer = document.querySelectorAll('.answer_card')
      this.$selectedAnswer.forEach((answer) => {
        answer.addEventListener('click', (e) => {
          this.answerID = e.target.dataset.answer || e.target.parentNode.dataset.answer || e.target.parentNode.parentNodedataset.answer
          e.target.classList.toggle("active")
        })
      })
    },
    createTimer() {
      this.timeleft = 15
      this.timer = setInterval(() => {
        document.getElementById('timer').innerHTML = this.timeleft
        if (this.timeleft === 0) {
          this.questionSkipped()
          this.currentQuestion++
          this.myAnswers.push("Out of time")
          this.createQuizQuestions(this.quizQuestionArray)
        } else {
          this.timeleft--
        }
      }, 1000);
    },
    checkAnswer(answerID, data) {
      if(answerID !== undefined){
        this.myAnswers.push(answerID)
      } else {
        this.myAnswers.push("Did Not Answer")
      }
      console.log(answerID)
      this.currentQuestion++
      console.log(this.myAnswers)
      if (answerID === data) {
        this.questionCorrect()
      } else {
        this.questionwrong()
      }
    },
    questionCorrect() {
      console.log("CORRECT")
      this.$answerList.innerHTML += `<h2>${this.currentQuestion}. CORRECT</h2>`
      this.questionRight++
    },
    questionwrong() {
      console.log("Better luck next time!")
      this.$answerList.innerHTML += `<h2>${this.currentQuestion}. WRONG</h2>`
      this.questionWrong++
    },
    questionSkipped() {
      console.log("Question Skipped")
      this.$answerList.innerHTML += `<h2>${this.currentQuestion}. SKIPPED</h2>`
      this.questionSkip++
    },
    quizEnd(data) {
      this.$quizBody.style.display = "none"
      this.$results.style.display = "block"
      this.myAnswers.map((answer, i) =>{
          for (var key in data[i].answers) {
            if (data[i].answers.hasOwnProperty(key) && data[i].answers[key] !== null) {
              this.key = key
              this.value = data[i].answers[key]
            }
            console.log(key)
            console.log(answer)
            if (key === data[i].correct_answer) {
              this.correctAnswerVal = (data[i].answers[key])
            }
            if (key === answer) {
              this.correctAnswerKey = (data[i].answers[key])
            }
          }
          let endGame = `
            <h2> The Question: ${data[i].question}</h2>
            <h3>The correct answer: ${ this.correctAnswerVal}</h3>
            <p> your answer: ${this.correctAnswerKey}</p>
             `
            this.$resultsList.innerHTML += `<li>
            ${endGame}
            </li>`
      })
      clearInterval(this.timer);

    }
  }
  app.initialize()
})();
