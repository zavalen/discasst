<template>
  <a href="?switch-lang" @click.prevent="switchLang">
    <svg-icon style="margin-right: 8px" name="translate" />
    {{ lang === 'ru' ? 'English' : 'Русский' }}
  </a>
</template>

<script>
import {langActions} from '@/store/modules/lang'
import {mapState, mapGetters} from 'vuex'
import {authGetters} from '@/store/modules/auth'

export default {
  name: 'LangSwitcher',
  computed: {
    ...mapState({
      lang: (state) => state.lang.lang,
    }),
    ...mapGetters({
      currentUser: authGetters.currentUser,
    }),
  },
  watch: {
    lang(newLang) {
      this.setLang(newLang)
    },
    currentUser(user) {
      if (user && user.lang) {
        this.$store.dispatch(langActions.setAndSave, user.lang)
      }
    },
  },
  mounted() {
    this.setLang()
  },
  methods: {
    switchLang() {
      const newLang = this.lang === 'en' ? 'ru' : 'en'
      this.$store.dispatch(langActions.setAndSave, newLang)
    },
    setLang(lang = this.lang) {
      this.$i18n.locale = lang
    },
  },
}
</script>
