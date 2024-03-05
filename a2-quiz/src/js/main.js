import functions from './modules/functions.js'

/**
 * References to elements for buttons and links in page.html
 */
const startBtn = document.getElementById('start-button')
const restartBtn = document.getElementById('restart-button')
const submitBtn = document.getElementById('answer-submit-button')
const highScoresLink = document.getElementById('highscores-link')

/**
 * Click event listeners for buttons.
 */
startBtn.addEventListener('click', functions.startButtonClick)
restartBtn.addEventListener('click', functions.restartButtonClick)
submitBtn.addEventListener('click', functions.submitButtonClick)
highScoresLink.addEventListener('click', functions.highScoresLinkClick)

/**
 * Shows the entry box for the user.
 */
functions.quizBox.style.display = 'none'
functions.scoreBox.style.display = 'none'
functions.usernameInputField.focus()

/**
 * Keyboard events listeners for document.
 */
document.addEventListener('keydown', (event) => {
  const key = event.key
  let currentRadioIdx = functions.identifiers.currentRadioIndex
  const questionType = functions.identifiers.questionType

  if (questionType === 'choices') {
    const radioBtns = functions.radioButtonField.querySelectorAll('input[type="radio"]')
    let flag = false
    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      currentRadioIdx = (currentRadioIdx - 1 + radioBtns.length) % radioBtns.length
      flag = true
    } else if (key === 'ArrowDown' || key === 'ArrowRight') {
      currentRadioIdx = (currentRadioIdx + 1) % radioBtns.length
      flag = true
    }

    if (flag) {
      radioBtns[currentRadioIdx].focus()
      radioBtns[currentRadioIdx].checked = true
    }
  }

  if (key === 'Enter') {
    if (functions.scoreBox.style.display === 'block') {
      functions.restartButtonClick(event)
    } else if (functions.quizBox.style.display === 'none') {
      functions.startButtonClick(event)
    } else {
      functions.submitButtonClick(event)
    }
  }
})
