/**
 * Generic utilities.
 */

const OW_ICON = 'https://openweathermap.org/img/wn/'
const PNG = '@2x.png'
const UNITS = { metric: '°C', standard: '°F', imperial: ' K' }

/**
 * Returns a new function that runs at most once every `interval` ms.
 * @param {function} cb
 * @param {number} interval
 * @return {function}
 */
const debounce = (cb, interval) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      cb(...args)
    }, interval)
  }
}

/**
 * Generate HTML for a weather data object.
 * @param {*} result
 * @param {string} unit
 * @return {string}
 */
const populate = ({ result, unit }) => {
  const formatted = result.places[0]?.formatted || 'Earth' // default to something if none available
  const details = result.data
  const weather = result.data.weather[0]
  return `<div>
    <div class="columns is-centered">      
      <h2 class="column content is-one-third is-vcentered is-large is-white" id="status">${weather.description}</h2>
      <figure class="image is-96x96">
        <img id="icon" class="is-rounded" src="${OW_ICON + weather.icon + PNG}" alt="please wait..."/>
      </figure>
    </div>

    <div class="column"> 
      <div class="columns" id="data-details">
        <div class="column is-half">
          <div>
            <p id="location" class="detail" >Location: ${formatted}</p>
            <p id="temp" class="detail" >Temperature: ${details.temp + UNITS[unit]}</p>
            <p id="humidity" class="detail" >Humidity: ${details.humidity + '%'}</p>
          </div>
        </div>
        <div class="column is-half">
          <div>
            <p  id="time" class="detail"> Time: ${result.timestamp}</p>
            <p  id="feelslike" class="detail" >Feels like: ${details.feels_like + UNITS[unit]}</p>
            <p  id="clouds" class="detail"> Clouds: ${details.clouds + '%'}</p>
          </div>
         </div>
      </div>
    </div>
  </div>`
}

export {
  debounce, populate
}
