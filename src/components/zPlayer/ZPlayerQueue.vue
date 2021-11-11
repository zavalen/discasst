<template>
  <div class="queue">
    <span class="current-episode-text">Сейчас играет:</span>
    <z-player-episode :episode="currentEpisode" class="zEpisode_current" />
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
    zPlayerEpisode,
  },
  computed: {
    ...mapState({
      isPlaying: (state) => state.zPlayer.isPlaying,
      currentEpisode: (state) => state.zPlayer.currentEpisode,
      queue: (state) => state.zPlayer.queue,
    }),
  },
}
</script>

<style lang="scss">
.zEpisode_current {
  margin-bottom: 16px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 2px var(--color-light-shadow);
}

.current-episode-text {
  font-size: 12px;
  font-weight: 600;
}
</style>
