<template>
  <header :class="{hide: !isHeaderVisible && !isModalOpen}" class="header">
    <div class="header__wrapper container">
      <div class="header__left" v-click-outside="closeMenu">
        <a href="#" class="header__burger" @click="toggleMenu">
          <fade-transition>
            <svg-icon
              style="position: absolute"
              v-if="!isMenuActive"
              name="menu"
            />
          </fade-transition>
          <fade-transition>
            <svg-icon
              style="position: absolute"
              v-if="isMenuActive"
              name="close"
            />
          </fade-transition>
        </a>

        <router-link
          @click="closeMenu"
          class="header__logo"
          :to="{name: 'home'}"
          >Discasst</router-link
        >
        <slide-right-transition>
          <ul
            class="header__main-nav main-nav"
            :class="{'main-nav_active': isMenuActive}"
          >
            <!-- <div v-if="isMenuActive" class="header__side-menu-bg"></div> -->
            <div class="main-nav__left">
              <li class="main-nav__item">
                <router-link
                  v-ripple
                  :to="{name: 'episodes'}"
                  class="main-nav__item-link button"
                  @click="closeMenu"
                  active-class="button_active"
                  >{{ $t('header.feed') }}</router-link
                >
              </li>
              <li class="main-nav__item">
                <router-link
                  v-ripple
                  :to="{name: 'podcasts'}"
                  class="main-nav__item-link button"
                  @click="closeMenu"
                  active-class="button_active"
                  >{{ $t('header.podcasts') }}</router-link
                >
              </li>
            </div>
            <div class="main-nav__right">
              <li class="main-nav__item">
                <router-link
                  :to="{name: 'add-podcast'}"
                  class="main-nav__item-link button"
                  active-class="button_active"
                  >{{ $t('header.addPodcast') }}</router-link
                >
              </li>
            </div>
          </ul>
        </slide-right-transition>
      </div>
      <ul class="header__user-menu nav">
        <template v-if="isAnonymus"> </template>
        <template v-if="isLoggedIn"> </template>
        <li class="nav__item">
          <router-link
            v-ripple
            :to="{name: 'search'}"
            active-class="button_active"
            class="nav__item-link button"
          >
            <svg-icon name="search" />
          </router-link>
        </li>
        <pd-notifications class="nav__item" />

        <li class="nav__item" v-click-outside="hideUserSubMenu">
          <a
            v-ripple
            class="nav__item-link button"
            :class="{
              button_active: userSubMenuVisible,
            }"
            href="#"
            @click.prevent="toggleUserSubMenu"
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
                <span class="user-submenu__top-arrow"></span>

                {{ $t('header.anonymus') }}
              </div>
              <div
                v-if="isLoggedIn"
                class="user-submenu__top"
                :class="{'user-submenu__top_logged': isLoggedIn}"
              >
                <span class="user-submenu__top-arrow"></span>

                <user-icon />
                {{ cutString(currentUser.username, 21) }}
                <router-link
                  class="user-submenu__profile-link"
                  @click="closeUserSubMenu"
                  :to="{name: 'profile'}"
                >
                </router-link>
                <span class="user-submenu__arrow-right" v-ripple
                  ><svg-icon name="arrow-right"
                /></span>
              </div>

              <ul class="user-submenu__main">
                <pd-loader v-if="isLoading" />

                <template v-if="isLoggedIn">
                  <li class="user-submenu__item">
                    <router-link
                      class="user-submenu__item-link"
                      @click="closeUserSubMenu"
                      :to="{name: 'settings'}"
                      >{{ $t('header.settings') }}</router-link
                    >
                  </li>
                  <li class="user-submenu__item">
                    <a
                      class="user-submenu__item-link"
                      href="?auth=logout"
                      @click.prevent="logout"
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
                </template>
              </ul>
              <div class="user-submenu__bottom">
                <theme-switcher v-ripple class="user-submenu__theme" />
                <lang-switcher v-ripple class="user-submenu__lang" />
              </div>
            </div>
          </fade-transition>
        </li>
      </ul>
    </div>
    <pd-popup type="confirmation" ref="logoutConfirmation">
      <template v-slot:header>
        {{ $t('logout.confirmationHeader') }}
      </template>
      {{ $t('logout.confirmation') }}
    </pd-popup>
  </header>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import {authGetters, authActions} from '@/store/modules/auth'
import LangSwitcher from '@/components/LangSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import PdNotifications from '@/components/PdNotifications.vue'
import PdPopup from '@/components/popups/PdPopup.vue'
import UserIcon from '@/components/ui/UserIcon.vue'
import FadeTransition from '@/components/animations/FadeTransition.vue'
import SlideRightTransition from '@/components/animations/SlideRightTransition.vue'
import PdLoader from '@/components/ui/PdLoader'
import SvgIcon from './SvgIcon.vue'
export default {
  name: 'PdNavbar',
  components: {
    ThemeSwitcher,
    LangSwitcher,
    UserIcon,
    FadeTransition,
    PdPopup,
    SlideRightTransition,
    PdNotifications,
    PdLoader,
    SvgIcon,
  },
  data() {
    return {
      userSubMenuVisible: false,
      isMenuActive: false,
      isHeaderVisible: true,
      scrollBefore: 0,
    }
  },
  mounted() {
    document.addEventListener('swiped-right', (e) => {
      if (!e.target.closest('.notifications') && !e.target.closest('.zPlayer'))
        this.toggleMenu()
    })

    document.addEventListener('mousewheel', this.wheelHandler)
  },
  unmounted() {
    document.removeEventListener('mousewheel', this.wheelHandler)
  },
  computed: {
    ...mapState({
      theme: (state) => state.theme.theme,
      isLoading: (state) => state.auth.isLoading,
      isModalOpen: (state) => state.zPlayer.isModalOpen,
    }),
    ...mapGetters({
      currentUser: authGetters.currentUser,
      isLoggedIn: authGetters.isLoggedIn,
      isAnonymus: authGetters.isAnonymus,
    }),
  },
  methods: {
    cutString(string, lettersNumber) {
      if (string.length > lettersNumber) {
        return string.slice(0, lettersNumber) + '...'
      }

      return string
    },

    hideUserSubMenu() {
      this.userSubMenuVisible = false
    },
    toggleUserSubMenu() {
      this.userSubMenuVisible = !this.userSubMenuVisible
    },
    closeUserSubMenu() {
      this.userSubMenuVisible = false
    },
    toggleMenu() {
      this.isMenuActive = !this.isMenuActive
    },
    closeMenu() {
      this.isMenuActive = false
    },
    openMenu() {
      this.isMenuActive = true
    },
    wheelHandler(event) {
      if (event && event.wheelDelta) {
        if (event.wheelDelta >= 0) {
          this.isHeaderVisible = true
        }
        if (event.wheelDelta < 0) {
          this.isHeaderVisible = false
        }
      }
    },

    async logout() {
      this.userSubMenuVisible = false

      const isConfirm = await this.$refs.logoutConfirmation.open()

      if (isConfirm) {
        this.$store.dispatch(authActions.logout)

        this.$router.push({name: 'home'})
      }
    },
  },
}
</script>

<style lang="scss" >
@import '@/assets/scss/_mixins.scss';

.main-nav,
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

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__left,
  &__right {
    display: flex;
    align-items: center;
    height: 100%;
    @include _768 {
      flex-direction: column;
      align-items: flex-start;
      height: auto;
      width: 100%;
    }
  }
  &__left {
    @include _768 {
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 24px;
      padding-bottom: 16px;
    }
  }
  &__right {
    margin-right: 8px;
    @include _768 {
      margin-right: 0;
    }
  }

  &__item {
    height: 100%;
    @include _768 {
      width: 100%;
      margin-bottom: 16px;
      height: 36px;
    }

    &-link {
      @include _768 {
        width: 100%;
        padding: 4px 16px;
      }
    }
  }

  @include _768 {
    width: 280px;
    z-index: 99;
    flex: auto;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    position: fixed;
    top: 0px;
    margin: 0;
    left: -100%;
    bottom: 0;
    background: var(--color-header-bg);
    padding: 80px 30px;
    box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}

.header {
  transition: 0.4s;

  * {
    transition: 0.2s;
  }

  &__left {
    display: flex;
    align-items: center;
    height: 100%;
    flex: auto;
  }

  &__burger {
    display: none;

    @include _768 {
      height: 100%;
      display: flex;
      align-items: center;
      position: absolute;
      z-index: 99999;
      padding: 12px 16px 8px 0;
      width: 24px;
    }

    .icon {
      width: 24px;
    }
  }

  // &__side-menu-bg {
  //   position: fixed;
  //   top: 0;
  //   bottom: 0;
  //   left: 280px;
  //   right: 0;
  //   background: rgba(0, 0, 0, 0.411);
  //   z-index: -1;
  //   transition: 0.6s;
  // }

  background: var(--color-header-bg);
  padding-top: 8px;
  padding-bottom: 10px;

  box-shadow: 0 2px 2px var(--color-light-shadow);
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 36px;
  }

  &__logo {
    font-family: 'Titillium Web', sans-serif;
    font-size: 28px;
    padding-top: 0;
    margin-right: 84px;
    color: var(--color-accent);
    text-decoration: none;
    position: relative;
    flex: auto;
    max-width: fit-content;
    z-index: 9999;
    &:hover {
      text-decoration: none;
    }

    &:active {
      bottom: -1px;
    }

    @include _768 {
      font-size: 24px;
      margin-right: 16px;
    }
  }

  &__nav {
    flex: auto;
  }

  &__user-menu {
    display: flex;
  }

  &__main-nav {
    flex: auto;
  }

  a:not(.user-submenu__profile-link) {
    position: relative;
    &:active {
      bottom: -1px;
    }
  }
}

.main-nav {
  &_active {
    left: 0;
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
    white-space: nowrap;
    font-weight: 600;
    position: relative;
    // overflow: hidden;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    .user-icon {
      width: 30px;
      margin-right: 16px;
    }

    &_logged {
      padding: 0 32px 0 16px;
      &:hover {
        background: var(--bg-menu-item-hover);

        .user-submenu__top-arrow {
          background: var(--bg-menu-item-hover);
        }
      }
    }
  }

  &__top-arrow {
    position: absolute;
    background: var(--color-header-bg-submenu);
    transform: rotate(45deg);
    width: 12px;
    height: 12px;
    right: 7px;
    top: -6px;
    transition: 0.2s;
    border-left: 1px solid var(--color-border);
    border-top: 1px solid var(--color-border);
    border-radius: 2px;
  }

  &__arrow-right {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }

  &__profile-link {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
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
    width: 50%;
    &:hover {
      background: var(--bg-menu-item-hover);
    }
  }
}

.hide {
  top: -52px !important;
}
</style>
