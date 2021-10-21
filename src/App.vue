<template>
  <pd-header> </pd-header>
  <main class="app__main">
    <router-view />
  </main>
  <footer class="app__footer"></footer>
</template>

<script>
import PdHeader from '@/components/PdHeader'

export default {
  name: 'app',
  components: {
    PdHeader,
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
