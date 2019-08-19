import Vue from 'vue'
import Router from 'vue-router'
import adminIndex from 'admin@/views/index' //首页
import adminAgentM from 'admin@/views/agentM' //saas代理商管理
import adminAgentForm from 'admin@/views/Form/agentForm' //表单 - 代理商表单
import adminAdvForm from 'admin@/views/Form/advForm' //表单 - 广告主表单
import adminAcpForm from 'admin@/views/Form/acpForm' //表单 - 广告公司表单
// import adminFinance from 'admin@/views/Finance' //财务管理 - 财务记录
import adminFrecord from 'admin@/views/Finance/record' //财务管理 - 财务记录
import adminFinfo from 'admin@/views/Finance/info' //财务管理 - 财务信息
import adminDiagAccount from 'admin@/views/diagnosis/account' //诊断 - 账户
import adminDiagActivity from 'admin@/views/diagnosis/activity' //诊断 - 活动
import adminDiagorder from 'admin@/views/diagnosis/order' //诊断 - 订单
import adminDiagHistory from 'admin@/views/diagnosis/historyOrder' //诊断 - 订单定向
import adminDreport from 'admin@/views/delivery/report' //投放完成率 - 报表
import adminDtool from 'admin@/views/delivery/tool' //投放完成率 - 工具
import adminOrderDetail from 'admin@/views/delivery/orderDetail' //投放完成率 - 订单详情
import skuManage from 'admin@/views/sku/manage'
import skuDetail from 'admin@/views/sku/detail'

import adminOEM from 'admin@/views/tool/oem'
import advspaceM from 'admin@/views/tool/advspaceM'
import exConfig from 'admin@/views/tool/adminDirectEx'

Vue.use(Router)
var tpl = {
  template: '<router-view/>'
};

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: adminIndex
    },{
      path: '/index',
      name: 'adminIndex',
      component: adminIndex,
    },{
      path: '/SaaS',
      name: 'adminM',
      component: adminAgentM
    },{
      path: '/finance',
      name: 'adminFinance',
      component: tpl,
      children: [
        {
          path: 'record',
          name: 'adminFinance.record',
          component: adminFrecord
        },{
          path: 'info',
          name: 'adminFinance.info',
          component: adminFinfo
        }
      ]
    },{
      path: '/form',
      name: 'adminform',
      component: tpl,
      children: [
        {
          path: 'agent',
          name: 'adminform.agent',
          component: adminAgentForm
        },{
          path: 'adv',
          name: 'adminform.adv',
          component: adminAdvForm
        },{
          path: 'acp',
          name: 'adminform.acp',
          component: adminAcpForm
        }
      ]
    },{
      path: '/diag',
      name: 'adminDiag',
      component: tpl,
      children: [
        {
          path: 'account',
          name: 'adminDiag.account',
          component: adminDiagAccount
        },{
          path: 'activity',
          name: 'adminDiag.activity',
          component: adminDiagActivity
        },{
          path: 'order',
          name: 'adminDiag.order',
          component: adminDiagorder
        },{
          path: 'historyO',
          name: 'adminDiag.historyO',
          component: adminDiagHistory
        }
      ]
    },{
      path: '/tool',
      name: 'adminTool',
      component: tpl,
      children: [
        {
          path: 'oem',
          name: 'adminTool.oem',
          component: adminOEM
        },
        {
          path: 'advspaceM',
          name: 'adminTool.advspaceM',
          component: advspaceM
        },
        {
          path: 'exConfig',
          name: 'adminTool.exConfig',
          component: exConfig
        }
      ]
    },{
      path: '/delivery',
      name: 'adminD',
      component: tpl,
      children: [
        {
          path: 'report',
          name: 'adminD.report',
          component: adminDreport
        },{
          path: 'tool',
          name: 'adminD.tool',
          component: adminDtool
        },{
          // path: 'orderDetail/:orderId',
          path: 'orderDetail',
          name: 'adminD.orderDetail',
          component: adminOrderDetail
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
          path: 'detail/:id',
          name: 'sku.detail',
          component: skuDetail
        }
      ]
    }
  ]
})
