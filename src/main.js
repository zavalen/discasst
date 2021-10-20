import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import BaseSvg from '@/components/BaseSvg'

createApp(App)
  .use(i18n)
  .use(store)
  .use(router)
  .component('BaseSvg', BaseSvg)
  .mount('#app')
