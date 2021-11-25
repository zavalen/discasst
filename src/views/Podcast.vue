<template>
  <div class="episode-page container">
    <div class="episode-page__top podcast-info">
      <template v-if="podcast">
        <div class="podcast-info__image">
          <img :src="podcast.imageURL" alt="" />
        </div>
        <div class="podcast-info__main">
          <h1 class="podcast-info__title">{{ podcast.title }}</h1>
          <p v-html="podcast.description"></p>
        </div>
        <div class="podcast-info__side"></div>
      </template>
    </div>
    <pd-episodes :api-url="apiUrl" :podcast-slug="podcastSlug" />
  </div>
</template>

<script>
// import {mapState} from 'vuex'
import podcasts from '@/api/podcasts'
import PdEpisodes from '@/components/PdEpisodes'

export default {
  name: 'Episode',
  components: {
    PdEpisodes,
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
    padding: 24px 32px;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    margin-top: 64px;
    margin-bottom: 24px;
    box-shadow: 0 2px 2px var(--color-light-shadow);
  }
}

.podcast-info {
  display: flex;
  &__image {
    position: relative;
    top: -64px;
    margin-bottom: -64px;
    & > img {
      min-width: 256px;
      max-width: 256px;
      border-radius: 10px;
      border: 1px solid var(--color-border);
      box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
      background-color: var(--bg-menu-item-hover);
    }
  }

  &__main {
    padding: 0 38px;
  }

  &__side {
    min-width: 300px;
    max-width: 300px;
  }

  &__title {
    margin: 0;
  }
}
</style>