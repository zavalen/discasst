<template>
  <div class="auth-page">
    <h2>{{ $t('login.header') }}</h2>

    <pd-validation-errors
      v-if="validationErrors"
      :validation-errors="validationErrors"
    />

    <form
      @submit.prevent="onSubmit"
      class="ng-pristine ng-valid ng-valid-email"
    >
      <fieldset>
        <fieldset class="form-group">
          <input
            class="form-control form-control-lg"
            :placeholder="$t('email')"
            type="email"
            v-model="email"
          />
        </fieldset>

        <fieldset class="form-group">
          <input
            class="form-control form-control-lg"
            type="password"
            :placeholder="$t('password')"
            v-model="password"
          />
        </fieldset>

        <button
          :disabled="isSubmitting"
          class="btn btn-lg btn-primary pull-xs-right"
          type="submit"
        >
          {{ $t('login.button') }}
        </button>
      </fieldset>
    </form>
  </div>
</template>

<script>
import PdValidationErrors from '@/components/ValidationErrors'
import {authActions} from '@/store/modules/auth'
import {mapState} from 'vuex'

export default {
  name: 'LoginForm',
  components: {PdValidationErrors},
  data() {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapState({
      isSubmitting: state => state.auth.isSubmitting,
      validationErrors: state => state.auth.validationErrors
    })
  },
  mounted() {
    this.$router.push('?auth=login')
    // this.logout()
  },
  unmounted() {
    this.$router.push('?')
  },
  methods: {
    logout() {
      this.$store.dispatch(authActions.logout)
    },
    onSubmit() {
      this.$store
        .dispatch(authActions.login, {
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push('?')
        })
    }
  }
}
</script>
