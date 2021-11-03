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
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.TEXT
  },
  imageURL: {
    type: DataTypes.STRING,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  categories: {
    type: DataTypes.JSON,
    allowNull: true
  },
  owner: {
    type: DataTypes.JSON,
    allowNull: false
  },
  explicit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rss: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Podcast
