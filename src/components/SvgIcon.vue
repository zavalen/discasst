<template>
  <span
    class="icon"
    v-if="isIconExist"
    :style="{height: height + 'px', width: width + 'px'}"
    v-html="require(`!html-loader!@/assets/icons/${name}.svg`)"
  ></span>
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
      validator(value) {
        return Object.prototype.hasOwnProperty.call(icons, value)
      },
    },
    height: {
      type: Number,
      require: false,
    },
    width: {
      type: Number,
      require: false,
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
    height: 100%;
    display: inline-block;
    vertical-align: baseline;
  }
}
</style>
