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
  ajax, fmoney
} from '@/common/js/utils'
import {
  number
} from "@/common/js/filter"
import navList from './router/navList';
import BaiduMap from 'vue-baidu-map'

import imageViewer from '@/common/components/imageViewer'
import vuePreview from 'vue-preview'
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
import Caret from "@/common/components/caret"

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
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'gXWSdw891u3IO5dCIqWLjLIabHVZKTNT'
})

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
  // 跳转界面-若有子集，则直接跳转到第一个子页面
  if(page[to.name]) {
    next(page[to.name][0].to)
  } else {
    next();
  }
})

var parm = location.href.match(/adv.html#\/(\d+)\/(\d+)\//)
var token = localStorage["advToken" + parm[2]];

// 设置title
document.title = store.state.common.oem.title
ajax.setToken(token);
store.commit("setToken", token)
store.dispatch("getBalance")
store.dispatch("getUserInfo").then(res => {
  // 获取权限后再渲染dom
  store.dispatch("getPermission").then(res => {
    Vue.prototype.permission = store.state.common.permission;
    // 根据账户类型来控制报表展示
    var View = judgeAccountType(store.state.common.permission.view)
    // 根据权限过滤导航栏
    initNavList(navList, View);
    // 根据nav生成跳转页面
    getPage(navList,'adv')
    console.log(page);
    
    // Vue.directive( 'title', {
    //   inserted: function (el, binding) { 
    //     document.title = el.dataset.title
    //    }
    // } )

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
})

// // 获取权限后再渲染dom
// store.dispatch("getPermission").then(res => {
//   Vue.prototype.permission = store.state.common.permission;
//   // 根据账户类型来控制报表展示
//   var View = judgeAccountType(store.state.common.permission.view)
//   // 根据权限过滤导航栏
//   initNavList(navList, View);
//   // 根据nav生成跳转页面
//   getPage(navList,'adv')
//   console.log(page);
  
//   // Vue.directive( 'title', {
//   //   inserted: function (el, binding) { 
//   //     document.title = el.dataset.title
//   //    }
//   // } )

//   new Vue({
//     el: '#app',
//     router,
//     store,
//     components: {
//       App
//     },
//     template: '<App/>'
//   })

// })

function judgeAccountType(view) {
  var userInfo = store.state.common.userInfo;
  if (userInfo.adverType == "2" && userInfo.isAdhubUser == "false") {
    delete(view["102"]);
    delete(view["103"]);
    delete(view["126"]);
    delete(view["55"]);
  }
  return view
}

function initNavList(arr, view) {
  // var view = store.state.common.permission.view,
  //   item, i;
  var view = view,item, i;
  // 根据路由设置navList
  for (i = 0; i < arr.length; i++) {

    item = arr[i];
    item.to.params = {
      isDirect: parm[1],
      advID: parm[2],
    }
    if (item.actionCode && !view[item.actionCode]) {
      arr.splice(i, 1);
      i--;
    }
    if (item.sub) initNavList(item.sub, view)
  }
}

function getPage(arr,parent) {
    page[parent] = []

    arr.forEach(item => {
        page[parent].push(item);
        if(item.sub) getPage(item.sub,item.to.name)
    })
}