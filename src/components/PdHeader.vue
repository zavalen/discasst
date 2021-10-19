<template>
  <header class="header">
    <div class="header__wrapper container">
      <a class="header__logo" href="/">Discasst</a>
      <ul
        show-authed="false"
        class="nav navbar-nav pull-xs-right"
        style="display: inherit"
      >
        <template v-if="!isLoggedIn">
          <li class="nav-item">
            <router-link :to="{name: 'home'}" active-class="active" exact>{{
              $t('header.home')
            }}</router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{name: 'register'}" active-class="active">{{
              $t('header.register')
            }}</router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{name: 'login'}" active-class="active">
              {{ $t('header.login') }}</router-link
            >
          </li>
        </template>
        <template v-if="isLoggedIn">
          <li class="nav-item">
            <router-link :to="{name: 'home'}" active-class="active">{{
              $t('header.home')
            }}</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'home'}" active-class="active">{{
              $t('header.createArticle')
            }}</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'home'}" active-class="active">{{
              $t('header.settings')
            }}</router-link>
          </li>

          <li class="nav-item">
            <a href="#" @click="logout(e)"> {{ $t('header.logout') }}</a>
          </li>
        </template>
        <li class="nav-item">
          <select v-model="$i18n.locale">
            <option>en</option>
            <option>ru</option>
          </select>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'PdNavbar',
  computed: {
    ...mapState({
      currentUser: (state) => state.auth.currentUser,
      isLoggedIn: (state) => state.auth.isLoggedIn,
    }),
  },
  methods: {
    logout(e) {
      e.preventDefault()
      console.log('logout')
    },
  },
}
</script>

<style lang="scss">
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.active {
      color: #42b983;
    }
  }
}
</style>