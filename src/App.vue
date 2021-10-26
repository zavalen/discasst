<template>
  <pd-header class="app__header"> </pd-header>
  <main class="app__main">
    <router-view />
    <ZPlayer class="app__zPlayer" />
  </main>
  <footer class="app__footer"></footer>
  <auth-popup v-if="isAnonymus" />
</template>

<script>
import PdHeader from '@/components/PdHeader'
import {authActions, authGetters} from '@/store/modules/auth'
import AuthPopup from '@/components/popups/AuthPopup'
import {mapGetters} from 'vuex'
import ZPlayer from '@/components/ZPlayer'

export default {
  name: 'app',

  components: {
    PdHeader,
    AuthPopup,
    ZPlayer,
  },
  computed: {
    ...mapGetters({
      isAnonymus: authGetters.isAnonymus,
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
