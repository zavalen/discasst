<template>
  <div class="queue">
    <draggable
      v-model="queue"
      item-key="id"
      handle=".zEpisode__icon"
      :component-data="{
        tag: 'ul',
        type: 'transition-group',
        name: !drag ? 'flip-list' : null,
      }"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
    >
      <template #item="{element}">
        <div
          v-if="element"
          class="zmodal__episode zEpisode"
        >
          <div class="zEpisode__main">
            <div
              class="zEpisode__play"
              @click="playEpisode(getEpisodeById(element.id))"
            >
              <svg-icon
                :name="
                  currentEpisode.id == element.id && isPlaying
                    ? 'pause'
                    : 'play'
                "
              />
            </div>
            <img
              v-lazy="element.podcast.imageURL"
              class="zEpisode__image"
            >
            <div class="zEpisode__creditials">
              <router-link
                :to="{
                  name: 'episode',
                  params: {
                    podcastSlug: element.podcast.slug,
                    episodeSlug: element.slug,
                  },
                }"
                class="zEpisode__title"
                @click="closeModal"
              >
                {{ element.title }}
              </router-link>
              <router-link
                :to="{
                  name: 'podcast',
                  params: {
                    podcastSlug: element ? element.podcast.slug : '',
                  },
                }"
                class="zEpisode__podcast"
                @click="closeModal"
              >
                {{ element.podcast.title }}
              </router-link>
            </div>
          </div>
          <div class="zEpisode__icon">
            <svg-icon name="drag" />
          </div>
          <div
            class="zEpisode__icon"
            @click="removeFromQueue(element.id)"
          >
            <svg-icon name="close" />
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import draggable from 'vuedraggable'
import {zPlayerActions, zPlayerMutations} from '@/store/modules/zPlayer'

export default {
  name: 'ZQueue',
  components: {
    draggable,
  },
  data() {
    return {
      drag: false,
    }
  },
  computed: {
    ...mapState({
      isPlaying: (state) => state.zPlayer.isPlaying,
      currentEpisode: (state) => state.zPlayer.currentEpisode,
    }),
    queue: {
      get() {
        return this.$store.state.zPlayer.queue
      },
      set(value) {
        this.$store.commit(zPlayerMutations.updateQueue, value)
      },
    },
    dragOptions() {
      return {
        animation: 400,
        disabled: false,
        ghostClass: 'ghost',
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
    closeModal() {
      this.$store.commit(zPlayerMutations.closeModal)
    },

    getEpisodeById(id) {
      return this.queue.find((ep) => ep.id === id)
    },
    removeFromQueue(id) {
      const episode = this.getEpisodeById(id)
      this.$store.commit(zPlayerMutations.removeFromQueue, episode)
    },
  },
}
</script>

<style lang="scss">
.zEpisode_current {
  margin-bottom: 16px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 2px var(--color-light-shadow);
}

.current-episode-text {
  font-size: 12px;
  font-weight: 600;
}

.zEpisode {
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  margin-bottom: 8px;
  max-width: 768px;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__main {
    display: flex;
    align-items: center;
    flex: auto;
  }
  &__play {
    margin-right: 12px;
    cursor: pointer;
    width: 24px;
  }

  &__image {
    width: 32px;
    height: 32px;
    margin-right: 8px;
    border-radius: 4px;
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

  &__icon {
    cursor: pointer;
    margin-left: 8px;
    .drag {
      cursor: move;
    }
  }
}

.sortable-chosen {
  box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  opacity: 0.7;
}
</style>
