/**
 * This app is to play a memory game, a grid of cards of 4, 8 and 16.
 */
class Memory {
  constructor (windowNum) {
    this.windowNum = windowNum
    this.attempts = 0
    this.matchedCard = 0
    this.flippedCard = []
    this.faceCard = []
  }

  /**
   * Runs the app.
   */
  run () {
    document.getElementById(`cards${this.windowNum}`).addEventListener('click', this.clickCard.bind(this))
    document.getElementById(`cards${this.windowNum}`).addEventListener('keydown', this.keyBoard.bind(this))
    document.getElementById(`grid${this.windowNum}`).addEventListener('keydown', this.keyBoard.bind(this))
    document.getElementById(`close${this.windowNum}`).addEventListener('click', this.close.bind(this))
    document.getElementById(`grid${this.windowNum}`).addEventListener('change', this.removeCards.bind(this))
    document.getElementById(`grid${this.windowNum}`).addEventListener('change', this.generateCards.bind(this))
    this.generateCards(16)
    this.randomizedCards()
  }

  /**
   * Clicks the card.
   * @param {*} event -click event.
   */
  clickCard (event) {
    if (Number.isInteger(Number(event.target.id)) && this.flippedCard.length < 2) {
      this.cardPair[event.target.id].src = `/img/${[this.faceCard[event.target.id]]}.png`
      this.flippedCard.push(event.target.id)

      if (this.flippedCard.length === 2) {
        setTimeout(() => {
          const first = this.flippedCard.pop()
          const second = this.flippedCard.pop()

          if (first !== second) {
            this.attempts++
            const checkResult = this.faceCard[first] === this.faceCard[second]

            setTimeout(() => {
              if (checkResult) {
                this.cardPair[first].style.opacity = 0
                this.cardPair[second].style.opacity = 0
                this.cardPair[first].tabIndex = -1
                this.cardPair[second].tabIndex = -1
                this.matchedCard += 2

                if (this.matchedCard === this.cardPair.length) {
                  this.removeCards(0)
                  document.getElementById(`userMessage${this.windowNum}`).innerHTML = `Bravo! ${this.attempts} attempts in ${this.timer(-1)} seconds!`
                }
              } else {
                this.cardPair[first].src = '/img/0.png'
                this.cardPair[second].src = '/img/0.png'
              }
            }, 300)
          } else {
            this.flippedCard.push(first)
          }
        }, 300)
      }
    }
  }

  /**
   * Generates new cards according to the number of cards.
   * @param {*} event -Number of cards.
   */
  generateCards (event) {
    for (let i = 0; i < Number(event); i++) {
      const img = document.createElement('img')
      img.setAttribute('src', '/img/0.png')
      img.setAttribute('tabindex', i === 0 ? 0 : -1) // 设置第一张牌的tabIndex为0，其他为-1
      img.setAttribute('id', i)
      img.setAttribute('class', 'memoDiv')
      img.style.height = 60 + 'px'
      img.style.width = 60 + 'px'
      document.getElementById(`cards${this.windowNum}`).appendChild(img)
    }
    this.cardPair = document.getElementById(`cards${this.windowNum}`).getElementsByTagName('img')
    for (let i = 0; i < this.cardPair.length; i++) {
      this.cardPair[i].src = '/img/0.png'
    }
    if (this.cardPair.length > 0) {
      this.cardPair[0].focus() // 让第一张牌获得焦点
    }
  }

  /**
   * Makes the cards random.
   */
  randomizedCards () {
    document.getElementById(`userMessage${this.windowNum}`).innerHTML = ''
    this.attempts = 0
    this.matchedCard = 0
    this.faceCard.length = 0
    const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
    values.length = this.cardPair.length
    this.faceCard = values.sort(() => Math.random() - 0.5)
    this.timer(0)
  }

  /**
   * Removes all the cards.
   * @param {number} event -number of cards.
   */
  removeCards (event) {
    const cardsContainer = document.getElementById(`cards${this.windowNum}`)

    while (cardsContainer.firstChild) {
      cardsContainer.removeChild(cardsContainer.firstChild)
    }
    if (event !== 0) {
      this.generateCards(Number(event.target.value))
      this.randomizedCards()
    }
  }

  /**
   * Timer function to start and stop timing.
   * @param {number} option - A parameter indicating whether to start or stop the timer.
   * @returns {number|undefined} - a timer number.
   */
  timer (option) {
    return option === 0 ? (this.startValue = Date.now()) : Math.floor((Date.now() - this.startValue) / 1000)
  }

  /**
   * Close the current window.
   */
  close () {
    const window = document.getElementById(`window${this.windowNum}`)
    window.parentNode.removeChild(window)
  }

  /**
   * Keyboard key to use to play the game.
   * @param {*} event -click event.
   */
  keyBoard (event) {
    const id = Number(document.activeElement.id)
    switch (event.key) {
      case 'Enter':
      case ' ': // ENTER key
        this.clickCard(event)
        break
      case 'ArrowLeft':
        if (id !== 0) {
          this.cardPair[id].previousElementSibling.focus()
        }
        break
      case 'ArrowRight':
        if (id !== this.cardPair.length - 1) {
          this.cardPair[id].nextElementSibling.focus()
        }
        break
      case 'ArrowUp':
        if (id > 3) {
          this.cardPair[id - 4].focus()
        }
        break
      case 'ArrowDown':
        if (id < this.cardPair.length - 4) {
          this.cardPair[id + 4].focus()
        }
        break
      default:
        document.getElementById(`grid${this.windowNum}`).focus()
    }
  }
}

/**
 * Exports this module.
 */
export { Memory }
