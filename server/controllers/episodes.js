const Podcast = require('../models/Podcast')
const Episode = require('../models/Episode')
const EpisodeProgress = require('../models/EpisodeProgress')
const User = require('../models/User')
const {slugify} = require('../utils/slugUtils')
const sequelize = require('../dbConnection')
const podcastFeedParser = require('podcast-feed-parser')

function sanitizeOutput(article, user) {
  const newTagList = []
  for (let t of article.dataValues.Tags) {
    newTagList.push(t.name)
  }
  delete article.dataValues.Tags
  article.dataValues.tagList = newTagList

  if (article) {
    delete user.dataValues.password
    delete user.dataValues.email
    delete user.dataValues.following
    article.dataValues.author = user
    return article
  }
}

function sanitizeOutputMultiple(article) {
  const newTagList = []
  for (let t of article.dataValues.Tags) {
    newTagList.push(t.name)
  }
  delete article.dataValues.Tags
  article.dataValues.tagList = newTagList

  let user = {
    username: article.dataValues.User.username,
    email: article.dataValues.User.email,
    bio: article.dataValues.User.bio,
    image: article.dataValues.User.image
  }

  delete article.dataValues.User
  article.dataValues.author = user

  return article
}

module.exports.getSingleArticleBySlug = async (req, res) => {
  try {
    const {slug} = req.params
    let article = await Podcast.findByPk(slug, {include: Tag})

    const user = await article.getUser()

    article = sanitizeOutput(article, user)

    res.status(200).json({article})
  } catch (e) {
    return res.status(422).json({
      errors: {body: ['Could not get article', e.message]}
    })
  }
}

module.exports.updateArticle = async (req, res) => {
  try {
    if (!req.body.article) throw new Error('No articles data')
    const data = req.body.article
    const slugInfo = req.params.slug
    let article = await Podcast.findByPk(slugInfo, {include: Tag})

    if (!article) {
      res.status(404)
      throw new Error('Article not found')
    }

    const user = await User.findByPK(req.user.email)

    if (user.email != article.UserEmail) {
      res.status(403)
      throw new Error('You must be the author to modify this article')
    }

    const title = data.title ? data.title : article.title
    const description = data.description
      ? data.description
      : article.description
    const body = data.body ? data.body : article.body
    const slug = data.title ? slugify(title) : slugInfo

    const updatedArticle = await article.update({
      slug,
      title,
      description,
      body
    })

    article = sanitizeOutput(updatedArticle, user)
    res.status(200).json({article})
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422
    return res.status(code).json({
      errors: {body: ['Could not update article', e.message]}
    })
  }
}

module.exports.deleteArticle = async (req, res) => {
  try {
    const slugInfo = req.params.slug
    let article = await Podcast.findByPk(slugInfo, {include: Tag})

    if (!article) {
      res.status(404)
      throw new Error('Article not found')
    }

    const user = await User.findByPK(req.user.email)

    if (user.email != article.UserEmail) {
      res.status(403)
      throw new Error('You must be the author to modify this article')
    }

    await Podcast.destroy({where: {slug: slugInfo}})
    res.status(200).json({message: 'Article deleted successfully'})
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422
    return res.status(code).json({
      errors: {body: ['Could not delete article', e.message]}
    })
  }
}

module.exports.getFeed = async (req, res) => {
  try {
    let {limit = 20, offset = 0} = req.query
    if (limit > 100) {
      limit = 100
    }

    const modelsToInclude = [
      {
        model: Podcast
      }
    ]

    if (req.user) {
      modelsToInclude.push({
        model: EpisodeProgress,
        required: false,
        where: {UserId: req.user.id}
      })
    }

    const visitorId = req.headers.visitorid
    if (!req.user && visitorId) {
      modelsToInclude.push({
        model: EpisodeProgress,
        required: false,
        where: {VisitorId: visitorId}
      })
    }

    const episodes = await Episode.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['pubDate', 'DESC']],
      include: modelsToInclude
    })

    res.json({episodes})
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422
    return res.status(code).json({
      errors: {body: ['Could not create article', e.message]}
    })
  }
}

module.exports.writeProgress = async (req, res) => {
  try {
    const progress = req.body.progress
    if (!progress) throw new Error('No progress object')

    progress.VisitorId = req.headers.visitorid || progress.visitorId
    if (req.user) {
      progress.UserId = req.user.id
    }

    if (progress.UserId) {
      let where = {
        UserId: progress.UserId,
        EpisodeId: progress.EpisodeId
      }
      updateOrCreate(EpisodeProgress, where, progress)

      res.status(200)
    } else {
      let where = {
        VisitorId: progress.VisitorId,
        EpisodeId: progress.EpisodeId
      }
      updateOrCreate(EpisodeProgress, where, progress)
    }
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
