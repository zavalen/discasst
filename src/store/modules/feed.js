import feed from '@/api/episodes'

const state = {
  episodes: [],
  isLoading: false,
  errors: null,
  lastPage: false
}

export const feedMutations = {
  getFeedStart: '[feed] getFeedStart',
  getFeedSuccess: '[feed] getFeedSuccess',
  getFeedFailure: '[feed] getFeedFailure',

  makePageLast: '[feed] makePageLast'
}

export const feedActions = {
  getFeed: '[feed] getFeed'
}

const mutations = {
  [feedMutations.getFeedStart](state) {
    state.isLoading = true
    state.errors = null
  },
  [feedMutations.getFeedSuccess](state, payload) {
    state.isLoading = false
    state.episodes = state.episodes.concat(payload)
    state.errors = null
  },
  [feedMutations.getFeedFailure](state, payload) {
    state.isLoading = false
    state.errors = payload
  },
  [feedMutations.makePageLast](state) {
    state.lastPage = true
  }
}

const actions = {
  [feedActions.getFeed](context, payload) {
    return new Promise(resolve => {
      context.commit(feedMutations.getFeedStart)
      feed
        .getFeed(payload)
        // .then(response => response.json())
        .then(response => {
          context.commit(feedMutations.getFeedSuccess, response.data.episodes)

          if (response.data.episodes.length < payload.params.limit) {
            context.commit(feedMutations.makePageLast)
          }
          resolve(response.data.episodes)
        })
        .catch(result => {
          context.commit(feedMutations.getFeedFailure, result.response.data)
        })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
