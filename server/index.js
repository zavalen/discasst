require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app)
// const io = require('socket.io')(server, {
//   cors: {
//     origin: process.env.FRONTEND_HOST,
//     methods: ['GET', 'POST']
//   }
// })
const morgan = require('morgan')
const cors = require('cors')

const {notFound, errorHandler} = require('./middleware/errorHandler')
const sequelize = require('./dbConnection')

const userRoute = require('./routes/users')
const podcastRoute = require('./routes/podcasts')
const episodeRoute = require('./routes/episodes')

const setAssociations = require('./models/associations')
setAssociations()

//CORS
app.use(cors({credentials: true, origin: true}))

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

// const onConnection = socket => {
//   console.log('A user connected')

//   socket.on('q', q)
// }

// io.on('connection', onConnection)

// function q(time) {
//   console.log(time)
// }

const PORT = process.env.PORT || 8081

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
