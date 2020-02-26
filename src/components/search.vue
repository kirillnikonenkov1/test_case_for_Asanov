<template>
  <section class="search">
    <div class="search__container">
        <label for="search" class="search__label">
          <p class="search__hint" v-show="this.isFormFocused">Search by name</p>
          <input type="text" class="search__input" id="search" placeholder="Search by name" v-model="query" @keyup.enter="debouncedSearch" @focus="onFocus" @blur="onBlur" ref="input">
          <button class="search__button"  @click="debouncedSearch">
            <span class="search__icon">
              <svg class="search__loop" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3505 12.0684H12.5067L12.2077 11.7801C13.2544 10.5625 13.8845 8.9818 13.8845 7.26226C13.8845 3.428 10.7765 0.320007 6.94225 0.320007C3.10799 0.320007 0 3.428 0 7.26226C0 11.0965 3.10799 14.2045 6.94225 14.2045C8.6618 14.2045 10.2425 13.5744 11.4601 12.5277L11.7484 12.8267V13.6705L17.0886 19L18.68 17.4086L13.3505 12.0684ZM6.94225 12.0684C4.28284 12.0684 2.13608 9.92168 2.13608 7.26226C2.13608 4.60284 4.28284 2.45609 6.94225 2.45609C9.60167 2.45609 11.7484 4.60284 11.7484 7.26226C11.7484 9.92168 9.60167 12.0684 6.94225 12.0684Z" fill="#808080"/>
              </svg>
            </span>
          </button>
        </label>
      <button class="search__btn-reset" v-show="isSearch" @click="resetPage">reset page</button>
    </div>
  </section>
</template>
<script>
import {mapActions, mapState} from 'vuex';
import debounce from 'lodash.debounce';
export default {
  name: 'search',
  data() {
    return {
      isFormFocused: false,
    }
  },
  computed: {
    ...mapState(['searchQuery']),
    query: {
      get() {
        return this.searchQuery;
      },
      set(val) {
        return this.setSearchQuery(val);
      }
    },
    isSearch() {
      return this.$store.getters.IS_SEARCH;
    },
    searchQuery() {
      return this.$store.getters.GET_SEARCH_QUERY;
    }
  },
  methods: {
    ...mapActions(['setSearchQuery', 'search']),
    onFocus() {
      this.isFormFocused = true;
      this.$refs.input.placeholder = '';
    },
    onBlur() {
      this.isFormFocused = false;
      this.$refs.input.placeholder = 'Search by name';
    },
    debouncedSearch: debounce(function () {
        this.search();
        this.$store.commit('IS_SEARCH', true);
      }, 1000),
    resetPage() {
      window.scrollTo(0, 0);
      this.$store.commit('IS_CAN_RENDER_LIST', false);
      this.$store.commit('SET_SEARCH_QUERY', '');
      this.$store.dispatch('setInitialData');
      this.$store.commit('IS_SEARCH', false);
      this.$store.commit('IS_DATA_LOADED', false);
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/utils/vars";
@import "../assets/scss/utils/mixins";

.search {
  margin: {
    bottom: 45px;
  };
  @media (min-width: $tableWidth) {
    margin: {
      bottom: 80px;
    };
  }
  &__container {
    @include cnt($max-width: 848px, $padding: 0 24px)
    @media (min-width: $smDesktopWidth) {
      max-width: 33%;
      padding: 0;
    }
  }
  &__label {
    position: relative;
    display: block;
    margin: {
      bottom: 20px;
    };
  }
  &__btn-reset {
    color: #808080;
    background: {
      color: transparent;
    };
    border: 1px solid #808080;
    &:active,
    &:focus {
      box-shadow: 0 10px 40px rgba(37, 136, 167, 0.38);
    }
  }
  &__hint {
    position: absolute;
    top: -10px;
    left: 0;
    font: {
      size: 12px;
      weight: 500;
    };
    color: #808080;
    @media (min-width: $tableWidth) {
      font: {
        size: 13px;
      };
    }
  }
  &__input {
    width: 100%;
    padding: {
      top: 8px;
      bottom: 8px;
    };
    font: {
      size: 16px;
      weight: 500;
    };
    color: #808080;
    background: {
      color: transparent;
    };
    border: none;
    border-bottom: 1px solid #808080;
    outline: none;
    @media (min-width: $tableWidth) {
      font: {
        size: 18px;
      };
    }
  }
  &__button {
    position: absolute;
    right: 0;
    top: 8px;
    padding: 0;
    margin: 0;
    background: {
      color: transparent;
    };
    border: none;
    outline: none;
    @media (min-width: $tableWidth) {
      top: 4px;
    }
  }
  &__loop {
    width: 19px;
    height: 19px;
    @media (min-width: $tableWidth) {
      width: 23px;
      height: 23px;
    }
  }
}
</style>
