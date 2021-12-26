<template>
  <pd-popup
    v-if="isOpen"
    ref="authPopup"
  >
    <div class="authpopup__header">
      <router-link
        class="button"
        :class="{button_active: authComponent === 'LoginForm'}"
        :to="{
          query: {
            auth: 'login',
          },
        }"
      >
        {{ $t('header.login') }}
      </router-link>
      <router-link
        class="button"
        :class="{button_active: authComponent === 'RegisterForm'}"
        :to="{
          query: {
            auth: 'register',
          },
        }"
      >
        {{ $t('header.register') }}
      </router-link>
    </div>

    <component :is="authComponent" />
  </pd-popup>
</template>

<script>
import PdPopup from '@/components/popups/PdPopup'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import {mapState} from 'vuex'
import {nextTick} from 'vue'

export default {
  name: 'AuthPopup',
  components: {
    PdPopup,
    LoginForm,
    RegisterForm,
  },
  props: {
    authType: {
      type: String,
      required: false,
      default: null
    },
  },
  data() {
    return {
      authComponent: 'LoginForm',
      isOpen: false,
    }
  },
  computed: {
    ...mapState({
      isAuthPopupOpen: (state) => state.auth.isAuthPopupOpen,
    }),
  },

  watch: {
    $route(to) {
      if (to.query.auth === 'login' || to.query.auth === 'register') {
        this.authComponent = this.capitalizeFirstLetter(to.query.auth) + 'Form'
        this.isOpen = true
        this.open()
      } else {
        this.isOpen = false
      }
    },
  },
  methods: {
    async open() {
      await nextTick()
      const authPopup = this.$refs.authPopup
      await authPopup.open()
      this.isOpen = false
      this.$router.push({query: {}})
    },

    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
  },
}
</script>

<style lang="scss">
.authpopup__header {
  margin-bottom: 24px;
}
</style>
