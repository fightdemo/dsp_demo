import Vue from 'vue'
import Router from 'vue-router'

import Index from 'saas@/views/index'
import ReportAgent from 'saas@/views/report/agent'
import ReportSku from 'saas@/views/report/sku'
import Creative from 'saas@/views/audit/creative'
import Qualification from 'saas@/views/audit/qualification'
import Agent from 'saas@/views/agent'
import Record from 'saas@/views/finance/record'
import Info from 'saas@/views/finance/info'
import Profit from 'saas@/views/finance/profit'
import Detail from 'saas@/views/finance/detail'
import Reward from 'saas@/views/reward'
import skuManage from 'saas@/views/sku/manage'
import skuDetail from 'saas@/views/sku/detail'
import skuList from 'saas@/views/sku/list'

var tpl = {
  template: '<router-view/>'
};

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [{
    name: 'saas',
    path: '/',
    component: tpl,
    children: [
      {
        path: 'index',
        name: 'index',
        component: Index
      },
      {
        path: 'reward',
        name: 'reward',
        component: Reward
      },
      {
        path: 'report',
        name: 'report',
        component: tpl,
        children: [
          {
            path: 'agent',
            name: 'report.agent',
            component: ReportAgent
          },
          {
            path: 'sku',
            name: 'report.sku',
            component: ReportSku
          }
        ]
      },
      {
        path: 'audit',
        name: 'audit',
        component: tpl,
        children: [
          {
            path: 'creative',
            name: 'audit.creative',
            component: Creative
          },
          {
            path: 'qualification',
            name: 'audit.qualification',
            component: Qualification
          }
        ]
      },
      {
        path: 'agent',
        name: 'agent',
        component: Agent
      },
      {
        path: 'finance',
        name: 'finance',
        component: tpl,
        children: [
          {
            path: 'record',
            name: 'finance.record',
            component: Record,
          },{
            path: 'info',
            name: 'finance.info',
            component: Info,
          },{
            path: 'profit',
            name: 'finance.profit',
            component: Profit,
          },{
            path: 'detail/:id/:type',
            name: 'finance.detail',
            component: Detail,
          }
        ]
      },{
        path: '/sku',
        name: 'sku',
        component: tpl,
        children: [
          {
            path: 'manage',
            name: 'sku.manage',
            component: skuManage
          }, {
            path: 'detail/:type/:id',
            name: 'sku.detail',
            component: skuDetail
          }, {
            path: 'list',
            name: 'sku.list',
            component: skuList
          }
        ]
      }
    ]
  }]
})
