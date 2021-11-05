<template>
  <div class="podcasts">
    <pd-loader v-if="isLoading" />
    <div v-if="errors">Something goes wrong...</div>

    <template v-if="podcasts">
      <div class="podcast" v-for="podcast in podcasts" :key="podcast.id">
        <div
          v-tooltip="'You have new messages.'"
          class="podcasts-podcast__left"
        >
          <img :src="podcast.imageURL" alt="" srcset="" />
        </div>

        <div class="podcasts-podcast__right">
          <h2>{{ podcast.title }}</h2>
        </div>
      </div>
    </template>
  </div>
</template>



<script>
import {podcastsActions} from '@/store/modules/podcasts'
import {mapState} from 'vuex'
import PdLoader from '@/components/ui/PdLoader'

export default {
  name: 'PdFeed',
  components: {PdLoader},

  props: {
    apiUrl: {
      type: String,
      required: false,
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

<style lang="scss">
.podcasts {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 2vw;
  margin: 48px 0;
}

.podcast {
  max-width: 240px;
  background: red;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 2px var(--color-light-shadow);
  &:hover {
    box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  }
}
</style>