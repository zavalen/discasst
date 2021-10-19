<template>
  <pd-header> </pd-header>
  <main class="container">
    <router-view />
  </main>
  <footer></footer>
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: rgb(233, 233, 233);
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
  }

  &__logo {
    font-family: 'Titillium Web', sans-serif;
    font-size: 1.5rem !important;
    padding-top: 0rem !important;
    margin-right: 2rem !important;
    color: #5cb85c !important;
  }
}

main {
  flex: auto;
}

footer {
  background: #2c3e50;
  min-height: 100px;
}

.container {
  max-width: 1140px;
  width: 100%;
  padding: 0 20px;
}
</style>
