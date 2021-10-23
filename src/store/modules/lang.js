import {setItem, getItem} from '@/helpers/persistenceStorage.js'

const state = {
  lang: getItem('lang') || 'ru'
}

export const mutationTypes = {
  switchLang: '[colorLang] switchLang'
}

const mutations = {
  [mutationTypes.switchLang](state) {
    state.lang = state.lang === 'ru' ? 'en' : 'ru'
    setItem('lang', state.lang)
  }
}

export default {
  state,
  mutations
}
