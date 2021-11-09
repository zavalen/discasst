<template>
  <div class="home container">
    <div>Episode {{ $route.params.slug }}</div>
    <h1>{{ episodeId }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Episode',
  props: {
    episodeId: {
      type: String,
    },
  },
  components: {},
}
</script>
