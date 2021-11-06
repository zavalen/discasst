const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  theme: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'light'
  },
  lang: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'ru'
  },
  email_confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  }
})

module.exports = User
