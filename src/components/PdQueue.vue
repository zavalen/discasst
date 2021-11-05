<template>
  <div class="queue scrollbar">
    <div class="queue_top">
      <button>Очередь</button>
      <button>История</button>
      <form>
        <input type="text" name="" id="" />
        <button type="submit"><svg-icon name="search" /></button>
      </form>
    </div>
    Сейчас играет:
    <h3>{{ currentEpisode ? currentEpisode.title : '----' }}</h3>
    <hr />
    <h2>Очередь</h2>
    <div v-for="episode in queue" :key="episode.id">
      <div>{{ episode.title }}</div>
    </div>
    <hr />

    <h2>История</h2>
    <div v-for="episode in history" :key="episode.id">
      <div :class="{strong: currentEpisode && currentEpisode.id == episode.id}">
        {{ episode.title }}
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'zQueue',
  props: {
    isOpen: {
      type: Boolean,
    },
  },

  computed: {
    ...mapState({
      isPlaying: (state) => state.zPlayer.isPlaying,
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
  background: var(--color-zplayer-bg);
  backdrop-filter: blur(10px);

  border-radius: 10px;
  box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  padding: 32px;
}

.strong {
  background: rgb(153, 153, 153);
}
</style>