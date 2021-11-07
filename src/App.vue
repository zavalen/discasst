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
import {statisticsActions, statisticsGetters} from '@/store/modules/statistics'
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
  },
  computed: {
    ...mapGetters({
      isAnonymus: authGetters.isAnonymus,
      visitor: statisticsGetters.visitor,
    }),
  },
  data() {
    return {
      user: null,
    }
  },
  async mounted() {
    this.user = await this.$store.dispatch(authActions.getCurrentUser)
    await this.$store
      .dispatch(statisticsActions.getVisitor)
      .catch((err) => console.log(err))
    console.log('after visitor')
    await this.$store.dispatch(statisticsActions.sendVisitor, this.visitor)
    window.addEventListener('offline', () =>
      toast.error(this.$t('toastifications.offline'), {timeout: false})
    )
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
