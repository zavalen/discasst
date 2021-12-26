<template>
  <div class="auth-page">
    <!-- <h2>{{ $t('register.header') }}</h2> -->

    <pd-validation-errors
      v-if="validationErrors"
      :validation-errors="validationErrors"
    />

    <form
      class="ng-pristine ng-valid ng-valid-email"
      @submit.prevent="onSubmit"
    >
      <div>
        <div class="form-group">
          <input
            ref="firstInput"
            v-model="username"
            class="form-control form-control-lg"
            type="text"
            :placeholder="$t('username')"
          >
        </div>

        <div class="form-group">
          <input
            v-model="email"
            class="form-control form-control-lg"
            placeholder="Email"
            type="email"
          >
        </div>

        <div class="form-group">
          <input
            v-model="password"
            class="form-control form-control-lg"
            type="password"
            :placeholder="$t('password')"
          >
        </div>

        <button
          :disabled="isSubmitting"
          class="button_primary"
          type="submit"
        >
          {{ $t('register.button') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import PdValidationErrors from '@/components/ValidationErrors'
import {authActions, authMutations} from '@/store/modules/auth'
import {mapState} from 'vuex'

export default {
  name: 'PdRegister',
  components: {PdValidationErrors},
  data() {
    return {
      username: '',
      email: '',
      password: '',
    }
  },
  computed: {
    ...mapState({
      isSubmitting: (state) => state.auth.isSubmitting,
      validationErrors: (state) => state.auth.validationErrors,
      theme: (state) => state.theme.theme,
      lang: (state) => state.lang.lang,
    }),
  },
  mounted() {
    this.$router.push('?auth=register')
    this.$store.commit(authMutations.resetErrors)
    this.$refs.firstInput.focus()
  },

  methods: {
    logout() {
      this.$store.dispatch(authActions.logout)
    },
    onSubmit() {
      this.$store
        .dispatch(authActions.register, {
          username: this.username,
          email: this.email,
          password: this.password,
          theme: this.theme,
          lang: this.lang,
        })
        .then(() => {
          this.$router.push('?')
        })
    },
  },
}
</script>
