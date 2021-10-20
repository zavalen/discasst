<template>
  <component
    :is="iconComponent"
    class="inline-block fill-current"
    style="height: 1em; width: 1em"
  />
</template>

<script>
const icons = {}

const requireComponents = require.context('@/assets/icons/', false, /.svg$/)

requireComponents.keys().forEach((fileName) => {
  // const iconName = fileName.replace(/^.*[\\/]/, '').replace('.svg', '')
  const iconName = fileName.replace(/^\.\/icon-(.+)\.svg$/, '$1')

  const componentConfig = requireComponents(iconName)

  console.log(componentConfig)
  icons[iconName] = componentConfig.default || componentConfig
})
console.log(icons)

export default {
  name: 'BaseSvg',
  props: {
    name: {
      type: String,
      required: true,
      validator(value) {
        return Object.prototype.hasOwnProperty.call(icons, value)
      },
    },
  },

  computed: {
    iconComponent() {
      return icons[this.name]
    },
  },
}
</script>