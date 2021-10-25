<template>
  <div class="user-icon">
    <svg-icon
      v-if="!isLoggedIn || (currentUser && !currentUser.image)"
      name="user"
    />
    <img
      v-if="isLoggedIn && currentUser.image"
      :src="currentUser.image"
      :title="currentUser.username"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {authGetters} from '@/store/modules/auth'

export default {
  name: 'PdNavbar',

  data() {
    return {
      userSubMenuVisible: false
    }
  },

  computed: {
    ...mapGetters({
      currentUser: authGetters.currentUser,
      isLoggedIn: authGetters.isLoggedIn,
      isAnonymus: authGetters.isAnonymus
    })
  }
}
</script>

<style lang="scss">
.user-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
