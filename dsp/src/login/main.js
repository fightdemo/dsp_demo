// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

require('@/common/css/base.css');

Vue.config.productionTip = false;

Vue.use(BootstrapVue)

import {
  ajax
} from '@/common/js/utils'


Vue.prototype.$ajax = ajax

getCode()
function getCode() {
  let random = Math.floor(Math.random() * 2) + 1;
  switch (random) {
    case 1:
      require('@/common/css/sk1/sk1.css');
      break;
    case 2:
      require('@/common/css/sk2/sk2.css');
      break;
  
    default:
      break;
  }
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
