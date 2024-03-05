import initiateDataRetrieval from './WebScraper.js'
import processData from './ProcessData.js'

const url = process.argv[2]
/**
 * Start the retrieving and processing its data.
 */
async function main () {
  try {
    const retrievedData = await initiateDataRetrieval(url)
    processData(retrievedData)
  } catch (error) {
    console.error('Error:', error)
  }
}

main()
