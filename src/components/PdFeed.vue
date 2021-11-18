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
        <div class="feed-episode__left">
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
          <div class="feed-episode__heading">
            <div class="feed-episode__time">
              {{ formatDate(episode.pubDate) }}
            </div>
            <h2
              class="feed-episode__title"
              :style="{fontSize: episode.title.length > 80 ? '18px' : ''}"
            >
              {{ episode.title }}
            </h2>
            <div class="feed-episode__subline">
              <router-link
                class="feed-episode__podcast-link"
                :to="{
                  name: 'podcast',
                  params: {podcastSlug: episode.Podcast.slug}
                }"
                >{{ episode.Podcast.title }}</router-link
              >
              <svg-icon
                @click.stop.prevent
                name="add-square"
                v-tooltip="'Подписаться'"
              />
            </div>
          </div>
          <div class="feed-episode__buttons">
            <router-link
              class="button"
              :to="{
                name: 'episode',
                params: {
                  podcastSlug: episode.Podcast.slug,
                  episodeSlug: episode.slug
                }
              }"
            >
              Обсудить</router-link
            >

            <template v-if="!currentEpisode || currentEpisode.id != episode.id">
              <span @click.stop.prevent="toggleInQueue(episode)">
                {{
                  isEpisodeInQueue(episode.id)
                    ? 'Убрать из очереди'
                    : 'Добавить в очередь'
                }}
              </span>
            </template>
            <template v-if="currentEpisode && currentEpisode.id == episode.id">
              <span @click.stop>Сейчас играет</span>
            </template>
          </div>
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
    },
    formatDate(date) {
      return moment(date)
        .format('DD MMMM YYYY', {trim: true})
        .replace(new Date().getFullYear(), '')
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
  // background: linear-gradient(180deg, #f7f9fa 0%, #ebeced 100%);
  border-radius: 10px;
  margin-top: 24px;
  margin-bottom: 24px;
  margin-right: auto;
  margin-left: auto;
  cursor: pointer;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 2px var(--color-light-shadow);
  // box-shadow: 0px 100px 70px -10px rgba(169, 180, 203, 0.2),
  // 0px 4px 4px rgba(0, 0, 0, 0.25), -3px -3px 4px #ffffff, 0px 3px 0px #d6dadf;
  display: flex;
  overflow: hidden;
  height: 184px;
  width: 700px;
  position: relative;
  padding-bottom: 4px;
  &:hover {
    .feed-episode__play {
      opacity: 0.85;
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
    z-index: 2;

    & > .icon {
      border: 1px solid var(--color-border);
      background: var(--color-post-bg);
      z-index: 3;
      box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
      transition: 0.3s;
      & > svg {
        min-width: 32px;
        min-height: 32px;
      }
    }

    & > .play {
      padding: 38px 38px 38px 32px;
      border-start-end-radius: 150%;
      border-end-start-radius: 50%;
      border-start-start-radius: 50%;
      border-end-end-radius: 150%;
      & > svg {
        margin-left: 6px;
      }
    }

    & > .pause {
      border-radius: 20%;
      padding: 38px 36px;
    }

    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.4s;
    opacity: 0;
  }

  &__left {
    min-width: 176px;
    max-width: 176px;
    border-radius: 10px;
    padding: 12px;
    & > img {
      width: 100%;
      border-radius: 10px;
      border: 1px solid var(--color-border);
    }
    position: relative;
  }

  &__right {
    padding: 12px 36px 16px 12px;
    flex: auto;
    position: relative;
    color: inherit;
    text-decoration: inherit;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__time {
    color: var(--color-text-secondary);
    font-size: 12px;
    margin-bottom: 4px;
  }

  &__title {
    margin: 0;
    font-size: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -moz-box;
    -moz-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-clamp: 3;
    box-orient: vertical;
    margin-bottom: 4px;
    line-height: 120%;
  }

  &__subline {
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    & svg {
      min-width: 16px;
      width: 16px;
      min-height: 16px;
      height: 16px;
      position: relative;
      // top: -1px;
    }
  }

  &__buttons {
    display: flex;
    align-items: center;
    & > .button,
    & > button {
      &:first-child {
        border: 1px solid var(--color-border);
        background: black;
        color: #fff;
      }
      padding: 4px 16px;
      margin-right: 8px;
    }
  }

  &__podcast-link {
    margin: 0;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -moz-box;
    -moz-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    line-clamp: 1;
    box-orient: vertical;
    color: var(--color-text);
    text-decoration: none;
  }

  transition: 0.5s;
  &:hover {
    box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  }
  &__progress {
    position: absolute;
    bottom: 0;
    height: 4px;
    background: var(--color-accent);
    width: 50%;
    z-index: 5;
  }
}

.playing {
  box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);

  .feed-episode__play {
    opacity: 0.85;
  }
}
</style>
