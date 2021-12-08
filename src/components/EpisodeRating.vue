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

    <span
      class="rating__number"
      v-tooltip="
        episode.rating.minusesCount + ' / ' + episode.rating.plusesCount
      "
    >
      {{ episode.rating.sum || '—' }}
    </span>
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
        const rating = {
          episodeId: episode.id,
          value: 0,
        }

        if (episode.rating.userRating == value) {
          episode.rating.sum -= value
          episode.rating.userRating = 0
          rating.value = 0
        } else if (episode.rating.userRating == -value) {
          episode.rating.sum += value * 2
          episode.rating.userRating = value
          rating.value = value
        } else {
          episode.rating.sum += value
          episode.rating.userRating = value
          rating.value = value
        }

        if (value == 1) {
          episode.rating.userRating
        }

        this.$store.dispatch(feedActions.setRating, rating)
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
  &__plus,
  &__minus {
    padding: 2px 8px;
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
    path {
      fill: rgb(4, 202, 4);
    }
  }

  &__minus_active {
    path {
      fill: rgb(211, 37, 37);
    }
  }
  &__number {
    min-width: 24px;
    display: flex;
    height: 28px;
    flex: auto;
    text-align: center;
    font-size: 14px;
    text-shadow: 0 0 1px var(--color-text);
    align-items: center;
    justify-content: center;
  }
}
</style>
