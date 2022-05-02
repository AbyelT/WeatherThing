/**
 * Main app logic.
 */

import { currentWeather, autocomplete } from './api.js'
import { debounce, populate } from './util.js'

/**
 * Fetches the weather for the given time and position and displays it.
 * @return {Promise<void>}
 */
const updateWeather = async () => {
  const lat = document.getElementById('lat').value
  const lon = document.getElementById('lon').value
  const time = document.getElementById('time').value
  const unit = document.getElementById('units').value
  const res = document.getElementById('res')
  const data = await currentWeather(lat, lon, time, unit)

  //a function for taking the data, creating all html elements
  //and populating them with data
  const structure = populate(data)

  //TODO: create a structure for data, then fix format
  console.log(data)
  console.log(data.current)

  res.innerHTML = structure
}

/**
 * App entry point.
 * @return {Promise<void>}
 */
document.body.onload = async () => {
  const input = document.getElementById('input')
  const units = document.getElementById('units')
  const suggestions = document.querySelector('.suggestions ul')
  const time = document.getElementById('time')

  /**
   * Looks up a term in the autocomplete API and populates the
   * places "dropdown" from the autocomplete API response.
   * @return {Promise<void>}
   */
  const search = async () => {
    console.log("hi")

    const text = input.value
    let results = []
    if (text.length > 0) {
      results = await autocomplete(text)
    }
    suggestions.innerHTML = ''
    if (results.length > 0) {
      results.map(({ formatted, lat, lon }) => {
        suggestions.innerHTML += `<li data-lat="${lat}" data-lon="${lon}">${formatted}</li>`
      })
      suggestions.classList.add('has-suggestions')
    } else {
      suggestions.classList.remove('has-suggestions')
    }
  }

  // add input change event listener
  input.addEventListener('keyup', debounce(search, 250))
  units.addEventListener('change', debounce(search, 250))

  // add suggestion selection event listener
  suggestions.addEventListener('click', (ev) => {
    input.value = ev.target.innerHTML
    document.getElementById('lat').value = ev.target.dataset.lat
    document.getElementById('lon').value = ev.target.dataset.lon
    input.focus()
    suggestions.innerHTML = ''
    suggestions.classList.remove('has-suggestion')
    updateWeather()
  })

  // add event listener for time selection/change
  time.addEventListener('input', debounce(async () => {
    await updateWeather()
  }, 500))

  // add event listener for GPS button (if available)
  if ('geolocation' in navigator) {
    const gps = document.getElementById('gps')
    gps.addEventListener('click', () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        document.getElementById('lat').value = position.coords.latitude
        document.getElementById('lon').value = position.coords.longitude
        document.getElementById('input').value = ''
        await updateWeather()
      })
    })
  } else {
    // TODO: maybe should be hidden if not available
    document.getElementById('gps').disabled = true
  }

  // pre-load some data to visualize on page load
  await updateWeather()
}
