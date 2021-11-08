const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports.sign = async user => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      //   user,
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) return reject(err)
        return resolve(token)
      }
    )
  })
}

module.exports.decode = async token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err)

      return resolve(decoded)
    })
  })
}

module.exports.signEmail = async user => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        id: user.id,
        email: user.email,
        emailToken: user.emailToken
      },
      process.env.JWT_SECRET_EMAIL_VERIFICATION,
      (err, token) => {
        if (err) return reject(err)
        return resolve(token)
      }
    )
  })
}

module.exports.decodeEmailToken = async token => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET_EMAIL_VERIFICATION,
      (err, decoded) => {
        if (err) return reject(err)

        return resolve(decoded)
      }
    )
  })
}
