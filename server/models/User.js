const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lang: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    subscriptions: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    register_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
