<template>
  <div class="queue scrollbar">
    <div v-for="episode in queue" :key="episode.id">
      <div>{{ episode.title }}</div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'zQueue',

  computed: {
    ...mapState({
      isPlaying: (state) => state.zPlayer.isPlaying,
      episodeToPlay: (state) => state.zPlayer.episodeToPlay,
      currentEpisode: (state) => state.zPlayer.currentEpisode,
      queue: (state) => state.zPlayer.queue,
      history: (state) => state.zPlayer.history,
    }),
  },
}
</script>

<style lang="scss">
.queue {
  //   box-sizing: border-box;
  max-width: 1240px;
  margin: 16px auto;
  height: calc(100vh - 168px);
  background: azure;
  border-radius: 10px;
  box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  padding: 32px;
}
</style>