export {
  auditState,
  state,
  state2,
  target,
  campaignType,
  uppercase,
  number,
  action,

  dataTypes,
  creativeTypes,
  interactionTypes,
  adTypes
}



function adTypes(value) {
  if (!value) return ''
  return {
    1: 'banner',
    2: '开屏',
    3: '插屏',
    4: '视频贴片',
    5: '原生',
    6: '激励视频',
  } [value]
}
function creativeTypes(value) {
  if (!value) return ''
  return {
    1: '单图',
    2: '一图三文',
    3: '文字链',
    4: '视频',
    5: 'H5',
    6: '原生',
  } [value]
}
function interactionTypes(value) {
  if (!value) return ''
  return {
    1: '仅展示',
    2: '下载应用',
    4: '跳转网页',
  } [value]
}
function dataTypes() {
  if (!value) return ''
  return {
    1: '品牌名称/贊助信息',
    2: '描述信息',
    3: '用户评级',
    4: '点赞数',
    5: '下载数量',
    6: '价格',
    7: '售卖价格',
    8: '服务电话',
    9: '地址',
    10: '描述信息2',
    11: 'URL',
    12: '评论数',
    13: 'H5',
  } [value]
}


function action(value) {
  if (!value) return ''
  return {
    deposit:'转入',
    withdraw:'转出',
    rtbProfit:'利润提取',
  } [value]
}
function auditState(value) {
  if (!value) return ''
  return {
    1: '待审核',
    2: '审核通过',
    3: '审核拒绝',
  } [value]
}
// 操作状态
function state(value) {
  if (!value) return ''
  return {
    0: '启用',
    1: '暂停',
    2: '删除',
  } [value]
}

// 操作状态
function state2(value) {
  if (!value) return ''
  return {
    10011: '启用',
    10012: '暂停',
    10013: '删除',
    10014: '不限(包含已删除)',
    10111: '投放中',
    10112: '计划新建',
    10113: '审核不通过',
    10114: '新建审核中',
    10115: '修改审核中',
    10116: '已暂停',
    10117: '已被广告组暂停',
    10118: '未达到投放时间',
    10119: '广告计划超出预算',
    10120: '广告组超出预算',
    10121: '账号余额不足',
    10122: '不在投放时段',
    10123: '已完成',
    10124: '已删除',
    10125: '不限(包含已删除)',
    10211: '投放中',
    10212: '审核不通过',
    10225: '不限(包含已删除)',
    10224: '已删除',
    10223: '已完成',
    10222: '不在投放时段',
    10221: '账号余额不足',
    10220: '广告组超出预算',
    10219: '广告计划超出预算',
    10218: '未达到投放时间',
    10217: '已被广告组暂停',
    10216: '广告计划已暂停',
    10215: '已暂停',
    10214: '修改审核中',
    10213: '新建审核中',
  } [value]
}

// 转化目标
function target(value) {
  if (!value) return ''
  return {
    phone: '电话拨打',
    form: '表单提交',
    consult_effective: '有效咨询',
    wechat: '微信复制',
    view: '页面访问',
    shoppping: '购买',
    other: '其他',
  } [value]
}

function campaignType(value) {
  if (!value) return ''
  return {
    landingPage: '落地页',
    app: 'App应用',
    article: '头条文章',
  } [value]
}

//小写转大写
function uppercase(val) { 
  return val.toUpperCase()
 }

// 数字处理
function number(num,decimal) {
  var num = (num || 0).toString(),
    result = '',arr,d,isNegative = false;
  // 判断是否为负数
  if(num < 0) {
    isNegative = true;
    // 截取负号
    num = num.substring(1)
  }
  // 将小数与整数分离
  arr = num.split('.');
  num = arr[0];
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  if (decimal) {
    // 保留decimal位小数点
    d = parseFloat('0.'+(arr[1]||'0')).toFixed(decimal);
    // 剔除第一位0后加上整数部分
    result = result + d.substr(1);
  } else if(arr[1]) {
    // 保留全部小数
    result += "." + arr[1]
  }
  // 将截取的负号添加回去
  if(isNegative) result = "-" + result;
  return result;
}


