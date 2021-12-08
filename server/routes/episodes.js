const express = require('express')
const router = express.Router()
const EpisodeController = require('../controllers/episodes')
const {authByToken, appendUserByTokenIfExist} = require('../middleware/auth')

router.get('/', appendUserByTokenIfExist, EpisodeController.getEpisodes)
// router.get('/:podcastSlug', EpisodeController.getEpisodesByPodcastSlug)
router.post(
  '/progress',
  appendUserByTokenIfExist,
  EpisodeController.writeProgress
)
router.post('/rating', authByToken, EpisodeController.writeRating)
router.post(
  '/history',
  appendUserByTokenIfExist,
  EpisodeController.addToHistory
)
router.get('/history', appendUserByTokenIfExist, EpisodeController.getHistory)

module.exports = router
