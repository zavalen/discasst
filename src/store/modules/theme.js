import {setItem, getItem} from '@/helpers/persistenceStorage.js'
import api from '@/api/auth'
import auth from '@/store/modules/auth'

const state = {
  theme: getItem('theme') || 'light'
}

export const themeMutation = {
  set: '[theme] set'
}
export const themeActions = {
  setAndSave: '[theme] setAndSave'
}

const mutations = {
  [themeMutation.set](state, theme) {
    state.theme = theme
  }
}

const actions = {
  async [themeActions.setAndSave](context, payload) {
    context.commit(themeMutation.set, payload)
    setItem('theme', payload)

    if (auth.state.currentUser) {
      await api.updateUserDetails({theme: payload})
    }
  }
}

export default {
  state,
  mutations,
  actions
}
