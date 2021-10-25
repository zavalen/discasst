<template>
  <div v-if="isOpen" class="modal">
    <div class="modal__window">
      <div class="modal__close" @click="close"><svg-icon name="close" /></div>
      <slot> </slot>
    </div>
    <div class="modal__bg" @click="close"></div>
  </div>
</template>

<script>
export default {
  name: 'PdPopup',
  currentPopupController: null,

  data() {
    return {
      isOpen: false
    }
  },
  mounted() {
    document.addEventListener('keydown', this.controleByKeys)
  },
  unmounted() {
    document.removeEventListener('keydown', this.controleByKeys)
  },
  methods: {
    open() {
      this.isOpen = true
      let resolve, reject
      const popupPromise = new Promise((ok, fail) => {
        resolve = ok
        reject = fail
      })

      this.$options.popupController = {resolve, reject}

      return popupPromise
    },
    close() {
      this.isOpen = false
      this.$options.popupController.resolve(false)
    },
    ok() {
      this.isOpen = false
      if (this.$options.popupController) {
        this.$options.popupController.resolve(true)
      }
    },
    controleByKeys(e) {
      if (e.key === 'Escape') {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.397);
    z-index: 9998;
    cursor: pointer;
  }

  &__window {
    max-width: 500px;
    width: 100%;
    background: var(--bg-header);
    z-index: 9999;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.63);
    position: relative;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
  }

  &__close {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 20px;
    cursor: pointer;
  }
}
</style>
