import Axios from 'axios';
export  default {
  state: {
    data: null,
    mainData: null,
    isDataLoaded: false,
    searchQuery: '',
    character: null,
    isCharacterLoaded: false,
    isSearch: false,
    isCanRenderList: false,
    isMinDelayLeft: false,
    blockUpdate: true,
    isUpdating: false,
    popupOpen: false,
  },
  mutations: {
    SET_DATA: (state, payload) => {
      state.data = payload;
    },
    SET_MAIN_DATA: (state, payload) => {
      state.mainData = payload;
    },
    IS_DATA_LOADED: (state, payload) => {
      state.isDataLoaded = payload;
    },
    SET_SEARCH_QUERY: (state, payload) => {
      state.searchQuery = payload;
    },
    SET_CHARACTER: (state, payload) => {
      state.character = payload;
    },
    IS_CHARACTER_LOADED: (state, payload) => {
      state.isCharacterLoaded = payload;
    },
    UPDATE_DATA: (state, payload) => {
      state.mainData.push(...payload);
    },
    IS_UPDATING: (state, payload) => {
      state.isUpdating = payload;
    },
    IS_SEARCH: (state, payload) => {
      state.isSearch = payload;
    },
    IS_CAN_RENDER_LIST: (state, payload) => {
      state.isCanRenderList = payload;
    },
    IS_MIN_DELAY_LEFT: (state, payload) => {
      state.isMinDelayLeft = payload;
    },
    IS_BLOCK_UPDATE: (state, payload) => {
      state.blockUpdate = payload;
    },
    IS_POPUP_OPEN: (state, payload) => {
      state.popupOpen = payload;
    }
  },
  actions: {
    async getData(context, url) {
      let obj = {};
      await Axios.get(url)
      .then(response => {
        obj = response
      });
      context.commit('SET_DATA', obj.data);
      return obj;
    },
    async getDataWithSpecies(context, data) {
      let specie = [];
      let speciesLinks = data.map(item => {
        return item = Axios.get(item.species[0]);
      });
      await Promise.all([...speciesLinks])
        .then(allResults => specie = allResults.map(item => {
          return item = item.data.name;
        }));
      data = data.map((item, key) => {
        item.species = specie[key];
        return item;
      });
      return data;
    },
    setData(context, obj) {
      context.commit('SET_MAIN_DATA', obj);
      context.commit('IS_DATA_LOADED', true);
      context.commit('IS_BLOCK_UPDATE', false);
      setTimeout(() => context.commit('IS_CAN_RENDER_LIST', true), 1000);
    },
    async setInitialData(context) {
      let data = [];
      let promise = new Promise((resolve, reject) => {
        resolve(this.dispatch('getData', 'https://swapi.co/api/people/'))
      });
      await promise
        .then(response => this.dispatch('getDataWithSpecies', response.data.results))
        .then(response => data = response);
      this.dispatch('setData', data);
    },
    setSearchQuery(context, searchQuery) {
      context.commit('SET_SEARCH_QUERY', searchQuery.toLowerCase());
    },
    async search(context) {
      context.commit('IS_DATA_LOADED', false);
      context.commit('IS_CAN_RENDER_LIST', false);
      context.commit('IS_MIN_DELAY_LEFT', false);
      setTimeout(() => context.commit('IS_MIN_DELAY_LEFT', true),2000);
      let data = {};
      let searchQuery = context.state.searchQuery;
      let promise = new Promise((resolve, reject) => {
        resolve(this.dispatch('getData',`https://swapi.co/api/people/?search=${searchQuery}`));
      });
      await promise
        .then(response => this.dispatch('getDataWithSpecies', response.data.results))
        .then(response => data = response);
      this.dispatch('setData', data);
    },
    async getCharacterInfo(context, obj) {
      if (obj.films[0].includes('http')) {
        let filmsLinks = obj.films.map(item => {
          return item = Axios.get(item);
        });
        await Promise.all([...filmsLinks])
          .then(allResults => allResults.map(item => {
            return item.data.title
          }))
          .then(results => obj.films = results);
        let promise = new Promise((resolve, reject) => {
          resolve(Axios.get(obj.homeworld))
        });
        await promise.then(response => obj.homeworld = response.data.name);
      }
      context.commit('SET_CHARACTER', obj);
      context.commit('IS_CHARACTER_LOADED', true);
    },
    async getMoreData(context) {
      context.commit('IS_UPDATING', true);
      let q = context.state.data.next;
      let URLCheck = (parseInt(q[q.length - 1]) === 4) ? q.substring(0, q.length-1) + (parseInt(q[q.length -1]) + 1) : q;
      URLCheck = (parseInt(q[q.length - 1]) === 8) ? 'https://swapi.co/api/people/?page=1' : URLCheck;
      let promise = new Promise((resolve, reject) => {
        resolve(this.dispatch('getData', URLCheck))
      });
      await promise
        .then(response => this.dispatch('getDataWithSpecies', response.data.results))
        .then(response => this.commit('UPDATE_DATA', response));
      context.commit('IS_UPDATING', false);
    }
  },
  getters: {
    DATA: state => {
      return state.mainData;
    },
    IS_LOADED: state => {
      return state.isDataLoaded;
    },
    CHARACTER: state => {
      return state.character;
    },
    GET_SEARCH_QUERY: state => {
      return state.searchQuery;
    },
    IS_CHARACTER_LOADED: state => {
      return state.isCharacterLoaded;
    },
    IS_UPDATING: state => {
      return state.isUpdating;
    },
    IS_SEARCH: state => {
      return state.isSearch;
    },
    IS_CAN_RENDER_LIST: state => {
      return state.isCanRenderList;
    },
    IS_MIN_DELAY_LEFT: state => {
      return state.isMinDelayLeft;
    },
    IS_BLOCK_UPDATE: state => {
      return state.blockUpdate;
    },
    IS_POPUP_OPEN: state => {
      return state.popupOpen;
    }
  }
}
