const User = require('../models/User')
const Visitor = require('../models/Visitor')
const VisitorInfo = require('../models/VisitorInfo')
const PodcastsManagers = require('../models/PodcastsManagers')
const Podcast = require('../models/Podcast')
const validator = require('validator')
var uaParser = require('ua-parser-js')

const {hashPassword, matchPassword} = require('../utils/password')
const {sign, decode} = require('../utils/jwt')

module.exports.createUser = async (req, res) => {
  try {
    const userToCreate = req.body.user
    if (!userToCreate) throw new Error('Something wrong with request (no user)')
    if (!userToCreate.username) throw new Error('Username is Required')
    if (userToCreate.username.length <= 3) {
      throw new Error('Username is too short')
    }
    if (!userToCreate.email) throw new Error('Email is Required')
    if (!validator.isEmail(userToCreate.email)) {
      throw new Error('Email is wrong')
    }
    if (!userToCreate.password) throw new Error('Password is Required')
    if (userToCreate.password.length < 8) {
      throw new Error('Password is shorter than 8')
    }

    const existingUser = await User.findOne({
      where: {email: userToCreate.email}
    })
    if (existingUser) throw new Error('User aldready exists with this email id')

    const password = await hashPassword(userToCreate.password)

    userToCreate.password = password
    const user = await User.create(userToCreate)

    const podcastUserOwner = await Podcast.findOne({
      where: {ownerEmail: user.email}
    })
    if (podcastUserOwner) {
      PodcastsManagers.create({
        role: 'owner',
        PodcastId: podcastUserOwner.id,
        UserId: user.id
      })
    }

    if (user) {
      if (user.dataValues.password) delete user.dataValues.password
      user.dataValues.token = await sign(user)

      console.log(user)

      res.status(201).json({user})
    }
  } catch (e) {
    res
      .status(422)
      .json({errors: {body: ['Could not create user ', e.message]}})
  }
}

module.exports.loginUser = async (req, res) => {
  try {
    if (!req.body.user.email) throw new Error('Email is Required')
    if (!req.body.user.password) throw new Error('Password is Required')

    const user = await User.findOne({where: {email: req.body.user.email}})
    if (!user) {
      res.status(401)
      throw new Error('No User with this email id')
    }

    //Check if password matches
    const passwordMatch = await matchPassword(
      user.password,
      req.body.user.password
    )

    if (!passwordMatch) {
      res.status(401)
      throw new Error('Invalid password or email')
    }

    delete user.dataValues.password
    user.dataValues.token = await sign({
      id: user.dataValues.id,
      email: user.dataValues.email,
      username: user.dataValues.username,
      role: user.dataValues.role
    })

    res.status(200).json({user})
  } catch (e) {
    const status = res.statusCode ? res.statusCode : 500
    res
      .status(status)
      .json({errors: {body: ['Could not create user ', e.message]}})
  }
}

module.exports.getUserByEmail = async (req, res) => {
  try {
    console.log(req)
    const UserEmail = req.body.user.email || req.user.emain

    const user = await User.findOne({where: {email: UserEmail}})
    if (!user) {
      throw new Error('No such user found')
    }
    delete user.dataValues.password
    user.dataValues.token = req.header('Authorization').split(' ')[1]
    return res.status(200).json({user})
  } catch (e) {
    return res.status(404).json({
      errors: {body: [e.message]}
    })
  }
}

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)

    if (!user) {
      throw new Error('No such user found')
    }
    delete user.dataValues.password
    user.dataValues.token = req.header('Authorization').split(' ')[1]
    return res.status(200).json({user})
  } catch (e) {
    return res.status(404).json({
      errors: {body: [e.message]}
    })
  }
}

module.exports.updateUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)

    if (!user) {
      res.status(401)
      throw new Error('No user with this id')
    }

    if (req.body.user) {
      if (req.body.user.username) {
        const existingUser = await User.findOne({
          where: {username: req.body.user.username}
        })
        if (existingUser) {
          res.status(401)
          throw new Error('This username is aldready taken')
        }
      }
      const username = req.body.user.username || user.username

      const firstName = req.body.user.firstName || user.firstName
      const lastName = req.body.user.lastName || user.lastName
      const bio = req.body.user.bio || user.bio
      const image = req.body.user.image || user.image
      const gender = req.body.user.gender || user.gender
      const theme = req.body.user.theme || user.theme
      const lang = req.body.user.lang || user.lang

      const updatedUser = await user.update({
        firstName,
        lastName,
        username,
        bio,
        image,
        gender,
        theme,
        lang
      })

      delete updatedUser.dataValues.password
      updatedUser.dataValues.token = req.header('Authorization').split(' ')[1]
      res.json(updatedUser)
    } else {
      delete user.dataValues.password
      user.dataValues.token = req.header('Authorization').split(' ')[1]
      res.json(user)
    }
  } catch (e) {
    const status = res.statusCode ? res.statusCode : 500
    return res.status(status).json({
      errors: {body: [e.message]}
    })
  }
}

module.exports.createVisitor = async (req, res) => {
  try {
    let visitor = req.body.visitor
    if (visitor) {
      const id = req.headers.visitorid || visitor.visitorId || 'none'
      visitor.VisitorId = id

      await Visitor.findOrCreate({where: {id: visitor.VisitorId}})

      //if adblock
      if (visitor.adblock || !visitor.ip) {
        const ip =
          req.ip ||
          req.headers['x-forwarded-for']?.split(',').shift() ||
          req.socket?.remoteAddress

        visitor = await getVisitorInfoByIp(ip)
        visitor.VisitorId = id
        visitor.adblock = true
      }

      //userAgent parsing
      visitor.userAgent = req.headers['user-agent']
      const ua = uaParser(visitor.userAgent)
      visitor.browser = ua.browser.name + ' ' + ua.browser.version
      visitor.os = ua.os.name + ' ' + ua.os.version
      visitor.device = ua.device.type || 'desktop'
      visitor.deviceModel =
        ua.device.vendor || ua.device.model
          ? ua.device.vendor + ' ' + ua.device.model
          : null
      visitor.cpu = ua.cpu.architecture

      await VisitorInfo.create(visitor)
      return res.status(200)
    } else {
      return res.status(404)
    }
  } catch (e) {
    const status = res.statusCode ? res.statusCode : 500
    return res.status(status).json({
      errors: {body: [e.message]}
    })
  }
}

function getVisitorInfoByIp(ip) {
  return new Promise(resolve => {
    fetch('http://ip-api.com/json/' + ip)
      .then(response => response.json())
      .then(response => {
        const visitor = response || {}
        visitor.ip = response.query
        resolve(visitor)
      })
      .catch(result => {
        console.log(result)
      })
  })
}
