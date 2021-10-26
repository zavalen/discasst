
<template>
  <slide-up-transition>
    <div
      v-if="isReady"
      class="player player-container"
      :class="isMobile ? 'player-mobile' : ''"
    >
      <div class="zPlayer">
        <div class="zPlayer__progress-block">
          <div class="zPlayer__progress-line">
            <div
              class="zPlayer__progress-time"
              :style="{
                width: zPlayer.time
                  ? (zPlayer.time * 100) / zPlayer.duration + '%'
                  : '0%',
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
              {{
                zPlayer.time && zPlayer.time > 0 ? toHHMMSS(zPlayer.time) : ''
              }}
            </div>
            <div class="zPlayer__duration unselectable">
              {{
                zPlayer.duration && zPlayer.duration > 0
                  ? toHHMMSS(zPlayer.duration)
                  : ''
              }}
            </div>
            <div
              class="zPlayer__buffered"
              :style="{
                width: zPlayer.time
                  ? (zPlayer.time * 100) / zPlayer.buffered + '%'
                  : '0%',
              }"
            ></div>
            <div
              v-if="zPlayer.mouseOverShow"
              class="zPlayer__progress-overflow-time"
              :style="{
                left:
                  zPlayer.mouseOverTimePx > 100
                    ? zPlayer.mouseOverTimePx - 50 + 'px'
                    : zPlayer.mouseOverTimePx + 20 + 'px',
              }"
            >
              {{ toHHMMSS(zPlayer.mouseOverTime) }}
            </div>
          </div>
        </div>
        <div class="zPlayer__main-block">
          <div class="zPlayer__main-left">
            <div class="zPlayer__play" @click="zPlayerToggle">
              <svg-icon name="play" v-if="!this.zPlayer.isPlaying" />
              <svg-icon name="pause" v-if="this.zPlayer.isPlaying" />
            </div>

            <div
              class="zPlayer__next"
              :class="{
                disabled: playlistActive && playlist.length <= 1,
              }"
              @click="zPlayerNextTrack"
            >
              <svg-icon name="next-track" />
            </div>

            <div
              class="zPlayer__loading"
              :class="zPlayer.isLoading ? 'show' : ''"
            >
              <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div class="zPlayer__title">
              {{ this.zPlayer.title }}
            </div>
            <div
              v-if="this.zPlayer.id"
              class="zPlayer__open"
              @click="showSharedTrack(this.zPlayer.id)"
            >
              <svg-icon name="open" />
            </div>
          </div>
          <div class="zPlayer__main-right">
            <div class="zPlayer__speed" @click="zPlayerChangeSpeed">
              x{{ zPlayer.speed }}
            </div>

            <div class="zPlayer__volume-line">
              <div
                class="zPlayer__volume"
                :style="{
                  width: zPlayer.volume * 100 + '%',
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
                v-if="zPlayer.mouseOverShow"
                class="zPlayer__volume-overflow-persentage"
                :style="{
                  left: zPlayer.mouseOverTimePx + 'px',
                }"
              ></div>

              <svg-icon
                name="nosound"
                iconClass="zPlayer__nosound"
                v-if="zPlayer.volume == 0"
              />
            </div>

            <div
              v-if="playlistActive && isMobile"
              class="zPlayer__playlist"
              @click="togglePlaylistVisibility"
              ref="zplaylist"
            >
              <svg-icon name="playlist" />
            </div>
          </div>
        </div>
      </div>
      <div id="player"></div>
    </div>
  </slide-up-transition>
</template>

<script>
import SlideUpTransition from '@/components/ui/SlideUpTransition'

export default {
  name: 'ZPlayer',
  components: {
    SlideUpTransition,
  },
  mounted() {
    setTimeout(() => {
      this.isReady = true
    }, 2000)
  },
  data() {
    return {
      isReady: false,
      zPlayer: {
        id: null,
        title: null,
        duration: null,
        time: null,
        progress: (this.time * 100) / this.duration,
        mouseOverShow: false,
        mouseOverTime: null,
        mouseOverPx: null,
        clientX: null,
        isPlaying: false,
        isLoading: false,
        volume: 0.8,
        speed: 1,
        buffered: 0,
      },
    }
  },
}
</script>


<style lang="scss">
@import '@/assets/scss/_mixins.scss';

.zPlayer {
  max-width: 1240px;
  margin: 0 auto 12px auto;
  backdrop-filter: blur(10px);
  background: var(--color-zplayer-bg);
  border-radius: 10px;
  border: 1px solid var(--color-border);
  box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  overflow: hidden;
  height: 56px;

  &__progress-block {
    width: 100%;
    height: 12px;
    border-top-left-radius: var(--block-border-radius);
    border-top-right-radius: var(--block-border-radius);

    @include button-effect;

    &:hover {
      height: 20px;

      .zPlayer__duration,
      .zPlayer__time {
        font-size: 12px;
        top: 1px;
      }
    }
  }
  &__main-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 22px;
    box-sizing: border-box;
    @media (max-width: 768px) {
      padding: 12px 15px 12px;
    }
  }
  &__main-left {
    display: flex;
    align-items: center;
    flex: auto;
    position: relative;
  }
  &__main-right {
    display: flex;
    align-items: center;
  }

  &__play,
  &__next {
    cursor: pointer;
    width: 35px;
    margin-right: 6px;
    z-index: 20;

    @include button-effect;

    svg {
      fill: #fff;
      width: 30px;
      height: 30px;
    }
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

  &__title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 1px;
    cursor: default;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
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

  &__progress-line {
    width: 100%;
    height: 100%;
    background: rgb(51, 51, 51);
    position: relative;
    border-top-left-radius: var(--block-border-radius);
    border-top-right-radius: var(--block-border-radius);
  }

  &__duration {
    position: absolute;
    right: 15px;
    top: -2px;
    font-size: 10px;
    color: #e2e2e2;
    font-weight: 600;
    transition: 0.3s;
  }
  &__time {
    position: absolute;
    left: 15px;
    top: -2px;
    font-size: 10px;
    color: #e2e2e2;
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
    background: rgba(0, 0, 0, 0.685);

    font-size: 10px;
    top: 0%;
    left: 0;
    height: 100%;
    transition: width 1s;
  }

  &__volume-line {
    width: 60px;
    height: 20px;
    margin-left: 15px;

    background: rgb(51, 51, 51);
    position: relative;
    display: flex;
    flex-direction: column-reverse;

    @include button-effect;

    @media (max-width: 768px) {
      display: none;
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

  &__nosound {
    position: absolute;
    opacity: 0.5;
    svg {
      height: 24px;
      width: 24px;
      // margin-bottom: 3px;
      fill: #fff;
      // polygon,
      // line,
      path {
        // stroke: #fff;
        fill: #fff;
      }
    }
  }

  &__volume-overflow-persentage {
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
    margin-left: 15px;
    cursor: pointer;
    @include button-effect;
    svg {
      height: 20px;
      width: 20px;
      margin-bottom: 3px;
      path {
        fill: #fff;
      }
    }
  }
  &__speed {
    font-weight: 900;
    font-size: 20px;
    margin-left: 15px;
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
</style>