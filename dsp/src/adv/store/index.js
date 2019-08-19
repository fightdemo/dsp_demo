import Vue from 'vue';
import Vuex from 'vuex';

import {
  ajax
} from '@/common/js/utils';
import common from "@/common/store"

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    balance: 0,
    token: "",
  },
  mutations: {
    setBalance(state, data) {
      state.balance = data
    },
    setToken(state,data) {
      state.token = data;
    }
  },
  actions: {
    // 广告计划信息
    getBalance(context) {
      return ajax({
        url: '/dsp/advertiser/balance',
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
