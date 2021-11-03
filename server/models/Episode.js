const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Episode = sequelize.define('Episode', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true
  },

  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  subtitle: {
    type: DataTypes.TEXT
  },
  pubDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true
  },
  enclosure: {
    type: DataTypes.JSON,
    allowNull: true
  },
  duration: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  explicit: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
})

module.exports = Episode

/* {
  "article": {
    
    
    "tagList": ["dragons", "training"],
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
} */
