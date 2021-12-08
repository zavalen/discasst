const Podcast = require('../models/Podcast')
const PodcastsManagers = require('../models/PodcastsManagers')
const Episode = require('../models/Episode')
const User = require('../models/User')
const Subscriptions = require('../models/Subscriptions')
const {getPodcastJson} = require('../utils/podcastParser')
const {isAcceptablePodcastSlug} = require('../utils/slugUtils')
const validator = require('validator')

module.exports.createPodcast = async (req, res) => {
  try {
    if (!req.body.rss) throw new Error('No RSS')
    if (!validator.isURL(req.body.rss)) throw new Error('It is not URL')

    const rssUrl = req.body.rss
    const existingPodcast = await Podcast.findOne({
      where: {rss: rssUrl}
    })
    if (existingPodcast) {
      res.status(201).json(existingPodcast)
      return
    }

    const fullPodcast = await getPodcastJson(rssUrl)
    if (!fullPodcast) throw new Error('Something wrong while parsing')
    const podcast = fullPodcast.meta

    if (!(await isAcceptablePodcastSlug(podcast.slug))) {
      podcast.slug = podcast.slug + '-' + Math.floor(Math.random() * 1000)
    }

    const newPodcast = await Podcast.create(podcast)

    // FIND OWNER
    const existingUser = await User.findOne({
      where: {email: newPodcast.ownerEmail}
    })
    if (existingUser) {
      PodcastsManagers.create({
        role: 'owner',
        podcastId: newPodcast.id,
        userId: existingUser.id
      })
    }

    const episodes = fullPodcast.episodes
    for (let i = 0; i < episodes.length; i++) {
      const episode = episodes[i]

      episode.podcastId = newPodcast.id
      // if (!(await isAcceptableEpisodeSlug(slug))) {
      //   epSlug = epSlug + '-' + Math.floor(Math.random() * 1000)
      // }

      await Episode.create(episode)
    }

    res.status(201).json(newPodcast)
  } catch (e) {
    return res.status(422).json({
      errors: {body: ['Could not create podcast', e.message]}
    })
  }
}

module.exports.getPodcastBySlug = async (req, res) => {
  try {
    const {slug} = req.params

    const podcast = await Podcast.findOne({
      where: {slug: slug}
    })

    if (!podcast) throw new Error('No podcast with this slug')

    res.status(200).json({podcast})
  } catch (e) {
    return res.status(422).json({
      errors: {body: ['Could not get podcast', e.message]}
    })
  }
}

module.exports.getPodcasts = async (req, res) => {
  try {
    //Get all articles:
    const {podcastSlug = null, limit = 20, offset = 0} = req.query

    if (podcastSlug) {
      const podcast = await Podcast.findOne({
        where: {
          slug: podcastSlug
        }
      })
      res.json({podcast})
      return
    }

    const podcasts = await Podcast.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({podcasts})
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422
    return res.status(code).json({
      errors: {body: ['Could not create article', e.message]}
    })
  }
}

module.exports.subscribe = async (req, res) => {
  try {
    const {podcastId} = req.query
    const userId = req.user.id
    const podcast = await Podcast.findByPk(podcastId)
    console.log(podcast)

    if (podcast) {
      await Subscriptions.create({
        podcastId: podcast.id,
        userId: userId
      })
    }

    res.status(200).json({subscribed: true})
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422
    return res.status(code).json({
      errors: {body: ['Could not subscribe', e.message]}
    })
  }
}

module.exports.getSubscribtions = async (req, res) => {
  try {
    const userId = req.user.id
    const subscriptionsArray = await Subscriptions.findAll({
      where: {userId: userId}
    })

    let subscriptions = []
    subscriptionsArray.forEach(sub => {
      subscriptions.push(sub.podcastId)
    })

    res.status(200).json({subscriptions})
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422
    return res.status(code).json({
      errors: {body: ['Could not get subscriptions', e.message]}
    })
  }
}

module.exports.unsubscribe = async (req, res) => {
  try {
    const {podcastId} = req.query
    const userId = req.user.id
    console.log(podcastId)
    await Subscriptions.destroy({
      where: {userId: userId, podcastId: podcastId}
    })

    res.status(200).json({unsubscribed: true})
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422
    return res.status(code).json({
      errors: {body: ['Could not subscribe', e.message]}
    })
  }
}
