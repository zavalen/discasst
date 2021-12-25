<template>
  <slide-up-transition>
    <div
      v-if="isPlayerReady && currentEpisode"
      v-click-outside="closeModal"
      class="player player-container"
    >
      <slide-up-transition>
        <z-player-modal v-show="isModalOpen" />
      </slide-up-transition>

      <div class="zPlayer">
        <div class="zPlayer__progress-block">
          <div class="zPlayer__progress-line">
            <div
              class="zPlayer__progress-time"
              :style="{
                width: progress ? progress + '%' : '0%',
              }"
            ></div>
            <div
              class="zPlayer__progress-overflow"
              ref="progressOverflow"
              @mousedown="moveTo"
              @mouseup="closeMousepress"
              @mousemove="progressMouseOver"
              @mouseleave="hideProgressMouseOver"
            ></div>
            <div class="zPlayer__time unselectable">
              {{ time && time > 0 ? toHHMMSS(time) : '' }}
            </div>
            <div class="zPlayer__duration unselectable">
              {{ duration && duration > 0 ? toHHMMSS(duration) : '' }}
            </div>
            <div
              class="zPlayer__buffered"
              :style="{
                width: time ? (time * 100) / buffered + '%' : '0%',
              }"
            ></div>
            <div
              v-if="mouseOverShow"
              class="zPlayer__progress-overflow-time"
              :style="{
                left:
                  mouseOverTimePx > 100
                    ? mouseOverTimePx - 50 + 'px'
                    : mouseOverTimePx + 20 + 'px',
              }"
            >
              {{ toHHMMSS(mouseOverTime) }}
            </div>
          </div>
        </div>
        <div class="zPlayer__main-block">
          <div class="zPlayer__main-left">
            <!-- <div
              class="zPlayer__previous"
              :class="{
                disabled: !history.length,
              }"
              @click="previous"
            >
              <svg-icon name="previous" />
            </div> -->
            <div class="zPlayer__play" @click="togglePlay">
              <svg-icon name="play" v-if="!isPlaying" />
              <svg-icon name="pause" v-if="isPlaying" />
            </div>

            <div
              class="zPlayer__next"
              :class="{
                disabled: !queue.length,
              }"
              @click="next"
            >
              <svg-icon name="next" />
            </div>
            <!-- <div class="zPlayer__like" @click="like">
            </div> -->

            <div class="zPlayer__image">
              <img
                :src="
                  currentEpisode
                    ? currentEpisode.podcast.imageURL
                    : './images/headphones.png'
                "
                alt=""
              />
            </div>
            <div
              class="zPlayer__loading"
              :class="isEpisodeLoading ? 'show' : ''"
            >
              <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div class="zPlayer__credits">
              <router-link
                @click="closeModal"
                :to="{
                  name: 'episode',
                  params: {
                    podcastSlug: currentEpisode
                      ? currentEpisode.podcast.slug
                      : 's',
                    episodeSlug: currentEpisode ? currentEpisode.slug : 's',
                  },
                }"
                class="zPlayer__title"
              >
                {{ currentEpisode ? currentEpisode.title : 'No track' }}
              </router-link>
              <router-link
                @click="closeModal"
                :to="{
                  name: 'podcast',
                  params: {
                    podcastSlug: currentEpisode
                      ? currentEpisode.podcast.slug
                      : 's',
                  },
                }"
                class="zPlayer__podcast"
              >
                {{ currentEpisode ? currentEpisode.podcast.title : 'No track' }}
              </router-link>
            </div>
            <!-- <div class="zPlayer__open">
              <svg-icon name="open" />
            </div> -->
          </div>
          <div class="zPlayer__main-right">
            <!-- <div class="zPlayer__speed" @click="changeSpeed">x{{ speed }}</div> -->
            <div class="zPlayer__playlist">
              <episode-rating :episode="currentEpisode" />
            </div>
          </div>
          <div class="zPlayer__volume-block">
            <svg-icon @click="toggleVolume" v-if="volume > 0" name="volume" />
            <svg-icon
              @click="toggleVolume"
              v-if="volume == 0"
              name="volume-zero"
            />

            <div class="zPlayer__volume-line">
              <div
                class="zPlayer__volume"
                :style="{
                  height: volume * 100 + '%',
                }"
              ></div>

              <div
                class="zPlayer__volume-overflow"
                @mousedown="volumeTo"
                @mouseup="volumeMouseLeave"
                @mousemove="volumeMouseOver"
                @mouseleave="volumeMouseLeave"
              ></div>
              <div
                v-if="mouseOverShow"
                class="zPlayer__volume-overflow-persentage"
                :style="{
                  left: mouseOverTimePx + 'px',
                }"
              ></div>
            </div>
          </div>

          <div
            class="zPlayer__playlist"
            :class="{zPlayer__playlist_active: isModalOpen}"
            @click="toggleModal"
            ref="zplaylist"
          >
            <svg-icon name="playlist" />
            <span ref="queueCounter" class="zPlayer__playlist-counter">{{
              queue.length
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </slide-up-transition>
</template>

<script>
import SlideUpTransition from '@/components/animations/SlideUpTransition'
import {mapState} from 'vuex'
import {zPlayerMutations, zPlayerActions} from '@/store/modules/zPlayer'
import ZPlayerModal from '@/components/zPlayer/ZPlayerModal'
import moment from 'moment'
import EpisodeRating from '@/components/EpisodeRating'

export default {
  name: 'ZPlayer',
  components: {
    SlideUpTransition,
    ZPlayerModal,
    EpisodeRating,
  },
  created() {
    this.addPlayerJS()
  },

  data() {
    return {
      playerJs: null,
      playerJsNode: null,
      isPlayerReady: false,
      duration: 0,
      buffered: 0,
      isEpisodeLoading: false,
      speed: 1,
      mousepress: false,
      mouseOverShow: false,
      mouseOverTime: null,
      mouseOverPx: null,
      mousepressVolume: false,
      volume: 0.8,
      previousIndex: 0,
      userInfo: null,
    }
  },
  computed: {
    progress() {
      return (this.time * 100) / this.duration
    },
    ...mapState({
      currentUser: (state) => state.auth.currentUser,
      isPlaying: (state) => state.zPlayer.isPlaying,
      currentEpisode: (state) => state.zPlayer.currentEpisode,
      time: (state) => state.zPlayer.lastPoint,
      queue: (state) => state.zPlayer.queue,
      history: (state) => state.zPlayer.history,
      isModalOpen: (state) => state.zPlayer.isModalOpen,
      feedEpisodes: (state) => state.feed.episodes,
    }),
  },
  watch: {
    currentEpisode(newEpisode) {
      this.playerJs.api('play', newEpisode.file)
      if (newEpisode.progress && newEpisode.progress.lastPoint) {
        this.playerJs.api('seek', Math.floor(newEpisode.progress.lastPoint))
      }
    },
    // async feedEpisodes(newVal) {
    //   if (!this.currentEpisode && newVal.length > 0) {
    //     this.$store.dispatch(zPlayerActions.playEpisode, newVal[0])
    //     await this.$nextTick()
    //     this.$store.commit(zPlayerMutations.pause)
    //   }
    // },
    isPlaying(newVal) {
      if (!this.playerJs) {
        return
      }
      if (newVal) {
        this.playerJs.api('play')
      } else {
        this.playerJs.api('pause')
      }
    },
    queue: {
      handler: function (newVal, oldVal) {
        console.log(newVal.length)
        console.log(oldVal.length)
        if (this.$refs.queueCounter) {
          this.$refs.queueCounter.classList.add('counter-changed')
          setTimeout(() => {
            this.$refs.queueCounter.classList.remove('counter-changed')
          }, 500)
        }
      },
      deep: true,
    },
  },
  methods: {
    addPlayerJS() {
      const script = document.createElement('script')
      script.async = true
      script.src = './js/playerjs.js'
      document.head.appendChild(script)
      script.addEventListener('load', () => {
        this.initPlayerJS()
      })
    },
    initPlayerJS() {
      this.playerJs = new window.Playerjs({
        id: 'playerjs',
        file: this.currentEpisode ? this.currentEpisode.file : '',
      })
      this.playerJsNode = document.getElementById('playerjs')

      this.playerJsNode.removeAttribute('style')
      this.playerJsNode.innerHTML = ''
      localStorage.removeItem('pljsuserid')
      this.addEventsHandlers()
      this.isPlayerReady = true
    },
    addEventsHandlers() {
      this.playerJsNode.addEventListener('new', () => {})
      this.playerJsNode.addEventListener('end', () => {
        this.next()
        console.log('end event')
      })
      this.playerJsNode.addEventListener('play', () => {
        this.$store.commit(zPlayerMutations.play)
      })
      this.playerJsNode.addEventListener('pause', () => {
        this.$store.commit(zPlayerMutations.pause)
      })
      this.playerJsNode.addEventListener('time', () => {
        if (!this.mousepress) {
          this.$store.dispatch(
            zPlayerActions.setLastPoint,
            this.playerJs.api('time')
          )
        }

        this.isEpisodeLoading = false

        this.buffered = this.playerJs.api('buffered')
      })

      this.playerJsNode.addEventListener('duration', (e) => {
        this.duration = e.info
      })

      this.playerJsNode.addEventListener('waiting', () => {
        this.isEpisodeLoading = true
      })
      document.addEventListener('keydown', (event) => {
        if (
          event.code === 'Space' &&
          document.activeElement.tagName.toLowerCase() !== 'input'
        ) {
          event.preventDefault()
          this.togglePlay()
        }
      })
    },
    togglePlay() {
      console.log(this.statistics)
      if (this.currentEpisode) {
        this.playerJs.api('toggle')
      } else {
        this.next()
      }
    },
    next() {
      if (this.previousIndex) {
        this.previousIndex--
        this.$store.dispatch(
          zPlayerActions.playEpisode,
          this.history[this.previousIndex]
        )
        return
      }

      if (this.queue[0]) {
        this.$store.dispatch(zPlayerActions.playEpisode, this.queue[0])
      }
    },
    previous() {
      if (this.history[this.previousIndex]) {
        console.log('next')
        this.$store.dispatch(
          zPlayerActions.playEpisode,
          this.history[this.previousIndex]
        )
        this.previousIndex += 2
      }
    },
    changeSpeed() {
      if (this.speed == 1.0) {
        this.speed = 1.5
        this.playerJs.api('speed', 5)
      } else if (this.speed == 1.5) {
        this.speed = 2
        this.playerJs.api('speed', 6)
      } else if (this.speed == 2) {
        this.playerJs.api('speed', 3)
        this.speed = 1.0
      }
    },
    toHHMMSS(seconds) {
      return moment
        .utc(seconds * 1000)
        .format('HH:mm:ss', {trim: true})
        .replace(/^0(?:0:0?)?/, '')
    },
    hideProgressMouseOver() {
      this.mouseOverShow = false
      if (this.mousepress) {
        this.playerJs.api('seek', this.time)
        this.mousepress = false
      }
    },
    progressMouseOver(e) {
      this.mouseOverShow = true

      let rect = e.target.getBoundingClientRect()
      let x = Math.abs(e.clientX - rect.left) //x position within the element.
      this.mouseOverTimePx = x
      let percentage = (x * 100) / rect.width
      let seconds = (this.currentEpisode.duration * percentage) / 100
      this.mouseOverTime = seconds

      if (this.mousepress) {
        // this.time = seconds
        this.$store.dispatch(zPlayerActions.setLastPoint, seconds)
      }
    },
    closeMousepress() {
      this.mousepress = false
      this.playerJs.api('seek', this.time)
    },
    moveTo(e) {
      this.mousepress = true
      let rect = e.target.getBoundingClientRect()
      let x = Math.abs(e.clientX - rect.left) //x position within the element.
      let percentage = (x * 100) / rect.width
      let seconds = (this.currentEpisode.duration * percentage) / 100

      // this.time = seconds
      this.$store.dispatch(zPlayerActions.setLastPoint, seconds)
    },
    toggleVolume() {
      if (this.volume) {
        this.volume = 0
      } else {
        this.volume = 0.8
      }
      this.playerJs.api('volume', this.volume)
    },
    volumeTo(e) {
      this.mousepressVolume = true
      let rect = e.target.getBoundingClientRect()
      let x = Math.abs(e.clientY - rect.bottom) //x position within the element.
      let volume = x / rect.height
      this.volume = volume > 0.1 ? volume : 0
    },
    volumeMouseOver(e) {
      if (this.mousepressVolume) {
        let rect = e.target.getBoundingClientRect()
        let x = Math.abs(e.clientY - rect.bottom) //x position within the element.
        let volume = x / rect.height
        this.volume = volume > 0.1 ? volume : 0
      }
    },
    volumeMouseLeave() {
      if (this.mousepressVolume) {
        this.playerJs.api('volume', this.volume)
        this.mousepressVolume = false
      }
    },
    toggleModal() {
      this.$store.commit(zPlayerMutations.toggleModal)
    },
    closeModal() {
      this.$store.commit(zPlayerMutations.closeModal)
    },
    getEpisodeFromHistoryById(id) {
      return this.history.find((historyEp) => historyEp.id == id)
    },
    getEpisodeFromQueueById(id) {
      return this.queue.find((ep) => ep.id == id)
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/_mixins.scss';

.zPlayer {
  // max-width: 1240px;
  backdrop-filter: blur(10px);
  background: var(--color-zplayer-bg);
  border-radius: 10px;
  // border: 1px solid var(--color-border);
  box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  margin: 0 auto;
  line-height: 1;

  &__progress-block {
    width: 100%;
    height: 12px;
    border-top-left-radius: var(--block-border-radius);
    border-top-right-radius: var(--block-border-radius);

    @include button-effect;

    // &:hover {
    //   // height: 20px;

    //   .zPlayer__duration,
    //   .zPlayer__time {
    //     font-size: 12px;
    //     top: 1px;
    //   }
    // }
  }
  &__main-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 24px 4px 12px;
    box-sizing: border-box;
    height: 56px;
    @media (max-width: 768px) {
      padding: 12px 15px 12px;
    }
  }
  &__main-left {
    display: flex;
    align-items: center;
    flex: auto;
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  &__main-right {
    display: flex;
    align-items: center;
    height: 100%;
  }

  &__image {
    width: 42px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
  }

  &__previous,
  &__play,
  &__next {
    cursor: pointer;
    width: 32px;
    // margin-right: 201px;
    margin-left: 8px;
    z-index: 20;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @include button-effect;

    .icon {
      width: 20px;
      height: 20px;
    }
  }
  &__play {
    .icon {
      width: 38px;
      height: 38px;
    }
  }

  &__next {
    margin-right: 12px;
  }

  &__like {
    margin-right: 8px;
    cursor: pointer;
    @include button-effect;
  }

  &__loading {
    position: absolute;
    left: -9px;
    top: -10px;
    z-index: 10;
    opacity: 0;
    visibility: hidden;
    transition: 0.1s;

    .lds-ring {
      display: inline-block;
      position: relative;
      width: 42px;
      height: 42px;
      opacity: 0.4;
    }
    .lds-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 42px;
      height: 42px;
      margin: 4px;
      border: 4px solid rgb(44, 44, 44);
      border-radius: 50%;
      animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: rgb(70, 70, 70) transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
      animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
      animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
      animation-delay: -0.15s;
    }
  }

  &__credits {
    overflow: hidden;
  }
  &__title {
    display: block;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 1px;
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
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: break-spaces;
    font-size: 12px;
    color: inherit;
    text-decoration: none;
  }

  &__progress-line {
    width: 100%;
    height: 100%;
    background: var(--color-secondary);
    position: relative;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
  }

  &__duration {
    position: absolute;
    right: 15px;
    top: 0;
    font-size: 12px;
    color: var(--color-text);
    font-weight: 600;
    transition: 0.3s;
    z-index: 9999;
  }
  &__time {
    position: absolute;
    left: 15px;
    top: 0;
    font-size: 12px;
    color: var(--color-text);
    font-weight: 600;
    transition: 0.3s;
    @include unselectable;
  }

  &__progress-time {
    background: rgb(94, 93, 93);
    height: 100%;
    // border-top-left-radius: var(--block-border-radius);
    // border-top-right-radius: var(--block-border-radius);
  }
  &__progress-overflow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99;
    cursor: pointer;
    border-top-left-radius: var(--block-border-radius);
    border-top-right-radius: var(--block-border-radius);
  }
  &__progress-overflow-time {
    position: absolute;
    background: rgba(0, 0, 0, 0.685);
    padding: 2px 10px;
    font-size: 10px;
    top: 100%;
    left: 0;
    z-index: 999;
    @include unselectable;
  }

  &__buffered {
    position: absolute;
    background: rgba(0, 0, 0, 0.274);

    font-size: 10px;
    top: 0%;
    left: 0;
    height: 100%;
    transition: width 1s;
  }

  &__volume-line {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    transition: 0.3s;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 100px;
    border-radius: 4px;
    padding: 8px 4px;
    overflow: hidden;
    box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);

    background: var(--color-zplayer-bg);

    border: 1px solid var(--color-border);
    display: flex;
    flex-direction: column-reverse;

    @include button-effect;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__volume-block {
    position: relative;
    cursor: pointer;
    margin-left: 18px;
    @include button-effect;

    &:hover .zPlayer__volume-line {
      opacity: 1;
      visibility: visible;
    }
  }

  &__volume {
    background: #5e5d5d;
    height: 100%;
  }

  &__volume-overflow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99;
    cursor: pointer;
  }

  &__open {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 10px;
    @include button-effect;
    svg {
      height: 16px;
      width: 16px;
      // margin-bottom: 3px;
      fill: #fff;
    }
    @media (max-width: 768px) {
      margin-left: 6px;
    }
  }

  &__playlist {
    margin-left: 18px;
    cursor: pointer;
    position: relative;
    @include button-effect;

    &_active {
      opacity: 1;
    }
  }

  &__playlist-counter {
    font-size: 8px;
    position: absolute;
    bottom: -6px;
    right: -6px;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    background-color: var(--color-text);
    color: var(--color-text-reverse);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
  }

  &__speed {
    font-weight: 600;
    font-size: 20px;
    margin-left: 8px;
    text-align: right;
    width: 40px;
    cursor: pointer;
    @include button-effect;
    @include unselectable;
    @media (max-width: 768px) {
      margin-left: 8px;
    }
  }
}

.disabled {
  opacity: 0.2;
  cursor: default;
  &:hover {
    opacity: 0.2;
  }
}

.counter-changed {
  background: var(--color-accent);
  transform: scale(1.3);
}
</style>
