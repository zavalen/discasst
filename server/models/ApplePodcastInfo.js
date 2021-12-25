const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const ApplePodcastInfo = sequelize.define(
  'ApplePodcastInfo',
  {
    imageURL30: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imageURL60: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageURL100: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    applePodcastId: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    applePodcastLink: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    genreIds: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    primaryGenre: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    releaseDate: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    episodesCount: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'apple_podcast_info',
    freezeTableName: true
  }
  // {
  //   indexes: [{unique: false, fields: ['pubDate']}]
  // }
)

module.exports = ApplePodcastInfo
