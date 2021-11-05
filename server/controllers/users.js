const {databaseVersion} = require('../dbConnection')
const User = require('../models/User')
const {hashPassword, matchPassword} = require('../utils/password')
const {sign, decode} = require('../utils/jwt')

module.exports.createUser = async (req, res) => {
  try {
    const userToCreate = req.body.user
    console.log(req)
    if (!userToCreate) throw new Error('Something wrong with request (no user)')
    if (!userToCreate.username) throw new Error('Username is Required')
    if (!userToCreate.email) throw new Error('Email is Required')
    if (!userToCreate.password) throw new Error('Password is Required')

    const existingUser = await User.findOne({
      where: {email: userToCreate.email}
    })
    if (existingUser) throw new Error('User aldready exists with this email id')

    const password = await hashPassword(userToCreate.password)

    userToCreate.password = password
    const user = await User.create(userToCreate)

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
    // const user = await User.findByPK(req.user.email)
    const user = await User.findOne({where: {email: req.body.user.email}})

    if (!user) {
      res.status(401)
      throw new Error('No user with this email id')
    }

    if (req.body.user) {
      const username = req.body.user.username
        ? req.body.user.username
        : user.username
      const bio = req.body.user.bio ? req.body.user.bio : user.bio
      const image = req.body.user.image ? req.body.user.image : user.image
      let password = user.password
      if (req.body.user.password)
        password = await hashPassword(req.body.user.password)

      const updatedUser = await user.update({username, bio, image, password})
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
