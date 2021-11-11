<template>
  <div class="zmodal__episode zEpisode">
    <div class="zEpisode__play" @click="playEpisode(episode)">
      <svg-icon
        :name="currentEpisode.id == episode.id && isPlaying ? 'pause' : 'play'"
      />
    </div>
    <div class="zEpisode__creditials">
      <router-link
        :to="{
          name: 'episode',
          params: {
            podcastSlug: episode.Podcast.slug,
            episodeSlug: episode.slug,
          },
        }"
        class="zEpisode__title"
        >{{ episode.title }}</router-link
      >
      <router-link
        :to="{
          name: 'podcast',
          params: {
            podcastSlug: episode ? episode.Podcast.slug : 's',
          },
        }"
        class="zEpisode__podcast"
        >{{ episode.Podcast.title }}</router-link
      >
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
      required: true,
    },
  },
  methods: {
    playEpisode(episode) {
      if (this.currentEpisode && episode.id == this.currentEpisode.id) {
        this.$store.dispatch(zPlayerActions.toggle)
      } else {
        this.$store.dispatch(zPlayerActions.playEpisode, episode)
      }
    },
  },
  computed: {
    ...mapState({
      isPlaying: (state) => state.zPlayer.isPlaying,
      currentEpisode: (state) => state.zPlayer.currentEpisode,
    }),
  },
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

  &__credits {
    overflow: hidden;
  }
  &__title {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 1px;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: 4px;
    color: inherit;
    text-decoration: none;
    @media (max-width: 768px) {
      font-size: 13px;
      margin-bottom: 0;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      white-space: break-spaces;
    }
  }

  &__podcast {
    display: block;
    font-size: 12px;
    color: inherit;
    text-decoration: none;
  }
}
</style>
