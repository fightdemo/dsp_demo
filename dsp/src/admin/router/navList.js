var navList = [{
  name: '首页',
  actionCode: '300',
  to: {
    name: 'adminIndex'
  },
  icon: "icon-template"
}, {
  name: '代理商管理',
  actionCode: '302',
  icon: "icon-layer",
  to: {
    name: 'adminM'
  }

}, {
  name: '财务管理',
  icon: "icon-widget-icon-label",
  actionCode: '309',
  to: {
    name: 'adminFinance'
  },
  sub: [{
    name: '财务记录',
    actionCode: '310',
    to: {
      name: 'adminFinance.record'
    }
  }, {
    name: '财务信息',
    actionCode: '311',
    to: {
      name: 'adminFinance.info'
    }
  }]

}, {
  name: '报表中心',
  icon: "icon-duplicate",
  actionCode: '313',
  to: {
    name: 'adminform'
  },
  sub: [{
    name: '代理商报表',
    actionCode: '314',
    to: {
      name: 'adminform.agent'
    },
  }, {
    name: '广告公司报表',
    actionCode: '315',
    to: {
      name: 'adminform.acp'
    },
  }, {
    name: '广告主报表',
    actionCode: '316',
    to: {
      name: 'adminform.adv'
    },
  }]

}, {
  name: '诊断',
  icon: "icon-widget-sticker",
  actionCode: '317',
  to: {
    name: 'adminDiag'
  },
  sub: [{
    actionCode: '318',
    name: '账户',
    to: {
      name: 'adminDiag.account'
    },
  }, {
    name: '活动',
    actionCode: '319',
    to: {
      name: 'adminDiag.activity'
    },

  }, {
    name: '订单',
    actionCode: '320',
    to: {
      name: 'adminDiag.order'
    },

  }, {
    name: '订单定向',
    actionCode: '321',
    to: {
      name: 'adminDiag.historyO'
    },

  }]

}, {
  name: '运营工具',
  to: {
    name: 'adminTool'
  },
  icon: "icon-cog",
  sub: [{
    name: 'oem设置',
    to: {
      name: 'adminTool.oem'
    }
  },{
    name: '广告位管理',
    to: {
      name: 'adminTool.advspaceM'
    }
  },
  // {
  //   name: '定向扩量配置',
  //   to: {
  //     name: 'adminTool.exConfig'
  //   }
  // }
  ]
}, {
  name: '投放完成率评估',
  actionCode: '322',
  icon: "icon-cubes",
  to: {
    name: 'adminD'
  },
  sub: [{
    name: '报表',
    actionCode: '323',
    to: {
      name: 'adminD.report'
    },

  }, {
    name: '工具',
    actionCode: '324',
    to: {
      name: 'adminD.tool'
    }

  }],

},{
  name: '合约资源管理',
  to: {
    name: 'sku'
  },
  hideSub: true,
  sub:[{
    name: '合约资源管理',
    to: {
      name: 'sku.manage'
    },
  }],
  icon: "icon-paste"
},
// {
//   name: '合约资源管理',
//   to: {
//     name: 'sku.manage'
//   },
//   icon: "icon-paste"
// }
]
export default navList
