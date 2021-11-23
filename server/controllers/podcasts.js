const Podcast = require('../models/Podcast')
const PodcastsManagers = require('../models/PodcastsManagers')
const Episode = require('../models/Episode')
const User = require('../models/User')
const Subscriptions = require('../models/Subscriptions')
const sequelize = require('../dbConnection')
const podcastFeedParser = require('podcast-feed-parser')
const {
  slugify,
  isAcceptablePodcastSlug,
  isAcceptableEpisodeSlug
} = require('../utils/slugUtils')
const {jsonToHtml} = require('../utils/stringUtils')
const sanitizeHtml = require('sanitize-html')
const validator = require('validator')

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

    const options = {
      meta: {
        title: '',
        description: '',
        subtitle: '',
        imageURL: '',
        lastUpdated: '',
        link: '',
        language: '',
        editor: '',
        author: '',
        summary: '',
        categories: [],
        owner: {
          name: '',
          email: ''
        },
        explicit: true,
        complete: true,
        blocked: true
      },
      episodes: [
        {
          title: '',
          description: '',
          imageURL: '',
          pubDate: '',
          link: '',
          language: '',
          'itunes:season': '',
          'itunes:episode': '',
          enclosure: {
            length: '0',
            type: '',
            url: ''
          },
          duration: 0,
          summary: '',
          blocked: true,
          explicit: true,
          order: 1
        }
      ]
    }

    const fullPodcast = await getPodcastFromRss(rssUrl, options)
    if (!fullPodcast) throw new Error('Something wrong while parsing')
    const podcast = fullPodcast.meta
    podcast.rss = rssUrl
    if (
      podcast.description.includes('\n') ||
      podcast.description.includes('\r')
    ) {
      podcast.description = jsonToHtml(podcast.description)
    }
    // CREATE SLUG
    let slug = slugify(podcast.title)
    if (!(await isAcceptablePodcastSlug(slug))) {
      slug = slug + '-' + Math.floor(Math.random() * 1000)
    }
    podcast.slug = slug

    podcast.ownerName = podcast.owner.name
    podcast.ownerEmail = podcast.owner.email

    for (let key in podcast) {
      podcast[key] = sanitizeHtml(podcast[key])
    }

    const newPodcast = await Podcast.create(podcast)

    // FIND OWNER
    const existingUser = await User.findOne({
      where: {email: newPodcast.ownerEmail}
    })
    if (existingUser) {
      PodcastsManagers.create({
        role: 'owner',
        PodcastId: newPodcast.id,
        UserId: existingUser.id
      })
    }

    const episodes = fullPodcast.episodes
    console.log(episodes.length)
    for (let i = 0; i < episodes.length; i++) {
      const episode = episodes[i]
      episode.episode = +episode.episode || episodes.length - i

      if (
        episode.description.includes('\n') ||
        episode.description.includes('\r')
      ) {
        episode.description = jsonToHtml(episode.description)
      }
      episode.PodcastId = newPodcast.id
      episode.file = episode.enclosure.url
      episode.enclosure = JSON.stringify(episode.enclosure)
      let epSlug = slugify(episode.title)
      // if (!(await isAcceptableEpisodeSlug(slug))) {
      //   epSlug = epSlug + '-' + Math.floor(Math.random() * 1000)
      // }
      episode.slug = epSlug

      for (let key in episode) {
        episode[key] = sanitizeHtml(episode[key])
      }
      console.log(episode)
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
        PodcastId: podcast.id,
        UserId: userId
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
      where: {UserId: userId}
    })

    let subscriptions = []
    subscriptionsArray.forEach(sub => {
      subscriptions.push(sub.PodcastId)
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
      where: {UserId: userId, PodcastId: podcastId}
    })

    res.status(200).json({unsubscribed: true})
  } catch (e) {
    const code = res.statusCode ? res.statusCode : 422
    return res.status(code).json({
      errors: {body: ['Could not subscribe', e.message]}
    })
  }
}

async function getPodcastFromRss(url) {
  const podcast = await getPodcastJson(url)
  // podcast.meta.description = formatJsonToHtml(podcast.meta.description)

  // podcast.episodes = podcast.episodes.map(ep => {
  //   ep.description = formatJsonToHtml(ep.description)
  // })

  return podcast
}

async function getPodcastJson(url) {
  const podcast = await podcastFeedParser.getPodcastFromURL(url)

  return podcast
}
