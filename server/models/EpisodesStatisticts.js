const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const EpisodesStatisticts = sequelize.define('EpisodesStatisticts', {
  playingCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  lastPoint: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  progress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reallyListened: {
    type: DataTypes.INTEGER,
    allowNull: true
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

module.exports = EpisodesStatisticts
