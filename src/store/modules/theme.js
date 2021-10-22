import {setItem, getItem} from '@/helpers/persistenceStorage.js'

const state = {
  theme: 'light'
}

export const mutationTypes = {
  switchTheme: '[colorTheme] switchTheme',
  setTheme: '[colorTheme] setTheme'
}

const mutations = {
  [mutationTypes.setTheme](state) {
    const theme = getItem('theme') || 'light'
    state.theme = theme
  },
  [mutationTypes.switchTheme](state) {
    state.theme = state.theme === 'light' ? 'dark' : 'light'
    setItem('theme', state.theme)
  }
}

export default {
  state,
  mutations
}
