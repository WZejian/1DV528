/**
 * Root window for all apps to differentiate each of them.
 */
class Window {
  constructor (windowNum, app, zIndex, stateX, stateY) {
    this.windowNum = windowNum
    this.app = app
    this.zIndex = zIndex
    this.stateX = stateX
    this.stateY = stateY
  }

  /**
   * Generates a new window element with specific attributes and content.
   * @returns {HTMLDivElement} - The newly created window element.
   */
  generateWindow () {
    console.log('app: ' + this.app)
    const window = document.createElement('div')
    window.setAttribute('id', 'window' + this.windowNum)
    window.setAttribute('class', 'window')

    const option = document.createElement('div')
    option.innerHTML = this.option(this.app)
    window.appendChild(option)

    const header = document.createElement('div')
    header.setAttribute('id', 'window' + this.windowNum + 'header')
    header.setAttribute('class', 'header')
    window.appendChild(header)

    const closeImg = document.createElement('img')
    closeImg.setAttribute('id', 'close' + this.windowNum)
    closeImg.setAttribute('src', '/img/close.png')
    header.appendChild(closeImg)

    window.insertAdjacentHTML('beforeend', this.mainBlock(this.app))
    window.style.top = this.stateX + 'px'
    window.style.left = this.stateY + 'px'
    window.style.zIndex = this.zIndex

    return window
  }

  /**
   * Generates the header content for different apps.
   * @param {string} app - The identifier for the app.
   * @returns {string} - The HTML content representing the header for the app.
   */
  option (app) {
    switch (app) {
      case 'memo':
        return `
        <span id="timer${this.windowNum}"></span>
        <ul id = "grid${this.windowNum}" class="custom-options">
          <li class="custom-option">
              <input type="radio" id="option1" name="options" value="16" checked>
              <label for="option1">4x4</label>
          </li>
          <li class="custom-option">
              <input type="radio" id="option2" name="options" value="4">
              <label for="option2">2x2</label>
          </li>
          <li class="custom-option">
              <input type="radio" id="option3" name="options" value="8">
              <label for="option3">2x4</label>
          </li>
        </ul>`
      case 'chat':
        return `
          </div>
            <p id="connectionState${this.windowNum}" class="connectionState"></p>
          </div>
          <div class="username"> 
            <input autocomplete="off" class="username-input" id="username${this.windowNum}" type="text" placeholder="Enter username" style="width: 120px;">
          </div>`
      case 'slider':
        return ` 
              <div id="circleBox${this.windowNum}" class="circlebox">
                <ol class="circle"></ol>
              </div>`
      default:
        return ''
    }
  }

  /**
   * Makes the main body of each different app.
   * @param {string} app - The identifier for the app.
   * @returns {string} - The HTML content representing the header for the app.
   */
  mainBlock (app) {
    switch (app) {
      case 'memo':
        return `
              <div id="cards${this.windowNum}" class="cards"></div>
              <div id="userMessage${this.windowNum}"></div>`
      case 'chat':
        return `
              <div id="chat${this.windowNum}" class="chatDiv">
                <label>Chat Area</label>    
                <textarea id="chatArea${this.windowNum}" class="chatArea"></textarea>
                <div id="inputArea" class="inputArea">
                  <p class="message_reminder">Press ENTER to send your message</p>
                  <p><textarea cols="50" class="userMessage" id="userMessage${this.windowNum}"></textarea></p>
                </div>
              </div>`
      case 'slider':
        return `
              <div id="big_box${this.windowNum}" class="big_box">
              <ul id="ul${this.windowNum}">
                <li><img src="/img/slider1.png" alt=""></li>
                <li><img src="/img/slider2.png" alt=""></li>
                <li><img src="/img/slider3.png" alt=""></li>
                <li><img src="/img/slider4.png" alt=""></li>
                <li><img src="/img/slider5.png" alt=""></li>
              </ul>
              <div id="left${this.windowNum}"class="left">&lt</div>
              <div id="right${this.windowNum}" class="right">&gt</div>
              <ol id="ol${this.windowNum}">
                </ol>
              </div> `
      default:
        return ''
    }
  }
}

export { Window }
