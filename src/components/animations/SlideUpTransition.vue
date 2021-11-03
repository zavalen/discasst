<template>
  <transition name="slideup">
    <slot></slot>
  </transition>
</template>
<script>
export default {}
</script>
<style>
.slideup-leave-active,
.slideup-enter-active {
  transition: 0.5s;
}
.slideup-enter-from {
  transform: translateY(100%);
}
.slideup-leave-to {
  transform: translateY(160%);
}
</style>
