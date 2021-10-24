<template>
  <pd-header class="app__header"> </pd-header>
  <main class="app__main">
    <router-view />
  </main>
  <footer class="app__footer"></footer>
  <auth-popup v-if="!isLoggedIn && isAuthPopupOpen" />
</template>

<script>
import PdHeader from '@/components/PdHeader'
import {authActions} from '@/store/modules/auth'
import AuthPopup from '@/components/popups/AuthPopup'
import {mapState} from 'vuex'

export default {
  name: 'app',

  components: {
    PdHeader,
    AuthPopup,
  },
  computed: {
    ...mapState({
      isAuthPopupOpen: (state) => state.auth.isAuthPopupOpen,
      isLoggedIn: (state) => state.auth.isLoggedIn,
    }),
  },
  mounted() {
    this.$store.dispatch(authActions.getCurrentUser)
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
