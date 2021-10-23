<template>
  <a href="#" @click.prevent="switchLang">
    {{ lang === 'ru' ? 'English' : 'Русский' }}
  </a>
</template>

<script>
import {mutationTypes as mutationLang} from '@/store/modules/lang'

export default {
  name: 'LangSwitcher',
  beforeMount() {
    this.setLang()
  },

  computed: {
    lang() {
      return this.$store.state.lang.lang
    },
  },
  methods: {
    switchLang() {
      this.$store.commit(mutationLang.switchLang)
      this.setLang()
    },
    setLang() {
      this.$i18n.locale = this.lang
    },
  },
}
</script>
