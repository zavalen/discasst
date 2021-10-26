<template>
  <div class="container">
    <div class="feed-container">
      <div class="feed">
        <div class="search-header">
          <form class="search" @submit.prevent="">
            <input
              type="text"
              v-model="search"
              class="search__input"
              :placeholder="$t('search.placeholder')"
              ref="searchInput"
            />

            <button type="submit" class="search__submit">
              <svg-icon name="search" />
            </button>
          </form>
        </div>
        <pd-feed :api-url="apiUrl" />
      </div>
      <div class="sidebar"></div>
    </div>
  </div>
</template>

<script>
import PdFeed from '@/components/PdFeed'
export default {
  name: 'PdSearch',
  components: {PdFeed},
  data() {
    return {
      search: '',
      apiUrl: '/articles',
    }
  },
  watch: {
    search(newVal) {
      this.$router.push({query: {s: newVal}})
    },
  },
  mounted() {
    this.$refs.searchInput.focus()
  },
}
</script>


<style lang="scss">
.feed-container {
  display: flex;
  max-width: 1128px;
  width: 100%;
  margin: 0 auto;
}

.feed {
  width: 768px;
}
.sidebar {
  margin-left: 60px;
  width: 300px;
  background: var(--color-post-bg);
}

.search-header {
  background: var(--color-post-bg);
  box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  margin: 30px 0;
  border-radius: 10px;
  padding: 20px;
}

.search {
  position: relative;
  &__input {
    padding: 10px 50px 10px 20px;
  }

  &__submit {
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    padding: 2px 16px;
  }
}
</style>