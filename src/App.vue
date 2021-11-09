<template>
  <pd-header class="app__header"> </pd-header>
  <main class="app__main">
    <router-view />
    <ZPlayer class="app__zPlayer" />
  </main>
  <footer class="app__footer"></footer>
  <auth-popup v-if="isAnonymus" />
  <visitor-info />
</template>

<script>
import PdHeader from '@/components/PdHeader'
import VisitorInfo from '@/components/VisitorInfo'
import {authActions, authGetters} from '@/store/modules/auth'
import AuthPopup from '@/components/popups/AuthPopup'
import {mapGetters} from 'vuex'
import ZPlayer from '@/components/ZPlayer'
import {useToast} from 'vue-toastification'

const toast = useToast()

export default {
  name: 'app',
  components: {
    PdHeader,
    AuthPopup,
    ZPlayer,
    VisitorInfo,
  },
  computed: {
    ...mapGetters({
      isAnonymus: authGetters.isAnonymus,
    }),
  },
  data() {
    return {
      user: null,
    }
  },
  async mounted() {
    this.user = await this.$store.dispatch(authActions.getCurrentUser)

    window.addEventListener('offline', () =>
      toast.error(this.$t('toastifications.offline'), {timeout: false})
    )
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
