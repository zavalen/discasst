const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Visitor = sequelize.define(
  'Visitor',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  },
  {updatedAt: false}
)

module.exports = Visitor
