<template>
  <div @click="scrollTop" v-if="windowWidth > 1240" class="scrollTop">
    <svg-icon :class="{down: lastPageYOffset}" name="arrow-up" />
  </div>
</template>

<script>
export default {
  name: 'ScrollToTop',

  data() {
    return {
      windowWidth: window.screen.width,
      lastPageYOffset: 0,
      //   arrowDown: false,
    }
  },
  mounted() {
    document.addEventListener('mousewheel', this.makeLastPageYOffsetZero)
  },
  unmounted() {
    document.removeEventListener('mousewheel', this.makeLastPageYOffsetZero)
  },
  methods: {
    scrollTop() {
      if (window.pageYOffset > 500) {
        this.lastPageYOffset = 0
      }
      window.scrollTo({top: this.lastPageYOffset, behavior: 'smooth'})
      this.lastPageYOffset = window.pageYOffset
    },
    makeLastPageYOffsetZero(event) {
      if (event && event.wheelDelta) {
        if (event.wheelDelta < 0) {
          this.lastPageYOffset = 0
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.scrollTop {
  position: fixed;

  right: calc(50% + 1226px / 2);
  left: 0;
  top: 0;
  bottom: 0;
  cursor: pointer;
  transition: 0.3s;
  background-color: transparent;

  &:hover {
    background-color: var(--bg-block-hover);

    .icon {
      opacity: 1;
    }
  }

  .icon {
    position: absolute;
    bottom: 24px;
    right: 16px;
    opacity: 0.3;
    transition: 0.3s;
  }
}

.down {
  transform: rotate(180deg);
}
</style>
