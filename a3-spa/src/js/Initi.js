/**
 * Imports all modules needed.
 */
import { Window } from './Window.js'
import { Chat } from './Chat.js'
import { Memory } from './Memory.js'
import { Slider } from './Slider.js'

/**
 * Global variables to differentiate windows.
 */
let container
let windowNum = 0
let clickedWindow = null
let zIndex = 0
let stateX = 0
let stateY = 0
let xMouse = 0
let yMouse = 0
let xElement = 0
let yElement = 0

/**
 * Clicks app icon to create accordingly windows.
 */
function init () {
  container = document.getElementById('container')
  document.querySelector('#memo').addEventListener('click', startApp)
  document.querySelector('#chat').addEventListener('click', startApp)
  document.querySelector('#slider').addEventListener('click', startApp)
}

window.addEventListener('load', init)

/**
 * Starts accordingly app when clicked the app icon.
 * @param {object} event - Click event.
 */
function startApp (event) {
  stateX += 40
  stateY += 40
  if (stateY >= 500) {
    stateY = 1.5 * stateX
    stateX = 20
  }
  zIndex++
  windowNum++
  let app
  const newWindow = new Window(windowNum, String(event.target.id), zIndex, stateX, stateY).generateWindow()
  container.appendChild(newWindow)
  newWindow.addEventListener('drag', dragWindow(newWindow))
  console.log('event.target.id: ' + event.target.id)
  switch (event.target.id) {
    case 'chat':
      app = new Chat(windowNum)
      break
    case 'memo':
      app = new Memory(windowNum)
      break
    case 'slider':
      app = new Slider(windowNum)
      break
    default:
      break
  }
  app.run()
}

/**
 * Drags the window selected.
 * @param {*} window -window to drag.
 */
function dragWindow (window) {
  window.onmousedown = function () {
    drag(this)
    return false
  }

  document.onmousemove = move
  document.onmouseup = stop
}

/**
 * Drag func.
 * @param {*} window -app window to drag.
 */
function drag (window) {
  clickedWindow = window
  xElement = xMouse - clickedWindow.offsetLeft
  yElement = yMouse - clickedWindow.offsetTop
  zIndex++
  window.style.zIndex = zIndex
}

/**
 * Move func.
 * @param {*} e -event.
 */
function move (e) {
  xMouse = document.all ? window.event.clientX : e.pageX
  yMouse = document.all ? window.event.clientY : e.pageY

  if (clickedWindow !== null) {
    clickedWindow.style.left = (xMouse - xElement) + 'px'
    clickedWindow.style.top = (yMouse - yElement) + 'px'
  }
}

/**
 * Stop dragging func.
 */
function stop () {
  clickedWindow = null
}
