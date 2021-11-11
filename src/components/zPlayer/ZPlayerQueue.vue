<template>
  <div class="queue scrollbar">
    <h3>Сейчас играет</h3>
    <z-player-episode :episode="currentEpisode" />
    <hr />
    <div v-for="episode in queue" :key="episode.id">
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
      queue: state => state.zPlayer.queue
    })
  }
}
</script>

<style lang="scss"></style>
