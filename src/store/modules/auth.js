import authApi from '@/api/auth.js'
import {setItem, getItem} from '@/helpers/persistenceStorage.js'

import {useToast} from 'vue-toastification'
const toast = useToast()
import translate from '@/i18n'
const i18n = translate.global

const state = {
  isSubmitting: false,
  isLoading: false,
  currentUser: null,
  validationErrors: null,
  isLoggedIn: null
}

export const authMutations = {
  registerStart: '[auth] registerStart',
  registerSuccess: '[auth] registerSuccess',
  registerFailure: '[auth] registerFailure',

  loginStart: '[auth] loginStart',
  loginSuccess: '[auth] loginSuccess',
  loginFailure: '[auth] loginFailure',

  getCurrentUserStart: '[auth] getCurrentUserStart',
  getCurrentUserSuccess: '[auth] getCurrentUserSuccess',
  getCurrentUserFailure: '[auth] getCurrentUserFailure',

  logout: '[auth] logout',
  resetErrors: '[auth] resetErrors'
}

export const authActions = {
  register: '[auth] register',
  login: '[auth] login',
  getCurrentUser: '[auth] getCurrentUser',
  logout: '[auth] logout'
}

export const authGetters = {
  currentUser: '[auth] currentUser',
  isLoggedIn: '[auth] isLoggedIn',
  isAnonymus: '[auth] isAnonymus'
}

const getters = {
  [authGetters.currentUser]: state => {
    return state.currentUser
  },
  [authGetters.isLoggedIn]: state => {
    return Boolean(state.isLoggedIn)
  },
  [authGetters.isAnonymus]: state => {
    return state.isLoggedIn === false
  }
}

const mutations = {
  [authMutations.registerStart](state) {
    state.isSubmitting = true
    state.validationErrors = null
  },
  [authMutations.registerSuccess](state, payload) {
    state.isSubmitting = false
    state.currentUser = payload
    state.isLoggedIn = true
  },
  [authMutations.registerFailure](state, payload) {
    state.isSubmitting = false
    state.validationErrors = payload
  },
  [authMutations.loginStart](state) {
    state.isSubmitting = true
    state.validationErrors = null
  },
  [authMutations.loginSuccess](state, payload) {
    state.isSubmitting = false
    state.currentUser = payload
    state.isLoggedIn = true
    state.isAuthPopupOpen = false
  },
  [authMutations.loginFailure](state, payload) {
    state.isSubmitting = false
    state.validationErrors = payload
  },
  [authMutations.getCurrentUserStart](state) {
    state.isLoading = true
  },
  [authMutations.getCurrentUserSuccess](state, payload) {
    state.isLoading = false
    state.currentUser = payload
    state.isLoggedIn = true
  },
  [authMutations.getCurrentUserFailure](state) {
    state.isLoading = false
    state.isLoggedIn = false
    state.currentUser = null
  },
  [authMutations.logout](state) {
    state.isLoading = false
    state.isLoggedIn = false
    state.currentUser = null
    state.validationErrors = null
    state.isAuthPopupOpen = false
  },

  [authMutations.resetErrors](state) {
    state.validationErrors = null
  }
}

const actions = {
  [authActions.register](context, credentials) {
    return new Promise(resolve => {
      context.commit(authMutations.registerStart)
      authApi
        .register(credentials)
        .then(response => {
          context.commit(authMutations.registerSuccess, response.data.user)
          setItem('accessToken', response.data.user.token)
          toast.success(i18n.t('toastifications.registerSuccess'))

          resolve(response.data.user)
          window.reload()
        })
        .catch(result => {
          console.log('Error: ', result)
          context.commit(
            authMutations.registerFailure,
            result.response.data.errors
          )
        })
    })
  },
  [authActions.login](context, credentials) {
    return new Promise(resolve => {
      context.commit(authMutations.loginStart)
      authApi
        .login(credentials)
        .then(response => {
          context.commit(authMutations.loginSuccess, response.data.user)

          setItem('accessToken', response.data.user.token)
          toast.success(i18n.t('toastifications.loginSuccess'))

          resolve(response.data.user)
          window.reload()
        })
        .catch(result => {
          console.log('Error: ', result)
          context.commit(authMutations.loginFailure, result)
        })
    })
  },
  [authActions.getCurrentUser](context) {
    const token = getItem('accessToken')
    if (!token) {
      context.commit(authMutations.getCurrentUserFailure)
      return false
    }
    return new Promise(resolve => {
      context.commit(authMutations.getCurrentUserStart)
      authApi
        .getCurrentUser()
        .then(response => {
          context.commit(
            authMutations.getCurrentUserSuccess,
            response.data.user
          )
          resolve(response.data.user)
        })
        .catch(() => {
          context.commit(authMutations.getCurrentUserFailure)
        })
    })
  },
  [authActions.logout](context) {
    context.commit(authMutations.logout)
    setItem('accessToken', '')

    window.location.reload()
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
