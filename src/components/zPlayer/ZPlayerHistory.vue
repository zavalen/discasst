<template>
  <div class="queue scrollbar">
    <div v-for="episode in history" :key="episode.id">
      <z-player-episode :episode="episode" />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import zPlayerEpisode from '@/components/zPlayer/ZPlayerEpisode'
import {zPlayerActions} from '@/store/modules/zPlayer'
export default {
  name: 'zHistory',
  data() {
    return {
      limit: 10,
      offset: 0,
    }
  },
  components: {
    zPlayerEpisode,
  },
  mounted() {
    this.$store.dispatch(zPlayerActions.getHistory, {
      limit: this.limit,
      offset: this.offset,
    })
  },
  computed: {
    ...mapState({
      isPlaying: (state) => state.zPlayer.isPlaying,
      currentEpisode: (state) => state.zPlayer.currentEpisode,
      history: (state) => state.zPlayer.history,
    }),
  },
}
</script>

<style lang="scss"></style>
