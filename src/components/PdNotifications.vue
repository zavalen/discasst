<template>
  <li v-click-outside="hideNotifications">
    <a
      v-ripple
      class="nav__item-link button"
      :class="{button_active: isNotificationsOpen}"
      @click="toggleNotifications"
    >
      <svg-icon name="notification" />
      <fade-transition>
        <span v-if="notWatchedNotifications" class="notifications-counter">{{
          notWatchedNotifications > 9 ? '9+' : notWatchedNotifications
        }}</span>
      </fade-transition>
    </a>
    <fade-transition>
      <div
        v-show="isNotificationsOpen"
        ref="notifications"
        class="notifications"
      >
        <div class="notifications__top">
          <h3>{{ $t('notifications.title') }}</h3>
          <button
            v-if="isLoggedIn && notifications.length"
            @click="clearNotifications"
            class="notifications__clear"
          >
            {{ $t('notifications.clear') }}
          </button>
        </div>
        <div class="notifications__main scrollbar">
          <div class="notifications__zero" v-if="!notifications.length">
            {{ $t('notifications.zero') }}
          </div>
          <template
            v-for="notification in notifications"
            :key="notification.id"
          >
            <router-link :to="notification.link" class="notification">
              {{ notification.message }}
            </router-link>
          </template>
        </div>
        <div class="notifications__bottom"></div>
      </div>
    </fade-transition>
  </li>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import {authGetters} from '@/store/modules/auth'
import {
  notificationsActions,
  notificationsMutations,
} from '@/store/modules/notifications'
import FadeTransition from '@/components/animations/FadeTransition.vue'

export default {
  name: 'PdNavbar',
  components: {
    FadeTransition,
  },
  data() {
    return {
      isNotificationsOpen: false,
      notifications: [],
    }
  },
  computed: {
    ...mapState({
      notificationsData: (state) => state.notifications.notifications,
    }),
    ...mapGetters({
      isLoggedIn: authGetters.isLoggedIn,
      isAnonymus: authGetters.isAnonymus,
    }),
    notWatchedNotifications() {
      return this.notifications.filter((x) => x.watched === false).length
    },
  },
  methods: {
    async getNotifications() {
      this.notifications = await this.$store.dispatch(
        notificationsActions.getNotifications
      )
    },
    hideNotifications() {
      this.isNotificationsOpen = false
    },
    toggleNotifications() {
      this.isNotificationsOpen = !this.isNotificationsOpen
    },
    clearNotifications() {
      console.log(notificationsMutations.clear)
      this.notifications = []
      this.$store.commit(notificationsMutations.clear)
    },
  },
  watch: {
    isAnonymus(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.notifications.unshift({
            id: 0,
            message:
              'Зарегистрируйтесь или войдите, чтобы оставлять комментарии',
            link: '?auth=login',
            watched: false,
          })
        }, 4000)
      }
    },
    isNotificationsOpen(newVal) {
      if (newVal) {
        this.notifications.forEach((item) => {
          item.watched = true
        })
      }
    },
    isLoggedIn(newVal) {
      if (newVal) {
        this.getNotifications()
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/scss/_mixins.scss';

.notifications {
  position: absolute;
  background: var(--color-header-bg-submenu);
  border: 1px solid var(--color-border);
  border-top: 0;
  width: 440px;
  right: 0;
  top: calc(100% + 24px);
  display: flex;
  flex-direction: column;
  border-radius: 10px;

  box-shadow: 0 0.25rem 0.5rem 0.125rem var(--color-default-shadow);

  @include _768 {
    right: -100%;
    width: calc(100vw - 48px);
  }

  &__clear {
    background: transparent;
    font-size: 12px;
    padding: 0;
    margin: 0;

    &:hover {
      background: transparent;
    }
  }

  &__top {
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    font-size: 16px;
    font-weight: 600;
    position: sticky;

    h3 {
      margin: 0;
      padding: 0;
      font-size: 16px;
    }

    &:after {
      content: '\A';
      position: absolute;
      background: var(--color-header-bg-submenu);
      transform: rotate(45deg);
      width: 12px;
      height: 12px;
      right: 18px;
      top: -6px;
      transition: 0.2s;
    }
    @include _768 {
      &:after {
        right: 20%;
      }
    }
  }

  &__main {
    flex: auto;
    padding: 0;
    min-height: 64px;
    max-height: calc(100vh - 240px);
    overflow: auto;

    @include _768 {
      max-height: calc(100vh - 280px);
    }
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
    height: 16px;
  }

  &__zero {
    padding: 24px 24px;
    color: var(--color-text-secondary);
  }
}

.notifications-counter {
  position: absolute;
  background: var(--color-notifications-bg);
  color: var(--color-notifications-text);
  border-radius: 50%;
  font-size: 10px;
  bottom: 2px;
  right: 2px;
  height: 16px;
  min-width: 16px;
  padding: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 2px var(--color-light-shadow);
}

.notification {
  display: block;

  padding: 16px 24px;
  background: rgba(231, 242, 255, 0.315);
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
  color: var(--color-text);
  text-decoration: none;
}
</style>
