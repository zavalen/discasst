import {setItem} from '@/helpers/persistenceStorage.js'

const state = {
  theme: 'light'
}

export const mutationTypes = {
  switchTheme: '[colorTheme] switchTheme'
}

const mutations = {
  [mutationTypes.switchTheme](state) {
    state.theme = state.theme === 'light' ? 'dark' : 'light'
    setItem('theme', state.theme)
  }
}

export default {
  state,
  mutations
}
