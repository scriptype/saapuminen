const storage = {
  __e: 'localstorage access is denied',
  fetch(key) {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.info(this.__e)
    }
  },
  put(key, value) {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.info(this.__e)
    }
  }
}

export default storage
