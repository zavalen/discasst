<template>
  <div class="home container">
    <div>Episode {{ $route.params.slug }}</div>
    <h1 v-if="episodeId">{{ episodeId }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Episode',
  components: {},
  props: {
    episodeId: {
      type: String,
      default: null,
    },
  },
}
</script>
