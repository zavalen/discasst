import {createStore} from 'vuex'

import auth from '@/store/modules/auth'
import theme from '@/store/modules/theme'
import lang from '@/store/modules/lang'
import feed from '@/store/modules/feed'
import notifications from '@/store/modules/notifications'

export default createStore({
  modules: {auth, theme, lang, feed, notifications}
})
