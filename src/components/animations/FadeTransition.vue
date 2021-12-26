<template>
  <transition
    name="fade"
    mode="out-in"
  >
    <slot />
  </transition>
</template>
<script>
export default {}
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
