// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

require('@/common/css/base.css');

Vue.config.productionTip = false;
Vue.use(ElementUI);
import {
  ajax
} from '@/common/js/utils'


Vue.prototype.$ajax = ajax

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
})
