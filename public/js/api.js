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
 * Looks up the current weather on the OpenWeather API for a given
 * position.
 * @example
 * // returns a promise representing the API response
 * currentWeather({ lat: 59.3326, lon: 18.0649 })
 * @example
 * // example response
 * {
 *   "coord": {
 *     "lon": 18.0649,
 *     "lat": 59.3326
 *   },
 *   "weather": [
 *     {
 *       "id": 800,
 *       "main": "Clear",
 *       "description": "clear sky",
 *       "icon": "01d"
 *     }
 *   ],
 *   "base": "stations",
 *   "main": {
 *     "temp": 280.74,
 *     "feels_like": 278.41,
 *     "temp_min": 278.63,
 *     "temp_max": 281.51,
 *     "pressure": 1026,
 *     "humidity": 45
 *   },
 *   "visibility": 10000,
 *   "wind": {
 *     "speed": 3.6,
 *     "deg": 290
 *   },
 *   "clouds": {
 *     "all": 0
 *   },
 *   "dt": 1651053347,
 *   "sys": {
 *     "type": 1,
 *     "id": 1788,
 *     "country": "SE",
 *     "sunrise": 1651028396,
 *     "sunset": 1651084236
 *   },
 *   "timezone": 7200,
 *   "id": 2673730,
 *   "name": "Stockholm",
 *   "cod": 200
 * }
 * @param {number|string} lat
 * @param {number|string} lon
 * @return {Promise<*>}
 */
const currentWeather = ({ lat, lon }) => {
  return get(`${OW_API_URL}/data/2.5/weather`, {
    appid: OW_API_KEY,
    lat,
    lon
  }) // TODO: error handling?
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
  currentWeather,
  autocomplete
}
