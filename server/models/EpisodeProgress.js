const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const EpisodeProgress = sequelize.define(
  'EpisodeProgress',
  {
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
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    reallyListened: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    reallyListenedPercentage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    reallyListenedArray: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        return this.getDataValue('reallyListenedArray').split(',')
      },
      set(val) {
        this.setDataValue('reallyListenedArray', val.join(','))
      }
    }
  },
  {
    tableName: 'episodes_progress',
    freezeTableName: true
  }
)

module.exports = EpisodeProgress
