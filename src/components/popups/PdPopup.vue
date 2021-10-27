<template>
  <fade-transition>
    <div v-if="isOpen" class="modal">
      <div class="modal__window scrollbar">
        <div class="modal__close" @click="close">
          <svg-icon name="close" />
        </div>
        <h2 class="modal__header">
          <slot name="header"></slot>
        </h2>
        <slot> </slot>
        <div v-if="isBtnsEnabled" class="modal__buttons">
          <button
            v-if="okBtnText"
            class="modal__btn button_primary"
            @click="ok"
          >
            {{ okBtnText }}
          </button>
          <button
            v-if="cancelBtnText"
            class="modal__btn button_secondary"
            @click="close"
          >
            {{ cancelBtnText }}
          </button>
        </div>
      </div>

      <div class="modal__bg" @click="close"></div>
    </div>
  </fade-transition>
</template>

<script>
import FadeTransition from '@/components/animations/FadeTransition'

export default {
  name: 'PdPopup',
  props: {
    type: {
      type: String,
      required: false
    },
    okBtn: {
      type: String,
      required: false
    },
    cancelBtn: {
      type: String,
      required: false
    }
  },
  components: {
    FadeTransition
  },
  currentPopupController: null,

  computed: {
    isBtnsEnabled() {
      return Boolean(this.okBtn || this.cancelBtn || this.type)
    },
    okBtnText() {
      return this.okBtn || this.$t('popup.ok')
    },
    cancelBtnText() {
      return this.cancelBtn || this.$t('popup.cancel')
    }
  },
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
  z-index: 9999;
  padding: 20px;
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
    background: var(--color-header-bg);
    z-index: 9999;
    border-radius: 10px;
    padding: 16px 48px 24px 32px;
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

  &__buttons {
    margin-top: 24px;
  }

  &__close {
    position: absolute;
    right: 2px;
    top: 2px;
    width: 24px;
    cursor: pointer;
    padding: 8px 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;

    &:hover {
      background-color: var(--bg-menu-item-hover);
    }
  }
}
</style>
