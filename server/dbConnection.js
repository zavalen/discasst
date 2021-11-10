const {Sequelize} = require('sequelize')
require('dotenv').config()

//LOCAL CONNECTION
const sequelize = new Sequelize(
  process.env.DB_NAME || 'discasst',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || 'root',
  {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    logging: false
  }
)

//AMAZON RDS CONNECTION
/* const sequelize = new Sequelize('conduit1',process.env.USER_NAME,process.env.PASSWORD,{
    dialect: 'mysql',
    host:process.env.DB_HOST,
    logging: false,
    port: 3306
});
 */
// const sequelize = new Sequelize('d6rk5ijgmvcf6q',process.env.USER_NAME,process.env.PASSWORD,{
//     dialect: 'postgres',
//     host: process.env.DB_HOST,
//     logging: false,
//     port: 5432,
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false // <<<<<<< YOU NEED THIS
//         }
//     }
// });

const checkConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

checkConnection()

module.exports = sequelize
