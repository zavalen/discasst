<template>
  <header class="app_header header">
    <div class="header__wrapper container">
      <router-link class="header__logo" :to="{name: 'home'}"
        >Discasst</router-link
      >

      <ul
        show-authed="false"
        class="header__menu nav navbar-nav pull-xs-right"
        style="display: inherit"
      >
        <li class="nav-item">
          <router-link :to="{name: 'register'}" active-class="active">{{
            $t('header.feed')
          }}</router-link>
        </li>
        <li class="nav-item">
          <router-link :to="{name: 'register'}" active-class="active">{{
            $t('header.podcasts')
          }}</router-link>
        </li>
      </ul>

      <ul class="header__user-menu">
        <template v-if="!isLoggedIn">
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
      </ul>
      <div class="nav-item">
        <select v-model="$i18n.locale">
          <option>en</option>
          <option>ru</option>
        </select>
      </div>
      <a href="#" class="nav-item" @click.prevent="switchTheme">
        Переключить тему
      </a>
    </div>
  </header>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'PdNavbar',

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser,
      isLoggedIn: state => state.auth.isLoggedIn
    })
  },
  methods: {
    logout(e) {
      e.preventDefault()
      console.log('logout')
    },
    switchTheme() {
      let html = document.getElementsByTagName('html')[0]
      let theme = html.getAttribute('data-theme')

      html.setAttribute('data-theme', theme === 'light' ? 'dark' : 'light')
    }
  }
}
</script>

<style lang="scss">
.header {
  background: rgb(233, 233, 233);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
  }

  &__logo {
    font-family: 'Titillium Web', sans-serif;
    font-size: 1.5rem;
    padding-top: 0rem;
    margin-right: 2rem;
    color: #5cb85c;
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }

  &__menu {
    flex: auto;
  }

  &__user-menu {
    display: flex;
  }
}
</style>
