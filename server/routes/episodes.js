const express = require('express')
const router = express.Router()
const EpisodeController = require('../controllers/episodes')
const {authByToken} = require('../middleware/auth')

router.get('/', EpisodeController.getEpisodes) //Gets the currently logged-in user
// router.post('/users/login', PodcastController.loginUser) //Login for existing user
// router.patch('/user', authByToken, PodcastController.updateUserDetails) //Updated user information for current user

module.exports = router
