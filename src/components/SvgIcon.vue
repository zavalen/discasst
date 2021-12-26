<template>
  <span
    v-if="isIconExist"
    v-dompurify-html="require(`!html-loader!@/assets/icons/${name}.svg`)"
    class="icon"
    :class="name"
    :style="{height: height + 'px', width: width + 'px'}"
  />
</template>

<script>
const icons = {}
const requireComponents = require.context('@/assets/icons/', false, /.svg$/)
requireComponents.keys().forEach((fileName) => {
  const iconName = fileName.replace(/^.*[\\/]/, '').replace('.svg', '')
  icons[iconName] = true
})

export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      require: true,
      default: null,
      validator(value) {
        return Object.prototype.hasOwnProperty.call(icons, value)
      },
    },
    height: {
      type: Number,
      require: false,
      default: null,
    },
    width: {
      type: Number,
      require: false,
      default: null,
    },
  },
  computed: {
    isIconExist() {
      return Object.prototype.hasOwnProperty.call(icons, this.name)
    },
  },
}
</script>

<style lang="scss">
.icon {
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  // > svg,
  // > path {
  //   // fill: var(--color-text);
  //   stroke: var(--color-text);
  // }

  > svg {
    width: 100%;
    min-width: 24px;
    height: 100%;
    min-height: 24px;
    display: inline-block;
    vertical-align: baseline;
  }
}
</style>
