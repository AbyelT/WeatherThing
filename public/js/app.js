/**
 * Main app logic.
 */


import { currentWeather, autocomplete } from './api.js'
import { debounce } from './util.js'

/**
 * Fetches the weather for the given time and position and displays it.
 * @return {Promise<void>}
 */
const updateWeather = async () => {
  const lat = document.getElementById('lat').value
  const lon = document.getElementById('lon').value
  const time = document.getElementById('time').value

  const weather = await currentWeather({ lat, lon, time })

  // TODO: presentation
  const pre = document.querySelector('pre')
  pre.innerText = JSON.stringify(weather, null, 2)
}

/**
 * App entry point.
 * @return {Promise<void>}
 */
document.body.onload = async () => {
  const input = document.getElementById('input')
  const suggestions = document.querySelector('.suggestions ul')
  const time = document.getElementById('time')

  /**
   * Looks up a term in the autocomplete API and populates the
   * places "dropdown" from the autocomplete API response.
   * @return {Promise<void>}
   */
  const search = async () => {
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
  time.addEventListener('input', async () => {
    await updateWeather()
  })

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
