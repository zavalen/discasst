const Podcast = require('../models/Podcast')
const Episode = require('../models/Episode')
const Rating = require('../models/Rating')
const EpisodeProgress = require('../models/EpisodeProgress')
const Subscriptions = require('../models/Subscriptions')
const UserEpisodesHistory = require('../models/UserEpisodesHistory')
const {Op} = require('sequelize')

// module.exports.getEpisodesByPodcastSlug = async (req, res) => {
//   try {
//     const {podcastSlug} = req.params

//     const podcast = await Podcast.findOne({
//       where: {slug: podcastSlug}
//     })

//     const episodes = await Episode.findAll({
//       where: {podcastId: podcast.id}
//     })

//     res.status(200).json({episodes})
//   } catch (e) {
//     return res.status(422).json({
//       errors: {body: ['Could not get article', e.message]}
//     })
//   }
// }

module.exports.getEpisodes = async (req, res) => {
  try {
    let {
      limit = 20,
      offset = 0,
      podcastSlug = null,
      podcastsIds = null,
      subscriptions = false
    } = req.query
    if (limit > 50) {
      limit = 50
    }

    const modelsToInclude = [
      {
        model: Podcast,
        as: 'podcast'
      },

      {
        model: Rating,
        required: false
      }
    ]

    if (req.user && req.user.id) {
      modelsToInclude.push({
        model: EpisodeProgress,
        as: 'progress',
        required: false,
        where: {userId: req.user.id}
      })
    }

    const query = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['pubDate', 'DESC']],
      include: modelsToInclude
    }

    if (podcastSlug) {
      const podcast = await Podcast.findOne({where: {slug: podcastSlug}})
      if (!podcast) {
        throw new Error('No such podcast slug')
      }
      query.where = {podcastId: podcast.id}
    }

    if (subscriptions && req.user && req.user.id) {
      const subscriptionsArray = await Subscriptions.findAll({
        where: {
          userId: req.user.id
        }
      })
      let subscriptionsIds = []
      subscriptionsArray.forEach(sub => {
        subscriptionsIds.push(sub.podcastId)
      })

      if (!subscriptionsIds.length) {
        res.json({episodes: []})
        return
      }
      podcastsIds = subscriptionsIds.join(',')
    }

    if (podcastsIds) {
      podcastsIds = podcastsIds.split(',')
      query.where = {
        podcastId: {
          [Op.or]: podcastsIds
        }
      }
    }

    const episodes = await Episode.findAll(query)

    for (let index = 0; index < episodes.length; index++) {
      const episode = episodes[index]
      let sum = 0
      let plusesCount = 0
      let minusesCount = 0
      let userRating = 0
      episode.Ratings.forEach(item => {
        sum += item.value

        if (item.value == 1) {
          plusesCount++
        }

        if (item.value == -1) {
          minusesCount++
        }
        if (req.user && req.user.id == item.userId) {
          userRating = item.value
        }
      })
      episode.dataValues.rating = {sum, userRating, plusesCount, minusesCount}
      delete episode.dataValues.Ratings
    }

    res.json({episodes})
  } catch (e) {
    console.log(e)

    throw new Error('Error in getFeed')
  }
}

module.exports.writeProgress = async (req, res) => {
  try {
    const progress = req.body.progress
    if (!progress) throw new Error('No progress object')

    progress.VisitorId = req.headers.visitorid || progress.visitorId
    if (req.user) {
      progress.userId = req.user.id
    }

    if (progress.userId) {
      let where = {
        userId: progress.userId,
        EpisodeId: progress.EpisodeId
      }
      updateOrCreate(EpisodeProgress, where, progress)

      res.status(200).json({status: 200})
    } else {
      let where = {
        VisitorId: progress.VisitorId,
        EpisodeId: progress.EpisodeId
      }
      updateOrCreate(EpisodeProgress, where, progress)
      res.status(200).json({status: 200})
    }
  } catch (e) {
    // const code = res.statusCode ? res.statusCode : 422
    throw new Error('Error in writeProgress')
    // return res.status(code).json({
    //   errors: {body: ['Could not create article', e.message]}
    // })
  }
}

module.exports.writeRating = async (req, res) => {
  try {
    console.log(req.query)
    if (!req.user) throw new Error('No user')
    if (!req.body.rating && !(req.query.episodeId && req.query.value)) {
      throw new Error('No rating')
    }

    let rating = req.body.rating || {
      episodeId: req.query.episodeId,
      value: req.query.value
    }

    rating.userId = req.user.id

    if (rating.value < -1 && rating.value > 1) throw new Error('Wrong rating')

    let where = {
      userId: req.user.id,
      episodeId: rating.episodeId
    }

    updateOrCreate(Rating, where, rating)

    res.status(200).json({status: 200})
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422
    // throw new Error('Error in writeRating')
    return res.status(code).json({
      errors: {body: [e.message]}
    })
  }
}

module.exports.getHistory = async (req, res) => {
  try {
    let {limit = 20, offset = 0} = req.query
    limit = limit > 100 ? 100 : limit

    const modelsToInclude = [
      {
        model: Podcast,
        as: 'podcast'
      },

      {
        model: Rating,
        required: false
      }
    ]

    modelsToInclude.push({
      model: UserEpisodesHistory,
      required: true,
      where: {userId: req.user.id}
    })

    const episodes = await Episode.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[UserEpisodesHistory, 'createdAt', 'DESC']],
      include: modelsToInclude
    })

    res.status(200).json({episodes})
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422
    return res.status(code).json({
      errors: {body: ['Could not create article', e.message]}
    })
  }
}

module.exports.addToHistory = async (req, res) => {
  try {
    const episode = req.body.episode

    if (!episode) throw new Error('No episode object')

    episode.VisitorId = req.headers.visitorid || episode.visitorId || null
    episode.userId = req.user ? req.user.id : null
    episode.EpisodeId = episode.id
    delete episode.id

    await UserEpisodesHistory.create(episode)
    res.status(200)
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422
    return res.status(code).json({
      errors: {body: ['Could not create article', e.message]}
    })
  }
}

async function updateOrCreate(model, where, newItem) {
  try {
    const foundItem = await model.findOne({where})
    if (!foundItem) {
      const item = await model.create(newItem)
      return {item, created: true}
    }

    const item = await model.update(newItem, {where})
    return {item, created: false}
  } catch (e) {
    console.log('error in updateOrCreate')
    return {}
  }
}
