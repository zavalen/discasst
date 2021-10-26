<template>
  <fade-transition>
    <div v-if="isOpen" class="modal">
      <div class="modal__window scrollbar">
        <div class="modal__close button" @click="close">
          <svg-icon name="close" />
        </div>
        <slot> </slot>
      </div>
      <div class="modal__bg" @click="close"></div>
    </div>
  </fade-transition>
</template>

<script>
import FadeTransition from '@/components/ui/FadeTransition'

export default {
  name: 'PdPopup',
  components: {
    FadeTransition,
  },
  currentPopupController: null,

  data() {
    return {
      isOpen: false,
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
    },
  },
}
</script>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;

  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-popup-overlay);
    z-index: 9998;
    cursor: pointer;
    backdrop-filter: blur(1px);
  }

  &__window {
    max-width: 460px;
    width: 100%;
    background: var(--color-header-bg);
    z-index: 9999;
    border-radius: 10px;
    padding: 20px 50px 40px 30px;
    box-shadow: 0 0.5rem 0.5rem 0.5rem var(--color-default-shadow);

    position: relative;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10vh;
    max-height: 70vh;
    overflow: auto;
    .custom-scroll::-webkit-scrollbar-thumb,
    .custom-scroll-x::-webkit-scrollbar-thumb {
      background-color: rgba(90, 90, 90, 0);
      border-radius: 0.35rem;
    }

    h2 {
      margin-top: 0;
    }
  }

  &__close {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 16px;
    cursor: pointer;
    padding: 20px;
  }
}
</style>
