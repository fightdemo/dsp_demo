import Axios from 'axios'
import {
  Loading,
  Message
} from 'element-ui';
import {
  baseURL
} from './config';

Axios.defaults.baseURL = baseURL;
Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';


export {
  ajax,
  getQueryString,
  getNowFormatDate,
  nextDayFnc,
  exportCsv,
  parseDate,
  getTime,
  ymd,
  floatScroll,
  fiveMultiple,
  timeToMillion,
  getParameter,
  fmoney
}
var loadingInstance;
let ajaxNums = 0;
function ajax(option) {
  var token = ajax.token;
  option.data = option.data || {};
  if (token && !option.data.token) option.data.token = token;
  if (option.load) {
    loadingInstance = Loading.service({
      lock: false,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
  }
  ajaxNums++;
  return Axios({
    url: option.url,
    method: option.method || 'post',
    data: option.stringify === false ? option.data : JSON.stringify(option.data),
    params: option.params
  }).then(function (response) {
    ajaxNums--;
    if(ajaxNums == 0) {
      loadingInstance.close();
    }
    // if (option.load) loadingInstance.close();
    var data = response.data;
    if (typeof data == "string") {
      data = JSON.parse(data);
    }
    if (data.status == "0") {
      return Promise.resolve(data);
    } else if (data.status == 30001) {
      throw new Error("登录失效,请重新登录");
    } else {
      throw new Error(data.error);
    }
  }).catch(function (error) {
    if (option.load) loadingInstance.close();
    if (error.message == "无效的Token") {
      // ajax.logout && ajax.logout();
      Message.error(error.message);
      setTimeout(()=>{
        location.href = "./"
      },1000)
    } else {
      Message.error(error.message)
      return Promise.reject(error);
    }
  });
}
ajax.setToken = function (token) {
  ajax.token = token
}
// ajax.logout = function(cb) {
//   cb()
// }
ajax.all = Axios.all;

// 获取url参数
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

//获取当前时间戳 reutrn YYYY-MM-DD
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  //var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();

  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }


  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;

  return currentdate;

};
//传入 YYYYY-MM-DD 转成 yyyy年mm月dd日
function ymd(date) {
  var flag = date.slice(4, 5);
  if (flag == "-") {
    var newDate = date.split("-");
    var ymdTime = newDate[0] + "年" + newDate[1] + "月" + newDate[2] + "日";
    return ymdTime;
  }

};
/***参数都是以周一为基准的***/
//上周的开始时间 getTime(7,1)
//上周的结束时间 getTime(1,1)
//本周的开始时间 getTime(0,1)
//本周的结束时间 getTime(-6,1)
function getTime(n, m) {
  var now = new Date();
  var year = now.getFullYear();
  //因为月份是从0开始的,所以获取这个月的月份数要加1才行
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var day = now.getDay();
  // console.log(date);
  //判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
  if (day !== 0) {
    n = n + (day - 1);
  } else {
    n = n + day;
  }
  if (day) {
    //这个判断是为了解决跨年的问题
    if (month > 1) {
      month = month;
    }
    //这个判断是为了解决跨年的问题,月份是从0开始的
    else {
      year = year - 1;
      month = 12;
    }
  }
  now.setDate(now.getDate() - n);
  year = now.getFullYear();
  month = now.getMonth() + 1;
  date = now.getDate();
  // console.log(n);
  var s;
  if (m == 1) {
    s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date); //m=1,2018-01-01
  } else if (m == 2) {
    s = year + "年" + (month < 10 ? ('0' + month) : month) + "月" + (date < 10 ? ('0' + date) : date) + '日'; //m=2,2018年01月01日
  }
  return s;
};
//传入一个  YYYYY-MM-DD  前推和后退数以天数
function nextDayFnc(startTime, y, z) {
  var startTime = startTime;
  var startTime2 = startTime.split("-");
  var year = parseInt(startTime2[0]);
  var month = parseInt(startTime2[1]);
  var day = parseInt(startTime2[2]);
  var myDate = new Date();
  var setYesDay = parseInt(myDate.setFullYear(year, month - 1, day));
  if (z == 1) {
    var yesterday = parseInt(setYesDay - 86400000 * y); //加减天数改变这个毫秒数
  } else if (z == 2) {
    var yesterday = parseInt(setYesDay + 86400000 * y); //z==1时为-  z==2时为+
  }
  var ds = new Date(yesterday);
  var oldYear = ds.getYear() + 1900;
  var oldMonth = ds.getMonth() + 1;
  if (oldMonth < 10) {
    oldMonth = "0" + oldMonth;
  } else {
    oldMonth = oldMonth;
  }
  var oldDay = ds.getDate();
  if (oldDay < 10) {
    oldDay = "0" + oldDay;
  } else {
    oldDay = oldDay;
  }
  var yesDay = oldYear + "-" + oldMonth + "-" + oldDay;
  return yesDay;
};
//传入 YYYYY-MM-DD 转成 yyyy年mm月dd日
function parseDate(date) {
  var newDate = date.split("-");
  return newDate[0] + "年" + newDate[1] + "月" + newDate[2] + "日";
}

// 下载报表
function exportCsv(obj, name) {
  var titleForKey = obj.titleForKey;
  var data = obj.data;
  var str = [];
  str.push(obj.title.join(",") + "\r\n");
  for (var i = 0; i < data.length; i++) {
    var temp = [];
    for (var j = 0; j < titleForKey.length; j++) {
      temp.push(`"${data[i][titleForKey[j]]}"`);
    }
    str.push(temp.join(",") + "\r\n");
  }
  var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str.join(""));

  var downloadLink = document.createElement("a");
  downloadLink.href = uri;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

// function floatScroll($box, callback) {
//   var mouseX, objX,
//     oldTime = new Date(),
//     content = $box.find(".slider-content")[0],
//     isDowm = false,
//     // fW = $box[0].clientWidth,
//     fW = $("#tableInfo thead").width(),
//     sW = content.clientWidth,
//     ratio = sW / fW,
//     bW = sW * ratio,
//     max = fW - bW,
//     $body = $("body")
//   scroll = $box.find(".bar");
//   // if(ratio == 1) {
//   //     return;
//   // }
//   // console.log(fW,sW,ratio,bW,max)
//   $box.addClass("slider-box")
//   scroll.width(bW);
//   // scroll.width($scrollWidth.width());
//   $(document).off("mousedown").on("mousedown", ".slider-bar > .bar", function (e) {
//     var e = e || event;
//     // e.preventDefault();     //非IE浏览器
//     objX = this.parentNode.style.marginLeft || 0;
//     mouseX = e.clientX;
//     isDowm = true;
//     $body.addClass('select-none')
//   })
//   document.onmousemove = function (e) {
//     if (isDowm) {
//       var x = e.clientX;
//       var target = 0;
//       var left = Math.abs(parseInt(objX)) + parseInt(x) - parseInt(mouseX);
//       if (left < 0) {
//         target = 0;
//       } else if (left > max) {
//         target = max;
//       } else {
//         target = left;
//       }
//       for (var i = 0; i < scroll.length; i++) {
//         scroll[i].style.left = target + "px";
//       }
//       var left = target / max * (sW - fW);
//       content.style.marginLeft = left + "px";
//       callback && callback(left)
//     }
//   }
//   document.onmouseup = function (e) {
//     $body.removeClass('select-none')
//     if (isDowm) {
//       isDowm = false;
//     }
//   }
//   document.onscroll = function () {
//     var page = $("#pageToolbar");
//     if (page.length == 0) {
//       document.onscroll = null;
//       return;
//     };
//     var top = document.documentElement.scrollTop || document.body.scrollTop;
//     // 判断是否换页了
//     if (top > (page.offset().top - $(window).height())) {
//       scroll.parent().removeClass("bottom")
//     } else {
//       scroll.parent().addClass("bottom")
//     }
//   }
//   document.onscroll()
// }

function floatScroll($box, callback) {
  var mouseX, objX,
    oldTime = new Date(),
    content = $box.find(".table-box")[0],
    isDowm = false,
    fW = $box[0].clientWidth,    //盒子宽度
    sW = content.clientWidth,    //内容宽度
    sH = content.scrollHeight,   //内容高度
    ratio = fW / sW,             //1:bar显示的宽度 比例
    bW = fW * ratio,             //bar的宽度        
    max = fW - bW,               //移动的最大距离  
    $body = $("body"),
    scrollHidden = $('#scrollWrap'),
    scrollWarp = $('.scroll-wrap'),  
    scroll = $('.h-bar');        
    // scroll = $box.find(".bar");        
  $box.addClass("slider-box")
  if(fW == sW) {
    fW = 0;
    bW = 0;
  }
  // console.log(sH)
  scrollHidden.height(sH+1);
  scrollWarp.width(fW); //设置barWrap宽度
  scroll.width(bW);     //设置bar宽度
  //PC端
  $(document).off("mousedown").on("mousedown", ".scroll-wrap > .h-bar", function (e) {
    var e = e || event;
    objX = this.style.left || 0;
    mouseX = e.clientX;
    isDowm = true;
    $body.addClass('select-none')
  })
  document.onmousemove = function (e) {
    if (isDowm) {
      window.getSelection ? window.getSelection().removeAllRanges():document.selection.empty();
      var x = e.clientX;
      var target = 0;
      var left = parseInt(objX) + parseInt(x) - parseInt(mouseX);
      if (left < 0) {
        target = 0;
      } else if (left > max) {
        target = max;
      } else {
        target = left;
      }
      for (var i = 0; i < scroll.length; i++) {
        scroll[i].style.left = target + "px";
      }
      var left = -target / max * (sW - fW);
      content.style.marginLeft = left + "px";
      callback && callback(left)
    }
  }
  document.onmouseup = function (e) {
    $body.removeClass('select-none')
    if (isDowm) {
      isDowm = false;
    }
  }
  //移动端
  $(document).off("touchstart").on("touchstart", ".scroll-wrap > .h-bar", function (e) {
    var e = e || event;
    objX = this.style.left || 0;
    // mouseX = e.clientX;
    mouseX = e.originalEvent.changedTouches[0].pageX;
    isDowm = true;
    $body.addClass('select-none')
  })
  $(document).on("touchmove", function(e) {
    if (isDowm) {
      window.getSelection ? window.getSelection().removeAllRanges():document.selection.empty();
      // var x = e.clientX;
      var x = e.originalEvent.changedTouches[0].pageX;
      var target = 0;
      var left = parseInt(objX) + parseInt(x) - parseInt(mouseX);
      if (left < 0) {
        target = 0;
      } else if (left > max) {
        target = max;
      } else {
        target = left;
      }
      for (var i = 0; i < scroll.length; i++) {
        scroll[i].style.left = target + "px";
      }
      var left = -target / max * (sW - fW);
      content.style.marginLeft = left + "px";
      callback && callback(left)
    }
  })
  $(document).on("touchend", function(e) {
    $body.removeClass('select-none')
    if (isDowm) {
      isDowm = false;
    }
  })
  document.onscroll = function () {
    var page = $("#pageToolbar");
    if (page.length == 0) {
      document.onscroll = null;
      return;
    };
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    // 判断是否换页了
    if (top > (page.offset().top - $(window).height())) {
      scroll.parent().removeClass("bottom")
    } else {
      scroll.parent().addClass("bottom")
    }
  }
  document.onscroll()
}

//取到最近一个能被5整除的数
function fiveMultiple(val) {
  if (val <= 0) {
    return 0;
  }
  return val - val % 5 + 5
}

//天/时/分
function timeToMillion(times) {
  //     var times;
  // 　　　　　　//如果是2个参数就是时间差
  //     if (endStr) {
  //         var startT = new Date(startStr).getTime()
  //         var endT = new Date(endStr).getTime()
  //         times = (endT - startT) / 1000
  // 　　　　　　// 如果是一个参数，参数值是秒数

  //     } else {
  //         times = startStr
  //     }
  var day, hour, minute, endOutStr;
  if (times > 0) {
    day = Math.floor(times / (60 * 60 * 24));
    hour = Math.floor(times / (60 * 60)) - (day * 24);
    minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
    // second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    if (parseInt(day) != 0) {
      endOutStr = day + "天" + hour + "小时" + minute + "分钟"
    } else {
      if (parseInt(hour) != 0) {
        endOutStr = hour + "小时" + minute + "分钟"
      } else {
        endOutStr = minute + "分钟"
      }
    }
  } else {
    endOutStr = 0
  }
  // if (day <= 9) day = '0' + day;
  // if (hour <= 9) hour = '0' + hour;
  // if (minute <= 9) minute = '0' + minute;
  // if (second <= 9) second = '0' + second;
  return endOutStr
}

/*
  * 参数说明：
  * s：要格式化的数字
  * n：保留几位小数
  * */
function fmoney(s, n) {
  
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(),
      r = s.split(".")[1],
      t = "";
  for (var i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
}

function getParameter(feature) {
  return ajax({
    url: '/dsp/sys/parameter/query',
    data: {
      "filter": {
        "feature": feature
      },
    },
    load: true,
  })
}
