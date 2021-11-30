<template>
  <div class="home container">
    <discover-search />
    <pd-podcasts-grid />
  </div>
</template>

<script>
import PdPodcastsGrid from '@/components/PdPodcastsGrid'
import DiscoverSearch from '@/components/DiscoverSearch'
export default {
  name: 'Podcasts',
  components: {PdPodcastsGrid, DiscoverSearch},
  mounted() {
    window.scrollTo({top: 0})
  },
}
</script>
