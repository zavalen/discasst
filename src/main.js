import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import SvgIcon from '@/components/SvgIcon'
import vClickOutside from 'click-outside-vue3'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

createApp(App)
  .use(i18n)
  .use(store)
  .use(router)
  .use(vClickOutside)
  .component('SvgIcon', SvgIcon)
  .use(Toast, {
    transition: 'Vue-Toastification__bounce',
    maxToasts: 10,
    newestOnTop: true,
    position: 'bottom-left',
    draggable: true,
    closeOnClick: true,
    timeout: 4000
  })
  .mount('#app')
