import feed from '@/api/feed'

const state = {
  episodes: [],
  isLoading: false,
  errors: null
}

export const feedMutations = {
  getFeedStart: '[feed] getFeedStart',
  getFeedSuccess: '[feed] getFeedSuccess',
  getFeedFailure: '[feed] getFeedFailure'
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
          console.log(response.data.episodes)
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
