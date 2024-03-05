/**
 * This chat is to send and receive message via web socket and can see the history of the chat.
 */
class Chat {
  constructor (windowNum) {
    this.windowNum = windowNum
    this.username = ''
    this.webSocket = null
  }

  /**
   * Run the app.
   */
  run () {
    document.getElementById(`close${this.windowNum}`).addEventListener('click', this.close.bind(this))
    const connectionState = document.getElementById(`connectionState${this.windowNum}`)
    const cachedChat = localStorage.getItem('cachedChat')
    const chatArea = document.getElementById(`chatArea${this.windowNum}`)
    chatArea.value = cachedChat

    this.webSocket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket')
    this.webSocket.onopen = function (event) {
      connectionState.innerText = 'Connection built!'
    }

    this.webSocket.onerror = function (event) {
      connectionState.innerText = 'No Connection!'
    }

    this.webSocket.onmessage = function (event) {
      const msg = JSON.parse(event.data)
      const newMsg = msg.username + ': ' + msg.data
      console.log('newMsg: ' + newMsg)
      if (msg.type === 'message' && msg.data != '') {
        chatArea.value += '\n' + newMsg
        localStorage.setItem('cachedChat', chatArea.value)
      }
    }

    this.username = window.localStorage.getItem('username') === null ? '' : window.localStorage.getItem('username')
    if (this.username === '') {
      document.getElementById(`username${this.windowNum}`).focus()
      document.getElementById(`username${this.windowNum}`).addEventListener('keypress', this.addUser.bind(this))
    } else {
      document.getElementById(`userMessage${this.windowNum}`).focus()
      document.getElementById(`username${this.windowNum}`).style.display = 'none'
      document.getElementById(`userMessage${this.windowNum}`).addEventListener('keypress', this.pressedEnter.bind(this))
    }
  }

  /**
   * New user should add username to use this app.
   */
  addUser () {
    this.username = document.getElementById(`username${this.windowNum}`).value
    window.localStorage.setItem('username', this.username)
    document.getElementById(`userMessage${this.windowNum}`).disabled = false
    document.getElementById(`userMessage${this.windowNum}`).focus()
    document.getElementById(`userMessage${this.windowNum}`).addEventListener('keydown', this.pressedEnter.bind(this))
  }

  /**
   * Enter key pressed to send message.
   * @param {*} event -enter key pressed.
   */
  pressedEnter (event) {
    if (event.keyCode === 13) {
      this.sendMessage(event.target.value)
      event.target.value = ''
      event.preventDefault()
    }
  }

  /**
   * Close current chat app window.
   */
  close () {
    const window = document.getElementById(`window${this.windowNum}`)
    window.parentNode.removeChild(window)
  }

  /**
   * Connection to the server using WebSocket.
   * @returns {*} - A Promise that resolves to the WebSocket instance based on successful connection.
   */
  connect () {
    return new Promise((resolve, reject) => {
      if (this.webSocket && this.webSocket.readyState === 1) { // check if connection is already open
        resolve(this.webSocket) // then return it direcly
        console.log('connect first')
        return
      }
      this.webSocket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket')
      this.webSocket.onopen = () => {
        resolve(this.webSocket)
        console.log('connected!')
      }
      this.webSocket.onerror = () => reject(this.webSocket)
      this.webSocket.onmessage = (event) => {
        console.log('data: ' + event.data)
        this.printMessage(JSON.parse(event.data)) // display messages when server get a message
      }
    })
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.webSocket && this.webSocket.readyState === 1) { // check if connection is already open
        resolve(this.webSocket); // then return it directly
        console.log('connect first');
        return;
      }
  
      this.webSocket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket');
      this.webSocket.onopen = () => {
        resolve(this.webSocket);
        console.log('connected!');
        // 仅在连接成功时添加 onmessage 处理程序
        this.webSocket.onmessage = (event) => {
          console.log('data: ' + event.data);
          this.printMessage(JSON.parse(event.data)); // display messages when server gets a message
        };
      };
  
      this.webSocket.onerror = () => reject(this.webSocket);
    });
  }
  


  /**
   * Sends text of user message via websocket.
   * @param {*} text -typed msg.
   */
  sendMessage (text) {
    const data = {
      type: 'message',
      data: text,
      username: this.username,
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
    }
    this.connect().then(function (webSocket) {
      webSocket.send(JSON.stringify(data))
      console.log('sent msg!')
    }).catch(function (error) {
      console.log('Error: ', error)
    })
  }

  /**
   * Show the messages on the chat area.
   * @param {*} message -message to show
   */
  printMessage (message) {
    if (message.type === 'message') {
      const newMsg = message.username + ': ' + message.data
      console.log('newMsg: ' + newMsg)
      document.getElementById(`chatArea${this.windowNum}`).value += '\n' + newMsg
      localStorage.setItem('cachedChat', document.getElementById(`chatArea${this.windowNum}`).value)
    }
  }
}
/**
 * Export this module.
 */
export { Chat }
