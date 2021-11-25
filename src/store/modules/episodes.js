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

  makePageLast: '[feed] makePageLast'
}

export const feedActions = {
  getEpisodes: '[feed] getEpisodes'
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
  }
}

export default {
  state,
  mutations,
  actions
}
