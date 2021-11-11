const nanoid = require('nanoid')

module.exports = (length = 12) => {
  const id = nanoid.customAlphabet(
    '1234567890abcdefghijklmnopqrstuvwxyz',
    length
  )
  return id
}
