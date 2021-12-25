<template>
  <div class="feed">
    <template v-if="isLoading">
      <div
        class="feed-episode skeleton"
        v-for="item in [1, 2, 3, 4, 5]"
        :key="item"
      >
        <div class="feed-episode__left">
          <img v-lazy="" alt="" srcset="" class="loading" />
          <div class="feed-episode__play"></div>
        </div>
        <div class="feed-episode__right">
          <div class="feed-episode__heading">
            <div class="feed-episode__time skeleton-time loading">&nbsp;</div>
            <h2 class="feed-episode__title skeleton-title loading">&nbsp;</h2>
            <div class="feed-episode__subline skeleton-subline loading">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-if="errors">Something goes wrong...</div>
    <div
      class="no-episode"
      v-if="!episodes.length && apiUrl.includes('subscriptions')"
    >
      У вас ещё нет ни одной подписки :(
    </div>
    <template v-if="episodes.length">
      <div
        class="feed-episode"
        v-for="episode in episodes"
        :key="episode?.id"
        :class="{playing: currentEpisode && currentEpisode.id == episode.id}"
      >
        <div class="feed-episode__left">
          <div class="feed-episode__image">
            <img v-lazy="episode.imageURL" />
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

          <episode-rating class="feed-episode__rating" :episode="episode" />
        </div>

        <div class="feed-episode__right">
          <div class="feed-episode__heading">
            <div class="feed-episode__time">
              {{ formatDate(episode.pubDate) }} <strong>·</strong>
              {{ formatDuration(episode.duration) }}
            </div>
            <h2
              class="feed-episode__title"
              :style="{fontSize: episode.title.length > 68 ? '18px' : ''}"
            >
              {{ episode.title }}
            </h2>
            <div class="feed-episode__subline">
              <router-link
                class="feed-episode__podcast-link"
                :to="{
                  name: 'podcast',
                  params: {podcastSlug: episode.podcast.slug},
                }"
                ><img
                  class="feed-episode__podcast-image"
                  :src="episode.podcast.imageURL"
                  alt=""
                />
                {{ episode.podcast.title }}</router-link
              >
              <svg-icon
                v-if="!userSubscriptions.includes(episode.podcast.id)"
                class="feed-episode__subscribe"
                @click.stop.prevent="subscribe(episode.podcast)"
                name="add-circle"
                v-tooltip="'Подписаться'"
              />
              <svg-icon
                class="feed-episode__subscribe"
                v-if="userSubscriptions.includes(episode.podcast.id)"
                @click.stop.prevent="unsubscribe(episode.podcast)"
                name="tick-square"
                v-tooltip="'Вы подписаны'"
              />
            </div>
          </div>
          <div class="feed-episode__buttons">
            <router-link
              class="button feed-episode__comments"
              :to="{
                name: 'episode',
                params: {
                  podcastSlug: episode.podcast.slug,
                  episodeSlug: episode.slug,
                },
              }"
            >
              <svg-icon style="margin-right: 8px" name="comments" />
              Обсудить</router-link
            >
          </div>
        </div>
        <div class="feed-episode__buttons-block">
          <template v-if="!currentEpisode || currentEpisode.id != episode.id">
            <svg-icon
              v-if="!isEpisodeInQueue(episode.id)"
              class="button feed-episode__icon"
              v-tooltip="'Добавить в очередь'"
              @click.stop.prevent="toggleInQueue(episode)"
              name="add-to-playlist"
            />
            <svg-icon
              v-if="isEpisodeInQueue(episode.id)"
              class="button feed-episode__icon"
              v-tooltip="'Убрать из очередь'"
              @click.stop.prevent="toggleInQueue(episode)"
              name="in-playlist"
            />
          </template>
          <template v-if="currentEpisode && currentEpisode.id == episode.id">
            <svg-icon
              v-tooltip="'Сейчас играет'"
              class="button feed-episode__icon"
              @click.stop
              name="now-playing"
            />
          </template>
          <div class="button feed-episode__more">
            <svg-icon name="more" />
          </div>
        </div>
        <div v-if="isLoggedIn" class="feed-episode__progress-wrapper">
          <div
            v-if="isLoggedIn"
            class="feed-episode__progress"
            :style="{width: episode.progress?.percentage + '%'}"
          ></div>
        </div>
        <router-link
          class="feed-episode__link"
          :to="{
            name: 'episode',
            params: {
              podcastSlug: episode.podcast.slug,
              episodeSlug: episode.slug,
            },
          }"
        >
        </router-link>
      </div>

      <button
        ref="loadMore"
        class="load-more"
        @click="loadFeed"
        v-if="!lastPage"
      >
        Загрузить ещё
      </button>
    </template>
  </div>
</template>

<script>
import {feedActions} from '@/store/modules/episodes'
import {mapState, mapGetters} from 'vuex'
import {authGetters} from '@/store/modules/auth'
import {podcastsActions} from '@/store/modules/podcasts'
import {zPlayerActions} from '@/store/modules/zPlayer'
import moment from 'moment'
import 'moment/locale/ru' // without this line it didn't work
moment.locale('ru')

import EpisodeRating from '@/components/EpisodeRating'

export default {
  name: 'PdEpisodes',
  components: {
    EpisodeRating,
  },
  props: {
    apiUrl: {
      type: String,
      required: true,
    },
    podcastSlug: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      page: 1,
      episodesPerPage: 30,
    }
  },

  computed: {
    ...mapState({
      episodes: (state) => state.feed.episodes,
      isLoading: (state) => state.feed.isLoading,
      lastPage: (state) => state.feed.lastPage,
      errors: (state) => state.feed.errors,
      currentEpisode: (state) => state.zPlayer.currentEpisode,
      isPlaying: (state) => state.zPlayer.isPlaying,
      queue: (state) => state.zPlayer.queue,
      lang: (state) => state.lang.lang,
      userSubscriptions: (state) => state.podcasts.userSubscriptions,
    }),
    ...mapGetters({
      currentUser: authGetters.currentUser,
      isLoggedIn: authGetters.isLoggedIn,
      isAnonymus: authGetters.isAnonymus,
    }),
    payload() {
      return {
        apiUrl: this.apiUrl,
        page: this.page,
        params: {
          offset: (this.page - 1) * this.episodesPerPage,
          limit: this.episodesPerPage,
          podcastSlug: this.podcastSlug,
        },
      }
    },
  },
  mounted() {
    this.loadFeed()
    this.getNextPage()
  },
  watch: {
    lang(newLang) {
      moment.locale(newLang)
    },
    apiUrl() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      this.page = 1
      this.loadFeed()
    },
    userSubscriptions() {
      this.page = 1
      if (this.apiUrl.includes('subscriptions')) {
        this.loadFeed()
      }
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
    loadFeed() {
      this.$store.dispatch(feedActions.getEpisodes, this.payload)
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
      return this.queue.some((ep) => {
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
      return (
        moment(date)
          // .unix(date / 1000)
          .format('D MMMM YYYY', {trim: true})
          .replace(new Date().getFullYear(), '')
      )
    },
    formatDuration(seconds) {
      let minutes = Math.ceil(seconds / 60)
      let lastNumber = minutes.toString().split('').pop()
      let textMinutes = this.$t('time.someMinutes')
      lastNumber == 1 && minutes != 11 && minutes != 12
        ? (textMinutes = this.$t('time.minute'))
        : ''
      if (lastNumber > 1 && lastNumber <= 4) {
        textMinutes = this.$t('time.pluralMinutes')
      }

      if (minutes > 60) {
        let hours = Math.floor(minutes / 60)
        let textHours
        minutes = minutes - hours * 60
        hours == 1 ? (textHours = this.$t('time.hour')) : ''
        hours > 1 && hours <= 4 ? (textHours = this.$t('time.someHours')) : ''
        hours > 4 ? (textHours = this.$t('time.manyHours')) : ''
        return hours + ' ' + textHours + ' ' + minutes + ' ' + textMinutes
      }
      return minutes + ' ' + textMinutes
    },
    subscribe(podcast) {
      if (this.isAnonymus) {
        this.$router.push({name: 'login'})
      } else {
        this.$store.dispatch(podcastsActions.subscribe, podcast)
      }
    },
    unsubscribe(podcast) {
      this.$store.dispatch(podcastsActions.unsubscribe, podcast)
    },
    getNextPage() {
      window.onscroll = () => {
        if (this.$refs.loadMore) {
          let loadMoreBoundingClient =
            this.$refs.loadMore.getBoundingClientRect()
          let loadPosition = loadMoreBoundingClient.y < 1000
          if (loadPosition) {
            this.loadFeed()
          }
        }
      }
    },
  },
}
</script>

<style lang="scss">
.feed {
  margin-bottom: 16px;
}

.feed-episode {
  background: var(--color-block-bg);
  border-radius: 10px;
  margin-bottom: 24px;
  margin-right: auto;
  margin-left: auto;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 2px var(--color-light-shadow);
  display: flex;
  // overflow: hidden;
  // height: 184px;
  width: 686px;
  position: relative;
  // padding-bottom: 4px;
  &:hover {
    .feed-episode__play {
      opacity: 0.85;
    }
  }

  &__link {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 0;
  }

  &__podcast-image {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    border: 1px solid var(--color-border);
    margin-right: 8px;
  }

  &__podcast-link {
    z-index: 2;
    transition: 0.3s;
    display: flex;
    align-items: center;
    // padding-right: 10px;

    &:hover {
      text-shadow: 0 0 0.5px var(--color-text);
    }
  }

  &__play {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 2;
    cursor: pointer;

    & > .icon {
      border: 1px solid var(--color-border);
      background: var(--color-block-bg);
      z-index: 3;
      // box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
      transition: 0.3s;
      &:active {
        top: 1;
      }
      & > svg {
        min-width: 32px;
        min-height: 32px;
      }
    }

    & > .play {
      border-radius: 50%;
      // border-radius: 20%;
      border: 1px solid var(--color-text);
      padding: 34px;
      // padding: 38px 38px 38px 32px;
      // border-start-end-radius: 150%;
      // border-end-start-radius: 50%;
      // border-start-start-radius: 50%;
      // border-end-end-radius: 150%;
      position: relative;

      & > svg {
        margin-left: 6px;
      }
    }

    & > .pause {
      border: 1px solid var(--color-text);
      border-radius: 50%;
      padding: 34px;
      position: relative;
    }

    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.4s;
    opacity: 0;
  }

  &__left {
    min-width: 156px;
    max-width: 156px;
    border-radius: 10px;
    padding: 8px 8px 12px 16px;
  }

  &__image {
    & > img {
      width: 100%;
      border-radius: 10px;
      border: 1px solid var(--color-border);
      // box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
      // box-shadow: 0 2px 2px var(--color-light-shadow);
      background-color: var(--bg-block-hover);
    }
    position: relative;
    margin-bottom: 2px;
  }

  &__right {
    padding: 10px 16px 14px 10px;
    flex: auto;
    position: relative;
    color: inherit;
    text-decoration: inherit;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
  }

  &__subscribe {
    z-index: 2;
  }

  &__buttons-block {
    min-width: 48px;
    // background-color: var(--color-accent);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    // border-left: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }

  &__arrow-icon {
  }

  &__time {
    color: var(--color-text-secondary);
    font-size: 12px;
    margin-bottom: 2px;
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
    margin-bottom: 6px;
    line-height: 120%;
  }

  &__subline {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    border-radius: 16px;
    border: 1px solid var(--color-border);
    // box-shadow: 0 1px 1px var(--color-light-shadow);

    width: fit-content;
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

    // & > .button,
    // & > button {
    //   &:first-child {
    //     border: 1px solid var(--color-border);
    //     background: black;
    //     color: #fff;
    //   }
    //   padding: 4px 16px;
    //   margin-right: 8px;
    // }
  }

  &__comments {
    padding: 4px 12px 4px 8px;
    margin-right: 4px;
    color: var(--color-text);
    display: flex;
    align-items: center;
    text-decoration: none;
    border-radius: 10px;
    z-index: 2;
    // border: 1px solid var(--color-text);
  }

  .button,
  button {
    z-index: 2;
  }
  &__icon {
    padding: 16px;
    border-radius: 50%;
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
    display: flex;
    align-items: center;
    padding-right: 4px;
    // border: 1px solid var(--color-border);

    &:hover,
    &:active {
    }
  }

  transition: 0.5s;
  &:hover {
    box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  }
  &__progress {
    position: absolute;
    bottom: 0;
    height: 3px;
    background: var(--color-accent);
    z-index: 5;
    transition: 0.3s;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  &__progress-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 10px;
    z-index: 5;
    transition: 0.3s;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;
  }

  &__rating {
    z-index: 2;
  }
}

.playing {
  box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);

  .feed-episode__play {
    opacity: 0.85;
  }
}

.load-more {
  background: var(--color-block-bg);
  width: 100%;
  padding: 16px;
  border: 1px solid var(--color-border);
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: var(--color-block-bg);
    box-shadow: 0 2px 2px var(--color-light-shadow);
  }
}

.skeleton-time {
  width: 130px;
  border-radius: 10px;
  animation-delay: 0.5s;
  margin-bottom: 8px;
}

.skeleton-subline {
  width: 80px;
  border-radius: 10px;
  animation-delay: 0.5s;
}

.skeleton-title {
  animation-delay: 0.9s;
  border-radius: 10px;
  overflow: hidden;
  max-width: 440px;
  margin-bottom: 12px;
}

.loading {
  background: linear-gradient(0.25turn, transparent, #fff, transparent),
    linear-gradient(var(--bg-block-hover), var(--bg-block-hover)),
    radial-gradient(
      38px circle at 19px 19px,
      var(--bg-block-hover) 50%,
      transparent 51%
    ),
    linear-gradient(var(--bg-block-hover), var(--bg-block-hover));
  background-repeat: no-repeat;
  background-size: -315px 250px, 315px 180px, 100px 100px, 225px 30px;
  background-position: -315px 0, 0 0, 0px 190px, 50px 195px;
  animation-name: loading;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

@keyframes loading {
  to {
    background-position: 315px 0, 0 0, 0 190px, 50px 195px;
  }
}

.no-episode {
  background: var(--color-block-bg);
  border-radius: 10px;
  margin-right: auto;
  margin-left: auto;
  border: 1px solid var(--color-border);
  // box-shadow: 0 2px 2px var(--color-light-shadow);
  overflow: hidden;
  position: relative;
  padding: 24px 36px;
  font-weight: 600;
  height: 360px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
