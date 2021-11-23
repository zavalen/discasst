<template>
  <div class="container">
    <div class="feed-container">
      <div class="sidebar-left">
        <ul class="left-menu" :class="{'menu-margin': scrollDown}">
          <li
            class="left-menu__item"
            :class="{'left-menu__item_active': apiUrl === '/episodes'}"
            @click="apiUrl = '/episodes'"
          >
            <svg-icon name="all" />Все подряд
          </li>
          <li class="left-menu__item"><svg-icon name="radio" />Популярные</li>
          <li class="left-menu__item">
            <svg-icon name="subscriptions" />
            <span> Подписки </span>
          </li>
          <hr style="margin-bottom: 16px" />
          <span class="ad-title">Рекламируемые подкасты</span>
          <li
            class="left-menu__item"
            :class="{
              'left-menu__item_active':
                apiUrl === '/episodes?podcastSlug=newochem&limit=5&offser=0',
            }"
            @click="apiUrl = '/episodes?podcastSlug=newochem&limit=5&offser=0'"
          >
            <svg-icon name="subscriptions" />
            <span> Newочём </span>
          </li>
        </ul>
      </div>

      <div class="feed">
        <pd-feed :api-url="apiUrl" />
      </div>
      <div class="sidebar"></div>
    </div>
  </div>
</template>

<script>
import PdFeed from '@/components/PdFeed'
export default {
  name: 'PdGlobalFeed',
  components: {PdFeed},
  data() {
    return {
      apiUrl: '/episodes',
      scrollDown: false,
    }
  },
  mounted() {
    document.addEventListener('mousewheel', this.wheelHandler)
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
.feed {
  width: 700px;
}
.sidebar-left {
  flex: auto;
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
