// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/common/css/base.css';
import router from './router'
import store from './store'
let Base64 = require('js-base64').Base64;

import {
  ajax, fmoney
} from '@/common/js/utils'
import {
  number
} from "@/common/js/filter"
import navList from './router/navList';

import vuePreview from 'vue-preview'
import mSelect from "@/common/components/select"
import Switch from "@/common/components/switch"
import dspEdit from "@/common/components/dspEdit"
import dspEditSelect from "@/common/components/dspEditSelect"
import selectData from "@/common/components/select-data"
import Page from "@/common/components/page"
import mRadio from "@/common/components/radio"
import mInput from "@/common/components/input"
import mCheck from "@/common/components/check"
import Search from "@/common/components/search"
import dspTab from "@/common/components/dspTab"
import dspButton from "@/common/components/dspButton"
import imageViewer from '@/common/components/imageViewer'
import Caret from "@/common/components/caret"

Vue.use(imageViewer)
Vue.use(vuePreview,{
  mainClass: 'pswp--minimal--dark',
  barsSize: {top: 0, bottom: 0},
  captionEl: false,
  fullscreenEl: false,
  shareEl: false,
  bgOpacity: 0.85,
  tapToClose: true,
  tapToToggleControls: false
})
Vue.component('mSelect', mSelect)
Vue.component('mSwitch', Switch)
Vue.component('dspEdit', dspEdit)
Vue.component('dspEditSelect', dspEditSelect)
Vue.component('selectData', selectData)
Vue.component('page', Page)
Vue.component('mRadio', mRadio)
Vue.component('mInput', mInput)
Vue.component('mCheck', mCheck)
Vue.component('search', Search)
Vue.component('dspTab', dspTab)
Vue.component('dspButton', dspButton)
Vue.component('Caret', Caret)


Vue.prototype.$ajax = ajax
Vue.prototype.fmoney = fmoney

// filter
Vue.filter("number", number);
Vue.use(ElementUI);

Vue.config.productionTip = false;

// 定义全局变量page
var page = Vue.prototype.PAGE = {};


// 路由守卫
router.beforeEach((to, from, next) => {
  // 跳转页面时初始化滚动条状态
  document.documentElement.scrollTop = 0;
  // 跳转界面
  if(page[to.name]) {
    next(page[to.name][0].to)
  } else {
    next();
  }
})

var token = localStorage["dspToken"];

// 设置title
document.title = store.state.common.oem.title
ajax.setToken(token);
store.commit("setToken", token)
store.dispatch("getBalance")
ajax.all([store.dispatch("getUserInfo"),store.dispatch("getPermission")])
.then(res => {
  Vue.prototype.permission = store.state.common.permission;
  // 根据权限过滤导航栏
  initNavList(navList);
  // 根据nav生成跳转页面
  getPage(navList,'saas')
  console.log(page);

  new Vue({
    el: '#app',
    router,
    store,
    components: {
      App
    },
    template: '<App/>'
  })

})

function initNavList(arr) {
  var view = store.state.common.permission.view,
    item, i;
  // 根据路由设置navList
  for (i = 0; i < arr.length; i++) {
    item = arr[i];
    if (item.actionCode && !view[item.actionCode]) {
      arr.splice(i, 1);
      i--;
    }
    if (item.sub) initNavList(item.sub)
  }
}

function getPage(arr,parent) {
    page[parent] = []

    arr.forEach(item => {
        page[parent].push(item);
        if(item.sub) getPage(item.sub,item.to.name)
    })
}