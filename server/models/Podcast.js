const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')
const idGenerator = require('../utils/idGenerator')

const Podcast = sequelize.define('Podcast', {
  id: {
    type: DataTypes.STRING,
    defaultValue: idGenerator(),
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageURL: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rss: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  link: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true
  },

  creator: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ownerName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ownerEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  explicit: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  generator: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  copyright: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categories: {
    type: DataTypes.JSON,
    allowNull: true
  },
  keywords: {
    type: DataTypes.JSON,
    allowNull: true
  }
})

module.exports = Podcast
