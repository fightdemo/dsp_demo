// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/common/css/base.css';
import router from './router'
import store from './store'
import {
  ajax
} from '@/common/js/utils'
import {
  number
} from "@/common/js/filter"
import navList from './router/navList';

import mSelect from "@/common/components/select"
import Switch from "@/common/components/switch"
import dspEdit from "@/common/components/dspEdit"
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
let Base64 = require('js-base64').Base64;

Vue.use(imageViewer)
Vue.component('mSelect', mSelect)
Vue.component('mSwitch', Switch)
Vue.component('dspEdit', dspEdit)
Vue.component('selectData', selectData)
Vue.component('page', Page)
Vue.component('mRadio', mRadio)
Vue.component('mInput', mInput)
Vue.component('mCheck', mCheck)
Vue.component('search', Search)
Vue.component('dspTab', dspTab)
Vue.component('dspButton', dspButton)
Vue.component('Caret',Caret)


Vue.prototype.$ajax = ajax

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

var parm = location.href.match(/agent.html#\/(\d+)\//)
var token = localStorage["agentToken" + parm[1]];
var isDirect = localStorage["agentIsDirect"+parm[1]];

// 设置title
document.title = store.state.common.oem.title
ajax.setToken(token);
store.commit("setToken", token)
store.commit("setIsDirect", isDirect)
store.dispatch("getBalance")
ajax({
  url: '/dsp/sys/parameter/query',
  data: {
      "filter":{"feature":"dsp.feature.device.depot.allow"},
  }
}).then( res => {
  if(res.data[0].value != 1){
    navList.forEach( item => {
      if( item.actionCode == 2 ){
        item.sub = item.sub.splice(0,1)
      }
    } )
  }
} )
ajax.all([store.dispatch("getUserInfo"),store.dispatch("getPermission")])
.then(res => {
  Vue.prototype.permission = store.state.common.permission;
  // 根据权限过滤导航栏
  initNavList(navList);
  // 根据nav生成跳转页面
  getPage(navList,'agent')

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
    item.to.params = {
      agentID: parm[1],
    }
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