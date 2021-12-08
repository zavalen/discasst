const User = require('./User')
const Visitor = require('./Visitor')
const VisitorInfo = require('./VisitorInfo')
const Podcast = require('./Podcast')
const Episode = require('./Episode')
const Rating = require('./Rating')
const UserEpisodesHistory = require('./UserEpisodesHistory')
const EpisodeProgress = require('./EpisodeProgress')
const PodcastsManagers = require('./PodcastsManagers')
const Subscriptions = require('./Subscriptions')

const setAssociations = function() {
  User.hasMany(VisitorInfo, {as: 'visitors', foreignKey: 'userId'})
  Episode.belongsTo(Podcast, {as: 'podcast', foreignKey: 'podcastId'})

  Podcast.belongsToMany(User, {
    through: PodcastsManagers,
    as: 'managers',
    foreignKey: 'podcastId',
    otherKey: 'userId'
  })

  User.belongsToMany(Episode, {
    through: UserEpisodesHistory,
    foreignKey: 'userId'
  })
  Visitor.belongsToMany(Episode, {through: UserEpisodesHistory})

  Visitor.hasMany(VisitorInfo, {onDelete: 'cascade', foreignKey: 'visitorId'})
  Episode.hasOne(EpisodeProgress, {
    onDelete: 'cascade',
    as: 'progress',
    foreignKey: 'episodeId'
  })
  EpisodeProgress.belongsTo(Visitor, {
    onDelete: 'cascade',
    foreignKey: 'visitorId'
  })
  EpisodeProgress.belongsTo(User, {onDelete: 'cascade', foreignKey: 'userId'})
  EpisodeProgress.belongsTo(Episode, {
    onDelete: 'cascade',
    foreignKey: 'episodeId'
  })

  User.belongsToMany(Podcast, {
    through: Subscriptions,
    as: 'subscriptions',
    foreignKey: 'userId',
    otherKey: 'podcastId'
  })
  Episode.belongsToMany(User, {
    through: Rating,
    as: 'rating',
    foreignKey: 'episodeId',
    otherKey: 'userId'
  })
  Episode.hasMany(Rating, {foreignKey: 'episodeId'})
}
module.exports = setAssociations
