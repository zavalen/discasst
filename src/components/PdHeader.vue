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
            <a
              href="?auth=login"
              @click.prevent="openAuthPopup"
              class="nav__item-link"
              >{{ $t('header.login') }}</a
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
        </template>
        <li class="nav__item">
          <a class="nav__item-link"> <svg-icon name="notification" /> </a>
        </li>
        <li class="nav__item" v-click-outside="hideUserSubMenu">
          <a
            class="nav__item-link"
            :class="{'nav__item-link_active': userSubMenuVisible}"
            href="#"
            @click.prevent.stop="toggleUserSubMenu"
          >
            <user-icon />
          </a>
          <div
            v-show="userSubMenuVisible"
            ref="usersubmenu"
            class="user-submenu"
          >
            <div v-if="isAnonymus" class="user-submenu__top">
              <user-icon />
              {{ $t('header.anonymus') }}
            </div>
            <router-link v-if="isLoggedIn" :to="{name: 'home'}">
              <div class="user-submenu__top">
                <user-icon />
                {{ currentUser ? currentUser.username : $t('header.anonymus') }}
              </div>
            </router-link>
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
                  <a
                    class="user-submenu__item-link"
                    href="?auth=login"
                    @click.prevent="openAuthPopup"
                    >{{ $t('header.login') }}</a
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
import UserIcon from '@/components/UserIcon.vue'

export default {
  name: 'PdNavbar',
  components: {
    ThemeSwitcher,
    LangSwitcher,
    UserIcon
  },
  data() {
    return {
      userSubMenuVisible: false
    }
  },

  computed: {
    ...mapState({
      theme: state => state.theme.theme
    }),
    ...mapGetters({
      currentUser: authGetters.currentUser,
      isLoggedIn: authGetters.isLoggedIn,
      isAnonymus: authGetters.isAnonymus
    })
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
      this.userSubMenuVisible = false
    },
    logout() {
      this.$store.dispatch(authActions.logout)
    }
  }
}
</script>

<style lang="scss">
.header {
  * {
    transition: 0.2s;
  }

  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0px 0.3px 0.8px rgba(0, 0, 0, 0.008),
    0px 0.9px 2.7px rgba(0, 0, 0, 0.012), 0px 4px 12px rgba(0, 0, 0, 0.02);
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
  background: var(--bg-header-submenu);
  // border: 1px solid var(--border-color);
  border-top: 0;
  max-width: 400px;
  width: 300px;
  right: 0;
  top: calc(100% + 10px);
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0.3px 0.3px 0.3px -6px rgba(0, 0, 0, 0.011),
    0.7px 0.7px 0.8px -6px rgba(0, 0, 0, 0.016),
    1.3px 1.3px 1.5px -6px rgba(0, 0, 0, 0.02),
    2.2px 2.2px 2.7px -6px rgba(0, 0, 0, 0.024),
    4.2px 4.2px 5px -6px rgba(0, 0, 0, 0.029),
    10px 10px 12px -6px rgba(0, 0, 0, 0.04);

  a {
    color: var(--text-color);
    text-decoration: none;
  }

  &__top {
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0 24px;

    &:before {
      content: '\A';
      border-style: solid;
      border-width: 0 8px 8px 8px;
      border-color: transparent transparent var(--bg-header-submenu) transparent;
      position: absolute;
      right: 14px;
      top: -8px;
    }

    &:hover {
      background: var(--bg-menu-item-hover);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      &:before {
        border-color: transparent transparent var(--bg-menu-item-hover)
          transparent;
      }
    }

    .user-icon {
      width: 30px;
      margin-right: 10px;
    }
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
        text-shadow: 0 0 1px var(--text-color);
      }
    }
  }

  &__bottom {
    display: flex;
    border-top: 1px solid var(--border-color);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;
  }

  &__theme {
    border-right: 1px solid var(--border-color);
  }

  &__theme,
  &__lang {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    color: var(--text-color);
    text-decoration: none;
    padding: 12px 14px;
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
