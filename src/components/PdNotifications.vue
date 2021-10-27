<template>
  <li v-click-outside="hideNotifications">
    <a class="nav__item-link button" @click="toggleNotifications">
      <svg-icon name="notification" />
      <span class="notifications-counter">1</span>
    </a>
    <fade-transition>
      <div
        v-show="isNotificationsOpen"
        ref="notifications"
        class="notifications"
      >
        <div v-if="isAnonymus" class="notifications__top">
          {{ $t('header.anonymus') }}
        </div>
        <div
          v-if="isLoggedIn"
          class="notifications__top"
          :class="{notifications__top_logged: isLoggedIn}"
        >
          <user-icon />
          {{ currentUser.username }}
          <router-link class="notifications__profile-link" :to="{name: 'home'}">
          </router-link>
        </div>
      </div>
    </fade-transition>
  </li>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import {authGetters} from '@/store/modules/auth'
import UserIcon from '@/components/ui/UserIcon.vue'
import FadeTransition from '@/components/animations/FadeTransition.vue'

export default {
  name: 'PdNavbar',
  components: {
    UserIcon,
    FadeTransition
  },
  data() {
    return {
      isNotificationsOpen: false,
      isMenuActive: false
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
    hideNotifications() {
      this.isNotificationsOpen = false
    },
    toggleNotifications() {
      this.isNotificationsOpen = !this.isNotificationsOpen
    }
  }
}
</script>

<style lang="scss">
.notifications {
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
  }
}

.notifications-counter {
  position: absolute;
  background: red;
  color: #fff;
  border-radius: 50%;
  font-size: 10px;
  bottom: 1px;
  right: 1px;
  height: 16px;
  width: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 2px var(--color-light-shadow);
}
</style>
