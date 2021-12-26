import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import SvgIcon from '@/components/SvgIcon'
import vClickOutside from 'click-outside-vue3'
import Ripple from '@/directives/ripple/ripple'
import '@/directives/ripple/ripple.css'
import VueLazyLoad from 'vue3-lazyload'
import VTooltip from 'v-tooltip'

import 'v-tooltip/dist/v-tooltip.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
const toastOptions = {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 10,
  newestOnTop: true,
  position: 'bottom-left',
  draggable: true,
  closeOnClick: true,
  timeout: 4000,
}

import VueDOMPurifyHTML from 'vue-dompurify-html'

createApp(App)
  .use(i18n)
  .use(store)
  .use(router)
  .use(vClickOutside)
  .use(VueLazyLoad, {
    log: false,
    error: '/images/placeholder.png',
  })
  .use(VTooltip)
  .component('SvgIcon', SvgIcon)
  .directive('ripple', Ripple)
  .use(VueDOMPurifyHTML)
  .use(Toast, toastOptions)
  .mount('#app')
