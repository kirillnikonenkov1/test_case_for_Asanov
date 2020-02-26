import Vue from 'vue';
import Vuex from 'vuex';
import './assets/scss/main.scss';

Vue.component('v-page', require('./pages/index.vue').default);
Vue.use(Vuex);

import starWarsStore from './store/index';
const store = new Vuex.Store({
  modules: {
    starWarsStore,
  }
});

new Vue({
  store,
  el: '#app',
});


