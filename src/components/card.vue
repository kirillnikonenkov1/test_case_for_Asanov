<template>
  <div class="character" @click="showPopup()">
    <div class="character__avatar-box" :style="{background: this.avatarColor}">
      <p class="character__avatar">{{characterinfo.name.slice(0, 1)}}</p>
    </div>
    <p class="character__name">{{characterinfo.name}}</p>
    <p class="character__species">{{characterinfo.species}}</p>
    <popup :characterinfo="characterinfo" :avatarColor="this.avatarColor" v-if="popup" @closeModal="closeModal()">

    </popup>
  </div>
</template>

<script>
import popup from '../components/popup.vue'
export default {
  props: ['characterinfo'],
  components: {
    popup,
  },
  data() {
    return {
      popup: false,
    }
  },
  computed: {
    avatarColor() {
      return '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase()
    }
  },
  methods: {
    showPopup() {
      this.popup = true;
      document.getElementById('body').classList.add('scroll-hidden');
      this.$store.commit('IS_POPUP_OPEN', true);
    },
    closeModal() {
      this.popup = false;
      document.getElementById('body').classList.remove('scroll-hidden');
      this.$store.commit('IS_POPUP_OPEN', false);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/utils/vars";
@import "../assets/scss/utils/mixins";

.character {
  padding: {
    top: 33px;
    bottom: 33px;
  };
  @media (min-width: $tableWidth) {
    padding: {
      top: 47px;
      bottom: 47px;
    };
  }
  @media (min-width: $smDesktopWidth) {
    padding: {
      top: 93px;
      bottom: 93px;
    };
  }
  &__avatar-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    margin: {
      bottom: 10px;
      left: auto;
      right: auto;
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
    margin: {
      bottom: 10px;
    };
    font: {
      size: 18px;
      weight: 700;
    };
    color: #FFF;
    text-align: center;
  }
  &__species {
    font: {
      size: 13px;
    };
    text-align: center;
  }
}
</style>
