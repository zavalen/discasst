<template>
  <div class="auth-page container">
    <h1>{{ $t('login.header') }}</h1>
    <p>
      {{ $t('login.subHeader') }}
      <router-link :to="{name: 'register'}">
        {{ $t('login.subHeaderLink') }}.</router-link
      >
    </p>
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
import {actionTypes, mutationTypes} from '@/store/modules/auth'
import {mapState} from 'vuex'

export default {
  name: 'PdLogin',
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
    this.resetErrors()
  },
  methods: {
    resetErrors() {
      this.$store.commit(mutationTypes.resetErrors)
    },
    onSubmit() {
      this.$store
        .dispatch(actionTypes.login, {
          email: this.email,
          password: this.password,
        })
        .then((user) => {
          console.log('successfully register', user)
          this.$router.push({name: 'home'})
        })
    },
  },
}
</script>
