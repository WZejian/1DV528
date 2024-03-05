import { JSDOM } from 'jsdom'
import nodeFetch from 'node-fetch'
import fetchCookie from 'fetch-cookie'
const fetch = fetchCookie(nodeFetch)
const log = console.log

/**
 * Starts retrieving data.
 * @param {string} url - The url to start retrieving data.
 * @returns {object} data - data object.
 */
async function initiateDataRetrieval (url) {
  try {
    const [links, text] = await retrieveLinks(url)
    if ([links, text] != null) {
      log('Scraping: links... OK!')
    } else {
      log('Scraping: links... FAILED!')
    }
    const data = {}

    for (let i = 0; i < links.length; i++) {
      const textKey = text[i].toLowerCase()

      if (textKey === 'calendar') {
        data.calendar = await retrieveCalendar(links[i])
      } else if (textKey === 'the cinema') {
        data.movies = await retrieveCinemaWithMovieTimes(links[i])
      } else if (textKey === 'zekes bar') {
        data.dinner = await retrieveBar(links[i])
      }
    }
    return data
  } catch (error) {
    console.error('Error during initiateDataRetrieval:', error)
    throw error
  }
}

/**
 * Retrieve page content.
 * @param {string} url - the url to retrieve html page content.
 * @returns {string} - the text of pageContent.
 */
async function retrievePageContent (url) {
  const res = await fetch((url))
  return res.text()
}

/**
 * Retrieves the links in the page.
 * @param {string} url - the url to retrieve.
 * @returns {Array} - An array of links and linkText
 */
async function retrieveLinks (url) {
  const pageContent = await retrievePageContent(url)
  const dom = new JSDOM(pageContent)
  const anchorElements = dom.window.document.querySelectorAll('a')
  const links = []
  const linksText = []
  anchorElements.forEach(a => links.push(a.href))
  anchorElements.forEach(a => {
    const cleanedText = a.textContent.replace(/[^\w\s]/gi, '').trim()
    linksText.push(cleanedText)
  })

  return [links, linksText]
}

/**
 * Retrieve calendar data.
 * @param {string} url - the url to retrieve.
 * @returns {object} - return calendar object.
 */
async function retrieveCalendar (url) {
  // retrieve the links and their corresponding texts from the provided URL
  const linksData = await retrieveLinks(url)
  const links = linksData[0]
  const linkTexts = linksData[1]

  const calendarsData = {}
  for (let i = 0; i < links.length; i++) {
    const pageContent = await retrievePageContent(url + links[i])
    const dom = new JSDOM(pageContent)
    const table = dom.window.document.querySelector('table')
    const headerElements = table.querySelectorAll('th')
    const tableDataElements = table.querySelectorAll('td')
    const headers = []
    const tableData = []
    headerElements.forEach(element => headers.push(element.textContent))
    tableDataElements.forEach(element => tableData.push(element.textContent))

    const calendar = {}
    for (let j = 0; j < headers.length; j++) {
      calendar[headers[j]] = tableData[j].toLowerCase()
    }

    calendarsData[linkTexts[i]] = calendar
  }
  if (calendarsData) {
    log('Scraping: available days... OK!')
  } else {
    log('Scraping: available days... FAILED!')
  }

  return calendarsData
}

/**
 * Retrieves the cinema data.
 * @param {string} url - the url to retrieve.
 * @returns {object} return movie time object.
 */
async function retrieveCinemaWithMovieTimes (url) {
  /**
   * @param {string} innerUrl -url of movie
   * @param {string} day - calendar day
   * @param {string} movie - movie name
   * @returns {object} - time data object
   */
  async function retrieveMovieTime (innerUrl, day, movie) {
    const response = await fetch(innerUrl + '/check?day=' + day + '&movie=' + movie)
    const data = await response.json()
    const timeData = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].status === 1) {
        timeData.push(data[i].time)
      }
    }
    return timeData
  }

  const pageContent = await retrievePageContent(url)
  const dom = new JSDOM(pageContent)
  const selects = dom.window.document.querySelectorAll('select')
  const optionNames = {}
  const optionValues = {}

  for (let i = 0; i < selects.length; i++) {
    let options = selects[i].querySelectorAll('option')
    options = Array.from(options).slice(1)
    const attrName = selects[i].getAttribute('name')
    optionNames[attrName] = []
    optionValues[attrName] = []

    for (const option of options) {
      optionNames[attrName].push(option.textContent)
      optionValues[attrName].push(option.value)
    }
  }

  const timeRes = {}
  for (const movie of optionNames.movie) {
    for (const day of optionNames.day) {
      const time = await retrieveMovieTime(url, optionValues.day[optionNames.day.indexOf(day)], optionValues.movie[optionNames.movie.indexOf(movie)])
      if (time.length > 0) {
        if (!timeRes[day]) {
          timeRes[day] = {}
        }
        timeRes[day][movie] = time
      }
    }
  }
  if (timeRes) {
    log('Scraping: showtimes... OK!')
  } else {
    log('Scraping: showtimes... FAILED!')
  }

  return timeRes
}

/**
 * Retrieves the bar data.
 * @param {string} url - the url to retrieve.
 * @returns {object} - bar data object.
 */
async function retrieveBar (url) {
  const pageContent = await retrievePageContent(url)
  const dom = new JSDOM(pageContent)
  const action = dom.window.document.querySelector('form').getAttribute('action')
  const loginPath = url + action.split('./').join('')

  const username = 'zeke'
  const password = 'coys'
  const options = {
    method: 'POST',
    redirect: 'manual',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'username=' + username + '&password=' + password + '&submit=login'
  }

  const response = await fetch(loginPath, options)
  const bookingPath = response.headers.get('location')
  const redirectedPage = await retrievePageContent(bookingPath)
  const dom2 = new JSDOM(redirectedPage)
  const inputsElements = dom2.window.document.querySelectorAll('input')

  const days = []

  for (let i = 0; i < inputsElements.length; i++) {
    days.push(inputsElements[i].value)
  }

  const dayMap = { fri: 'Friday', sat: 'Saturday', sun: 'Sunday' }
  const data = {}

  for (const i of days) {
    const dayAbbrev = i.substring(0, 3)
    const dayFull = dayMap[dayAbbrev]
    if (dayFull) {
      const timeRange = i.substring(3, 5) + ':00 - ' + i.substring(5, 7) + ':00'
      if (!data[dayFull]) data[dayFull] = []
      data[dayFull].push(timeRange)
    }
  }
  if (data) {
    log('Scraping: possible reservations... OK!')
  } else {
    log('Scraping: possible reservations... FAILED!')
  }

  return data
}

export default initiateDataRetrieval
