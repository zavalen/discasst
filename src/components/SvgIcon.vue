<template>
  <span
    class="icon"
    v-if="isIconExist"
    v-html="require(`!html-loader!@/assets/icons/${name}.svg`)"
  ></span>
</template>

<script>
const icons = {}
const requireComponents = require.context('@/assets/icons/', false, /.svg$/)
requireComponents.keys().forEach(fileName => {
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
      }
    }
  },
  computed: {
    isIconExist() {
      return Object.prototype.hasOwnProperty.call(icons, this.name)
    }
  }
}
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: baseline;
}
</style>
