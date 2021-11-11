const express = require('express')
const router = express.Router()
const EpisodeController = require('../controllers/episodes')
const {authByToken, appendUserByTokenIfExist} = require('../middleware/auth')

router.get('/', appendUserByTokenIfExist, EpisodeController.getFeed)
router.post(
  '/progress',
  appendUserByTokenIfExist,
  EpisodeController.writeProgress
)
router.post(
  '/history',
  appendUserByTokenIfExist,
  EpisodeController.addToHistory
)
router.get('/history', appendUserByTokenIfExist, EpisodeController.getHistory)

module.exports = router
