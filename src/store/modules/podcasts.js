import podcasts from '@/api/podcasts'

const state = {
  data: null,
  isLoading: false,
  errors: null
}

export const podcastsMutations = {
  getPodcastsStart: '[podcasts] getPodcastsStart',
  getPodcastsSuccess: '[podcasts] getPodcastsSuccess',
  getPodcastsFailure: '[podcasts] getPodcastsFailure'
}

export const podcastsActions = {
  getPodcasts: '[podcasts] getPodcasts'
}

const mutations = {
  [podcastsMutations.getPodcastsStart](state) {
    state.isLoading = true
    state.errors = null
  },
  [podcastsMutations.getPodcastsSuccess](state, payload) {
    state.isLoading = false
    state.data = payload
    state.errors = null
  },
  [podcastsMutations.getPodcastsFailure](state, payload) {
    state.isLoading = false
    state.errors = payload
  }
}

const actions = {
  [podcastsActions.getPodcasts](context) {
    return new Promise(resolve => {
      context.commit(podcastsMutations.getPodcastsStart)
      podcasts
        .getPodcasts()
        .then(response => {
          context.commit(
            podcastsMutations.getPodcastsSuccess,
            response.data.podcasts
          )
          resolve(response.data.podcasts)
        })
        .catch(result => {
          context.commit(
            podcastsMutations.getPodcastsFailure,
            result.response.data
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
