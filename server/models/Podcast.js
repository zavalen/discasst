const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Podcast = sequelize.define('Podcast', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
  subtitle: {
    type: DataTypes.TEXT
  },
  imageURL: {
    type: DataTypes.STRING,
    allowNull: true
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true
  },
  authorName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  categories: {
    type: DataTypes.JSON,
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
    type: DataTypes.STRING,
    allowNull: true
  },
  rss: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Podcast
