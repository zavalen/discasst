<template>
  <div class="container">
    <div class="feed-container">
      <div class="feed">
        <pd-feed :api-url="apiUrl" />
      </div>
      <div class="sidebar"></div>
    </div>
  </div>
</template>

<script>
import PdFeed from '@/components/PdFeed'
export default {
  name: 'PdGlobalFeed',
  components: {PdFeed},
  data() {
    return {
      apiUrl: '/articles'
    }
  }
}
</script>

<style lang="scss">
.feed-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 1128px;
  width: 100%;
  margin: 0 auto;
}

.feed {
  width: 768px;
}
.sidebar {
  margin-left: 60px;
  margin-top: 20px;
  border-radius: 10px;
  width: 300px;
  background: var(--color-header-bg);
  box-shadow: 0 2px 2px var(--color-light-shadow);
  margin-bottom: 32px;
}
</style>
