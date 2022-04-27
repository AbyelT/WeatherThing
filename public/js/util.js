/**
 * Generic utilities.
 */

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

export {
  debounce
}