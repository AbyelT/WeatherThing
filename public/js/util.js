/**
 * Generic utilities.
 */

const OW_ICON = "https://openweathermap.org/img/wn/"
const PNG = "@2x.png"

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


const populate = (data) => {
  let details = data.current
  let weather = data.current.weather[0]
  let structure = `<div>
    <div id="weather-div">
      <h2 id="status">${weather.description}</h2>
      <img id="icon" src="${OW_ICON + weather.icon + PNG}" alt="please wait..."/>
    </div>
    <p>Location: <span id="location">${details.description}</span></p>
    <p>Time: <span id="time">${weather.description}</span></p>
    <p>Temperature: <span id="temp"></span></p>
    <p>Feels like: <span id="feelslike"></span></p>
  </div>`
  
  
  return structure

  /*
  resWeather.innerText = weather.description
  resIcon.innerText = "he" */
}

export {
  debounce, populate
}