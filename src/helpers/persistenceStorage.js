export const getItem = key => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (e) {
    console.log('Error getting data from localStorage')
    return null
  }
}

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.log('Error setting data to localStorage')
  }
}
