import Vue from 'vue'
import Router from 'vue-router'
// 首页
import Index from 'agent@/views/index'
// 中转页
import Transfer from 'agent@/views/transfer'
// 投放管理
import Adv from 'agent@/views/delivery/adv'
import People from 'agent@/views/delivery/people'
// 报表
import Bid from 'agent@/views/report/bid'
import Deal from 'agent@/views/report/deal'
import Resources from 'agent@/views/report/resources'
// 系统管理
import Account from 'agent@/views/system/account'
import User from 'agent@/views/system/user'
import AdvManage from 'agent@/views/system/adv'
import Role from 'agent@/views/system/role'
import RoleAdv from 'agent@/views/system/role/adv'
import RoleUser from 'agent@/views/system/role/user'
import Permission from 'agent@/views/system/permission'
import Qualification from 'agent@/views/system/qualification'
import Oem from 'agent@/views/system/oem'
// 财务
import Record from 'agent@/views/finance/record'
import Info from 'agent@/views/finance/info'
import Profit from 'agent@/views/finance/profit'
import FinanceDetail from 'agent@/views/finance/detail'
// 合约
import DealResource from 'agent@/views/deal/resource'
import DealList from 'agent@/views/deal/list'
import DealDetail from 'agent@/views/deal/detail'
import DealShop from 'agent@/views/deal/shop'
// dmp
import Dmp from "agent@/views/dmp"

var tpl = {
  template: '<router-view/>'
};

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [{
    name: "agent",
    path: '/:agentID',
    component: tpl,
    children: [{
        path: 'index',
        name: 'index',
        component: Index
      },
      {
        path: 'transfer/:advID',
        name: 'transfer',
        component: Transfer
      },
      {
        path: 'delivery',
        name: 'delivery',
        component: tpl,
        children: [{
          name: 'delivery.adv',
          path: 'adv',
          component: Adv
        }, {
          name: 'delivery.people',
          path: 'people',
          component: People
        }]
      },
      {
        path: 'report',
        name: 'report',
        component: tpl,
        children: [{
          name: 'report.bid',
          path: 'bid',
          component: Bid
        }, {
          name: 'report.deal',
          path: 'deal',
          component: Deal
        }, {
          name: 'report.resources',
          path: 'resources',
          component: Resources
        }]
      },
      {
        path: 'system',
        name: 'system',
        component: tpl,
        children: [{
          name: 'system.account',
          path: 'account',
          component: Account
        }, {
          name: 'system.user',
          path: 'user',
          component: User
        }, {
          name: 'system.adv',
          path: 'adv',
          component: AdvManage
        }, {
          name: 'system.qualification',
          path: 'qualification/:advID',
          component: Qualification
        }, {
          name: 'system.oem',
          path: 'oem',
          component: Oem
        }, {
          name: 'system.role',
          path: 'role',
          component: Role,
          children: [{
              name: 'system.role.adv',
              path: 'adv',
              component: RoleAdv,
            },
            {
              name: 'system.role.user',
              path: 'user',
              component: RoleUser,
            }
          ]
        }, {
          name: 'system.permission',
          path: 'permission/:type/:id?',
          component: Permission
        }]
      }, {
        path: 'finance',
        name: 'finance',
        component: tpl,
        children: [{
          name: 'finance.record',
          path: 'record',
          component: Record
        }, {
          name: 'finance.info',
          path: 'info',
          component: Info
        }, {
          name: 'finance.profit',
          path: 'profit',
          component: Profit
        }, {
          name: 'finance.detail',
          path: 'detail/:id/:type',
          component: FinanceDetail
        }]
      }, {
        path: 'deal',
        name: 'deal',
        component: tpl,
        children: [{
          name: 'deal.resource',
          path: 'resource',
          component: DealResource
        }, {
          name: 'deal.list',
          path: 'list',
          component: DealList
        },{
          name: 'deal.detail',
          path: 'detail/:id',
          component: DealDetail
        },{
          name: 'deal.shop',
          path: 'shop/:id',
          component: DealShop
        }]
      },{
        name: 'dmp',
        path: 'dmp',
        component: Dmp
      }

    ]
  }]
})
