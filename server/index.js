require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_HOST,
    methods: ['GET', 'POST']
  }
})
const morgan = require('morgan')
const cors = require('cors')

const {notFound, errorHandler} = require('./middleware/errorHandler')
const sequelize = require('./dbConnection')

const User = require('./models/User')
const Visitor = require('./models/Visitor')
const VisitorInfo = require('./models/VisitorInfo')
const Podcast = require('./models/Podcast')
const Episode = require('./models/Episode')
const UserEpisodesHistory = require('./models/UserEpisodesHistory')
const EpisodeProgress = require('./models/EpisodeProgress')
const PodcastsManagers = require('./models/PodcastsManagers')
const Subscriptions = require('./models/Subscriptions')

const userRoute = require('./routes/users')
const podcastRoute = require('./routes/podcasts')
const episodeRoute = require('./routes/episodes')

//CORS
app.use(cors({credentials: true, origin: true}))

User.hasMany(VisitorInfo)
Podcast.hasMany(Episode)
Episode.belongsTo(Podcast)

Podcast.belongsToMany(User, {through: PodcastsManagers})
User.belongsToMany(Episode, {through: UserEpisodesHistory})
Visitor.belongsToMany(Episode, {through: UserEpisodesHistory})

Visitor.hasMany(VisitorInfo, {onDelete: 'cascade'})
// Visitor.hasOne(EpisodeProgress)
// User.hasOne(EpisodeProgress)
Episode.hasOne(EpisodeProgress, {onDelete: 'cascade'})
EpisodeProgress.belongsTo(Visitor, {onDelete: 'cascade'})
EpisodeProgress.belongsTo(User, {onDelete: 'cascade'})
EpisodeProgress.belongsTo(Episode, {onDelete: 'cascade'})

User.belongsToMany(Podcast, {through: Subscriptions})

const sync = async () => {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
  // await sequelize.sync({force: true})
  // await sequelize.sync()
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1') // setting the flag back for security
}

sync()

app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())
app.use(morgan('tiny'))
app.set('trust proxy', true)
app.get('/', (req, res) => {
  res.json({status: 'API is running'})
})
app.use('/api', userRoute)
app.use('/api/podcasts', podcastRoute)
app.use('/api/episodes', episodeRoute)
app.use(notFound)
app.use(errorHandler)

const onConnection = socket => {
  console.log('A user connected')

  socket.on('q', q)
}

io.on('connection', onConnection)

function q(time) {
  console.log(time)
}

const PORT = process.env.PORT || 8081

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
