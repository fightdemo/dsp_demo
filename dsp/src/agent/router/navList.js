var navList = [{
    name: "首页",
    actionCode: "1",
    to: {
      name: "index"
    },
    icon: "icon-template"
  },
  {
    name: "投放管理",
    actionCode: "2",
    to: {
      name: "delivery"
    },
    icon: "icon-layer",
    sub: [{
        name: "广告主管理",
        to: {
          name: "delivery.adv"
        }
      },
      {
        name: "人群管理",
        actionCode: "130",
        to: {
          name: "delivery.people"
        }
      }
    ]
  },
  {
    name: "报表中心",
    actionCode: "3",
    to: {
      name: 'report'
    },
    icon: "icon-duplicate",
    sub: [{
        name: "竞价交易报表",
        actionCode: "4",
        to: {
          name: 'report.bid'
        }
      },
      {
        name: "合约交易报表",
        actionCode: "5",
        to: {
          name: 'report.deal'
        }
      },
      {
        name: "合约资源报表",
        actionCode: "6",
        to: {
          name: 'report.resources'
        }
      }
    ]
  },
  {
    name: "合约交易管理",
    actionCode: "15",
    to: {
      name: 'deal'
    },
    icon: "icon-paste",
    sub: [{
      name: '商品列表',
      actionCode: "16",
      to: {
        name: 'deal.resource'
      }
    }, {
      name: '已购列表',
      actionCode: "17",
      to: {
        name: 'deal.list'
      }
    }]
  },
  {
    name: "财务管理",
    actionCode: "12",
    to: {
      name: 'finance'
    },
    icon: "icon-widget-icon-label",
    sub: [{
      name: '财务记录',
      to: {
        name: 'finance.record'
      }
    }, {
      name: '财务信息',
      actionCode: "13",
      to: {
        name: 'finance.info'
      }
    }, {
      name: '利润提取',
      actionCode: "14",
      to: {
        name: 'finance.profit'
      }
    }]
  },
  {
    name: "系统管理",
    actionCode: "7",
    to: {
      name: 'system'
    },
    icon: "icon-cog",
    sub: [{
        name: '账户管理',
        actionCode: "8",
        to: {
          name: 'system.account'
        }
      },
      {
        name: '员工用户管理',
        actionCode: "9",
        to: {
          name: 'system.user'
        }
      },
      {
        name: '广告主管理',
        actionCode: "10",
        to: {
          name: 'system.adv'
        }
      },
      {
        name: '角色管理',
        actionCode: "11",
        to: {
          name: 'system.role',
        },
        hideSub: true,
        sub: [
          {
            name: '员工角色',
            to: {name: 'system.role.user'}
          },
          {
            name: '广告主角色',
            to: {name: 'system.role.adv'}
          }
        ]
      }
    ]
  }
]

export default navList
