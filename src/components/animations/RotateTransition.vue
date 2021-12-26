<template>
  <transition-group
    name="rotate"
    mode="out-in"
    :duration="500"
  >
    <slot />
  </transition-group>
</template>
<script>
export default {}
</script>
<style>
.rotate-enter-active,
.rotate-leave-active {
  transition: 0.5s;
}
.rotate-enter-from,
.rotate-leave-to {
  opacity: 0;
  transform: rotate(180deg);
}
</style>
