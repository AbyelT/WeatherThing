/**
 * Main app logic.
 */

import { currentWeather } from './api.js'
import { debounce } from './util.js'

/**
 * Fetches the weather for the given time and position and displays it.
 * @return {Promise<void>}
 */
const updateWeather = async () => {
  const lat = document.getElementById('lat').value
  const lon = document.getElementById('lon').value

  // TODO: switch on time (different API calls)
  const weather = await currentWeather({ lat, lon })

  // TODO: presentation
  const pre = document.querySelector('pre')
  pre.innerText = JSON.stringify(weather, null, 2)
}

/**
 * App entry point.
 * @return {Promise<void>}
 */
document.body.onload = async () => {
  const button = document.getElementById('button')
  const input = document.getElementById('input')

  /*
  input.addEventListener('input', debounce(async () => {
    // TODO: implement autocomplete (see geo API or alternative)
  }, 500))
  */

  // TODO: set position (lat/lon) in form through autocomplete feature

  // TODO: set time in form in some way
  //  - depending on time (now vs. forecast) we have to perform different calls!

  // TODO: remove this (also button, form will never be submitted, since we just
  //  fetch on change (missing listeners!):
  //  - click on GPS button
  //  - change city (select from autocomplete)
  // add event listener for setting city
  button.addEventListener('click', updateWeather)

  // add event listener for GPS button (if available)
  if ('geolocation' in navigator) {
    const gps = document.getElementById('gps')
    gps.addEventListener('click', () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        document.getElementById('lat').value = position.coords.latitude
        document.getElementById('lon').value = position.coords.longitude
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
