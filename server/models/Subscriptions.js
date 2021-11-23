const sequelize = require('../dbConnection')

const Subscriptions = sequelize.define('Subscriptions', {}, {updatedAt: false})

module.exports = Subscriptions
