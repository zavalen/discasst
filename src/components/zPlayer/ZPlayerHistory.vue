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

export default {
  name: 'zQueue',
  components: {
    zPlayerEpisode
  },
  computed: {
    ...mapState({
      isPlaying: state => state.zPlayer.isPlaying,
      currentEpisode: state => state.zPlayer.currentEpisode,
      history: state => state.zPlayer.history
    })
  }
}
</script>

<style lang="scss"></style>
