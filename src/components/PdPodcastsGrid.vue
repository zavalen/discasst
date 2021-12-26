<template>
  <div class="podcasts">
    <pd-loader v-if="isLoading" />
    <div v-if="errors">Something goes wrong...</div>

    <template v-if="podcasts">
      <div v-for="podcast in podcasts" :key="podcast.id" class="podcast">
        <div class="podcast__top">
          <img v-lazy="podcast.imageURL" class="podcast__image" />
        </div>

        <div class="podcast__bottom">
          <h2 class="podcast__title">
            {{ podcast.title }}
          </h2>
        </div>
        <router-link
          class="podcast__link"
          :to="{
            name: 'podcast',
            params: {podcastSlug: podcast.slug},
          }"
        />
      </div>
    </template>
  </div>
</template>



<script>
import {podcastsActions} from '@/store/modules/podcasts'
import {mapState} from 'vuex'
import PdLoader from '@/components/ui/PdLoader'

export default {
  name: 'PdEpisodes',
  components: {PdLoader},

  props: {
    apiUrl: {
      type: String,
      required: false,
      default: null,
    },
  },

  computed: {
    ...mapState({
      podcasts: (state) => state.podcasts.data,
      isLoading: (state) => state.podcasts.isLoading,
      errors: (state) => state.podcasts.errors,
    }),
  },
  mounted() {
    this.$store.dispatch(podcastsActions.getPodcasts, {offset: 21, limit: 50})
  },
}
</script>

<style lang="scss" scoped>
.podcasts {
  display: grid;
  // grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
  margin: 48px 0;
}

.podcast {
  max-width: 240px;
  background: var(--color-block-bg);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 2px var(--color-light-shadow);
  // height: fit-content;
  transition: 0.3s;
  position: relative;
  &:hover {
    box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  }

  &__top {
    width: 180px;
    height: 180px;
  }

  &__image {
    width: 180px;
    height: 180px;
  }
  &__bottom {
    padding: 16px 16px;
  }

  &__title {
    font-size: 18px;
    margin: 0;
    padding: 0;
  }

  &__link {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>