var navList = [{
    name: '首页',
    to: {
      name: 'index'
    },
    icon: "icon-template"
  },
  {
    name: '广告公司管理',
    icon: "icon-layer",
    to: {
      name: 'agent'
    }
  },
  {
    name: '报表中心',
    icon: "icon-duplicate",
    to: {
      name: 'report'
    },
    sub: [
        {name:'广告公司报表',to:{name:'report.agent'}},
        {name:'合约资源报表',to:{name:'report.sku'}},
    ]
  },
  {
    name: '审核管理',
    icon: "icon-widget-sticker",
    to: {
      name: 'audit'
    },
    sub: [
        {name:'创意审核',to:{name:'audit.creative'}},
        {name:'资质审核',to:{name:'audit.qualification'}},
    ]
  },
  {
    name: '合约资源管理',
    icon: "icon-paste",
    to: {
      name: 'sku'
    },
    sub: [
        {name:'商品列表',to:{name:'sku.manage'}},
        {name:'已购列表',to:{name:'sku.list'}},
    ]
  },
  {
    name: '财务管理',
    icon: "icon-widget-icon-label",
    to: {
      name: 'finance'
    },
    sub: [
        {name:'财务记录',to:{name:'finance.record'}},
        {name:'财务信息',to:{name:'finance.info'}},
        {name:'利润提取',to:{name:'finance.profit'}},
    ]
  }
]

export default navList