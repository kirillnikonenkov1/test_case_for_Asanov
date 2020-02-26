<template>
  <div class="popup--overlay"
  :class="[this.popupHeight > this.windowHeight ? 'popup--sm-window' : '']">
    <div class="popup"
         :class="[isCanRenderList ? 'popup--loaded' : '']"
         :style="{paddingBottom: stylePadding}" ref="popup">
      <div class="popup__container">
        <transition name="fadeout">
          <div class="video" v-show="!this.isCharacterLoaded || !this.isMinDelayLeft">
            <video src="./images/preload.mp4" autoplay loop muted></video>
          </div>
        </transition>
        <transition name="fadein">
          <div class="popup__content" v-show="this.isCharacterLoaded && this.isCanRenderList">
            <div class="popup__header">
              <div class="popup__avatar-box" :style="{background: this.avatarColor}">
                <p class="popup__avatar">{{characterInfo.name.slice(0, 1)}}</p>
              </div>
              <p class="popup__name">{{characterInfo.name}}</p>
            </div>
            <div class="popup__data">
              <ul class="popup__list">
                <li class="popup__item popup__item--birth">
                  <p class="popup__text">Birth year</p>
                  <p class="popup__info">{{ characterInfo.birth_year }}</p>
                </li>
                <li class="popup__item popup__item--species">
                  <p class="popup__text">Species</p>
                  <p class="popup__info">{{ characterInfo.species }}</p>
                </li>
                <li class="popup__item popup__item--gender">
                  <p class="popup__text">Gender</p>
                  <p class="popup__info">{{ characterInfo.gender }}</p>
                </li>
              </ul>
              <ul class="popup__list">
                <li class="popup__item popup__item--home">
                  <p class="popup__text">Homeworld</p>
                  <p class="popup__info">{{ characterInfo.homeworld }}</p>
                </li>
                <li class="popup__item popup__item--films films">
                  <p class="popup__text">Films</p>
                  <ul class="films__list">
                    <li class="films__item" v-for="item in characterInfo.films">
                      <p class="popup__info films__info">{{ item }}</p>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
      <div class="popup__close" @click.stop="$emit('closeModal')">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popup',
  props: [ 'characterinfo', 'avatarColor' ],
  data() {
    return {
      isMinDelayLeft: false,
      isCanRenderList: false,
      characterInfo: {
        name: '',
        birth_year: '',
        species: '',
        gender: '',
        homeworld: '',
        films: ''
      },
      popupHeight: '',
      windowHeight: '',
      stylePadding: '30px',
      styleTop: '',
    }
  },
  computed: {
    isCharacterLoaded() {
      return this.$store.getters.IS_CHARACTER_LOADED;
    },
  },
  watch: {
    isCharacterLoaded: function () {
      setTimeout(() => this.isCanRenderList = true, 3000)
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal', {
        popup: false,
      })
    },
    getPopupHeight() {
      return this.$refs.popup.offsetHeight;
    },
    getWindowHeight() {
      return document.documentElement.clientHeight;
    }
  },
  async mounted() {
    await this.$store.dispatch('getCharacterInfo', this.$props.characterinfo);
    this.characterInfo = this.$store.getters.CHARACTER;
    await setTimeout(() => {
      this.isMinDelayLeft = true;
    }, 2000);
    this.popupHeight = this.getPopupHeight();
    this.windowHeight = this.getWindowHeight();
    if (this.popupHeight > this.windowHeight) {
      this.stylePadding = (this.popupHeight/2) + 'px';
    }
  },
  beforeDestroy() {
    this.$store.commit('SET_CHARACTER', null);
    this.$store.commit('IS_CHARACTER_LOADED', false)
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/utils/vars";
@import "../assets/scss/utils/mixins";

.popup {
  position: fixed;
  overflow: auto;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: block;
  padding: {
    bottom: 48px;
  };
  background: {
    color:  #333333;
  };
  border: 1px solid black;
  z-index: 99;
  @media (min-width: $smDesktopWidth) {
    position: initial;
    left: calc(50% - 400px);
    width: 800px;
    padding: 80px;
    padding-bottom: 30px;
    min-height: 492px;
    max-height: 70%;
    height: initial;
    &::-webkit-scrollbar { width: 3px; height: 3px;}
    &::-webkit-scrollbar-button {  background-color: #1A1A1A; }
    &::-webkit-scrollbar-track {  background-color: #999;}
    &::-webkit-scrollbar-track-piece { background-color: #1A1A1A;}
    &::-webkit-scrollbar-thumb { height: 50px; background-color: #666; border-radius: 3px;}
    &::-webkit-scrollbar-corner { background-color: #1A1A1A;}
    &::-webkit-resizer { background-color: #666;}
  }
  &--loaded {
    background: {
      color: #1A1A1A;;
    };
  }
  &--sm-window {
    @media (min-width: $smDesktopWidth) {
      align-items: flex-start !important;
    }
  }
  &--overlay {
    @media (min-width: $smDesktopWidth) {
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      box-shadow: 0 0 1rem 0 rgba(41, 39, 39, 0.2);
      &::before {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: block;
        box-shadow: inset 0 0 2000px rgba(241, 241, 241, 0.5);
        filter: blur(10px);
        z-index: 0;
      }
    }
  }
  &__container {
    @include cnt($padding: 0 24px);
    @media (min-width: 660px) {
      max-width: 640px;
      padding: 0;
    }
  }
  &__header {
    display: flex;
    align-items: center;
    margin: {
      bottom: 50px;
    };
    padding: {
      top: 48px;
      bottom: 48px;
    };
    border-bottom: 2px solid #808080;
    @media (min-width: $smDesktopWidth) {
      padding: {
        top: 0;
      };
    }
  }
  &__avatar-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    margin: {
      right: 16px;
    };
    font: {
      size: 48px;
      weight: 500;
    };
    font-feature-settings: 'liga' off;
    color: #FFFFFF;
    border: {
      radius: 50%;
    };
  }
  &__name {
    font: {
      size: 22px;
      weight: 700;
    };
    color: #fff;
    @media (min-width: $smDesktopWidth) {
      font: {
        size: 24px;
      };
    }
  }
  &__content {
    word-break: break-word;
  }
  &__data {
   padding: {
     left: 32px;
   };
    @media (min-width: 660px) {
      display: flex;
      justify-content: space-between;
    }
  }
  &__list {
    @media (min-width: 660px) {
      flex: 0 0 calc(50% - 20px);
    }
  }
  &__item {
    position: relative;
    display: flex;
    margin: {
      bottom: 22px;
    };
    &::before {
      position: absolute;
      top: -4px;
      left: -32px;
      content: '';
      display: block;
      width: 24px;
      height: 24px;
      background: {
        repeat: no-repeat;
        position: center;
        size: contain;
      };
    }
    &--birth {
      &::before {
        background: {
          image: url("images/birth.png");
        };
      }
    }
    &--species {
      &::before {
        background: {
          image: url("images/species.png");
        };
      }
    }
    &--gender {
      &::before {
        background: {
          image: url("images/gender.png");
        };
      }
    }
    &--home {
      &::before {
        background: {
          image: url("images/home.png");
        };
      }
    }
    &--films {
      &::before {
        background: {
          image: url("images/films.png");
        };
      }
    }
  }
  &__text {
    flex: 0 0 85px;
    margin: {
      right: 24px;
    };
    @media (min-width: $smDesktopWidth) {
      flex: 0 0 110px;
      font: {
        size: 18px;
      };
    }
  }
  &__info {
    flex: 1 1;
    font: {
      weight: 700;
    };
    color: #FFF;
    @media (min-width: $smDesktopWidth) {
      font: {
        size: 18px;
      };
    }
  }
  .films {
    &__item {
      margin: {
        bottom: 12px;
      };
    }
  }
  &__close {
    position: absolute;
    top: 0;
    right: 0;
    width: 12px;
    height: 12px;
    &::before,
    &::after {
      position: absolute;
      top: 22px;
      right: 22px;
      content: '';
      display: block;
      width: 12px;
      height: 2px;
      background: {
        color: #fff;
      };
    }
    &::before {
      transform: rotate(45deg);
    };
    &::after {
      transform: rotate(-45deg);
    };
  }
}
.video {
  margin: {
    left: -24px;
    right: -24px;
  };
}
.fadeout-leave-active {
  animation: fadeout 1s;
}
.fadein-enter-active {
  animation: fadein 2s forwards;
}
@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
