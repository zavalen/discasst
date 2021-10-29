<template>
  <div class="auth-page">
    <h2>{{ $t('register.header') }}</h2>

    <pd-validation-errors
      v-if="validationErrors"
      :validation-errors="validationErrors"
    />

    <form
      @submit.prevent="onSubmit"
      class="ng-pristine ng-valid ng-valid-email"
    >
      <div>
        <div class="form-group">
          <input
            ref="firstInput"
            class="form-control form-control-lg"
            type="text"
            :placeholder="$t('username')"
            v-model="username"
          />
        </div>

        <div class="form-group">
          <input
            class="form-control form-control-lg"
            placeholder="Email"
            type="email"
            v-model="email"
          />
        </div>

        <div class="form-group">
          <input
            class="form-control form-control-lg"
            type="password"
            :placeholder="$t('password')"
            v-model="password"
          />
        </div>

        <button :disabled="isSubmitting" class="button_primary" type="submit">
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
      password: ''
    }
  },
  computed: {
    ...mapState({
      isSubmitting: state => state.auth.isSubmitting,
      validationErrors: state => state.auth.validationErrors,
      theme: state => state.theme.theme,
      lang: state => state.lang.lang
    })
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
          lang: this.lang
        })
        .then(() => {
          this.$router.push('?')
        })
    }
  }
}
</script>
