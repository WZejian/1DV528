/**
 * References to elements in page.html.
 */
const firstQuestionUrl = 'https://courselab.lnu.se/quiz/question/1'
const entryBox = document.getElementById('entry-box')
const quizBox = document.getElementById('quiz-box')
const scoreBox = document.getElementById('score-box')
const usernameInputField = document.getElementById('nickname-input')
const questionField = document.getElementById('questions')
const radioButtonField = document.getElementById('choices-box')
const answerInputField = document.getElementById('answer-input-box')
const timerField = document.getElementById('time-left')
const reminderField = document.getElementById('reminder')

/**
 * Identifiers defined to dynamically record data.
 */
const identifiers = {
  questionType: '',
  timeProcesser: null,
  timeLimit: 10,
  startTime: null,
  username: '',
  highScores: [],
  nextQuestionURL: '',
  currentRadioIndex: 0
}

/**
 * Clicks the start button to play the quiz game.
 * @param {event} event - click the button.
 */
function startButtonClick (event) {
  event.preventDefault()
  identifiers.username = usernameInputField.value.trim()
  identifiers.username ? quizStart() : alert('Empty username!')
}

/**
 * Clicks the restart button to restart the quiz game.
 * @param {event} event - click the button
 */
function restartButtonClick (event) {
  event.preventDefault()
  clearInterval(identifiers.timeProcesser)
  quizBox.style.display = 'none'
  scoreBox.style.display = 'none'
  entryBox.style.display = 'block'
  usernameInputField.focus()
}

/**
 * Clicks the submit button to submit the answer
 * @param {event} event - click the button
 */
async function submitButtonClick (event) {
  event.preventDefault()
  let answer = null
  if (identifiers.questionType === 'choices') {
    const selectedChoice = radioButtonField.querySelector('input[type="radio"]:checked')
    answer = selectedChoice ? selectedChoice.value : ''
  } else {
    answer = answerInputField.value.trim()
  }
  if (answer) {
    await submitAnswer(identifiers.nextQuestionURL, answer)
  } else {
    alert('Invalid answer')
  }
}

/**
 * Clicks the link to show the high scores
 * @param {event} event - Clicks the high score link
 */
function highScoresLinkClick (event) {
  event.preventDefault()
  showHighScores()
}

/**
 * Starts the game.
 */
async function quizStart () {
  entryBox.style.display = 'none'
  quizBox.style.display = 'block'
  const response = await fetch(firstQuestionUrl)
  if (response.ok) {
    const questionData = await response.json()
    showQuestion(questionData)
    identifiers.startTime = Date.now()
  }
}

/**
 * Timer to set the limit of answering a question.
 */
function Timer () {
  clearInterval(identifiers.timeProcesser)
  let remainingTime = identifiers.timeLimit
  timerField.innerText = `Time left:  ${remainingTime}  seconds`

  identifiers.timeProcesser = setInterval(function () {
    remainingTime--
    if (remainingTime >= 0) {
      timerField.innerText = `Time left: ${remainingTime} seconds`
    } else {
      clearInterval(identifiers.timeProcesser)
      reminderField.innerHTML = 'Time has run out! Game Over. Apologies!'
      quizBox.style.display = 'none'
      scoreBox.style.display = 'block'
    }
  }, 1000)
}

/**
 * Shows the question and choices(if the question typle is multiple-choice)
 * @param {object} questionData - JSON data of a question received.
 */
function showQuestion (questionData) {
  questionField.innerText = questionData.question
  if (!questionData.alternatives) {
    identifiers.questionType = 'fill-in-the-blank'
    radioButtonField.style.display = 'none'
    answerInputField.style.display = 'block'
    answerInputField.focus()
  } else {
    identifiers.questionType = 'choices'
    identifiers.currentRadioIndex = -1
    radioButtonField.innerHTML = ''
    for (const [key, value] of Object.entries(questionData.alternatives)) {
      const radioHtml = `<label><input type="radio" name="choices-box" value="${key}">${value}</label>`
      radioButtonField.insertAdjacentHTML('beforeend', radioHtml)
    }
    radioButtonField.style.display = 'block'
    answerInputField.style.display = 'none'
  }

  identifiers.nextQuestionURL = questionData.nextURL
  Timer()
}

/**
 * Submits the answer to the server.
 * @param {string} answerURL -url to post an answer to the server.
 * @param {string} answer - answer in javaScript object.
 */
async function submitAnswer (answerURL, answer) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer })
  }
  const response = await fetch(answerURL, options)
  const data = await response.json()
  if (response.ok) {
    if (data.nextURL) {
      showNextQuestion(data.nextURL)
    } else { // All questions are done correctly
      const durationTime = (Date.now() - identifiers.startTime) / 1000
      clearInterval(identifiers.timeProcesser)
      updateHighScores(identifiers.username, durationTime)
      reminderField.innerHTML = `Grattis! ${identifiers.username}, your time: ${durationTime.toFixed(1)} seconds!`
      quizBox.style.display = 'none'
      scoreBox.style.display = 'block'
    }
  } else {
    clearInterval(identifiers.timeProcesser)
    reminderField.innerHTML = 'Not correct answer, Game Over, Apologies!'
    quizBox.style.display = 'none'
    scoreBox.style.display = 'block'
  }
}

/**
 * Shows the next question if it is not the last one.
 * @param {string} nextUrl - url of the next question of an answer
 */
async function showNextQuestion (nextUrl) {
  const response = await fetch(nextUrl)
  if (response.ok) {
    const nextQuestionData = await response.json()
    showQuestion(nextQuestionData)
  }
}

/**
 * Updates the highest five scores.
 * @param {object} username -player's the username
 * @param {number} durationTime -the time a user spent in one iteration in a completed game.
 */
function updateHighScores (username, durationTime) {
  const newScore = { username, durationTime }
  let storedHighScores = JSON.parse(localStorage.getItem('highScores'))
  storedHighScores = storedHighScores || []
  const newScores = storedHighScores.concat(newScore)
  newScores.sort((a, b) => a.durationTime - b.durationTime)
  const newTop5Scores = newScores.slice(0, 5)
  localStorage.setItem('highScores', JSON.stringify(newTop5Scores))
  identifiers.highScores = newTop5Scores
}

/**
 * Show the highest 5 scores in a table.
 */
function showHighScores () {
  let highScoreHtml = '<h2>Top 5 high scores</h2><table><tr><th>Rank</th><th>Name</th><th>Time</th></tr>'

  identifiers.highScores.forEach((score, index) => {
    const rank = `${index + 1}`
    highScoreHtml += `<tr><td>${rank}</td><td>${score.username}</td><td>${score.durationTime.toFixed(1)} s</td></tr>`
  })

  highScoreHtml += '</table>'

  reminderField.innerHTML = highScoreHtml
  scoreBox.style.display = 'block'
}

export default {
  restartButtonClick,
  startButtonClick,
  submitButtonClick,
  highScoresLinkClick,
  identifiers,
  radioButtonField,
  quizBox,
  scoreBox,
  usernameInputField
}
