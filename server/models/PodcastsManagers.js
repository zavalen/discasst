const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const PodcastsManagers = sequelize.define('PodcastsManagers', {
  role: {
    type: DataTypes.STRING,
    allowNull: true
  }
})

module.exports = PodcastsManagers
