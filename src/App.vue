<template>
  <pd-header class="app__header"> </pd-header>
  <main class="app__main">
    <router-view />
  </main>
  <footer class="app__footer"></footer>
  <auth-popup v-if="isAnonymus" />
</template>

<script>
import PdHeader from '@/components/PdHeader'
import {authActions, authGetters} from '@/store/modules/auth'
import AuthPopup from '@/components/popups/AuthPopup'
import {mapGetters} from 'vuex'

export default {
  name: 'app',

  components: {
    PdHeader,
    AuthPopup
  },
  computed: {
    ...mapGetters({
      isAnonymus: authGetters.isAnonymus
    })
  },
  mounted() {
    this.$store.dispatch(authActions.getCurrentUser)
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
