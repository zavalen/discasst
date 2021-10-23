import {createStore} from 'vuex'

import auth from '@/store/modules/auth'
import theme from '@/store/modules/theme'
import lang from '@/store/modules/lang'

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {auth, theme, lang}
})
