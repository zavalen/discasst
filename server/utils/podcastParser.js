const fs = require('fs')
const Parser = require('rss-parser')
const parser = new Parser()
const {jsonToHtml} = require('./stringUtils')
const sanitizeHtml = require('sanitize-html')
const {slugify} = require('./slugUtils')

module.exports.getPodcastJson = async url => {
  // const getPodcastJson = async url => {
  if (!url) return

  let startTime = Date.now()
  console.log('Start parsing podcast: ' + url)

  const podcastJson = await parser.parseURL(url)
  let parsingTime = Date.now() - startTime
  console.log(
    `Parsing of "${podcastJson.title}" (${url}) takes ${parsingTime /
      1000} seconds.`
  )

  if (
    !podcastJson ||
    !podcastJson.title ||
    !podcastJson.description ||
    !podcastJson.items ||
    !podcastJson.items.length ||
    !podcastJson.itunes ||
    !podcastJson.itunes.image
  ) {
    throw new Error('RSS link is not correct')
  }

  const meta = getPodcastMeta(podcastJson, url)

  const episodes = getEpisodes(podcastJson)

  // fs.writeFile('podcasttest.json', JSON.stringify({meta, episodes}), err => {
  //   if (err) {
  //     console.error(err)
  //     return
  //   }
  // })

  return {meta, episodes}
}

function getPodcastMeta(podcastJson, rssUrl) {
  const meta = {}
  meta.title = podcastJson.title
  meta.slug = slugify(meta.title)
  meta.description = jsonToHtml(podcastJson.description)
  meta.imageURL = podcastJson.image?.url || podcastJson.itunes.image || ''
  meta.rss = rssUrl
  meta.link = podcastJson.link || ''
  meta.language = getLanguage(podcastJson.language)
  meta.creator = podcastJson.creator || podcastJson.itunes.creator || ''
  meta.ownerName = podcastJson.itunes.owner.name || ''
  meta.ownerEmail = podcastJson.itunes.owner.email || ''

  meta.explicit =
    isExplicit(podcastJson.itunes.explicit) || isExplicit(podcastJson.explicit)
  meta.generator = podcastJson.generator || ''
  meta.copyright = podcastJson.copyright || ''
  meta.categories =
    podcastJson.itunes.categoriesWithSubs || podcastJson.itunes.categories || ''
  meta.keywords = podcastJson.keywords || podcastJson.itunes.keywords || ''
  if (meta.keywords && meta.keywords.length) {
    meta.keywords = meta.keywords.map(keyword => keyword.trim())
  }

  for (let key in meta) {
    if (typeof meta[key] === 'string') {
      meta[key] = sanitizeHtml(meta[key]).trim()
    }
  }

  return meta
}

function getEpisodes(podcastJson) {
  if (!podcastJson || !podcastJson.items || !podcastJson.items.length) {
    return []
  }

  const episodes = []
  podcastJson.items.forEach((item, index) => {
    const episode = {}
    if (!item.title && !item.enclosure.url) {
      return
    }
    episode.title = item.title
    episode.slug = slugify(item.title)
    episode.description =
      item['content:encoded'] || item.content || item['content:encodedSnippet']
    episode.description = jsonToHtml(episode.description)
    episode.pubDate = new Date(item.pubDate).toISOString()
    episode.link = item.link
    episode.file = item.enclosure.url
    episode.enclosure = item.enclosure
    episode.duration = convertTimeToSeconds(item.itunes.duration)
    episode.season = +item.itunes.season
    episode.episode = +item.itunes.episode || podcastJson.items.length - index

    episode.explicit = isExplicit(item.explicit)

    for (let key in episode) {
      if (typeof episode[key] === 'string') {
        episode[key] = sanitizeHtml(episode[key]).trim()
      }
    }
    episodes.push(episode)
  })

  return episodes
}

function isExplicit(explicit) {
  if (!explicit) {
    return false
  }

  const explicitString = explicit.toLocaleLowerCase().trim()
  if (
    explicitString == 'yes' ||
    explicitString == 'true' ||
    explicitString == 'yep' ||
    explicitString == 'explicit'
  ) {
    return true
  } else {
    return false
  }
}

function getLanguage(lang) {
  if (!lang) return ''

  if (lang.includes('-')) {
    lang = lang.split('-')[0]
  }

  return lang.toLocaleLowerCase()
}

function convertTimeToSeconds(time) {
  return +time.split(':').reduce((acc, time) => 60 * acc + +time)
}

// getPodcastJson('https://whyarewestillalive.libsyn.com/rss')
