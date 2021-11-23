<template>
  <pd-header class="app__header"> </pd-header>
  <main class="app__main">
    <router-view />
    <ZPlayer class="app__zPlayer" />
  </main>
  <footer class="app__footer"></footer>
  <auth-popup v-if="isAnonymus" />
  <visitor-info />
  <scroll-to-top />
</template>

<script>
import PdHeader from '@/components/PdHeader'
import VisitorInfo from '@/components/VisitorInfo'
import ScrollToTop from '@/components/ui/ScrollToTop'
import {authActions, authGetters} from '@/store/modules/auth'
import {podcastsActions} from '@/store/modules/podcasts'
import AuthPopup from '@/components/popups/AuthPopup'
import {mapGetters} from 'vuex'
import ZPlayer from '@/components/zPlayer/ZPlayer'
import {useToast} from 'vue-toastification'

const toast = useToast()

export default {
  name: 'app',
  components: {
    PdHeader,
    AuthPopup,
    ZPlayer,
    VisitorInfo,
    ScrollToTop,
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
    if (this.user) {
      await this.$store.dispatch(podcastsActions.getSubscribtions)
    }
    window.addEventListener('offline', () =>
      toast.error(this.$t('toastifications.offline'), {timeout: false})
    )
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
