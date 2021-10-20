<template>
  <pd-header> </pd-header>
  <main class="container">
    <router-view />
  </main>
  <footer></footer>
</template>

<script>
import PdHeader from '@/components/PdHeader'

export default {
  name: 'app',
  components: {
    PdHeader,
  },
}
</script>

<style lang="scss">
:root {
  // --site-bg: #100f13;
  --site-bg: #010101;
  --block-bg: #17181a;
  --text-color: rgb(226, 226, 226);
  --link-color: #cacaff;
  --btn-color: #17181a;
  --btn-hover-color: #232425;
  --accent: #ffd100;
  --selected-episode: #1d1b24;
  --block-border-radius: 18px;
  --container-width: 1240px;
}

@mixin button-effect {
  opacity: 0.6;
  transition: 0.3s;

  &:hover {
    opacity: 1;
  }
}
@mixin button-effect-innactive {
  opacity: 0.6;
  transition: 0.3s;
}

@mixin unselectable {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  not supported by any browser */
}
body {
  font-family: 'Roboto', sans-serif;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1300px;
  width: 100%;
  padding: 0 20px;
}

.header {
  background: rgb(233, 233, 233);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
  }

  &__logo {
    font-family: 'Titillium Web', sans-serif;
    font-size: 1.5rem;
    padding-top: 0rem;
    margin-right: 2rem;
    color: #5cb85c;
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }
}

main {
  flex: auto;
}

footer {
  background: #2c3e50;
  min-height: 100px;
}

.zPlayer {
  &__progress-block {
    width: 100%;
    height: 12px;
    border-top-left-radius: var(--block-border-radius);
    border-top-right-radius: var(--block-border-radius);

    @include button-effect;

    &:hover {
      height: 20px;

      .zPlayer__duration,
      .zPlayer__time {
        font-size: 12px;
        top: 1px;
      }
    }
  }
  &__main-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 22px;
    box-sizing: border-box;
    @media (max-width: 768px) {
      padding: 12px 15px 12px;
    }
  }
  &__main-left {
    display: flex;
    align-items: center;
    flex: auto;
    position: relative;
  }
  &__main-right {
    display: flex;
    align-items: center;
  }

  &__play,
  &__next {
    cursor: pointer;
    width: 35px;
    margin-right: 6px;
    z-index: 20;

    @include button-effect;

    svg {
      fill: #fff;
      width: 30px;
      height: 30px;
    }
  }

  &__loading {
    position: absolute;
    left: -9px;
    top: -10px;
    z-index: 10;
    opacity: 0;
    visibility: hidden;
    transition: 0.1s;

    .lds-ring {
      display: inline-block;
      position: relative;
      width: 42px;
      height: 42px;
      opacity: 0.4;
    }
    .lds-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 42px;
      height: 42px;
      margin: 4px;
      border: 4px solid rgb(44, 44, 44);
      border-radius: 50%;
      animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: rgb(70, 70, 70) transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
      animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
      animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
      animation-delay: -0.15s;
    }
  }

  &__title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 1px;
    cursor: default;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    @media (max-width: 768px) {
      font-size: 13px;
      margin-bottom: 0;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      white-space: break-spaces;
    }
  }

  &__progress-line {
    width: 100%;
    height: 100%;
    background: rgb(51, 51, 51);
    position: relative;
    border-top-left-radius: var(--block-border-radius);
    border-top-right-radius: var(--block-border-radius);
  }

  &__duration {
    position: absolute;
    right: 15px;
    top: -2px;
    font-size: 10px;
    color: #e2e2e2;
    font-weight: 600;
    transition: 0.3s;
  }
  &__time {
    position: absolute;
    left: 15px;
    top: -2px;
    font-size: 10px;
    color: #e2e2e2;
    font-weight: 600;
    transition: 0.3s;
    @include unselectable;
  }

  &__progress-time {
    background: rgb(94, 93, 93);
    height: 100%;
    // border-top-left-radius: var(--block-border-radius);
    // border-top-right-radius: var(--block-border-radius);
  }
  &__progress-overflow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99;
    cursor: pointer;
    border-top-left-radius: var(--block-border-radius);
    border-top-right-radius: var(--block-border-radius);
  }
  &__progress-overflow-time {
    position: absolute;
    background: rgba(0, 0, 0, 0.685);
    padding: 2px 10px;
    font-size: 10px;
    top: 100%;
    left: 0;
    z-index: 999;
    @include unselectable;
  }

  &__buffered {
    position: absolute;
    font-size: 10px;
    top: 0%;
    left: 0;
    height: 100%;
    transition: width 1s;
  }

  &__volume-line {
    width: 60px;
    height: 20px;
    margin-left: 15px;

    background: rgb(51, 51, 51);
    position: relative;
    display: flex;
    flex-direction: column-reverse;

    @include button-effect;

    @media (max-width: 768px) {
      display: none;
    }
  }
  &__volume {
    background: #5e5d5d;
    height: 100%;
  }

  &__volume-overflow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99;
    cursor: pointer;
  }

  &__nosound {
    position: absolute;
    opacity: 0.5;
    svg {
      height: 24px;
      width: 24px;
      // margin-bottom: 3px;
      fill: #fff;
      // polygon,
      // line,
      path {
        // stroke: #fff;
        fill: #fff;
      }
    }
  }

  &__volume-overflow-persentage {
  }

  &__open {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-left: 10px;
    @include button-effect;
    svg {
      height: 16px;
      width: 16px;
      // margin-bottom: 3px;
      fill: #fff;
    }
    @media (max-width: 768px) {
      margin-left: 6px;
    }
  }

  &__playlist {
    margin-left: 15px;
    cursor: pointer;
    @include button-effect;
    svg {
      height: 20px;
      width: 20px;
      margin-bottom: 3px;
      path {
        fill: #fff;
      }
    }
  }
  &__speed {
    font-weight: 900;
    font-size: 20px;
    margin-left: 15px;
    text-align: right;
    width: 40px;
    cursor: pointer;
    @include button-effect;
    @include unselectable;
    @media (max-width: 768px) {
      margin-left: 8px;
    }
  }
}
</style>
