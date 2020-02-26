<script>
import card from '../components/card.vue'
import search from '../components/search.vue'
import debounce from "lodash.debounce";

export default {
  components: {
    card,
    search
  },
  data() {
    return {
    };
  },
  computed: {
    dataList() {
      return this.$store.getters.DATA
    },
    isLoaded() {
      return this.$store.getters.IS_LOADED;
    },
    isSearch() {
      return this.$store.getters.IS_SEARCH;
    },
    isUpdating() {
      return this.$store.getters.IS_UPDATING;
    },
    isBlockUpdate() {
      return this.$store.getters.IS_BLOCK_UPDATE;
    },
    isCanRenderList() {
      return this.$store.getters.IS_CAN_RENDER_LIST;
    },
    isMinDelayLeft() {
      return this.$store.getters.IS_MIN_DELAY_LEFT;
    },
    isPopupOpen() {
      return this.$store.getters.IS_POPUP_OPEN;
    }
  },
  methods: {
    scroll () {
      window.onscroll = async () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.body.clientHeight - 1 && !this.isBlockUpdate && !this.isSearch) {
          this.$store.commit('IS_BLOCK_UPDATE', true);
          await this.$store.dispatch('getMoreData');
          this.$store.commit('IS_BLOCK_UPDATE', false);
        }
      }
    },
    resize() {
      window.onresize = async () => {
        if (this.$store.getters.IS_POPUP_OPEN) {
          let popup = document.querySelector('.popup');
          let popupOverlay = document.querySelector('.popup--overlay');
          let popupSize = popup.offsetHeight;
          let windowHeight = document.documentElement.clientHeight;
          if (popupSize > windowHeight) {
            popupOverlay.classList.add('popup--sm-window');
            popup.style.paddingBottom = (popupSize / 2).toString() + 'px';
          } else if (popupSize < windowHeight && popupOverlay.classList.contains('popup--sm-window')) {
            popup.style.paddingBottom = '30px';
            popupOverlay.classList.remove('popup--sm-window')
          }
        }
      }
    },
    toTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  },
  mounted() {
    if (this.$store.getters.DATA === null) {
      this.$store.dispatch('setInitialData');
    }
    setTimeout(() => this.$store.commit('IS_MIN_DELAY_LEFT', true),2000);
    this.scroll();
    this.resize();
  }
};
</script>

<style lang="scss">
@import "../assets/scss/utils/vars";
@import "../assets/scss/utils/mixins";

.header {
  padding: {
    top: 57px;
    bottom: 57px;
  };
  background: {
    image: url("images/background-header.png");
    repeat: no-repeat;
    size: cover;
  };
  @media (min-width: $tableWidth) {
    padding: {
      top: 90px;
      bottom: 90px;
    };
  }
  @media (min-width: $smDesktopWidth) {
    padding: {
      top: 120px;
      bottom: 120px;
    };
  }
  &__container {
      @include cnt();
  }
  &__logo {
    margin: {
      left: auto;
      right: auto;
    };
  }
}
.main {
  padding: {
    top: 40px;
    bottom: 120px;
  };
  background: {
    color:  #333333;
  };
  @media (min-width: $tableWidth) {
    padding: {
      top: 80px;
    };
  }
  @media (min-width: $smDesktopWidth) {
    padding: {
      bottom: 160px;
    };
  }
}
.video {
  display: flex;
  justify-content: center;
}
.content {
  display: block;
}
.characters {
  &__container {
    @include cnt($padding: 0 24px);
    @media (min-width: $smDesktopWidth) {
      max-width: 66%;
      padding: 0;
    }
  }
  &__list {
    @media (min-width: 500px) {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    @media (min-width: $smDesktopWidth) {

    }
  }
  &__item {
    max-width: 320px;
    margin: {
      bottom: 25px;
      left: auto;
      right: auto;
    };

    background: {
      color: #1A1A1A;
    };
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    border: {
      radius: 8px;
    };
    &:active,
    &:focus,
    &:hover {
      box-shadow: 0 10px 40px rgba(37, 136, 167, 0.38);
    }
    @media (min-width: 500px) {
      margin: {
        left: 0;
        right: 0;
      };
      flex: 0 0 calc(50% - 8px);
      &:nth-child(2n - 1) {
        margin: {
          right: 16px;
        };
      }
    }
    @media (min-width: $tableWidth) {
      max-width: 592px;
      margin: {
        bottom: 32px;
      };
      flex: 0 0 calc(50% - 16px);
      &:nth-child(2n - 1) {
        margin: {
          right: 32px;
        };
      }
    }
  }
}
.footer {
  padding: 36px 0;
  background: {
    color: #1A1A1A;;
  };
  @media (min-width: $tableWidth) {
    padding: {
      top: 53px;
      bottom: 46px;
    };
  }
  &__container {
    @include cnt();
  }
  &__text {
    font: {
      size: 14px;
      weight: 700;
    };
    letter-spacing: 0.11em;
    text-transform: uppercase;
    text-align: center;
    color: #FFF;
    @media (min-width: $tableWidth) {
      font: {
        size: 18px;
      };
    }
  }
}
.button-up {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: {
    color: transparent;
  };
  border: 1px solid #808080;
  &::before,
  &::after {
    position: absolute;
    top: calc(50% - 7.5px);
    display: block;
    content: '';
    width: 2px;
    height: 15px;
    background: {
      color: #808080;
    };
  }
  &::after {
    transform: rotate(45deg);
    left: calc(50% - 6px);
  }
  &::before {
    transform: rotate(-45deg);
    right: calc(50% - 6px);
  }
}
.scroll-hidden {
  overflow: hidden;
}
.desktop-hidden {
  @media (min-width: $tableWidth) {
    display: none;
  }
}
.fadeout-leave-active {
  animation: fadeout 1s;
}
.fadein-enter-active {
  animation: fadein 2s;
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
