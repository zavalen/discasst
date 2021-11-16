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
  transition: 0.3s;
}
.slideright-enter-from {
  transform: translateX(200%);
}
.slideright-leave-to {
  transform: translateX(-100%);
}
</style>
