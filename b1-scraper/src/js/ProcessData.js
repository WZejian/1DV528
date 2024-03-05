const log = console.log

/**
 * Data processing to make reservations.
 * @param {object} retrievedData - data object retrieved.
 */
function processData (retrievedData) {
  const days = analyzeCalendar(retrievedData.calendar)
  const availableDays = findAvailableDays(days)

  if (availableDays.length === 0) {
    log('No reservations found')
  } else {
    log('\nRecommendations:')
    for (const day of availableDays) {
      processDay(retrievedData, day)
    }
  }
}

/**
 * Analyzes Calendar data.
 * @param {object} calendar - calendar object
 * @returns {object} - days object.
 */
function analyzeCalendar (calendar) {
  const days = {}

  for (const i in calendar) {
    for (const j in calendar[i]) {
      if (calendar[i][j] === 'ok') {
        days[j] = (days[j] || 0) + 1
      }
    }
  }
  return days
}

/**
 * Avalable days found.
 * @param {object} days - days object.
 * @returns {Array} - list of available days.
 */
function findAvailableDays (days) {
  const availableDays = []
  for (const i in days) {
    if (days[i] === 3) {
      availableDays.push(i)
    }
  }
  return availableDays
}

/**
 * Processes data with days.
 * @param {object} data - data object retrieved from page.
 * @param {string} day - day String.
 */
function processDay (data, day) {
  const movies = data.movies[day] || {}
  const dinner = data.dinner[day] || []
  const possibleReservations = findPossibleReservations(movies, dinner)

  if (possibleReservations.length === 0) {
    log('No reservations found on ' + day)
  } else {
    printReservations(day, possibleReservations)
  }
}

/**
 * Finding possible reservations depending on time.
 * @param {object} movies - movies object.
 * @param {object} dinner - dinnero object
 * @returns {Array} - list of possible reservations.
 */
function findPossibleReservations (movies, dinner) {
  const possibleReservations = []
  for (const movie in movies) {
    for (const movieTime of movies[movie]) {
      const movieHour = parseInt(movieTime.split(':')[0])
      for (const dinnerTime of dinner) {
        const dinnerHour = parseInt(dinnerTime.split(':')[0])
        if (dinnerHour - movieHour >= 2) {
          possibleReservations.push([movie, movieTime, dinnerTime])
        }
      }
    }
  }
  return possibleReservations
}

/**
 * Prints the reservations.
 * @param {string} day - day String.
 * @param {Array} possibleReservations - list of possible reservations.
 */
function printReservations (day, possibleReservations) {
  for (const reservation of possibleReservations) {
    console.log('On ' + day +
      ' the movie ' + reservation[0].trim() +
      ' starts at ' + reservation[1] +
      ' and there is a free table between ' +
      reservation[2].split(' ').join(''))
  }
}

export default processData
