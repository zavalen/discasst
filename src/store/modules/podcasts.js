import podcasts from '@/api/podcasts'

import {useToast} from 'vue-toastification'
const toast = useToast()
import translate from '@/i18n'
const i18n = translate.global

const state = {
  data: null,
  isLoading: false,
  errors: null,
  podcast: null,
  subscribeLoading: false,
  userSubscriptions: []
}

export const podcastsMutations = {
  getPodcastsStart: '[podcasts] getPodcastsStart',
  getPodcastsSuccess: '[podcasts] getPodcastsSuccess',
  getPodcastsFailure: '[podcasts] getPodcastsFailure',

  subscribeStart: '[podcasts] subscribeStart',
  subscribeSuccess: '[podcasts] subscribeSuccess',
  subscribeFailure: '[podcasts] subscribeFailure',

  unsubscribeStart: '[podcasts] unsubscribeStart',
  unsubscribeSuccess: '[podcasts] unsubscribeSuccess',
  unsubscribeFailure: '[podcasts] unsubscribeFailure',

  getSubscriptionsStart: '[podcasts] getSubscriptionsStart',
  getSubscriptionsSuccess: '[podcasts] getSubscriptionsSuccess',
  getSubscriptionsFailure: '[podcasts] getSubscriptionsFailure'
}

export const podcastsActions = {
  getPodcasts: '[podcasts] getPodcasts',
  subscribe: '[podcasts] subscribe',
  unsubscribe: '[podcasts] unsubscribe',
  getSubscribtions: '[podcasts] getSubscribtions'
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
  },

  [podcastsMutations.subscribeStart](state) {
    state.subscribeLoading = true
  },
  [podcastsMutations.subscribeSuccess](state, payload) {
    state.subscribeLoading = false
    state.userSubscriptions.push(payload.id)
    toast.success(
      i18n.t('toastifications.subsciribe') + ' «' + payload.title + '»'
    )
  },
  [podcastsMutations.subscribeFailure](state) {
    state.subscribeLoading = false
  },

  [podcastsMutations.unsubscribeStart](state) {
    state.subscribeLoading = true
  },
  [podcastsMutations.unsubscribeSuccess](state, payload) {
    state.subscribeLoading = false
    state.userSubscriptions = state.userSubscriptions.filter(
      el => el != payload.id
    )
    toast.warning(
      i18n.t('toastifications.unsubsciribe') + ' «' + payload.title + '»'
    )
  },
  [podcastsMutations.unsubscribeFailure](state) {
    state.subscribeLoading = false
  },

  [podcastsMutations.getSubscriptionsStart](state) {
    state.subscribeLoading = true
    state.userSubscriptions = []
  },
  [podcastsMutations.getSubscriptionsSuccess](state, payload) {
    state.userSubscriptions = payload
    state.subscribeLoading = false
  },
  [podcastsMutations.getSubscriptionsStart](state) {
    state.subscribeLoading = false
    state.userSubscriptions = []
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
  },
  [podcastsActions.subscribe](context, podcast) {
    return new Promise(resolve => {
      context.commit(podcastsMutations.subscribeStart)
      podcasts
        .subscribe(podcast.id)
        .then(() => {
          context.commit(podcastsMutations.subscribeSuccess, podcast)
          resolve(true)
        })
        .catch(result => {
          context.commit(podcastsMutations.subscribeFailure)
          console.log(result.response.data)
        })
    })
  },
  [podcastsActions.unsubscribe](context, podcast) {
    return new Promise(resolve => {
      context.commit(podcastsMutations.unsubscribeStart)
      podcasts
        .unsubscribe(podcast.id)
        .then(() => {
          context.commit(podcastsMutations.unsubscribeSuccess, podcast)
          resolve(true)
        })
        .catch(result => {
          context.commit(podcastsMutations.unsubscribeFailure)
          console.log(result.response.data)
        })
    })
  },
  [podcastsActions.getSubscribtions](context) {
    return new Promise(resolve => {
      context.commit(podcastsMutations.getSubscriptionsStart)
      podcasts
        .getSubscribtions()
        .then(response => {
          console.log(response.data.subscriptions)
          context.commit(
            podcastsMutations.getSubscriptionsSuccess,
            response.data.subscriptions
          )

          resolve(response.data.subscriptions)
        })
        .catch(result => {
          context.commit(podcastsMutations.getSubscriptionsFailure)

          console.log(result.response.data)
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
