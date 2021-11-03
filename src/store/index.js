import {createStore} from 'vuex'

import auth from '@/store/modules/auth'
import theme from '@/store/modules/theme'
import lang from '@/store/modules/lang'
import feed from '@/store/modules/feed'
import podcasts from '@/store/modules/podcasts'
import notifications from '@/store/modules/notifications'
import zPlayer from '@/store/modules/zPlayer'

export default createStore({
  modules: {auth, theme, lang, feed, notifications, podcasts, zPlayer}
})
