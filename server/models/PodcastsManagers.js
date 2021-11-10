const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const PodcastsManagers = sequelize.define(
  'PodcastsManagers',
  {
    role: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'podcasts_managers'
  }
)

module.exports = PodcastsManagers
