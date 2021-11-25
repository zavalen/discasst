<template>
  <a href="?switch-theme" @click.prevent="switchTheme">
    <svg-icon
      style="margin-right: 8px"
      :name="theme === 'light' ? 'moon' : 'sun'"
    />
    {{ theme === 'light' ? $t('header.darkTheme') : $t('header.lightTheme') }}
  </a>
</template>

<script>
import {themeActions} from '@/store/modules/theme'
import {mapState, mapGetters} from 'vuex'
import {authGetters} from '@/store/modules/auth'

export default {
  name: 'ThemeSwitcher',
  mounted() {
    this.setTheme()
  },
  computed: {
    ...mapState({
      theme: (state) => state.theme.theme,
    }),
    ...mapGetters({
      currentUser: authGetters.currentUser,
    }),
  },
  methods: {
    switchTheme() {
      const newTheme = this.theme === 'light' ? 'dark' : 'light'
      this.$store.dispatch(themeActions.setAndSave, newTheme)
    },
    setTheme(theme = this.theme) {
      let html = document.getElementsByTagName('html')[0]
      html.setAttribute('data-theme', theme)
    },
  },
  watch: {
    theme(newTheme) {
      this.setTheme(newTheme)
    },
    currentUser(user) {
      if (user && user.theme) {
        this.$store.dispatch(themeActions.setAndSave, user.theme)
      }
    },
  },
}
</script>
