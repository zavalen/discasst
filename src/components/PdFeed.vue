<template>
  <div>
    <div v-for="article in articles" :key="article.createdAt">
      <h2>{{ article.title }}</h2>
      <h4>{{ article.description }}</h4>
    </div>
  </div>
</template>

<script>
import {feedActions} from '@/store/modules/feed'
import {mapState} from 'vuex'

export default {
  name: 'PdFeed',
  props: {
    apiUrl: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState({
      articles: (state) => state.feed.data,
    }),
  },
  mounted() {
    this.$store.dispatch(feedActions.getFeed, this.apiUrl)
  },
}
</script>