<template>
  <header class="header">
    <div class="header__wrapper container">
      <router-link class="header__logo" :to="{name: 'home'}"
        >Discasst</router-link
      >

      <ul class="header__nav nav">
        <li class="nav__item">
          <router-link
            :to="{name: 'feed'}"
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

      <ul class="header__user-menu nav">
        <template v-if="isAnonymus">
          <li class="nav__item">
            <a href="#" class="nav__item-link" @click.prevent="openAuthPopup">{{
              $t('header.login')
            }}</a>
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
                v-if="currentUser.image"
                style="width: 30px"
                :src="currentUser.image"
                :alt="currentUser.username"
                :title="currentUser.username"
              />
            </a>
          </li>
        </template>
        <li class="nav__item">
          <a class="nav__item-link"> <svg-icon name="notification" /> </a>
        </li>
        <li class="nav__item" v-click-outside="hideUserSubMenu">
          <a
            class="nav__item-link"
            href="#"
            @click.prevent.stop="toggleUserSubMenu"
          >
            <svg-icon name="user" />
          </a>
          <div
            v-show="userSubMenuVisible"
            ref="usersubmenu"
            class="user-submenu"
          >
            <ul>
              <li>
                <a href="?logout" @click="logout">{{ $t('header.logout') }}</a>
              </li>
              <li class="nav__item">
                <theme-switcher class="nav__item-link" />
              </li>
              <li class="nav__item">
                <lang-switcher class="nav__item-link" />
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import {authGetters, authActions, authMutations} from '@/store/modules/auth'
import LangSwitcher from '@/components/LangSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'

export default {
  name: 'PdNavbar',
  components: {
    ThemeSwitcher,
    LangSwitcher,
  },
  data() {
    return {
      userSubMenuVisible: false,
    }
  },

  computed: {
    ...mapState({
      theme: (state) => state.theme.theme,
    }),
    ...mapGetters({
      currentUser: authGetters.currentUser,
      isLoggedIn: authGetters.isLoggedIn,
      isAnonymus: authGetters.isAnonymus,
    }),
  },
  methods: {
    hideUserSubMenu() {
      this.userSubMenuVisible = false
    },
    toggleUserSubMenu() {
      this.userSubMenuVisible = !this.userSubMenuVisible
    },
    openAuthPopup() {
      this.$store.commit(authMutations.openAuthPopup)
    },
    logout() {
      this.$store.dispatch(authActions.logout)
    },
  },
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
    position: relative;
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

.user-submenu {
  position: absolute;
  background: var(--bg-header);
  border: 1px solid var(--border-color);
  box-shadow: 3px 5px 10px #0000001f;
  max-width: 400px;
  width: 256px;
  height: 100px;
  right: 0;
  top: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
</style>
