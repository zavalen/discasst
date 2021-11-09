const express = require('express')
const router = express.Router()
const EpisodeController = require('../controllers/episodes')
const {authByToken, appendUserByTokenIfExist} = require('../middleware/auth')

router.get('/', appendUserByTokenIfExist, EpisodeController.getFeed)
router.post('/', appendUserByTokenIfExist, EpisodeController.writeProgress)

module.exports = router
