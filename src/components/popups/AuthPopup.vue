<template>
  <pd-popup v-if="isAuthPopupOpen" ref="authPopup">
    <button @click="authComponent = 'LoginForm'">Login</button>
    <button @click="authComponent = 'RegisterForm'">Register</button>
    <component :is="authComponent" />
  </pd-popup>
</template>

<script>
import PdPopup from '@/components/popups/PdPopup'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import {authMutations} from '@/store/modules/auth'
import {mapState} from 'vuex'
import {nextTick} from 'vue'

export default {
  name: 'AuthPopup',
  props: {
    authType: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      authComponent: 'LoginForm'
    }
  },
  components: {
    PdPopup,
    LoginForm,
    RegisterForm
  },
  computed: {
    ...mapState({
      isAuthPopupOpen: state => state.auth.isAuthPopupOpen
    })
  },
  mounted() {
    this.detectAuthUrlParam()
    window.addEventListener('popstate', this.detectAuthUrlParam())
  },
  watch: {
    isAuthPopupOpen(newVal) {
      if (newVal) {
        this.open()
      }
    }
  },
  methods: {
    async open() {
      await nextTick()
      const authPopup = this.$refs.authPopup
      await authPopup.open()

      this.close()
    },
    close() {
      this.$store.commit(authMutations.closeAuthPopup)
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    detectAuthUrlParam() {
      const location = new URL(window.location.href)
      var auth = location.searchParams.get('auth')
      if (!auth) {
        return
      }
      if (auth === 'login' || auth === 'register') {
        this.authComponent = this.capitalizeFirstLetter(auth) + 'Form'
        this.$store.commit(authMutations.openAuthPopup)
      }
    }
  },
  unmounted() {
    window.removeEventListener('popstate', this.detectAuthUrlParam())
  }
}
</script>
