import feed from '@/api/episodes'

const state = {
  episodes: [],
  isLoading: false,
  errors: null,
  lastPage: false
}

export const feedMutations = {
  getEpisodesStart: '[feed] getEpisodesStart',
  getEpisodesSuccess: '[feed] getEpisodesSuccess',
  addToEpisodesSuccess: '[feed] getEpisodesSuccess',
  getEpisodesFailure: '[feed] getEpisodesFailure',

  makePageLast: '[feed] makePageLast',

  setRating: '[feed] setRating'
}

export const feedActions = {
  getEpisodes: '[feed] getEpisodes',
  setRating: '[feed] setRating'
}

const mutations = {
  [feedMutations.getEpisodesStart](state) {
    state.isLoading = true
    state.errors = null
    state.episodes = []
    state.lastPage = false
  },

  [feedMutations.getEpisodesSuccess](state, payload) {
    state.isLoading = false
    state.episodes = payload
    state.errors = null
  },
  [feedMutations.addToEpisodesSuccess](state, payload) {
    state.isLoading = false
    state.episodes = state.episodes.concat(payload)
    state.errors = null
  },
  [feedMutations.getEpisodesFailure](state, payload) {
    state.isLoading = false
    state.errors = payload
  },
  [feedMutations.makePageLast](state) {
    state.lastPage = true
  }
  // [feedMutations.setRating](state, payload) {
  //   const episode = state.episodes.find(ep => ep.id === payload.episodeId)
  //   episode.rating.userRating += payload.value
  //   episode.rating.sum += payload.value
  // }
}

const actions = {
  [feedActions.getEpisodes](context, payload) {
    return new Promise(resolve => {
      if (payload.page === 1) {
        context.commit(feedMutations.getEpisodesStart)
      }
      feed
        .getEpisodes(payload)
        .then(response => {
          if (payload.page === 1) {
            context.commit(
              feedMutations.getEpisodesSuccess,
              response.data.episodes
            )
          } else {
            context.commit(
              feedMutations.addToEpisodesSuccess,
              response.data.episodes
            )
          }
          if (response.data.episodes.length < payload.params.limit) {
            context.commit(feedMutations.makePageLast)
          }
          resolve(response.data.episodes)
        })
        .catch(result => {
          context.commit(feedMutations.getEpisodesFailure, result.response)
        })
    })
  },
  [feedActions.setRating](context, payload) {
    return new Promise(() => {
      // context.commit(feedMutations.setRating, payload)

      feed.setRating(payload)
      // .then(response => {

      // })
      // .catch(result => {
      // })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
