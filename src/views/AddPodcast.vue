<template>
  <div class="home container">
    <div class="add-podcast">
      <form @submit.prevent="addPodcast">
        <input placeholder="RSS" type="text" v-model="rss" />
        <button type="submit">Добавить</button>
      </form>
      <h2 v-if="isLoading">ЗАГРУЗКА...</h2>
      <div v-if="errors">{{ errors }}</div>
    </div>
  </div>
</template>

<script>
import podcasts from '@/api/podcasts'
export default {
  name: 'AddPodcast',
  data() {
    return {
      isLoading: false,
      rss: '',
      errors: null,
    }
  },
  methods: {
    async addPodcast() {
      this.isLoading = true

      const addedPodcast = await podcasts
        .addPodcast(this.rss)
        .then((response) => response.data)

      console.log(addedPodcast)
      this.$router.push({name: 'podcast', params: {slug: addedPodcast.slug}})
    },
  },
}
</script>

<style lang="scss">
.add-podcast {
  padding: 48px;
  background: var(--color-header-bg);
  max-width: 768px;
  margin: 80px auto;
}
</style>