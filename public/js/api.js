/**
 * API utilities.
 */

// OpenWeather API
const OW_API_URL = 'https://api.openweathermap.org'
const OW_API_KEY = '7e2389469a7fba48ac9018ae82d03f6f'

// Geoapify API
const GA_API_URL = 'https://api.geoapify.com'
const GA_API_KEY = '61cdc978b1ed40c39956b5bfa1aea0af'

/**
 * Performs a GET on a given endpoint and returns a promise
 * representing the JSON response.
 * @param {string} endpoint
 * @param {*} params
 * @returns {Promise<*>}
 */
const get = (endpoint, params) => {
  const url = new URL(endpoint)
  url.search = new URLSearchParams(params).toString()
  return window.fetch(url, {
    method: 'GET'
  }).then(handleRes)
}

/**
 * Handles a response and returns a promise representing the
 * JSON response. Throws if the response status is not
 * successful (2xx).
 * @param {Response} res
 * @returns {Promise<*>}
 */
const handleRes = (res) => {
  if (!res.ok) {
    throw new Error(res.status) // TODO: losing error info here
  }

  return res.json()
}

/**
 * Looks up the current or forecasted weather on the OpenWeather API for a given
 * position. If the given time {time} is higher than zero then the 
 * the forecasted weather is returned, else the current weather is given
 * @example
 * // returns a promise representing the API response
 * currentWeather({ lat: 59.3326, lon: 18.0649, time: 0 })
 * @example
 * // example response
 * {
  "lat": 0,
  "lon": 0,
  "timezone": "Etc/GMT",
  "timezone_offset": 0,
  "current": {
    "dt": 1651218396,
    "sunrise": 1651211629,
    "sunset": 1651255241,
    "temp": 27.35,
    "feels_like": 29.87,
    "pressure": 1012,
    "humidity": 74,
    "dew_point": 22.31,
    "uvi": 1.04,
    "clouds": 100,
    "visibility": 10000,
    "wind_speed": 4.71,
    "wind_deg": 160,
    "wind_gust": 4.4,
    "weather": [
      {
        "id": 804,
        "main": "Clouds",
        "description": "overcast clouds",
        "icon": "04d"
      }
    ]
  },
  "time": "Fri Apr 29 2022 09:46:36 GMT+0200 (Central European Summer Time)"
}
 * @param {number|string} lat
 * @param {number|string} lon
 * @param {number|string} time amount hours to forecast
 * @param {number|string} unit temperature unit
 * @return {Promise<*>} the current or forecasted weather
 */
const currentWeather = async (lat, lon, time, units) => {
  let exclude="minutely,alerts,daily"
  // check if user wants current or forecast weather
  /* if(time != 0) {
    exclude="current,minutely,alerts,daily"
  } else {
    exclude="hourly,minutely,alerts,daily"
  } */

  //fetch
  const weather = await get(`${OW_API_URL}/data/2.5/onecall`, {
    appid: OW_API_KEY,
    lat,
    lon,
    exclude: exclude,
    units: units,
  }) // TODO: error handling?

  // if time > 0, convert to hourly forecast. 
  // else convert to current time
  if(time > 0) {
    delete weather.current
    weather.hourly = weather.hourly[time-1]
    weather.time = new Date(weather.hourly.dt*1000 + weather.timezone_offset*1000).toString()
    return weather
  }
  else {
    delete weather.hourly
    weather.time = new Date(weather.current.dt*1000).toString();      // dont need +weather.timezone_offset*1000
    return weather
  }
}

/**
 * Looks up a search term in the Geoapify API and returns a promise
 * representing possible matches.
 * @example
 * // returns a promise representing the API response
 * autocomplete('Stock')
 * @example
 * // example response (only relevant fields)
 * [
 *   {
 *     ...
 *     "lon": 23.3967712,
 *     "lat": 53.6486022,
 *     "formatted": "Stock, Sokółka County, Poland",
 *     "city": "Stock",
 *     "country": "Poland"
 *   },
 *   ...
 * ]
 * @param {string} text
 * @return {Promise<[*]>}
 */
const autocomplete = (text) => {
  return get(`${GA_API_URL}/v1/geocode/autocomplete`, {
    apiKey: GA_API_KEY,
    text
  }).then(({ features }) => {
    return features.map(({ properties }) => properties)
  })
}

export {
  currentWeather, autocomplete
}
