<template>
  <a href="#" style="display: flex" @click.prevent="switchTheme">
    <svg-icon :name="theme === 'light' ? 'dark' : 'light'" />
  </a>
</template>

<script>
import {mutationTypes as mutationTheme} from '@/store/modules/theme'

export default {
  name: 'ThemeSwitcher',
  mounted() {
    this.$store.commit(mutationTheme.setTheme)
  },
  computed: {
    theme() {
      return this.$store.state.theme.theme
    }
  },
  watch: {
    theme(newVal) {
      let html = document.getElementsByTagName('html')[0]
      html.setAttribute('data-theme', newVal)
    }
  },
  methods: {
    switchTheme() {
      this.$store.commit(mutationTheme.switchTheme)
    },
    setTheme() {
      this.$store.commit(mutationTheme.setTheme)
      let html = document.getElementsByTagName('html')[0]
      html.setAttribute('data-theme', this.theme)
    }
  }
}
</script>

<style lang="scss">
.icon {
  height: 24px;
  width: 24px;
  > svg,
  > path {
    fill: var(--text-color);
  }

  > svg {
    width: 100%;
    height: 100%;
    display: inline-block;
    vertical-align: baseline;
  }
}
</style>
