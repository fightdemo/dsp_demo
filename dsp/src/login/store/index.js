import Vue from 'vue';
import Vuex from 'vuex';
import common from "@/common/store"

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    // 公共部分
    common
  }
});

export default store;
