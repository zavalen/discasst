<template>
  <div class="feed">
    <pd-loader v-if="isLoading" />
    <div v-if="errors">Something goes wrong...</div>

    <template v-if="episodes.length >= 1">
      <div
        class="feed-episode"
        v-for="episode in episodes"
        :key="episode?.id"
        :class="{playing: currentEpisode && currentEpisode.id == episode.id}"
      >
        <div v-tooltip="'Play'" class="feed-episode__left">
          <img v-lazy="episode.Podcast.imageURL" alt="" srcset="" />
          <div class="feed-episode__play" @click="playEpisode(episode)">
            <svg-icon
              v-if="
                !isPlaying ||
                  (currentEpisode && currentEpisode.id != episode.id)
              "
              name="play"
            />
            <svg-icon
              v-if="
                currentEpisode && currentEpisode.id == episode.id && isPlaying
              "
              name="pause"
            />
          </div>
        </div>

        <router-link
          class="feed-episode__right"
          :to="{
            name: 'episode',
            params: {
              podcastSlug: episode.Podcast.slug,
              episodeSlug: episode.slug
            }
          }"
        >
          <h2
            class="feed-episode__title"
            :style="{fontSize: episode.title.length > 80 ? '18px' : ''}"
            v-tooltip="episode.title.length > 142 ? episode.title : ''"
          >
            {{ episode.title }}
          </h2>
          <router-link
            class="feed-episode__podcast-link"
            :to="{name: 'podcast', params: {podcastSlug: episode.Podcast.slug}}"
            >{{ episode.Podcast.title }}</router-link
          >
          <template v-if="!currentEpisode || currentEpisode.id != episode.id">
            <button @click.stop.prevent="toggleInQueue(episode)">
              {{
                isEpisodeInQueue(episode.id)
                  ? 'Убрать из очереди'
                  : 'Добавить в очередь'
              }}
            </button>
          </template>
          <template v-if="currentEpisode && currentEpisode.id == episode.id">
            <button @click.stop>Сейчас играет</button>
          </template>
          {{ toHHMMSS(episode.duration) }}
          <!-- 
          <router-link
            :to="{
              name: 'episode',
              params: {
                podcastSlug: episode.Podcast.slug,
                episodeSlug: episode.slug
              }
            }"
            class="feed-episode__link"
          ></router-link> -->
        </router-link>

        <div class="feed-episode__progress"></div>
      </div>

      <button @click="loadFeed" v-if="!lastPage">LOAD MORE</button>
    </template>
  </div>
</template>

<script>
import {feedActions} from '@/store/modules/feed'
import {mapState} from 'vuex'
import PdLoader from '@/components/ui/PdLoader'
import {zPlayerActions} from '@/store/modules/zPlayer'
import moment from 'moment'

export default {
  name: 'PdFeed',
  components: {PdLoader},

  props: {
    apiUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      page: 1,
      episodesPerPage: 30
    }
  },

  computed: {
    ...mapState({
      episodes: state => state.feed.episodes,
      isLoading: state => state.feed.isLoading,
      lastPage: state => state.feed.lastPage,
      errors: state => state.feed.errors,
      currentEpisode: state => state.zPlayer.currentEpisode,
      isPlaying: state => state.zPlayer.isPlaying,
      queue: state => state.zPlayer.queue
    }),
    payload() {
      return {
        apiUrl: this.apiUrl,
        params: {
          offset: (this.page - 1) * this.episodesPerPage,
          limit: this.episodesPerPage
        }
      }
    }
  },
  mounted() {
    this.loadFeed()
  },
  methods: {
    playEpisode(episode) {
      if (this.currentEpisode && episode.id == this.currentEpisode.id) {
        this.$store.dispatch(zPlayerActions.toggle)
      } else {
        this.$store.dispatch(zPlayerActions.playEpisode, episode)
      }
    },
    loadFeed() {
      this.$store.dispatch(feedActions.getFeed, this.payload)
      this.page++
    },
    toggleInQueue(episode) {
      if (this.isEpisodeInQueue(episode.id)) {
        this.$store.dispatch(zPlayerActions.removeFromQueue, episode)
      } else {
        this.$store.dispatch(zPlayerActions.addToQueue, episode)
      }
    },
    isEpisodeInQueue(id) {
      return this.queue.some(ep => {
        return ep.id == id
      })
    },
    toHHMMSS(seconds) {
      return moment
        .utc(seconds * 1000)
        .format('HH:mm:ss', {trim: true})
        .replace(/^0(?:0:0?)?/, '')
    }
  }
}
</script>

<style lang="scss">
.feed {
  margin-bottom: 16px;
}

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

  &__podcast-link {
    z-index: 2;
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
    flex: auto;
    position: relative;
    color: inherit;
    text-decoration: inherit;
    display: block;
  }

  &__title {
    margin: 0;
    font-size: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -moz-box;
    -moz-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    box-orient: vertical;
  }

  transition: 0.5s;
  &:hover {
    box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  }
  &__progress {
    position: absolute;
    bottom: 0;
    height: 4px;
    background: red;
    // width: 50%;
    z-index: 5;
  }
}

.playing {
  background: rgb(153, 153, 153);
}
</style>
