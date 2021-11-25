<template>
  <div class="home container">
    <div class="add-podcast">
      <form @submit.prevent="addPodcast">
        <input
          placeholder="RSS link or apple podcast link"
          type="text"
          v-model.trim="url"
        />
        <button type="submit">Добавить</button>
      </form>
      https://whyarewestillalive.libsyn.com/rss
      <br />
      https://meduza.io/rss2/podcasts/meduza-v-kurse
      <br />
      https://rss.art19.com/apology-line
      <br />
      https://feeds.simplecast.com/54nAGcIl
      <br />
      https://feeds.fireside.fm/bibleinayear/rss
      <br />
      https://feeds.megaphone.fm/ADL9840290619
      <br />
      https://podster.fm/rss.xml?pid=48291
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
      url: '',
      errors: null,
    }
  },
  methods: {
    async addPodcast() {
      this.isLoading = true
      if (
        this.url.startsWith('https://podcasts.apple.com/') ||
        this.url.startsWith('id')
      ) {
        let match = this.url.match(/id(\d+)/)
        let podID
        if (match) {
          podID = match[1]
        } else {
          podID = this.url.match(/\d+/)
        }

        if (!podID) {
          this.errors = 'Не удалось найти ID подкаста'
        }

        try {
          const data = await fetch(
            `https://itunes.apple.com/lookup?id=${parseInt(
              podID
            )}&entity=podcast`,
            {cors: 'no-cors'}
          ).then((response) => {
            return response.json()
          })

          if (data.results.length) {
            this.url = data.results[0].feedUrl
          } else {
            this.errors = 'Нет подкаста с таким ID'
          }
        } catch (error) {
          this.errors = 'Что-то пошло не так'
        }
      }
      const addedPodcast = await podcasts
        .addPodcast(this.url)
        .then((response) => response.data)

      this.$router.push({
        name: 'podcast',
        params: {podcastSlug: addedPodcast.slug},
      })
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
