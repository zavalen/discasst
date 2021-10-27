<template>
  <a href="#" @click.prevent="switchLang">
    <svg-icon style="margin-right:8px" name="translate" />
    {{ lang === 'ru' ? 'English' : 'Русский' }}
  </a>
</template>

<script>
import {langActions} from '@/store/modules/lang'

export default {
  name: 'LangSwitcher',
  beforeMount() {
    this.setLang()
  },

  computed: {
    lang() {
      return this.$store.state.lang.lang
    }
  },
  methods: {
    switchLang() {
      this.$store.dispatch(langActions.switchAndSave)
      this.setLang()
    },
    setLang() {
      this.$i18n.locale = this.lang
    }
  }
}
</script>
