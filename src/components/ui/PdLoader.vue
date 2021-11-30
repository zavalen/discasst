<template>
  <div class="spin-loading">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>
<script>
export default {
  name: 'PdLoader',
}
</script>

<style lang="scss">
.spin-loading {
  display: inline-block;
  position: relative;
  // width: 80px;
  // height: 80px;
  margin: 0 auto;
}
.spin-loading div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: inherit;
  height: inherit;
  // margin: 8px;
  border: 2px solid var(--color-text-secondary);
  border-radius: 50%;
  animation: spin-loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--color-text-secondary) transparent transparent transparent;
}
.spin-loading div:nth-child(1) {
  animation-delay: -0.45s;
}
.spin-loading div:nth-child(2) {
  animation-delay: -0.3s;
}
.spin-loading div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes spin-loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>