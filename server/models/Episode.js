const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')
const idGenerator = require('../utils/idGenerator')

const Episode = sequelize.define(
  'Episode',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: idGenerator(),
      allowNull: false,
      primaryKey: true,
      unique: true
    },

    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
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
      type: DataTypes.TEXT,
      allowNull: false
    },
    enclosure: {
      type: DataTypes.JSON,
      allowNull: true
    },
    duration: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    season: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    episode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    explicit: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }
  // {
  //   indexes: [{unique: false, fields: ['pubDate']}]
  // }
)

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
