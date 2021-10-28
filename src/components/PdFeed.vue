<template>
  <div style="min-height: 200px">
    <pd-loader v-if="isLoading" />
    <div v-if="errors">Something goes wrong...</div>

    <template v-if="feed">
      <div class="feed-post" v-for="episode in feed" :key="episode.createdAt">
        <h2>{{ episode.title }}</h2>
        <h4>{{ episode.description }}</h4>
        {{ episode }}
        <router-link
          :to="{
            name: 'episode',
            params: {podcast: episode.podcast.slug, slug: episode.slug},
          }"
        >
          GO TO EPISODE
        </router-link>
      </div>
    </template>
  </div>
</template>



<script>
import {feedActions} from '@/store/modules/feed'
import {mapState} from 'vuex'
import PdLoader from '@/components/ui/PdLoader'

export default {
  name: 'PdFeed',
  components: {PdLoader},

  props: {
    apiUrl: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState({
      feed: (state) => state.feed.data,
      isLoading: (state) => state.feed.isLoading,
      errors: (state) => state.feed.errors,
    }),
  },
  mounted() {
    this.$store.dispatch(feedActions.getFeed, this.apiUrl)
  },
}
</script>

<style lang="scss">
.feed-post {
  padding: 30px;
  background: var(--color-post-bg);
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 2px var(--color-light-shadow);

  transition: 0.5s;
  &:hover {
    box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  }
}
</style>