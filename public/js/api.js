/**
 * API utilities.
 */

// OpenWeather API
const OW_API_URL = 'https://api.openweathermap.org'
const OW_API_KEY = '426a798fb8aeadc4112a00879b72a17a'

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
 * Extracts the requested weather data part (current or hourly) and transforms it
 * into a common representation.
 * @example
 * // example response
 * {
 *   "lat": 59.5,
 *   "lon": 18,
 *   "timezone": "Europe/Stockholm",
 *   "timezone_offset": 7200,
 *   "timestamp": "Tue May 03 2022 00:00:00 GMT+0200 (Central European Summer Time)",
 *   "data": {
 *     "dt": 1651521600,
 *     "temp": 6.25,
 *     "feels_like": 5.34,
 *     "pressure": 1007,
 *     "humidity": 83,
 *     "dew_point": 3.66,
 *     "uvi": 0,
 *     "clouds": 100,
 *     "visibility": 10000,
 *     "wind_speed": 1.53,
 *     "wind_deg": 282,
 *     "weather": [
 *       {
 *         "id": 804,
 *         "main": "Clouds",
 *         "description": "overcast clouds",
 *         "icon": "04n"
 *       }
 *     ],
 *     "sunrise": 1651459565,
 *     "sunset": 1651517025
 *   }
 * }
 * @param {*} weather
 * @param {number|string} time
 * @return {*}
 */
const getPartialWeatherData = (complete, time) => {
  // destructure weather object
  const { lat, lon, timezone, timezone_offset, current, hourly } = complete

  // get common data (only needed fields)
  const {
    dt, temp, feels_like, pressure, humidity, dew_point, uvi,
    clouds, visibility, wind_speed, wind_deg, weather
  } = time > 0 ? hourly[time-1] : current

  // create timestamp
  const timestamp = new Date(dt * 1000 + timezone_offset * 1000).toString()

  // get sunset/sunrise info
  const { sunrise, sunset } = current

  // build weather data
  const data = {
    dt, temp, feels_like, pressure, humidity, dew_point, uvi,
    clouds, visibility, wind_speed, wind_deg, weather,
    sunrise, sunset
  }

  // return data
  return {
    lat, lon, timezone, timezone_offset, timestamp, data
  }
}

/**
 * Looks up the current or forecasted weather on the OpenWeather API for a given
 * position. If the given time {time} is higher than zero then the forecasted
 * weather is returned, else the current weather is given.
 * For example response data see {@link getPartialWeatherData}.
 * @example
 * // returns a promise representing the API response
 * currentWeather({ lat: 59.3326, lon: 18.0649, time: 0 })
 * @param {number|string} lat
 * @param {number|string} lon
 * @param {number|string} time amount hours to forecast
 * @return {Promise<*>} the current or forecasted weather
 */
const currentWeather = async ({ lat, lon, time }) => {
  let metric="metric"
  let exclude="minutely,alerts,daily"

  //fetch
  // FIXME: mocking API response to avoid going over usage quota, replace the following with:
  //  `${OW_API_URL}/data/2.5/onecall`
  const url = `${window.location.href}/js/onecallMockResponse.json`
  const weather = await get(url, {
    appid: OW_API_KEY,
    lat,
    lon,
    exclude: exclude,
    units: metric,
  }) // TODO: error handling?

  // extract and return relevant weather data only
  return getPartialWeatherData(weather, time)
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
