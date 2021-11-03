<template>
  <div class="home container">
    <pd-podcasts-grid />
  </div>
</template>

<script>
import PdPodcastsGrid from '@/components/PdPodcastsGrid'
export default {
  name: 'Podcasts',
  components: {PdPodcastsGrid},
}
</script>
