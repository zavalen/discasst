<template>
  <transition name="slideright">
    <slot></slot>
  </transition>
</template>
<script>
export default {
  name: 'slideright',
}
</script>
<style>
.slideright-leave-active,
.slideright-enter-active {
  transition: 0.5s;
}
.slideright-enter-from {
  transform: translateX(-100%);
}
.slideright-leave-to {
  transform: translateX(-100%);
}
</style>
