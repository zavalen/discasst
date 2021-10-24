<template>
  <div class="container">
    <login-form />
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm'

export default {
  name: 'PdLogin',
  components: {LoginForm},
}
</script>
