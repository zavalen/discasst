import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import SvgIcon from '@/components/SvgIcon'
import vClickOutside from 'click-outside-vue3'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import LangSwitcher from '@/components/LangSwitcher.vue'

createApp(App)
  .use(store)
  .use(i18n)
  .use(router)
  .use(vClickOutside)
  .component('SvgIcon', SvgIcon)
  .component('ThemeSwitcher', ThemeSwitcher)
  .component('LangSwitcher', LangSwitcher)
  .mount('#app')
