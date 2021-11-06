const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const {notFound, errorHandler} = require('./middleware/errorHandler')
const sequelize = require('./dbConnection')

const User = require('./models/User')
const Podcast = require('./models/Podcast')
const Episode = require('./models/Episode')
const PodcastsManagers = require('./models/PodcastsManagers')

const userRoute = require('./routes/users')
const podcastRoute = require('./routes/podcasts')
const episodeRoute = require('./routes/episodes')
const app = express()

//CORS
app.use(cors({credentials: true, origin: true}))

Podcast.hasMany(Episode)
Episode.belongsTo(Podcast)
Podcast.belongsToMany(User, {through: PodcastsManagers})

const sync = async () => {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
  await sequelize.sync({force: true})
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1') // setting the flag back for security
}

// const sync = async () => await sequelize.sync({alter: true})
// const sync = async () => await sequelize.sync()
sync()

app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.json({status: 'API is running'})
})
app.use('/api', userRoute)
app.use('/api/podcasts', podcastRoute)
app.use('/api/episodes', episodeRoute)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
