<template>
  <nav class="tabs" :class="wrapperClass">
    <span
      class="tabs__item"
      v-for="tab in tabs"
      :ref="tab.value"
      :key="tab.title"
      :class="[
        {tabs__item_active: tab.value === currentTab},
        tab.value === currentTab && tabActiveClass ? tabActiveClass : '',
        tabClass,
      ]"
      :disabled="tab.disabled || false"
      @click="handleClick(tab.value)"
      v-html="tab.title"
    />

    <div
      class="tabs__active-line"
      :class="lineClass"
      :style="{
        width: `${activeLineWidth}px`,
        transform: `translateX(${activeLineOffset}px)`,
      }"
    />
  </nav>
</template>

<script>
export default {
  name: 'Pd-tabs',
  props: {
    currentTab: {
      type: String,
      required: true,
    },
    tabs: {
      type: Array,
      required: true,
    },
    updated: {
      type: [Boolean, String, Array],
      default: undefined,
    },
    wrapperClass: {
      type: String,
      required: false,
    },
    tabClass: {
      type: String,
      required: false,
    },
    tabActiveClass: {
      type: String,
      required: false,
    },
    lineClass: {
      type: String,
      required: false,
    },
  },
  watch: {
    currentTab(newCurrentTab) {
      if (this.newTab === newCurrentTab) return
      this.moveActiveLine(newCurrentTab)
      this.newTab = newCurrentTab
    },
    updated() {
      this.moveActiveLine(this.currentTab)
    },
  },
  data() {
    return {
      activeLineWidth: 0,
      activeLineOffset: 0,
      newTab: '',
    }
  },
  methods: {
    handleClick(value) {
      this.$emit('onClick', value)
      this.moveActiveLine(value)

      this.newTab = value
    },
    moveActiveLine(newValue) {
      if (!this.currentTab) return

      if (!this.$refs || !this.$refs[newValue]) {
        return
      }
      const element = this.$refs[newValue]

      this.activeLineWidth = element.clientWidth
      this.activeLineOffset = element.offsetLeft

      if (!this.activeLineWidth && !this.activeLineOffset) {
        this.activeLineWidth = 209
        this.activeLineOffset = 16
      }
    },
  },
  mounted() {
    this.newTab = this.currentTab
    this.moveActiveLine(this.currentTab)
  },
}
</script>

<style lang="scss">
.tabs {
  position: relative;
  margin: 0 auto;
  padding: 4px 16px 4px;

  &__item {
    display: inline-block;
    margin: 0 5px;
    padding: 10px 16px;
    font-size: 14px;
    padding-bottom: 8px;
    color: var(--color-text-secondary);
    text-decoration: none;
    border: none;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.3s;
    &_active {
      text-shadow: 0 0 1px var(--color-text);
    }
    &:hover {
      color: var(--color-text);
    }
    &:focus {
      outline: none;
      text-shadow: 0 0 1px var(--color-text);
    }
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  &__active-line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background-color: var(--color-accent);
    transition: transform 0.4s ease, width 0.4s ease;
    border-radius: 8px;
    overflow: hidden;
  }
}
</style>
