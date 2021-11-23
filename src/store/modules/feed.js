import feed from '@/api/episodes'

const state = {
  episodes: [],
  isLoading: false,
  errors: null,
  lastPage: false
}

export const feedMutations = {
  getFirstPageStart: '[feed] getFirstPageStart',
  getFirstPageSuccess: '[feed] getFirstPageSuccess',
  addToFeedSuccess: '[feed] getFirstPageSuccess',
  getFeedFailure: '[feed] getFeedFailure',

  makePageLast: '[feed] makePageLast'
}

export const feedActions = {
  getFeed: '[feed] getFeed'
}

const mutations = {
  [feedMutations.getFirstPageStart](state) {
    state.isLoading = true
    state.errors = null
    state.episodes = []
    state.lastPage = false
  },
  [feedMutations.getFirstPageSuccess](state, payload) {
    state.isLoading = false
    state.episodes = payload
    state.errors = null
  },
  [feedMutations.addToFeedSuccess](state, payload) {
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
      if (payload.page === 1) {
        context.commit(feedMutations.getFirstPageStart)
      }
      feed
        .getFeed(payload)
        .then(response => {
          if (payload.page === 1) {
            context.commit(
              feedMutations.getFirstPageSuccess,
              response.data.episodes
            )
          } else {
            context.commit(
              feedMutations.addToFeedSuccess,
              response.data.episodes
            )
          }
          if (response.data.episodes.length < payload.params.limit) {
            context.commit(feedMutations.makePageLast)
          }
          resolve(response.data.episodes)
        })
        .catch(result => {
          context.commit(feedMutations.getFeedFailure, result.response)
        })
    })
  }
}

export default {
  state,
  mutations,
  actions
}

// function makeArrayUnique(arr) {
//   return arr.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
// }
