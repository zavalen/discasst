<template>
  <slide-right-transition>
    <div v-if="episode" class="zmodal__episode zEpisode">
      <div class="zEpisode__main">
        <div class="zEpisode__play" @click="playEpisode(episode)">
          <svg-icon
            :name="
              currentEpisode.id == episode.id && isPlaying ? 'pause' : 'play'
            "
          />
        </div>
        <div class="zEpisode__creditials">
          <router-link
            @click="closeModal"
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
            @click="closeModal"
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
        <div class="zEpisode__description-toggle" @click="toggleDescription">
          <svg-icon name="description" />
        </div>
      </div>
      <div
        v-if="descriptionOpen"
        class="zEpisode__description"
        v-html="episode.description"
      ></div>
    </div>
  </slide-right-transition>
</template>

<script>
import {mapState} from 'vuex'
import {zPlayerActions, zPlayerMutations} from '@/store/modules/zPlayer'
import SlideRightTransition from '@/components/animations/SlideRightTransition'
export default {
  name: 'zEpisode',
  props: {
    episode: {
      type: Object,
      required: true,
    },
  },
  components: {
    SlideRightTransition,
  },
  data() {
    return {
      descriptionOpen: false,
    }
  },
  methods: {
    playEpisode(episode) {
      if (this.currentEpisode && episode.id == this.currentEpisode.id) {
        this.$store.dispatch(zPlayerActions.toggle)
      } else {
        this.$store.dispatch(zPlayerActions.playEpisode, episode)
      }
    },
    closeModal() {
      this.$store.commit(zPlayerMutations.closeModal)
    },
    toggleDescription() {
      this.descriptionOpen = !this.descriptionOpen
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
  max-width: 768px;
  &__main {
    display: flex;
    align-items: center;
  }
  &__play {
    margin-right: 16px;
    cursor: pointer;
    width: 30px;
  }

  &__credits {
    overflow: hidden;
    flex: auto;
    width: 480px;
  }
  &__title {
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 4px;
    color: inherit;
    text-overflow: ellipsis;
    overflow: hidden;
    text-decoration: none;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: break-spaces;

    @media (max-width: 768px) {
      font-size: 13px;
      margin-bottom: 0;
    }
  }

  &__podcast {
    display: block;
    font-size: 12px;
    color: inherit;
    text-decoration: none;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: break-spaces;
  }

  &__description {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 8px 42px;
    margin-top: 16px;
    margin-bottom: 16px;
    font-size: 14px;
  }
  &__description-toggle {
    cursor: pointer;
  }
}
</style>
