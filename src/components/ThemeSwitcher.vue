<template>
  <a href="#" @click.prevent="switchTheme">
    <svg-icon :name="theme === 'light' ? 'moon' : 'sun'" />
    {{ theme === 'light' ? $t('header.darkTheme') : $t('header.lightTheme') }}
  </a>
</template>

<script>
import {themeActions} from '@/store/modules/theme'

export default {
  name: 'ThemeSwitcher',
  beforeMount() {
    this.setTheme()
  },
  computed: {
    theme() {
      return this.$store.state.theme.theme
    },
  },
  methods: {
    switchTheme() {
      this.$store.dispatch(themeActions.switchAndSave)
      this.setTheme()
    },
    setTheme() {
      let html = document.getElementsByTagName('html')[0]
      html.setAttribute('data-theme', this.theme)
    },
  },
}
</script>
