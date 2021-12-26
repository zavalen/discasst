<template>
  <div class="home container">
    <div
      v-click-outside="blur"
      class="discover-search"
      @click="focus"
    >
      <form
        class="discover-search__form"
        @submit.prevent.stop
      >
        <button
          v-if="!isLoading"
          class="discover-search__submit"
          type="submit"
        >
          <svg-icon name="search" />
        </button>
        <pd-loader
          v-if="isLoading"
          class="discover-search__loading"
        />

        <input
          v-model.trim="searchQuery"
          class="discover-search__input"
          placeholder="Умный поиск"
          type="text"
          autocomplete="off"
        >
        <button
          v-if="searchQuery.length"
          class="discover-search__clear"
          @click.prevent.stop="clearSearch"
        >
          <svg-icon name="close" />
        </button>
      </form>

      <template v-if="focusing">
        <div class="discover-search__results scrollbar">
          <div>
            Это умный поискЭто умный поискЭто умный поискЭто умный поискЭто
            умный поискЭто умный поискЭто умный поискЭто умный поискЭто умный
            поискЭто умный поискЭто умный поискЭто умный поискЭто умный поискЭто
            умный поискЭто умный поискЭто умный поискЭто умный поискЭто умный
            поискЭто умный поискЭто умный поискЭто умный поискЭто умный поискЭто
            умный поискЭто умный поискЭто умный поискЭто умный поискЭто умный
            поискЭто умный поискЭто умный поискЭто умный поискЭто умный поискЭто
            умный поискЭто умный поискЭто умный поискЭто умный поискЭто умный
            поискЭто умный поискЭто умный поискЭто умный поискЭто умный поискЭто
            умный поискЭто умный поискЭто умный поискЭто умный поискЭто умный
            поискЭто умный поискЭто умный поискЭто умный поиск
          </div>

          <div
            v-for="searchResult in searchResults"
            :key="searchResult.collectionId"
            class="discover-search__result discover-search-result"
            @click="rss = searchResult.feedUrl"
          >
            <img
              v-lazy="searchResult.artworkUrl60"
              class="loading discover-search-result__image"
              alt=""
            >
            <div>{{ searchResult.collectionName }}</div>
          </div>
          <div v-if="errors">
            {{ errors }}
          </div>
        </div>
      </template>

      <!-- <h2 v-if="isLoading">ЗАГРУЗКА...</h2> -->
    </div>
  </div>
</template>

<script>
import podcasts from '@/api/podcasts'
import PdLoader from '@/components/ui/PdLoader'

export default {
  name: 'FindOrAddPodcast',
  components: {PdLoader},

  data() {
    return {
      isLoading: false,
      focusing: false,
      searchQuery: '',
      rss: '',
      errors: null,
      searchResults: null,
    }
  },

  watch: {
    async searchQuery(newVal) {
      this.errors = null
      if (newVal.length > 2) {
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
      } else {
        this.searchResults = []
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
        this.isLoading = true

        const data = await fetch(
          `https://itunes.apple.com/search?term=${encodedSearchQuery}&entity=podcast`
        ).then((response) => {
          return response.json()
        })

        if (data.results.length) {
          this.isLoading = false

          this.searchResults = data.results
          console.log(this.searchResults)
          this.isLoading = false
          return data.results
        } else {
          this.errors = 'Ничего не найдено'
          this.searchResults = []
          this.isLoading = false
        }
      } catch (error) {
        this.errors = 'Что-то пошло не так'
        this.isLoading = false
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
    clearSearch() {
      this.errors = null
      this.searchResults = []
      this.searchQuery = ''
    },
    blur() {
      this.focusing = false
    },
    focus() {
      this.focusing = true
    },
  },
}
</script>

<style lang="scss" scoped>
.discover-search {
  padding: 12px 12px;
  background: var(--color-header-bg);
  margin-top: 24px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  position: relative;
  &__form {
    margin: 0;
    height: auto;
    position: relative;
    z-index: 2;
  }

  &__input {
    margin: 0;
    width: 100%;
    border-radius: 48px;
    padding: 10px 48px;
    background: var(--color-block-bg);

    &:active,
    &:focus {
      // box-shadow: 0 2px 2px var(--color-light-shadow);
      border-color: var(--color-secondary);
    }
  }

  &__submit,
  &__clear,
  &__loading {
    background: transparent;
    position: absolute;
    left: 2px;
    top: 50%;
    transform: translateY(-54%);
    opacity: 0.4;
    transition: 0.3;
    &:hover {
      opacity: 1;
    }
  }
  &__loading {
    height: 24px;
    width: 24px;
    padding: 0px 12px;
  }

  &__clear {
    right: 2px;
    left: auto;
  }

  &__results {
    padding-top: 68px;
    padding-bottom: 8px;
    border-radius: 10px;
    max-height: calc(100vh - 200px);
    overflow: auto;
    border: 1px solid var(--color-border);
    border-top: 0;
    position: absolute;
    top: 0;
    left: 0;
    background: var(--color-block-bg);
    z-index: 1;
    width: 100%;
    box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  }

  &__result {
    // margin-bottom: 4px;
  }
}

.discover-search-result {
  padding: 4px 16px;
  cursor: pointer;
  transition: 0.3s;
  // background: var(--color-secondary);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  &:hover {
    background: var(--bg-block-hover);
  }

  &__image {
    border-radius: 10px;
    margin-right: 16px;
    height: 56px;
    width: 56px;
  }
}
</style>
