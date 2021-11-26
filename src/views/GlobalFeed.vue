<template>
  <div class="container">
    <div class="feed-container">
      <div class="sidebar-left">
        <ul class="left-menu" :class="{'menu-margin': scrollDown}">
          <template v-for="button in episodesButtons" :key="button.title">
            <li v-if="button.loggedUsers ? isLoggedIn : true">
              <router-link
                :to="{name: button.pathName}"
                class="left-menu__item"
                exact-active-class="left-menu__item_active"
              >
                <svg-icon :name="button.icon" /> <span>{{ button.title }}</span>
              </router-link>
            </li>
          </template>
          <hr style="margin-bottom: 16px" />
        </ul>
      </div>

      <div class="feed">
        <router-view />
      </div>
      <div class="sidebar"></div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import {authGetters} from '@/store/modules/auth'

const episodesButtons = [
  {
    title: 'Свежие',
    icon: 'all',
    pathName: 'allEpisodes',
    loggedUsers: false,
  },
  {
    title: 'Подписки',
    icon: 'subscriptions',
    pathName: 'subscriptions',
    loggedUsers: true,
  },
]

export default {
  name: 'PdGlobalFeed',
  data() {
    return {
      episodesButtons,
      scrollDown: false,
    }
  },
  computed: {
    ...mapState({
      userSubscriptions: (state) => state.podcasts.userSubscriptions,
    }),
    ...mapGetters({
      currentUser: authGetters.currentUser,
      isLoggedIn: authGetters.isLoggedIn,
      isAnonymus: authGetters.isAnonymus,
    }),
  },
  mounted() {
    document.addEventListener('mousewheel', this.wheelHandler)
    window.scrollTo({top: 0})
  },
  unmounted() {
    document.removeEventListener('mousewheel', this.wheelHandler)
  },
  methods: {
    wheelHandler(event) {
      if (event && event.wheelDelta) {
        if (event.wheelDelta >= 0) {
          this.scrollDown = false
        }
        if (event.wheelDelta < 0) {
          this.scrollDown = true
        }
      }
    },
  },
}
</script>

<style lang="scss">
.feed-container {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
  width: 100%;
}
// .feed {
//   width: 700px;
// }
.sidebar-left {
  // flex: auto;
  width: 175px;
}
.sidebar {
  border-radius: 10px;
  min-width: 300px;
  max-width: 300px;
  padding: 20px;
  background: var(--color-header-bg);
  box-shadow: 0 2px 2px var(--color-light-shadow);
  margin-bottom: 32px;
  height: 600px;
  margin-left: 24px;
}

.left-menu {
  position: sticky;
  top: 76px;
  transition: 0.8s;

  &__item {
    margin-bottom: 4px;
    cursor: pointer;
    border-radius: 10px;
    padding: 8px 8px;
    font-size: 14px;
    display: flex;
    align-items: center;
    transition: 0.3s;
    color: var(--color-text-secondary);
    text-shadow: 0 0 0.5px var(--color-text-secondary);
    border: 1px solid transparent;
    text-decoration: none;
    & > .icon {
      margin-right: 10px;
    }

    &_active,
    &:hover {
      background-color: var(--bg-menu-item-hover);
      color: var(--color-text);
      border-color: var(--color-border);
    }
  }
}

.menu-margin {
  top: 32px;
}

.sidebar-left {
  margin-right: 24px;
  margin-bottom: 32px;
  position: relative;
}

.ad-title {
  font-size: 11px;
  margin-bottom: 4px;
  display: block;
  color: var(--color-text-secondary);
}
</style>
