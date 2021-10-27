import notifications from '@/api/notifications'

const state = {
  data: [],
  isLoading: false,
  errors: null
}

export const notificationsMutations = {
  getNotificationsStart: '[notifications] getNotificationsStart',
  getNotificationsSuccess: '[notifications] getNotificationsSuccess',
  getNotificationsFailure: '[notifications] getNotificationsFailure',
  clear: '[notifications] clear'
}

export const notificationsActions = {
  getNotifications: '[notifications] getNotifications'
}

const mutations = {
  [notificationsMutations.getNotificationsStart](state) {
    state.isLoading = true
    state.errors = null
  },
  [notificationsMutations.getNotificationsSuccess](state, payload) {
    state.isLoading = false
    state.data = payload
    state.errors = null
  },
  [notificationsMutations.getNotificationsFailure](state, payload) {
    state.isLoading = false
    state.errors = payload
  },
  [notificationsMutations.clear](state) {
    state.isLoading = false
    state.data = []
    state.errors = null
  }
}

const actions = {
  [notificationsActions.getNotifications](context) {
    return new Promise(resolve => {
      context.commit(notificationsMutations.getNotificationsStart)
      notifications
        .getNotifications()
        .then(response => {
          context.commit(
            notificationsMutations.getNotificationsSuccess,
            response.data.notifications
          )
          resolve(response.data.notifications)
        })
        .catch(result => {
          context.commit(
            notificationsMutations.getNotificationsFailure,
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
