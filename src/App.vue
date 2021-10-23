<template>
  <pd-header> </pd-header>
  <main class="app__main">
    <router-view />
  </main>
  <footer class="app__footer"></footer>
</template>

<script>
import PdHeader from '@/components/PdHeader'
import {actionTypes as actionAuth} from '@/store/modules/auth'

export default {
  name: 'app',
  components: {
    PdHeader,
  },

  mounted() {
    this.$store.dispatch(actionAuth.getCurrentUser)
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
