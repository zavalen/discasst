<template>
  <div v-click-outside="blur" class="discover-search" @click="focus">
    <form class="discover-search__form" @submit.prevent.stop>
      <svg-icon
        v-if="!isLoading"
        class="discover-search__submit"
        name="search"
      />
      <pd-loader v-if="isLoading" class="discover-search__loading" />
      <input
        ref="discoverSearch"
        v-model.trim="searchQuery"
        class="discover-search__input"
        placeholder="Умный поиск"
        type="text"
      />
      <button
        v-if="searchQuery.length"
        v-tooltip="'Очистить поиск'"
        class="discover-search__clear"
        @click.prevent.stop="clearSearch"
      >
        <svg-icon name="close" />
      </button>
    </form>

    <template v-if="focusing">
      <div class="discover-search__results scrollbar">
        <div v-if="searchQuery.length < 2" class="discover-search__message">
          Это поиск по всем подкастам в интернете. Если на Discasst нет
          подкаста, который вы ищете, то он появится после того, как вы его
          найдёте в поиске.
        </div>
        <div
          v-if="searchQuery.length > 2 && !searchResults.length"
          class="discover-search__message"
        >
          Ничего не найдено.
        </div>
        <div
          v-for="searchResult in searchResults"
          :key="searchResult.collectionId"
          class="discover-search__result discover-search-result"
          :class="{
            'discover-search-result_active': searchResult == selectedResult,
          }"
          @click="findOrAddPodcast(searchResult)"
        >
          <img
            v-lazy="searchResult.artworkUrl60"
            class="loading discover-search-result__image"
            alt=""
          />
          <div>{{ searchResult.collectionName }}</div>
        </div>
        <!-- <div v-if="errors">{{ errors }}</div> -->
      </div>
    </template>

    <!-- <h2 v-if="isLoading">ЗАГРУЗКА...</h2> -->
  </div>
</template>

<script>
import podcasts from '@/api/podcasts'
import PdLoader from '@/components/ui/PdLoader'

export default {
  name: 'DiscoverSearch',
  components: {PdLoader},
  props: {
    isActive: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  emits: ['found'],
  data() {
    return {
      isLoading: false,
      focusing: false,
      searchQuery: '',
      rss: '',
      errors: null,
      searchResults: null,
      selectedResult: null,
      selectedResultIndex: -1,
    }
  },

  watch: {
    async searchQuery(newVal) {
      this.errors = null
      if (newVal.length > 1) {
        if (
          newVal.startsWith('https://podcasts.apple.com/') ||
          newVal.startsWith('id')
        ) {
          this.getRssFromAppleById(newVal)
        } else if (this.isValidHttpUrl(newVal)) {
          this.getRssFromUrl(newVal)
        } else {
          if (window.waitForSearch) {
            clearTimeout(window.waitForSearch)
          }
          this.isLoading = true
          window.waitForSearch = setTimeout(() => {
            this.search(newVal)
          }, 800)
        }
      } else {
        this.searchResults = []
      }
    },
    // rss(newRss) {
    //   if (typeof newRss === 'object') {
    //     this.rss = this.searchQuery
    //   }
    //   if (typeof newRss === 'string') {
    //     this.findOrAddPodcast(newRss)
    //     this.selectedResultIndex = -1
    //     this.selectedResult = null
    //     document.activeElement.blur()
    //   }
    // },
  },
  mounted() {
    window.scrollTo({top: 0})
    document.addEventListener('keydown', (event) => {
      if (this.focusing && this.searchResults && this.searchResults.length) {
        if (event.code === 'ArrowDown') {
          this.selectedResultIndex++
          if (!this.searchResults[this.selectedResultIndex]) {
            this.selectedResultIndex = 0
          }
          this.selectedResult = this.searchResults[this.selectedResultIndex]
        }

        if (event.code === 'ArrowUp') {
          this.selectedResultIndex--
          if (!this.searchResults[this.selectedResultIndex]) {
            this.selectedResultIndex = this.searchResults.length - 1
          }
          this.selectedResult = this.searchResults[this.selectedResultIndex]
        }

        if (event.code === 'Enter') {
          if (this.selectedResult) {
            // this.rss = this.selectedResult.feedUrl
            this.findOrAddPodcast(this.selectedResult)
          }
        }
      }
    })

    if (this.isActive) {
      this.focusing = true
      this.$refs.discoverSearch.focus()
    }
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

        this.isLoading = false
        this.searchResults = data.results
        console.log(this.searchResults)
        this.isLoading = false
        return data.results
      } catch (error) {
        this.errors = 'Что-то пошло не так'
        this.isLoading = false
      }
    },
    async findOrAddPodcast(searchResult) {
      this.isLoading = true
      const rss = searchResult.feedUrl

      const podcastInfo = {
        rss: rss,
        appleInfo: searchResult,
      }
      const addedPodcast = await podcasts
        .findOrAddPodcast(podcastInfo)
        .then((response) => response.data)

      this.isLoading = false
      this.focusing = false
      this.searchQuery = ''

      this.$emit('found', true)
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
  padding: 20px 16px;
  background: var(--color-header-bg);
  // margin-top: 24px;
  border-radius: 10px;
  // border: 1px solid var(--color-border);
  position: relative;
  // min-width: 400px;
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
    padding: 12px 48px;
    background: var(--color-block-bg);
    border: 2px solid var(--color-border);
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
    display: block;
    padding: 0 12px;
    left: 2px;
    top: 50%;
    transform: translateY(-54%);
    opacity: 0.4;
    transition: 0.3;
  }
  &__loading {
    height: 24px;
    width: 24px;
    padding: 0px 12px;
  }

  &__clear {
    right: 2px;
    left: auto;
    &:hover {
      opacity: 1;
    }
  }

  &__results {
    padding-top: 84px;
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

  &__message {
    margin: 4px 16px;
    border: 1px solid var(--color-border);
    padding: 16px;
    border-radius: 10px;
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
  &_active,
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
