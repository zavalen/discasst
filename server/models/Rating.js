const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Rating = sequelize.define('Rating', {
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

module.exports = Rating
