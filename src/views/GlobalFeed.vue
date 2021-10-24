<template>
  <div class="container">
    <pd-feed :api-url="apiUrl" />
  </div>
</template>

<script>
import PdFeed from '@/components/PdFeed'
export default {
  name: 'PdGlobalFeed',
  components: {PdFeed},
  data() {
    return {
      apiUrl: '/articles',
    }
  },
}
</script>
