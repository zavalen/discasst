const jwt = require('jsonwebtoken')
const JWT_SECRET = 'qemsaslvjd-33r3:9i9vis3.'
const JWT_SECRET_FOR_EMAI_VERIFICATION = 'email213124312rdsfsd'

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
      JWT_SECRET,
      (err, token) => {
        if (err) return reject(err)
        return resolve(token)
      }
    )
  })
}

module.exports.decode = async token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
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
      JWT_SECRET_FOR_EMAI_VERIFICATION,
      (err, token) => {
        if (err) return reject(err)
        return resolve(token)
      }
    )
  })
}

module.exports.decodeEmailToken = async token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_FOR_EMAI_VERIFICATION, (err, decoded) => {
      if (err) return reject(err)

      return resolve(decoded)
    })
  })
}
