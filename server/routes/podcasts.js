const express = require('express')
const router = express.Router()
const PodcastController = require('../controllers/podcasts')
const {authByToken} = require('../middleware/auth')

router.post('/', PodcastController.createPodcast) //Register a new user
router.get('/', PodcastController.getAllPodcasts) //Gets the currently logged-in user
// router.post('/users/login', PodcastController.loginUser) //Login for existing user
// router.patch('/user', authByToken, PodcastController.updateUserDetails) //Updated user information for current user

module.exports = router
