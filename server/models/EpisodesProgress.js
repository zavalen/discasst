const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const EpisodesProgress = sequelize.define('EpisodesProgress', {
  playingCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1
  },
  lastPoint: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  progress: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 0
  },
  reallyListened: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  reallyListenedArray: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('reallyListenedArray').split(',')
    },
    set(val) {
      this.setDataValue('reallyListenedArray', val.join(','))
    }
  }
})

module.exports = EpisodesProgress
