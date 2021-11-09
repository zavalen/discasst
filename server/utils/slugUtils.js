const slugifyPlugin = require('slugify')
const Podcast = require('../models/Podcast')
const {unAcceptableSlugs} = require('./unacceptableSlugs')

module.exports.slugify = string => {
  string = string.replace(/ё/g, 'е')

  let slug = slugifyPlugin(string, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    locale: 'en', // language code of the locale to use
    trim: true // trim leading and trailing replacement chars, defaults to `true`
  })

  return slug
}

module.exports.isAcceptablePodcastSlug = async slug => {
  if (unAcceptableSlugs.includes(slug)) {
    return false
  }

  const existingPodcastWithSlug = await Podcast.findOne({
    where: {slug: slug}
  })
  if (existingPodcastWithSlug) {
    return false
  }

  return true
}

module.exports.isAcceptableEpisodeSlug = async (slug, podcast) => {
  if (unAcceptableSlugs.includes(slug)) {
    return false
  }

  const existingPodcastWithSlug = await Podcast.findOne({
    where: {slug: slug}
  })
  if (existingPodcastWithSlug) {
    return false
  }

  return true
}
