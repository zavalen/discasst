import {setItem, getItem} from '@/helpers/persistenceStorage.js'
import api from '@/api/auth'
import auth from '@/store/modules/auth'

const state = {
  lang: getItem('lang') || 'ru'
}

export const langMutations = {
  set: '[lang] set'
}

export const langActions = {
  setAndSave: '[lang] setAndSave'
}

const mutations = {
  [langMutations.set](state, lang) {
    state.lang = lang
  }
}

const actions = {
  async [langActions.setAndSave](ctx, payload) {
    ctx.commit(langMutations.set, payload)
    setItem('lang', state.lang)

    if (auth.state.currentUser) {
      await api.updateUserDetails({lang: payload})
    }
  }
}

export default {
  state,
  mutations,
  actions
}
