<template>
  <div class="home container">
    <div class="add-podcast">
      <div v-if="errors">{{ errors }}</div>

      <form @submit.prevent="findOrAddPodcast(searchQuery)">
        <input
          placeholder="RSS link or apple podcast link"
          type="text"
          v-model.trim="searchQuery"
        />
        <button type="submit">Добавить</button>
      </form>
      <template v-if="searchResults && searchResults.length">
        <div
          class="search-result"
          v-for="searchResult in searchResults"
          :key="searchResult.collectionId"
          @click="rss = searchResult.feedUrl"
        >
          <div>{{ searchResult.collectionName }}</div>
        </div>
      </template>
      https://whyarewestillalive.libsyn.com/rss
      <br />
      https://meduza.io/rss2/podcasts/meduza-v-kurse
      <br />
      https://rss.art19.com/apology-line
      <br />
      https://feeds.simplecast.com/54nAGcIl
      <br />
      https://feeds.fireside.fm/bibleinayear/rss
      <br />
      https://feeds.megaphone.fm/ADL9840290619
      <br />
      https://podster.fm/rss.xml?pid=48291
      <h2 v-if="isLoading">ЗАГРУЗКА...</h2>
    </div>
  </div>
</template>

<script>
import podcasts from '@/api/podcasts'

export default {
  name: 'findOrAddPodcast',
  data() {
    return {
      isLoading: false,
      searchQuery: '',
      rss: '',
      errors: null,
      searchResults: null,
    }
  },
  mounted() {
    window.scrollTo({top: 0})
  },
  methods: {
    async getRssFromAppleById(searchQuery) {
      let match = searchQuery.match(/id(\d+)/)
      let podID
      if (match) {
        podID = match[1]
      } else {
        podID = searchQuery.match(/\d+/)
      }

      if (!podID) {
        this.errors = 'Не удалось найти ID подкаста'
        return
      }

      const results = await this.search(podID)
      this.rss = results[0].feedUrl
    },
    getRssFromUrl(searchQuery) {
      this.rss = searchQuery
    },
    async search(searchQuery) {
      const encodedSearchQuery = encodeURI(searchQuery)
      try {
        const data = await fetch(
          `https://itunes.apple.com/search?term=${encodedSearchQuery}&entity=podcast`
          // {cors: 'no-cors'}
        ).then((response) => {
          return response.json()
        })

        if (data.results.length) {
          this.searchResults = data.results
          this.isLoading = false
          return data.results
        } else {
          this.errors = 'Ничего не найдено'
        }
      } catch (error) {
        this.errors = 'Что-то пошло не так'
      }
    },
    async findOrAddPodcast(rss) {
      this.isLoading = true
      const addedPodcast = await podcasts
        .findOrAddPodcast(rss)
        .then((response) => response.data)

      this.$router.push({
        name: 'podcast',
        params: {podcastSlug: addedPodcast.slug},
      })
    },
    isValidHttpUrl(string) {
      let url

      try {
        url = new URL(string)
      } catch (_) {
        return false
      }

      return url.protocol === 'http:' || url.protocol === 'https:'
    },
  },

  watch: {
    async searchQuery(newVal) {
      this.errors = null
      if (newVal.length > 3) {
        if (
          newVal.startsWith('https://podcasts.apple.com/') ||
          newVal.startsWith('id')
        ) {
          this.getRssFromAppleById(newVal)
        } else if (this.isValidHttpUrl(newVal)) {
          this.getRssFromUrl(newVal)
        } else {
          this.search(newVal)
        }
      }
    },
    rss(newRss) {
      if (typeof newRss === 'object') {
        this.rss = this.searchQuery
      }
      if (typeof newRss === 'string') {
        this.findOrAddPodcast(newRss)
      }
    },
  },
}
</script>

<style lang="scss">
.add-podcast {
  padding: 48px;
  background: var(--color-header-bg);
  max-width: 768px;
  margin: 80px auto;
}

.search-result {
  padding: 24px;
  cursor: pointer;
  background: var(--color-secondary);
  border-radius: 10px;
}
</style>
