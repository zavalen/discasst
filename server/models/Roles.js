const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Roles = sequelize.define(
  'Roles',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    }
  },
  {
    timestamps: false
  }
)

module.exports = Roles
