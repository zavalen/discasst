<template>
  <div class="auth-wrapper">
    <!-- <h2 class="auth-wrapper__header">{{ $t('login.header') }}</h2> -->

    <pd-validation-errors
      v-if="validationErrors"
      :validation-errors="validationErrors"
    />

    <form class="auth-wrapper_form auth-form" @submit.prevent="onSubmit">
      <div>
        <div>
          <input
            :placeholder="$t('email')"
            type="email"
            v-model="email"
            ref="firstInput"
          />
        </div>

        <div>
          <input
            type="password"
            :placeholder="$t('password')"
            v-model="password"
          />
        </div>

        <button :disabled="isSubmitting" class="button_primary" type="submit">
          {{ $t('login.button') }}
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
  name: 'LoginForm',
  components: {PdValidationErrors},
  data() {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    ...mapState({
      isSubmitting: (state) => state.auth.isSubmitting,
      validationErrors: (state) => state.auth.validationErrors,
    }),
  },
  mounted() {
    this.$router.push({query: {auth: 'login'}})
    this.$store.commit(authMutations.resetErrors)
    window.addEventListener('keydown', this.keyController)
    this.$refs.firstInput.focus()
  },

  methods: {
    logout() {
      this.$store.dispatch(authActions.logout)
    },
    onSubmit() {
      this.$store
        .dispatch(authActions.login, {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push({query: {}})
        })
    },
    keyController(e) {
      if (e.key === 'Enter') {
        this.onSubmit()
      }
    },
  },
}
</script>
