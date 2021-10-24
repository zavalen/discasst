import feed from '@/api/feed'

const state = {
  data: null,
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
    state.data = payload
    state.errors = null
  },
  [feedMutations.getFeedFailure](state, payload) {
    state.isLoading = false
    state.errors = payload
  }
}

const actions = {
  [feedActions.getFeed](context, apiUrl) {
    return new Promise(resolve => {
      context.commit(feedMutations.getFeedStart)
      feed
        .getFeed(apiUrl)
        .then(response => {
          context.commit(feedMutations.getFeedSuccess, response.data.articles)
          resolve(response.data.articles)
        })
        .catch(result => {
          console.log('Error: ', result)
          context.commit(
            feedMutations.getFeedFailure,
            result.response.data.errors
          )
        })
    })
  }
}

const getters = {}
export default {
  state,
  mutations,
  getters,
  actions
}
