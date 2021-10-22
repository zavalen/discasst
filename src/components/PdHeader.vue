<template>
  <header class="app__header header">
    <div class="header__wrapper container">
      <router-link class="header__logo" :to="{name: 'home'}"
        >Discasst</router-link
      >

      <ul class="header__nav nav">
        <li class="nav__item">
          <router-link
            :to="{name: 'login'}"
            class="nav__item-link"
            active-class="nav__item-link_active"
            >{{ $t('header.feed') }}</router-link
          >
        </li>
        <li class="nav__item">
          <router-link
            :to="{name: 'register'}"
            class="nav__item-link"
            active-class="nav__item-link_active"
            >{{ $t('header.podcasts') }}</router-link
          >
        </li>
      </ul>

      <ul class="header__user-menu">
        <li>
          <theme-switcher />
        </li>
        <template v-if="isAnonymus">
          <li class="nav__item">
            <a class="nav__item-link"> <svg-icon name="notification" /> </a>
          </li>
          <li class="nav__item">
            <router-link
              :to="{name: 'login'}"
              class="nav__item-link"
              active-class="nav__item-link_active"
            >
              <svg-icon name="user" />
              {{ $t('header.login') }}</router-link
            >
          </li>
        </template>
        <template v-if="isLoggedIn">
          <li class="nav__item">
            <router-link
              :to="{name: 'home'}"
              class="nav__item-link"
              active-class="nav__item-link_active"
              >{{ $t('header.createArticle') }}</router-link
            >
          </li>

          <li class="nav__item">
            <a href="#" style="display: flex">
              <img
                style="width: 30px"
                :src="currentUser.image"
                :alt="currentUser.username"
                :title="currentUser.username"/>
              <svg-icon style="transform: rotate(90deg)" name="play"
            /></a>
          </li>
        </template>
      </ul>
    </div>
  </header>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import {getterTypes, mutationTypes as mutationAuth} from '@/store/modules/auth'
import ThemeSwitcher from './ThemeSwitcher.vue'

export default {
  name: 'PdNavbar',
  components: {
    ThemeSwitcher
  },
  computed: {
    ...mapState({
      theme: state => state.theme.theme
    }),
    ...mapGetters({
      currentUser: getterTypes.currentUser,
      isLoggedIn: getterTypes.isLoggedIn,
      isAnonymus: getterTypes.isAnonymus
    })
  },
  methods: {
    logout() {
      this.$store.commit(mutationAuth.logout)
    }
  }
}
</script>

<style lang="scss">
.header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 54px;
  }

  &__logo {
    font-family: 'Titillium Web', sans-serif;
    font-size: 1.5rem;
    padding-top: 0rem;
    margin-right: 2rem;
    color: var(--accent);
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }

  &__nav {
    flex: auto;
  }

  &__user-menu {
    display: flex;
  }
}

.nav {
  height: 100%;
  display: flex;

  &__item {
    display: flex;
    &-link {
      height: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 10px;
      text-decoration: none;
      color: var(--text-color);
      text-shadow: 0 0 1px var(--text-color);
      border-right: 1px solid transparent;
      border-left: 1px solid transparent;

      &_active,
      &:active,
      &:hover {
        background-color: var(--bg-menu-item-hover);
        border-color: var(--border-color);
      }
    }
  }
}
</style>
