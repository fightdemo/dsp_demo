import Vue from 'vue'
import Router from 'vue-router'

import Adv from 'adv@/views/adv'
import Tool from 'adv@/views/tool'
// 首页
import Index from 'adv@/views/index'
// 投放管理
import Activity from 'adv@/views/delivery/activity'
import ActivityAdd from 'adv@/views/delivery/activityAdd'
import Order from 'adv@/views/delivery/order'
import Creative from 'adv@/views/delivery/creative'
import NewOrder from 'adv@/views/delivery/newOrder'
// 投放报表
import Delivery from 'adv@/views/report/delivery'
import DeliveryActivity from 'adv@/views/report/delivery/activity'
import DeliveryOrder from 'adv@/views/report/delivery/order'
import DeliveryCreative from 'adv@/views/report/delivery/creative'
import DeliveryTime from 'adv@/views/report/delivery/time'
// 媒体报表
import Media from 'adv@/views/report/media'
import MediaApp from 'adv@/views/report/media/app'
import MediaSpace from 'adv@/views/report/media/space'
import MediaIndustry from 'adv@/views/report/media/industry'
import MediaPeople from 'adv@/views/report/media/people'
// 定向报表
import Direct from 'adv@/views/report/direct'
import DirectArea from 'adv@/views/report/direct/area'
import DirectOs from 'adv@/views/report/direct/os'
import DirectNet from 'adv@/views/report/direct/net'
import DirectIsp from 'adv@/views/report/direct/isp'
// 订单报表
import Deal from 'adv@/views/report/deal'
import DealPdb from 'adv@/views/report/deal/pdb'
import DealPd from 'adv@/views/report/deal/pd'
// 系统管理
import System from 'adv@/views/system'
import SystemBase from 'adv@/views/system/base'
import SystemQua from 'adv@/views/system/qualification'
// 财务
import Finance from 'adv@/views/finance'
// 监测管理
import Audiences from "adv@/views/tool/audiences"
// 落地页检测
import Detection from "adv@/views/tool/detection"
// dmp
import Dmp from "adv@/views/dmp"
//工具箱
import ToolPage from "adv@/views/toolPage"

var tpl = {
  template: '<router-view/>'
};

Vue.use(Router)
export default new Router({
  linkActiveClass: 'active',
  routes: [{
    name: "adv",
    path: '/:isDirect/:advID',
    component: Adv,
    children: [{
        path: 'index',
        name: 'index',
        component: Index
      }, {
        path: 'delivery',
        name: 'delivery',
        component: tpl,
        children: [{
          path: 'activity',
          name: 'delivery.activity',
          component: Activity
        },{
          path: 'activityAdd/:id?',
          name: 'delivery.activityAdd',
          component: ActivityAdd
        }, {
          path: 'order',
          name: 'delivery.order',
          component: Order
        }, {
          path: 'creative',
          name: 'delivery.creative',
          component: Creative
        }, {
          path: 'newOrder',
          name: 'delivery.newOrder',
          component: NewOrder
        }]
      }, {
        path: 'report',
        name: 'report',
        component: tpl,
        children: [{
            path: 'delivery',
            name: 'report.delivery',
            component: Delivery,
            children: [{
              path: "activity/:activityID?",
              name: 'report.delivery.activity',
              component: DeliveryActivity,
            }, {
              path: "order/:activityID?",
              name: 'report.delivery.order',
              component: DeliveryOrder,
            }, {
              path: "creative",
              name: 'report.delivery.creative',
              component: DeliveryCreative,
            }, {
              path: "time",
              name: 'report.delivery.time',
              component: DeliveryTime,
            }]
          },
          {
            path: 'media',
            name: 'report.media',
            component: Media,
            children: [{
              path: "app",
              name: 'report.media.app',
              component: MediaApp,
            }, {
              path: "space",
              name: 'report.media.space',
              component: MediaSpace,
            }, {
              path: "industry",
              name: 'report.media.industry',
              component: MediaIndustry,
            }, {
              path: "people",
              name: 'report.media.people',
              component: MediaPeople,
            }]
          },
          {
            path: 'direct',
            name: 'report.direct',
            component: Direct,
            children: [{
              path: "area",
              name: 'report.direct.area',
              component: DirectArea,
            }, {
              path: "os",
              name: 'report.direct.os',
              component: DirectOs,
            }, {
              path: "net",
              name: 'report.direct.net',
              component: DirectNet,
            }, {
              path: "isp",
              name: 'report.direct.isp',
              component: DirectIsp,
            }]
          },
          {
            path: 'deal',
            name: 'report.deal',
            component: Deal,
            children: [{
              path: "pdb",
              name: 'report.deal.pdb',
              component: DealPdb,
            }, {
              path: "pb",
              name: 'report.deal.pd',
              component: DealPd,
            }]
          },
        ]
      },
      {
        path: 'system',
        name: 'system',
        component: System,
        children: [{
            path: 'base',
            name: 'system.base',
            component: SystemBase
          },
          {
            path: 'qualification',
            name: 'system.qualification',
            component: SystemQua
          },
        ]
      },
      {
        path: 'finance',
        name: 'finance',
        component: Finance,
      }, {
        name: 'dmp',
        path: 'dmp',
        component: Dmp
      },{
        name: 'toolPage',
        path: 'toolPage',
        component: ToolPage
      }
    ]
  },
  {
    name: 'tool',
    path: '/:isDirect/:advID/tool',
    component: Tool,
    children: [
      {
        name: 'tool.audiences',
        path: 'audiences',
        component: Audiences
      },
      {
        name: 'tool.detection',
        path: 'detection',
        component: Detection
      }
    ]
  }
]
})
