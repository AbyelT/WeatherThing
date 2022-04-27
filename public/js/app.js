/**
 * App entry point.
 */

import { currentWeather } from './api.js'
import { debounce } from './util.js'

document.body.onload = async () => {
  const button = document.getElementById('button')
  const input = document.getElementById('input')
  const pre = document.querySelector('pre')

  /*
  input.addEventListener('input', debounce(async () => {
    // TODO: implement autocomplete (see geo API or alternative)
  }, 500))
  */

  // add event listener for setting city
  button.addEventListener('click', async () => {
    // TODO: implement
    const res = await currentWeather(input.value)
    pre.innerText = JSON.stringify(res, null, 2)
  })

  // pre-load some data to visualize on page load
  pre.innerText = JSON.stringify(await currentWeather('Stockholm'), null, 2)
}
