const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Visitor = sequelize.define('Visitor', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  visitorId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  as: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  countryCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lat: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  regionName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING,
    allowNull: true
  },
  browser: {
    type: DataTypes.STRING,
    allowNull: true
  },
  os: {
    type: DataTypes.STRING,
    allowNull: true
  },
  device: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deviceModel: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cpu: {
    type: DataTypes.STRING,
    allowNull: true
  }
})

module.exports = Visitor
