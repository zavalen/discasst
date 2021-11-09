import auth from '@/store/modules/auth'
import api from '@/api/visitor'
import {getVisitorId} from '@/api/axios'

const state = {
  visitor: {},
  isLoading: false,
  errors: null
}

export const statisticsGetters = {
  visitor: '[statistics] visitor'
}

const getters = {
  [statisticsGetters.visitor]: state => {
    return state.visitor
  }
}

export const statisticsMutations = {
  getVisitorStart: '[statistics] getVisitorStart',
  getVisitorSuccess: '[statistics] getVisitorSuccess',
  getVisitorFailure: '[statistics] getVisitorFailure',
  setUserId: '[statistics] setUserId'
}

export const statisticsActions = {
  getVisitor: '[statistics] getVisitor',
  sendVisitor: '[statistics] sendVisitor'
}

const mutations = {
  [statisticsMutations.getVisitorStart](state) {
    state.isLoading = true
    state.errors = null
  },
  [statisticsMutations.getVisitorSuccess](state, payload) {
    state.visitor = payload
    state.isLoading = false
    state.errors = null
  },
  [statisticsMutations.getVisitorFailure](state, payload) {
    state.isLoading = false
    state.errors = payload.errors
    state.visitor = payload.visitor
  },
  [statisticsMutations.setUserId](state, payload) {
    state.visitor.UserId = payload
  }
}

const actions = {
  [statisticsActions.getVisitor](context) {
    return new Promise(resolve => {
      context.commit(statisticsMutations.getVisitorStart)
      fetch('http://ip-api.com/json')
        .then(response => response.json())
        .then(response => {
          const visitor = response || {}
          visitor.visitorId = getVisitorId()
          visitor.UserId = auth.state.currentUser
            ? auth.state.currentUser.id
            : null
          visitor.ip = response.query
          context.commit(statisticsMutations.getVisitorSuccess, visitor)
          resolve(visitor)
        })
        .catch(result => {
          console.log('Error: ', result)
          const response = {}
          const visitor = {}
          visitor.visitorId = getVisitorId()
          visitor.UserId = auth.state.currentUser
            ? auth.state.currentUser.id
            : null
          response.visitor = visitor
          response.errors = result
          context.commit(statisticsMutations.getVisitorFailure, response)
          console.log(response)
          return visitor
        })
    })
  },
  [statisticsActions.sendVisitor](context, visitor) {
    return new Promise(resolve => {
      console.log(visitor)
      api
        .sendVisitor(visitor)
        .then(() => {
          resolve(true)
        })
        .catch(result => {
          console.log(result)
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
