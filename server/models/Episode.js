const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Episode = sequelize.define(
  'Episode',
  {
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
    slug: {
      type: DataTypes.STRING,
      allowNull: true
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
      allowNull: false
    },
    enclosure: {
      type: DataTypes.STRING,
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
    summary: {
      type: DataTypes.TEXT,
      allowNull: true
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
