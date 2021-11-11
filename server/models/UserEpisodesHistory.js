const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')
const idGenerator = require('../utils/idGenerator')

const UserEpisodesHistory = sequelize.define(
  'UserEpisodesHistory',
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: idGenerator(24),
      allowNull: false,
      primaryKey: true,
      unique: true
    }
  },
  {
    tableName: 'user_episodes_history',
    freezeTableName: true,
    updatedAt: false
  }
)

module.exports = UserEpisodesHistory
