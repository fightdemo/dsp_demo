import Vue from 'vue';
import Vuex from 'vuex';
import common from "@/common/store"

import {
  ajax
} from '@/common/js/utils';
Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    balance: 0,
    token: "",
  },
  mutations: {
    setToken(state, data) {
      state.token = data
    },
    setBalance(state, data) {
      state.balance = data
    },
  },
  actions: {
    getBalance(context) {
      return ajax({
        url: '/dsp/saas/dsp/finace/summary',
        data: {}
      }).then(res => {
        context.commit('setBalance', res.data)
      })
    },
  },
  modules: {
    // 公共部分
    common
  }
});

export default store;
