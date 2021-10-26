<template>
  <header class="header">
    <div class="header__wrapper container">
      <a href="#" class="header__burger button">
        <svg-icon name="menu" />
      </a>
      <router-link class="header__logo" :to="{name: 'home'}"
        >Discasst</router-link
      >

      <ul class="header__nav nav">
        <li class="nav__item">
          <router-link
            :to="{name: 'feed'}"
            class="nav__item-link button"
            active-class="button_active"
            >{{ $t('header.feed') }}</router-link
          >
        </li>
        <li class="nav__item">
          <router-link
            :to="{name: 'register'}"
            class="nav__item-link button"
            active-class="button_active"
            >{{ $t('header.podcasts') }}</router-link
          >
        </li>
      </ul>

      <ul class="header__user-menu nav">
        <template v-if="isAnonymus">
          <li class="nav__item">
            <router-link :to="{name: 'login'}" class="nav__item-link button">{{
              $t('header.login')
            }}</router-link>
          </li>
        </template>
        <template v-if="isLoggedIn">
          <li class="nav__item">
            <router-link
              :to="{name: 'home'}"
              class="nav__item-link button"
              active-class="button_active"
              >{{ $t('header.createArticle') }}</router-link
            >
          </li>
        </template>
        <li class="nav__item">
          <router-link
            :to="{name: 'search'}"
            active-class="button_active"
            class="nav__item-link button"
          >
            <svg-icon name="search" />
          </router-link>
        </li>
        <li class="nav__item">
          <a class="nav__item-link button">
            <svg-icon name="notification" />
          </a>
        </li>
        <li class="nav__item" v-click-outside="hideUserSubMenu">
          <a
            class="nav__item-link button"
            :class="{button_active: userSubMenuVisible}"
            href="#"
            @click.prevent.stop="toggleUserSubMenu"
          >
            <user-icon />
          </a>
          <fade-transition>
            <div
              v-show="userSubMenuVisible"
              ref="usersubmenu"
              class="user-submenu"
            >
              <div v-if="isAnonymus" class="user-submenu__top">
                {{ $t('header.anonymus') }}
              </div>
              <div
                v-if="isLoggedIn"
                class="user-submenu__top"
                :class="{'user-submenu__top_logged': isLoggedIn}"
              >
                <user-icon />
                {{ currentUser.username }}
                <router-link
                  class="user-submenu__profile-link"
                  :to="{name: 'home'}"
                >
                </router-link>
              </div>

              <ul class="user-submenu__main">
                <template v-if="isLoggedIn">
                  <li class="user-submenu__item">
                    <router-link
                      class="user-submenu__item-link"
                      :to="{name: 'home'}"
                      >{{ $t('header.settings') }}</router-link
                    >
                  </li>
                  <li class="user-submenu__item">
                    <a
                      class="user-submenu__item-link"
                      href="?auth=logout"
                      @click="logout"
                      >{{ $t('header.logout') }}</a
                    >
                  </li></template
                >

                <template v-if="isAnonymus">
                  <li class="user-submenu__item">
                    <router-link
                      :to="{name: 'login'}"
                      class="user-submenu__item-link"
                      >{{ $t('header.login') }}</router-link
                    >
                  </li>
                  <li class="user-submenu__item">
                    <router-link
                      :to="{name: 'register'}"
                      class="user-submenu__item-link"
                      >{{ $t('header.register') }}</router-link
                    >
                  </li>
                  <!-- <li class="user-submenu__item">
                  <a
                    class="user-submenu__item-link"
                    href="?auth=register"
                    @click.prevent="openAuthPopup"
                    >{{ $t('header.register') }}</a
                  >
                </li> -->
                </template>
              </ul>
              <div class="user-submenu__bottom">
                <theme-switcher class="user-submenu__theme" />
                <lang-switcher class="user-submenu__lang" />
              </div>
            </div>
          </fade-transition>
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
import UserIcon from '@/components/ui/UserIcon.vue'
import FadeTransition from '@/components/ui/FadeTransition.vue'

export default {
  name: 'PdNavbar',
  components: {
    ThemeSwitcher,
    LangSwitcher,
    UserIcon,
    FadeTransition,
  },
  data() {
    return {
      userSubMenuVisible: false,
    }
  },
  mounted() {
    // console.log(this.$router.currentRoute.value.name)
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
      this.userSubMenuVisible = false
      this.$store.commit(authMutations.openAuthPopup)
    },
    logout() {
      this.userSubMenuVisible = false

      this.$store.dispatch(authActions.logout)
    },
  },
}
</script>

<style lang="scss">
.header {
  * {
    transition: 0.2s;
  }

  a {
    position: relative;
    &:active {
      bottom: -1px;
    }
  }

  &__burger {
    height: 100%;
    display: flex;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 12px;
    margin-right: 10px;
  }

  background: var(--color-header-bg);
  padding-top: 8px;
  padding-bottom: 12px;

  box-shadow: 0 2px 2px var(--color-light-shadow);
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
  }

  &__logo {
    font-family: 'Titillium Web', sans-serif;
    font-size: 2rem;
    padding-top: 0rem;
    margin-right: 46px;
    color: var(--accent);
    text-decoration: none;
    position: relative;
    &:hover {
      text-decoration: none;
    }

    &:active {
      bottom: -1px;
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
  padding: 0;
  &__item {
    display: flex;
    position: relative;
    margin-right: 4px;

    &-link {
      height: 100%;
    }
  }
}

.user-submenu {
  position: absolute;
  background: var(--color-header-bg-submenu);
  border: 1px solid var(--color-border);
  border-top: 0;
  max-width: 400px;
  width: 290px;
  right: 10px;
  top: calc(100% + 24px);
  display: flex;
  flex-direction: column;
  border-radius: 10px;

  box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
  a {
    color: var(--color-text-secondary);
    text-decoration: none;
  }

  &__top {
    border-bottom: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 32px;
    font-weight: 600;
    position: relative;
    // &:before,
    &:after {
      content: '\A';
      position: absolute;
      background: var(--color-header-bg-submenu);
      transform: rotate(45deg);
      width: 12px;
      height: 12px;
      right: 8px;
      top: -6px;
      transition: 0.2s;
    }
    &:before {
      // box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
      z-index: -1;
    }

    .user-icon {
      width: 30px;
      margin-right: 10px;
    }

    &_logged {
      padding: 0 24px;

      &:hover {
        background: var(--bg-menu-item-hover);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        &:after {
          background: var(--bg-menu-item-hover);
        }
      }
    }
  }

  &__profile-link {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  &__profile {
    font-size: 12px;
  }

  &__main {
    flex: auto;
    padding: 0;
  }

  &__item {
    display: flex;
    &-link {
      padding: 16px 32px;
      flex: auto;
      &:hover {
        background: var(--bg-menu-item-hover);
        text-shadow: 0 0 1px var(--color-text-secondary);
      }
    }
  }

  &__bottom {
    display: flex;
    border-top: 1px solid var(--color-border);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;
  }

  &__theme {
    border-right: 1px solid var(--color-border);
  }

  &__theme,
  &__lang {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    color: var(--color-text-secondary);
    text-decoration: none;
    padding: 8px 14px;
    flex: auto;
    text-align: center;
    font-size: 14px;

    &:hover {
      background: var(--bg-menu-item-hover);
    }

    .icon {
      margin-right: 8px;
    }
  }
}
</style>
