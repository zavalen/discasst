<template>
  <div class="rating">
    <div
      v-tooltip="'Минус'"
      class="rating__minus"
      :class="{rating__minus_active: episode.rating.userRating == -1}"
      @click="setRating(episode, -1)"
    >
      <svg-icon name="rating-arrow-down" />
    </div>
    <transition
      name="slide-fade"
      mode="out-in"
    >
      <span
        :key="episode.rating.sum"
        v-tooltip="
          '- ' +
            episode.rating.minusesCount +
            ' | ' +
            episode.rating.plusesCount +
            ' +'
        "
        class="rating__number"
        :class="{
          rating__number_minus: episode.rating.sum < 0,
        }"
      >
        {{
          episode.rating.plusesCount || episode.rating.minusesCount
            ? episode.rating.sum
            : '—'
        }}
      </span>
    </transition>
    <div
      v-tooltip="'Плюс'"
      class="rating__plus"
      :class="{rating__plus_active: episode.rating.userRating == 1}"
      @click="setRating(episode, 1)"
    >
      <svg-icon name="rating-arrow-up" />
    </div>
  </div>
</template>

<script>
import {feedActions} from '@/store/modules/episodes'
import {authGetters} from '@/store/modules/auth'
import {mapGetters} from 'vuex'

export default {
  name: 'EpisodeRating',

  props: {
    episode: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ...mapGetters({
      isAnonymus: authGetters.isAnonymus,
    }),
  },
  methods: {
    setRating(episode, value) {
      if (this.isAnonymus) {
        this.$router.push({name: 'login'})
      } else {
        if (episode.rating.userRating == value) {
          episode.rating.sum -= value

          if (value == 1) {
            episode.rating.plusesCount--
          }
          if (value == -1) {
            episode.rating.minusesCount--
          }
          value = 0
        } else {
          let multiply = episode.rating.userRating == -value ? 2 : 1
          episode.rating.sum += value * multiply

          if (multiply == 1) {
            if (value == 1) {
              episode.rating.plusesCount++
            }
            if (value == -1) {
              episode.rating.minusesCount++
            }
          }

          if (multiply == 2) {
            if (value == 1) {
              episode.rating.plusesCount++
              episode.rating.minusesCount--
            }
            if (value == -1) {
              episode.rating.plusesCount--
              episode.rating.minusesCount++
            }
          }
        }
        episode.rating.userRating = value

        this.$store.dispatch(feedActions.setRating, {
          episodeId: episode.id,
          value,
        })
      }
    },
  },
}
</script>

<style lang="scss">
.rating {
  display: flex;
  align-items: center;
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  justify-content: space-between;
  backdrop-filter: blur(5px);
  overflow: hidden;
  transition: 0.3s;
  // box-shadow: 0 1px 1px var(--color-light-shadow);

  &__plus,
  &__minus {
    padding: 1px 8px;
    cursor: pointer;
    position: relative;

    &:hover {
      background: var(--bg-block-hover);
    }
    &:active {
      top: 1px;
    }
  }

  &__plus_active {
    background: rgba(4, 202, 4, 0.08);
    path {
      fill: rgb(4, 202, 4);
    }
  }

  &__minus_active {
    background: rgba(211, 37, 37, 0.08);

    path {
      fill: rgb(211, 37, 37);
    }
  }
  &__number {
    min-width: 20px;
    display: flex;
    height: 24px;
    flex: auto;
    text-align: center;
    font-size: 14px;
    text-shadow: 0 0 1px var(--color-text);
    align-items: center;
    justify-content: center;

    &_minus {
      color: rgb(211, 37, 37);
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.15s ease;
}
.slide-fade-leave-active {
  transition: all 0.15s ease;
}
.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
