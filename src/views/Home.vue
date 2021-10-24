<template>
  <div class="home container">{{ $t('message') }}</div>
  <global-feed />
</template>

<script>
import GlobalFeed from '@/views/GlobalFeed'
export default {
  name: 'Home',
  components: {
    GlobalFeed,
  },
}
</script>
