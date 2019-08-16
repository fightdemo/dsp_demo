var navList = [{
    name: "首页",
    actionCode: "47",
    to: {
      name: "index"
    },
    icon: "icon-template"
  },
  {
    name: "投放管理",
    actionCode: "48",
    to: {
      name: "delivery"
    },
    icon: "icon-layer",
    sub: [{
        name: "活动管理",
        actionCode: "49",
        to: {
          name: "delivery.activity"
        }
      },
      {
        name: "订单管理",
        actionCode: "50",
        to: {
          name: "delivery.order"
        }
      },
      {
        name: "素材管理",
        actionCode: "51",
        to: {
          name: "delivery.creative"
        }
      }
    ]
  },
  {
    name: "报表中心",
    actionCode: "53",
    to: {
      name: 'report'
    },
    icon: "icon-duplicate",
    sub: [{
        name: "投放报表",
        actionCode: "101",
        to: {
          name: 'report.delivery'
        },
        sub: [{
          name: '活动报表',
          actionCode: "124",
          to: {
            name: 'report.delivery.activity'
          },
        }, {
          name: '订单报表',
          actionCode: "125",
          to: {
            name: 'report.delivery.order'
          },
        }, {
          name: '素材报表',
          actionCode: "126",
          to: {
            name: 'report.delivery.creative'
          },
        }, {
          name: '时间报表',
          actionCode: "127",
          to: {
            name: 'report.delivery.time'
          },
        }]
      },
      {
        name: "媒体报表",
        actionCode: "102",
        to: {
          name: 'report.media'
        },
        sub: [{
          name: 'App报表',
          actionCode: "120",
          to: {
            name: 'report.media.app'
          },
        }, {
          name: '广告位报表',
          actionCode: "121",
          to: {
            name: 'report.media.space'
          },
        }, {
          name: '行业包报表',
          actionCode: "122",
          to: {
            name: 'report.media.industry'
          },
        }, {
          name: '人群包报表',
          actionCode: "123",
          to: {
            name: 'report.media.people'
          },
        }]
      },
      {
        name: "定向报表",
        actionCode: "103",
        to: {
          name: 'report.direct'
        },
        sub: [{
          name: '地域报表',
          actionCode: "116",
          to: {
            name: 'report.direct.area'
          },
        }, {
          name: '操作系统报表',
          actionCode: "117",
          to: {
            name: 'report.direct.os'
          },
        }, {
          name: '联网方式报表',
          actionCode: "118",
          to: {
            name: 'report.direct.net'
          },
        }, {
          name: '运营商报表',
          actionCode: "119",
          to: {
            name: 'report.direct.isp'
          },
        }]
      },
      {
        name: "合约交易报表",
        actionCode: "55",
        to: {
          name: 'report.deal'
        },
        sub: [{
          name: '保价保量交易报表',
          actionCode: "128",
          to: {
            name: 'report.deal.pdb'
          },
        }, {
          name: '保价不保量交易报表',
          actionCode: "129",
          to: {
            name: 'report.deal.pd'
          },
        }]
      }
    ]
  },
  {
    name: "系统管理",
    to: {
      name: 'system'
    },
    actionCode: "56",
    icon: "icon-cog",
    hideSub: true,
    sub: [{
        name: '基本信息',
        to: {
          name: 'system.base'
        }
      },
      {
        name: '资质信息',
        to: {
          name: 'system.qualification'
        }
      }
    ]
  },
  {
    name: "财务管理",
    actionCode: "59",
    to: {
      name: 'finance'
    },
    icon: "icon-widget-icon-label"
  }
]

export default navList
