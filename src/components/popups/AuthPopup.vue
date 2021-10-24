<template>
  <pd-popup ref="authPopup">
    <button @click="authComponent = 'LoginForm'">Login</button>
    <button @click="authComponent = 'RegisterForm'">Register</button>
    <component :is="authComponent" />
  </pd-popup>
</template>

<script>
import PdPopup from '@/components/PdPopup'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import {authMutations} from '@/store/modules/auth'

export default {
  name: 'AuthPopup',
  props: {
    authType: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      authComponent: this.authType
        ? this.capitalizeFirstLetter(this.authType) + 'Form'
        : 'LoginForm',
    }
  },
  components: {
    PdPopup,
    LoginForm,
    RegisterForm,
  },
  async mounted() {
    await this.open()
    this.close()
  },
  methods: {
    async open() {
      const authPopup = this.$refs.authPopup
      await authPopup.open()
    },
    close() {
      this.$store.commit(authMutations.closeAuthPopup)
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
  },
  unmounted() {},
}
</script>