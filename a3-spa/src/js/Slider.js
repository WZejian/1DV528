/**
 * This app is to show pictures automatically in a window.
 */
class Slider {
  constructor (windowNum) {
    this.windowNum = windowNum
    this.timer = null
    this.num = 0
  }

  /**
   * Runs this app.
   */
  run () {
    document.getElementById(`close${this.windowNum}`).addEventListener('click', this.close.bind(this))
    this.big_box = document.querySelector('#big_box' + this.windowNum)
    console.log('this.big_box: ' + this.big_box + this.windowNum)
    this.ul = document.querySelector('#ul' + this.windowNum)
    console.log('this.ul: ' + this.ul)
    this.ol = document.querySelector('#ol' + this.windowNum)
    console.log('this.ol: ' + this.ol)
    this.lis_img = this.ul.querySelectorAll('li')
    console.log('this.lis_img: ' + this.lis_img)
    this.left = document.querySelector('#left' + this.windowNum)
    this.right = document.querySelector('#right' + this.windowNum)

    for (let i = 0; i < this.lis_img.length; i++) {
      const li = document.createElement('li')
      this.ol.appendChild(li)
      li.setAttribute('index', i)

      if (i === 0) {
        li.className = 'current'
      }

      li.addEventListener('click', function () {
        for (let j = 0; j < this.ol.children.length; j++) {
          this.ol.children[j].className = ''
        }

        this.className = 'current'
        const index = this.getAttribute('index')
        this.animate(this.ul, -index * this.big_box.offsetWidth)
        this.circlechange(circles, index)
      })
    }

    const circles = this.ol.querySelectorAll('li')
    const imgs = this.ul.children[0].cloneNode(true)
    this.ul.appendChild(imgs)

    this.right.addEventListener('click', () => {
      if (this.num >= this.lis_img.length) {
        this.num = 0
        this.ul.style.left = 0 + 'px'
      }

      this.num++
      this.animate(this.ul, -this.num * this.big_box.offsetWidth)
      this.circlechange(circles, this.num)
    })

    this.left.addEventListener('click', () => {
      if (this.num <= 0) {
        this.num = this.lis_img.length
        this.ul.style.left = -this.lis_img.length * this.big_box.offsetWidth + 'px'
      }

      this.num--
      this.animate(this.ul, -this.num * this.big_box.offsetWidth)
      this.circlechange(circles, this.num)
    })

    this.timer = setInterval(() => {
      this.right.click()
    }, 1000)

    this.big_box.addEventListener('mouseover', () => {
      clearInterval(this.timer)
    })

    this.big_box.addEventListener('mouseout', () => {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.right.click()
      }, 1000)
    })
  }

  /**
   * Makes the element automatically move horizontally to a target position.
   * @param {*} obj - The element to be animated.
   * @param {number} target - The target left offset to which the element will be moved.
   */
  animate (obj, target) {
    const timer1 = setInterval(() => {
      const current = obj.offsetLeft
      let step = 20
      step = current > target ? -step : step

      if (Math.abs(current - target) <= Math.abs(step)) {
        clearInterval(timer1)
        obj.style.left = target + 'px'
      } else {
        obj.style.left = current + step + 'px'
      }
    }, 20)
  }

  /**
   * Circle updates when a picture slides.
   * @param {*} circles - A collection of elements representing circles.
   * @param {number} circle - Current circle.
   */
  circlechange (circles, circle) {
    if (circle === this.lis_img.length) {
      circle = 0
    }

    for (let i = 0; i < circles.length; i++) {
      circles[i].className = ''
    }

    circles[circle].className = 'current'
  }

  /**
   * Close the current window.
   */
  close () {
    const window = document.getElementById(`window${this.windowNum}`)
    window.parentNode.removeChild(window)
  }
}

/**
 * Exports this module.
 */
export { Slider }
