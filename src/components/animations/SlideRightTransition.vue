<template>
  <transition name="slideright">
    <slot></slot>
  </transition>
</template>
<script>
export default {
  name: 'slideright'
}
</script>
<style>
.slideright-leave-active,
.slideright-enter-active {
  transition: 0.4s;
  animation-timing-function: ease-in-out;
}
.slideright-enter-from {
  transform: translateX(100%) rotate(20deg);
  opacity: 0;
}
.slideright-leave-to {
  transform: translateX(-150%) rotate(-20deg);
  opacity: 0;
}
</style>
