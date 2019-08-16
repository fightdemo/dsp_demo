// 报表公共内容
import {
  getNowFormatDate,
  exportCsv,
  floatScroll
} from "@/common/js/utils";
import Chart from "@/common/components/chart";
import ChartBox from "adv@/components/chartBox";


export default {
  components: {
    Chart,
    ChartBox
  },
  created() {
    if(!this.option){
      this.getList();
      this.getTotal();
    }
    this.checkPrivilege()
  },
  computed: {
    silderFlag() {
        return this.$store.state.common.silderFlag
    },
    userInfo() {
        return this.$store.state.common.userInfo;
    }
  },
  watch: {
      silderFlag() {         
          this.init()
      }
  },
  methods: {
    //排序
    changeSort(val, type){    
      this.curSortType = type;
      if(val){
        this.sort = [type+",1"]
      }else{
        this.sort = [type+",0"]
      }
      this.getList()
    },
    // 选择时间
    selectDate(val) {
      this.dataGrain = val.start == val.end ? "hour" : "day";
      this.sTime = val.start + " 00:00:00";
      this.eTime = val.end + " 23:59:59";
      this.pageObj.currentPage = "1";
      this.getList();
      this.getTotal();
    },
    getList() {
      // if(this.option) {
      //   this.filter.activityID = this.option.activityID;
      //   this.filter.orderID = this.option.id;
      // }
      var data = {
        page: this.pageObj.currentPage + "",
        size: this.pageObj.size + "",
        sTime: this.sTime,
        eTime: this.eTime,
        filter: this.filter,
        dataGrain: this.dataGrain,
        sort: this.name == 'tsName' ? '' : this.sort
      };
      this.$ajax({
        url: this.url,
        data: data,
        load: true
      }).then(res => {
        // 列表
        this.list = res.data.data;
        // 图表
        var chartData = {
          xAxis: [],
          advertiserCost: [],
          view: [],
          click: [],
          clickRate: [],
          action: [],
          actionRate: [],
          cpm: [],
          cpc: []
        };
        res.data.data.forEach((v) => {
          chartData.xAxis.push(v[this.name]);
          chartData.advertiserCost.push(v.advertiserCost);
          chartData.view.push(v.view);
          chartData.click.push(v.click);
          chartData.clickRate.push(v.clickRate);
          chartData.action.push(v.action);
          chartData.actionRate.push(v.actionRate);
          chartData.cpm.push(v.cpm);
          chartData.cpc.push(v.cpc);
        });
        this.chartData = chartData;
        // 分页
        this.pageObj.total = res.data.total;
        this.pageObj.currentPage = res.data.page;

        this.tableShow = true;

        this.$nextTick(this.init)
      });
    },
    search(val){
      this.pageObj.currentPage = "1";
      this.filter.name = val;
      this.getList()
      this.getTotal()
    },
    getTotal() {
      if(!this.hasTotal) return;
      var data = {
        sTime: this.sTime,
        eTime: this.eTime,
        filter: this.filter,
        dataGrain: this.dataGrain,
        size: "99999"
      };
      this.$ajax({
        url: this.url + "/sum",
        data: data,
        load: true
      }).then(res => {
        this.total = res.data.data[0];
        this.totalList = res.data.data;
        this.$nextTick(this.init)
      });
    },
    download() {
      var data = {
        filter: this.filter,
        sTime: this.sTime,
        eTime: this.eTime,
        dataGrain: this.dataGrain,
        page: "1",
        size: "99999"
      };
      this.$ajax({
        url: this.url,
        data: data,
        load: true,
      }).then( res => {
        var reportList = res.data.data;
          exportCsv({
              title: this.title,
              titleForKey: this.titleForKey,
              data: reportList
            },
            this.reprotName+".csv"
          );
      } );
    },
    getActivity() {
      this.$ajax({
        url: "/dsp/activity/list",
        data: {
          size: "-1",
          sort: ["viewSort,1"]
        }
      }).then(res => {
        var activityList = res.data.data || [];
        activityList.unshift({
          name: '全部活动'
        })
        this.activityList = activityList;
      });
    },
    getOrder() {
      this.$ajax({
        url: "/dsp/order/list",
        data: {
          size: "-1",
          sort: ["viewSort,1"],
          filter: {
            activityID: this.filter.activityID 
          }
        }
      }).then(res => {
        var orderList = res.data.data || [];
        orderList.unshift({
          name: '全部订单'
        })
        this.orderList = orderList;
      });
    },
    changeActivity(item) {
      this.times++;
      this.filter.activityID = item.activityID;
      if(this.times >=1) {
        this.secondTitle = "全部订单";
        this.idVal = 'undefined';
        this.filter.orderID = "";
        //直接进入
        if(this.option == ''){
          this.getList();
          this.getTotal();
        }
        //调转进入
        if( this.option && this.times > 1 ){
          this.secondTitle = "全部订单";
          this.idVal = 'undefined';
          this.filter.orderID = "";
          this.getList();
          this.getTotal();
        }else if(this.option && this.times == 1){
          this.secondTitle = this.option.secondTitle;
          this.idVal = this.option.id;
        }
      }
      this.pageObj.currentPage = "1";      
      this.getOrder();
      this.spaceTooLList = []
      this.orderKpiList = {}
    },
    changeOrder(item) {
      this.filter.orderID = item.id;
      if( this.option ){
        this.option.id = item.id;
      }
      this.pageObj.currentPage = "1";
      this.getList();
      this.getTotal();

      if( item.name != '全部订单' && this.isOpenTool ){
        this.getSpaceToolList();
        this.getOrderKpi();
        this.changeFlag += 1;
      }else{
        this.spaceTooLList = []
        this.orderKpiList = {}
      }
    },
    changeOs(item) {
        this.filter.os = item.name;
        this.pageObj.currentPage = "1";
        this.getList();
        this.getTotal();
    },

    //获取广告位中的订单设置列表（只有广告位列表使用）
    getSpaceToolList() {
      var data = {
        page: this.pageObj.currentPage + "",
        size: this.pageObj.size+"",
        filter: {
          id: this.filter.orderID
        },
        // filter: this.filter,
        sort: ["cTime,1"]
      };
      this.$ajax({
          url: "/dsp/order/list",
          data: data,
          load: true
      }).then(res => {
          this.spaceTooLList = res.data.data;
      });
    },
    getOrderKpi() {
      this.$ajax({
          url: "/dsp/rpt/order/kpi/get",
          data: {
            data: this.filter.orderID
            // data: '808'
          },
          load: true
      }).then(res => {
        if( res.data ){
          this.orderKpiList = res.data;
        }else{
          this.orderKpiList = {}
        }
      });
    },
    checkPrivilege() {
      this.$ajax({
        url: '/dsp/sys/parameter/query',
        data: {
          "filter":{"feature":"dsp.feature.advertiser.order.kpi.allow"}
        }
      }).then( res => {
        if( res.data[0].value == '1' && this.userInfo.isAdhubUser == 'true' ){
          this.isOpenTool = true;
        }else{
          this.isOpenTool = false;
        }
      } )
    },

    //表格
    init() {
        $('.table-box').css('marginLeft', '0px');
        $(".float-thead").css({left:'0px'});
        $('.h-bar').css('left', '0px');
        this.floatThead($("#tableInfo thead"),$("#float-thead"));
        // this.floatBody($("#tableInfo thead"),$("#float-body"))
        floatScroll($("#tableWrap"),function(left){
            $(".float-thead").css({left:left});
            
        })
        $("html,body").scrollTop(0)
    },
    floatThead($thead,$float) {
        if(!$thead) return;
        var $floatTh = $float.find("th");
        var top = $thead.offset().top - 70;
        $float.css($.extend({},{width:$thead.width(),height:$thead.height()},{position:'absolute','z-index':"1",margin:"0",top:0}))
        // $float.css($.extend({},{width:'100%',height:$thead.height()},{position:'absolute','z-index':"1",margin:"0",top:0}))
        // 设置宽度
        $thead.find("tr > th").each(function(i,v){
            if($floatTh[i]){
                $floatTh[i].style.width = v.offsetWidth+"px";
                $floatTh[i].style.height = v.offsetHidth+"px";
            }
        })
        
        $thead.css({visibility: 'hidden'})
        $float.show();

        var oldTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.onscroll = function() {
            top = $thead.offset().top - 70;
            var newTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
            // 判断是否为横向滚动
            if(oldTop == newTop) return;
            oldTop = newTop;
            if(top < oldTop) {
                $float.css({top:oldTop - top})
                // $('#float-thead2').css({top:oldTop - top}) 
            } else {
                $float.css({top:0})
                // $('#float-thead2').css({top:0}) 
            }
        }
        // 移动滚动条 触发onscroll事件
        document.documentElement.scrollTop++;
        document.body.scrollTop++;
    },
    floatBody($body,$float) {
        if(!$body) return;
        var $floatTh = $float.find("th");
        $body.find("tr > th").each(function(i,v){
            if($floatTh[i]){
                $floatTh[i].style.width = v.offsetWidth+"px";
            }
        })                
    },
    
    //刷新报表数据
    refreshReport() {
      this.getList();
      this.getTotal();
    }
  },
  data: function () {
    return {
      times: 0, //判断是否是通过查看报表进入此页面，0 是，>1 不是
      tableShow: false,
      firstTitle: '全部活动',
      secondTitle: '全部订单',
      idVal: 'undefined',
      chartData: {},
      hasTotal: true,
      totalList: [],
      activityList: [],
      orderList: [],
      chartTargetList: [{
          id: "click",
          name: "点击量"
        },
        {
          id: "clickRate",
          name: "点击率"
        },
        {
          id: "view",
          name: "曝光量"
        },
        {
          id: "action",
          name: "转化"
        },
        {
          id: "actionRate",
          name: "转化率"
        },
        {
          id: "cpm",
          name: "cpm"
        },
        {
          id: "cpc",
          name: "cpc"
        }
      ],
      dataGrain: "hour",
      list: [],
      pageObj: {
        currentPage: 1,
        size: 20,
        total: 0
      },
      filter: {},
      total: {},
      sTime: getNowFormatDate() + " 00:00:00",
      eTime: getNowFormatDate() + " 23:59:59",
      // sort: ["viewSort,1"],
      sort: ["advCostSort,1"],
      // sTime: "2017-01-01 00:00:00",
      // eTime: "2019-12-12 23:59:59",
      spaceTooLList: [],
      orderKpiList: {},
      isOpenTool: false,  //是否可以查看广告位报表中的kpi模块
      changeFlag: 0,
    }
  }
}
