import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import SvgIcon from '@/components/SvgIcon'

createApp(App)
  .use(store)
  .use(i18n)
  .use(router)
  .component('SvgIcon', SvgIcon)
  .mount('#app')
