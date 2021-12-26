<template>
  <div class="home container">
    {{ $t('message') }}
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {authGetters} from '@/store/modules/auth'

export default {
  name: 'Home',
  components: {},
  computed: {
    ...mapGetters({
      isAnonymus: authGetters.isAnonymus
    })
  },
  mounted() {
    if (this.isAnonymus) {
      this.$router.push({name: 'home'})
    }
  }
}
</script>
