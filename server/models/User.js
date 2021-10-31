const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const User = sequelize.define(
  'User',
  {
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
    username: {
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    subscriptions: {
      type: DataTypes.STRING,
      allowNull: true
    },
    register_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    email_confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: false
  }
)

module.exports = User

/* {
  "user": {
    "token": "jwt.token.here",
  }
} */
