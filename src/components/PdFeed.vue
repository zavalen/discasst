<template>
  <div style="min-height: 200px">
    <pd-loader v-if="isLoading" />
    <div v-if="errors">Something goes wrong...</div>

    <template v-if="feed">
      <div
        class="feed-episode"
        v-for="episode in feed"
        :key="episode.id"
        :class="{playing: currentEpisode && currentEpisode.id == episode.id}"
      >
        <div v-tooltip="'You have new messages.'" class="feed-episode__left">
          <img :src="episode.Podcast.imageURL" alt="" srcset="" />
          <div class="feed-episode__play" @click="playEpisode(episode)">
            <svg-icon name="play" />
          </div>
        </div>

        <div class="feed-episode__right">
          <h2>{{ episode.title }}</h2>
          <p>{{ episode.Podcast.title }}</p>
        </div>
        <!-- <router-link
          class="feed-episode__link"
          :to="{
            name: 'episode',
            params: {podcast: episode.podcast.slug, slug: episode.slug},
          }"
        >
        </router-link> -->
      </div>
    </template>
  </div>
</template>



<script>
import {feedActions} from '@/store/modules/feed'
import {mapState} from 'vuex'
import PdLoader from '@/components/ui/PdLoader'

import {zPlayerActions} from '@/store/modules/zPlayer'

export default {
  name: 'PdFeed',
  components: {PdLoader},

  props: {
    apiUrl: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState({
      feed: (state) => state.feed.data,
      isLoading: (state) => state.feed.isLoading,
      errors: (state) => state.feed.errors,
      currentEpisode: (state) => state.zPlayer.currentEpisode,
      isPlaying: (state) => state.zPlayer.isPlaying,
    }),
  },
  mounted() {
    this.$store.dispatch(feedActions.getFeed, this.apiUrl)
  },
  methods: {
    playEpisode(episode) {
      this.$store.dispatch(zPlayerActions.playEpisode, episode)
    },
  },
}
</script>

<style lang="scss">
.feed-episode {
  background: var(--color-post-bg);
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: auto;
  margin-left: auto;
  cursor: pointer;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 2px var(--color-light-shadow);
  display: flex;
  overflow: hidden;
  height: 160px;
  width: 700px;
  position: relative;
  &:hover {
    .feed-episode__play {
      opacity: 1;
    }
  }

  &__link {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1;
  }

  &__play {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.301);
    z-index: 2;

    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.4s;
    opacity: 0;
  }

  &__left {
    background: rgb(202, 202, 202);
    box-shadow: 0 2px 2px var(--color-light-shadow);
    min-width: 160px;
    max-width: 160px;

    & > img {
      width: 100%;
    }
    position: relative;
  }

  &__right {
    padding: 12px 36px 24px 24px;

    h2 {
      margin: 0;
      font-size: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -moz-box;
      -moz-box-orient: vertical;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-clamp: 2;
      box-orient: vertical;
    }
  }

  transition: 0.5s;
  &:hover {
    box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  }
}

.playing {
  background: rgb(153, 153, 153);
}
</style>