import {setItem, getItem} from '@/helpers/persistenceStorage.js'

const state = {
  lang: getItem('lang') || 'ru'
}

export const langMutations = {
  switch: '[lang] switch'
}

export const langActions = {
  switchAndSave: '[lang] switchAndSave'
}

const mutations = {
  [langMutations.switch](state) {
    state.lang = state.lang === 'ru' ? 'en' : 'ru'
  }
}

const actions = {
  [langActions.switchAndSave](ctx) {
    ctx.commit(langMutations.switch)
    setItem('lang', state.lang)
  }
}

export default {
  state,
  mutations,
  actions
}
