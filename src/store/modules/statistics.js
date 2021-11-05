import {setItem, getItem} from '@/helpers/persistenceStorage.js'

const state = {
  visitorId: getVisitorId(),
  visitorInfo: null,
  isLoading: false,
  errors: null
}

export const statGetters = {
  visitorInfo: '[statistics] visitorInfo'
}

const getters = {
  [statGetters.visitorInfo]: state => {
    state.visitorInfo.visitorId = state.visitorId
    return state.visitorInfo
  }
}

export const statisticsMutations = {
  getVisitorInfoStart: '[statistics] getVisitorInfoStart',
  getVisitorInfoSuccess: '[statistics] getVisitorInfoSuccess',
  getVisitorInfoFailure: '[statistics] getVisitorInfoFailure'
}

export const statisticsActions = {
  getVisitorinfo: '[statistics] getVisitorinfo'
}

const mutations = {
  [statisticsMutations.getVisitorInfoStart](state) {
    state.isLoading = true
    state.errors = null
  },
  [statisticsMutations.getVisitorInfoSuccess](state, payload) {
    state.visitorInfo = payload
    state.isLoading = false
    state.errors = null
  },
  [statisticsMutations.getVisitorInfoFailure](state, payload) {
    state.isLoading = false
    state.errors = payload
  }
}

const actions = {
  [statisticsActions.getVisitorinfo](context) {
    return new Promise(resolve => {
      context.commit(statisticsMutations.getVisitorInfoStart)
      fetch('http://ip-api.com/json')
        .then(response => response.json())
        .then(response => {
          context.commit(statisticsMutations.getVisitorInfoSuccess, response)
          resolve(response)
        })
        .catch(result => {
          console.log('Error: ', result)
          context.commit(
            statisticsMutations.getVisitorInfoFailure,
            result.response.data.errors
          )
        })
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}

function getVisitorId() {
  const idFromLocalStorage = getItem('visitorId')
  if (idFromLocalStorage) {
    return idFromLocalStorage
  }

  const id =
    'id' +
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substr(2)

  setItem('visitorId', id)
  return id
}
