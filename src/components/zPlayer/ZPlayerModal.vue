<template>
  <div class="zmodal">
    <div class="zmodal__left">
      <div class="zmodal__top">
        <div class="zmodal__heading">Сейчас играет</div>
      </div>
      <div class="zmodal__left-wrapper scrollbar">
        <slide-right-transition>
          <div
            v-show="currentEpisodeVisibility"
            class="zmodal__current-episode zcurrent-episode"
          >
            <!-- <div class="zcurrent-episode__now-playing">Сейчас играет</div> -->
            <div class="zcurrent-episode__header">
              <img
                class="zcurrent-episode__image"
                :src="currentEpisode.Podcast.imageURL"
              />
              <div class="zcurrent-episode__controls"></div>
            </div>
            <div class="zcurrent-episode__body">
              <h2 class="zcurrent-episode__heading">
                {{ currentEpisode.title }}
              </h2>
              <div v-html="currentEpisode.description"></div>
            </div>
          </div>
        </slide-right-transition>
      </div>
    </div>
    <div class="zmodal__right">
      <div class="zmodal__top">
        <pd-tabs
          :tabs="tabs"
          :currentTab="currentTab"
          :wrapper-class="'tabs'"
          :tab-class="'tabs__item'"
          :tab-active-class="'tabs__item_active'"
          :line-class="'tabs__active-line'"
          @onClick="handleClick"
        />

        <div @click="closeModal" class="zmodal__close">
          <svg-icon name="close" />
        </div>
      </div>
      <div class="zmodal__content scrollbar">
        <component :is="currentTab"></component>
      </div>
    </div>
    <!-- <div class="zmodal__bottom">sssssssss</div> -->
  </div>
</template>

<script>
import {mapState} from 'vuex'

import ZPlayerHistory from '@/components/zPlayer/ZPlayerHistory'
import ZPlayerQueue from '@/components/zPlayer/ZPlayerQueue'
import {zPlayerMutations} from '@/store/modules/zPlayer'
import SlideRightTransition from '@/components/animations/SlideRightTransition'
import PdTabs from '@/components/ui/PdTabs'
export default {
  name: 'zPlayerModal',
  components: {
    ZPlayerHistory,
    ZPlayerQueue,
    SlideRightTransition,
    PdTabs
  },
  data() {
    return {
      currentEpisodeVisibility: true,
      currentTab: 'ZPlayerQueue',
      tabs: [
        {title: 'Очередь воспроизведения', value: 'ZPlayerQueue'},
        {title: 'История', value: 'ZPlayerHistory'}
      ]
    }
  },

  computed: {
    ...mapState({
      isPlaying: state => state.zPlayer.isPlaying,
      currentEpisode: state => state.zPlayer.currentEpisode
    })
  },
  watch: {
    currentEpisode() {
      this.currentEpisodeVisibility = false

      setTimeout(async () => {
        // await this.$nextTick()
        this.currentEpisodeVisibility = true
      }, 500)
    }
  },
  methods: {
    // openQueue() {
    //   this.currentTabComponent = 'ZPlayerQueue'
    // },
    // openhHstory() {
    //   this.currentTabComponent = 'ZPlayerHistory'
    // },
    closeModal() {
      this.$store.commit(zPlayerMutations.closeModal)
    },
    handleClick(newTab) {
      this.currentTab = newTab
    }
  }
}
</script>

<style lang="scss">
.zmodal {
  max-width: 1240px;
  margin: 0 auto 16px;
  height: calc(100vh - 176px);
  background: var(--color-zplayer-bg);
  border-radius: 10px;
  box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  &__current-episode {
    // height: calc(100vh - 200px);
    margin-right: 4px;
  }

  &__left {
    width: 42%;
    border-right: 2px solid var(--color-border);
    background-color: var(--color-body-bg);
    // height: 100vh;

    overflow: hidden;
  }

  &__left-wrapper {
    height: calc(100vh - 220px);
  }

  &__right {
    width: 58%;
  }

  &__top {
    position: relative;
    box-shadow: 0 2px 2px var(--color-light-shadow);
    background: var(--color-zplayer-bg);
  }

  &__bottom {
    padding: 4px 24px;
    border-top: 1px solid var(--color-border);
    background: var(--color-zplayer-bg);
    width: 100%;
    display: flex;
    align-items: center;
  }

  &__btn {
    padding: 12px 8px 8px 12px;
    background: transparent;
    border-bottom: 4px solid transparent;
    opacity: 0.7;
    border-radius: 0px;
    font-size: 15px;
    margin-left: 24px;
    position: relative;
    bottom: -1px;

    &:nth-child(2) {
      margin-left: 8px;
    }

    &_active,
    &:hover,
    &:active {
      background: transparent;
      opacity: 1;
      color: var(--color-text);
      box-shadow: none;
      text-shadow: 0 0 1px var(--color-text);
    }

    &_active {
      border-bottom: 4px solid var(--color-accent);
    }
  }

  &__close {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  &__content {
    padding: 12px 24px;
    height: calc(100vh - 248px);
  }

  &__heading {
    padding: 12px 12px 12px 24px;
    background: transparent;
    opacity: 0.7;
    border-radius: 0px;
    font-size: 15px;
    position: relative;
    border-bottom: 1px solid transparent;
    background: transparent;
    box-shadow: none;
    text-shadow: 0 0 1px var(--color-text);
    bottom: -1px;
  }
}

.strong {
  background: rgb(153, 153, 153);
}

.zcurrent-episode {
  // padding: 2px 32px 32px 32px;
  border-radius: 16px;
  margin: 16px 32px 32px;
  background: var(--color-zplayer-bg);
  box-shadow: 0 2px 2px var(--color-light-shadow);
  overflow: hidden;

  &__header {
    display: flex;
    margin-left: 32px;
    margin-top: 24px;
  }

  &__controls {
    width: 64px;
  }
  &__heading {
    margin-top: 16px;
    font-size: 20px;
  }

  &__now-playing {
    font-size: 14px;
    text-shadow: 0 0 1px var(--color-text);
    padding: 8px 0;
  }

  &__image {
    border: 1px solid var(--color-border);
    border-radius: 10px;
    width: calc(100% - 186px);
    // width: 140px;
    // min-height: 300px;
  }

  &__body {
    padding: 4px 32px 24px;
  }
}
</style>
