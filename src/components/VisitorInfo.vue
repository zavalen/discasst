

<script>
import {
  statisticsActions,
  statisticsGetters,
  statisticsMutations,
} from '@/store/modules/statistics'
import {authGetters} from '@/store/modules/auth'
import {mapGetters} from 'vuex'
import {detectAnyAdblocker} from 'vue-adblock-detector'

export default {
  name: 'VisitorInfo',

  computed: {
    ...mapGetters({
      visitor: statisticsGetters.visitor,
      currentUser: authGetters.currentUser,
    }),
  },
  watch: {
    currentUser(newUser) {
      this.$store.commit(statisticsMutations.setUserId, newUser.id)
      this.$store.dispatch(statisticsActions.sendVisitor, this.visitor)
    },
    visitor(newVisitor) {
      this.$store.dispatch(statisticsActions.sendVisitor, newVisitor)
    },
  },
  async mounted() {
    detectAnyAdblocker().then(async (detected) => {
      if (detected) {
        await this.$store.dispatch(statisticsActions.sendVisitor, {
          adblock: true,
        })
      } else {
        await this.$store.dispatch(statisticsActions.getVisitor)
      }
    })
  },
}
</script>

