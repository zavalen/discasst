const express = require('express')
const router = express.Router()
const PodcastController = require('../controllers/podcasts')
const {authByToken} = require('../middleware/auth')

router.post('/', PodcastController.createPodcast)
router.get('/', PodcastController.getPodcasts)
// router.get('/:slug', PodcastController.getPodcastBySlug)

router.get('/subscriptions', authByToken, PodcastController.getSubscribtions)
router.post('/subscriptions', authByToken, PodcastController.subscribe)
router.delete('/subscriptions', authByToken, PodcastController.unsubscribe)

module.exports = router
