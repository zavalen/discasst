<template>
  <div class="zmodal__episode zEpisode">
    <div class="zEpisode__play" @click="playEpisode(episode)">
      <svg-icon
        :name="currentEpisode.id == episode.id && isPlaying ? 'pause' : 'play'"
      />
    </div>
    <div>
      {{ episode.title }}
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {zPlayerActions} from '@/store/modules/zPlayer'

export default {
  name: 'zEpisode',
  props: {
    episode: {
      type: Object,
      required: true
    }
  },
  methods: {
    playEpisode(episode) {
      if (this.currentEpisode && episode.id == this.currentEpisode.id) {
        this.$store.dispatch(zPlayerActions.toggle)
      } else {
        this.$store.dispatch(zPlayerActions.playEpisode, episode)
      }
    }
  },
  computed: {
    ...mapState({
      isPlaying: state => state.zPlayer.isPlaying,
      currentEpisode: state => state.zPlayer.currentEpisode
    })
  }
}
</script>

<style lang="scss">
.zEpisode {
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  margin-bottom: 8px;
  display: flex;
  align-items: center;

  &__play {
    margin-right: 16px;
    cursor: pointer;
  }
}
</style>
