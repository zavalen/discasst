<template>
  <div class="zmodal">
    <div class="zmodal__left ">
      <div class="zmodal__top">
        <button
          class="zmodal__btn"
          :class="{zmodal__btn_active: currentTabComponent == 'ZPlayerQueue'}"
          @click="openQueue"
        >
          Сейчас играет
        </button>
      </div>
      <div class="zmodal__current-episode scrollbar">
        <img :src="currentEpisode.Podcast.imageURL" />
        <h2>{{ currentEpisode.title }}</h2>
        <div v-html="currentEpisode.description"></div>
      </div>
    </div>
    <div class="zmodal__right">
      <div class="zmodal__top">
        <button
          class="zmodal__btn"
          :class="{zmodal__btn_active: currentTabComponent == 'ZPlayerQueue'}"
          @click="openQueue"
        >
          Очередь воспроизведения
        </button>
        <button
          class="zmodal__btn"
          :class="{zmodal__btn_active: currentTabComponent == 'ZPlayerHistory'}"
          @click="openhHstory"
        >
          История
        </button>

        <div @click="closeModal" class="zmodal__close">
          <svg-icon name="close" />
        </div>
      </div>
      <div class="zmodal__content scrollbar">
        <component :is="currentTabComponent"></component>
      </div>
    </div>
    <div class="zmodal__bottom">
      sssssssss
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

import ZPlayerHistory from '@/components/zPlayer/ZPlayerHistory'
import ZPlayerQueue from '@/components/zPlayer/ZPlayerQueue'
import {zPlayerMutations} from '@/store/modules/zPlayer'

export default {
  name: 'zPlayerModal',
  components: {
    ZPlayerHistory,
    ZPlayerQueue
  },
  data() {
    return {
      currentTabComponent: 'ZPlayerQueue'
    }
  },

  computed: {
    ...mapState({
      isPlaying: state => state.zPlayer.isPlaying,
      currentEpisode: state => state.zPlayer.currentEpisode
    })
  },

  methods: {
    openQueue() {
      this.currentTabComponent = 'ZPlayerQueue'
    },
    openhHstory() {
      this.currentTabComponent = 'ZPlayerHistory'
    },
    closeModal() {
      this.$store.commit(zPlayerMutations.closeModal)
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
    padding: 0 32px 16px 16px;
    border-right: 1px solid var(--color-border);
    height: calc(100vh - 318px);
  }

  &__right,
  &__left {
    padding: 0 16px;
  }

  &__left {
    max-width: 40%;
  }

  &__right {
    max-width: 60%;
  }

  &__top {
    padding: 0px 24px 0px 0;
    margin-left: 2px;
    border-bottom: 1px solid var(--color-border);
    position: relative;
    margin-bottom: 16px;
  }

  &__bottom {
    padding: 16px;
    border: 1px solid var(--color-border);
    background: var(--color-zplayer-bg);
    width: 100%;
    background: red;
  }

  &__btn {
    padding: 18px 12px 12px 12px;
    background: transparent;
    border-bottom: 4px solid transparent;
    opacity: 0.7;
    border-radius: 0px;
    font-size: 16px;
    margin-right: 8px;
    position: relative;
    bottom: -1px;

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
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  &__content {
    padding: 0px 16px;
    height: calc(100vh - 318px);
  }
}

.strong {
  background: rgb(153, 153, 153);
}
</style>
