<template>
  <div class="episode-page container">
    <div class="episode-page__top podcast-info">
      <template v-if="podcast">
        <div class="podcast-info__image">
          <img :src="podcast.imageURL" alt="" />
        </div>
        <div class="podcast-info__main">
          <h1>{{ podcast.title }}</h1>
          <p v-html="podcast.description"></p>
        </div>
      </template>
    </div>
    <pd-feed :api-url="apiUrl" :podcast-slug="podcastSlug" />
  </div>
</template>

<script>
// import {mapState} from 'vuex'
import podcasts from '@/api/podcasts'
import PdFeed from '@/components/PdFeed'

export default {
  name: 'Episode',
  components: {
    PdFeed,
  },
  data() {
    return {
      apiUrl: '/episodes/',
      podcast: null,
      isLoading: false,
      errors: null,
    }
  },
  computed: {
    podcastSlug() {
      return this.$route.params.podcastSlug
    },
  },
  mounted() {
    window.scrollTo(0, 0)
    this.getPodcastBySlug()
  },

  methods: {
    getPodcastBySlug() {
      this.isLoading = true
      podcasts
        .getPodcastBySlug(this.podcastSlug)
        .then((response) => {
          if (response.errors) {
            this.$router.push({name: '404'})
            return
          }
          this.isLoading = false
          this.errors = null
          this.podcast = response.data.podcast
        })
        .catch((result) => {
          this.errors = result
          this.isLoading = false

          this.$router.push({name: '404'})
        })
    },
  },
}
</script>


<style lang="scss">
.episode-page {
  &__top {
    background: var(--color-block-bg);
    min-height: 120px;
    padding: 24px;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    margin-top: 24px;
    margin-bottom: 24px;
  }
}

.podcast-info {
  display: flex;
  &__image {
    & > img {
      min-width: 256px;
      max-width: 256px;
    }
  }

  &__main {
    padding: 0 24px;
  }
}
</style>