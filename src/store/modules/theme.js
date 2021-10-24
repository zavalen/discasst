import {setItem, getItem} from '@/helpers/persistenceStorage.js'

const state = {
  theme: getItem('theme') || 'light'
}

export const themeMutation = {
  switch: '[theme] switch'
}
export const themeActions = {
  switchAndSave: '[theme] switchAndSave'
}

const mutations = {
  [themeMutation.switch](state) {
    state.theme = state.theme === 'light' ? 'dark' : 'light'
  }
}

const actions = {
  [themeActions.switchAndSave](context) {
    context.commit(themeMutation.switch)
    setItem('theme', state.theme)
  }
}

export default {
  state,
  mutations,
  actions
}
