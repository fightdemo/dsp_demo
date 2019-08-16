<template>
<div id="admin">
    <p class="page-title">首页</p>
    <target :data="targetData" :list="targetList" hideName></target>
    <div class="content">
        <chart :targetList="chartTargetList" :data="chartData"></chart>
    </div>
</div>  
</template>
<script>
import { getNowFormatDate } from "@/common/js/utils";
import Target from "@/common/components/target"; 
import Chart from "@/common/components/chart";
export default {
    data(){
        return {
            sTime: getNowFormatDate() + " " + "00:00:00",
            eTime: getNowFormatDate() + " " + "23:59:59",
            targetData: {},
            targetList: [
                {
                    name: '代理商当日花费',
                    t: 'dspCost',
                    yT: 'ytdspCost',
                    ybT: 'ybtdspCost'
                   
                },{
                    name: '当日成本',
                    t: 'adminCost',
                    yT: 'ytadminCost',
                    ybT: 'ybtadminCost'
                },{
                    name: '当日利润',
                    t: 'adminProfit',
                    yT: 'ytadminProfit',
                    ybT: 'ybtadminProfit'
                    
                },{
                    name: '当日利润率',
                    t: 'adminProfitRate',
                    isRate: true,
                    yT: 'ytadminProfitRate',
                    ybT: 'ybtadminProfitRate'
                },{
                    name: 'CPM',
                    t: 'cpm',
                    yT: 'ytcpm',
                    ybT: 'ybtcpm'
                },{
                    name: 'CPC',
                    t: 'cpc',
                    yT: 'ytcpc',
                    ybT: 'ybtcpc'
                }
            ],
            chartData:{},
            chartTargetList: [
                {id:"click",name:"点击量"},
                {id:"clickRate",name:"点击率"},
                {id:"view",name:"曝光量"},
                {id:"action",name:"转化"},
                {id:"actionRate",name:"转化率"},
                {id:"cpm",name:"cpm"},
                {id:"cpc",name:"cpc"},
            ]
        }
    },
    mounted(){
        this.getTarget();
        this.getChartData();
    },
    methods: {
        //获取汇总数据
        getTarget(){
            this.$ajax({
                url: '/dsp/rpt/admin/summary',
                data:{
                    eTime: this.eTime,
                    sTime:this.sTime,
                    filter:{},
                },
                load: true
            }).then(res=>{
                var Obj = {};
                this.targetData = res.data;
                var todayObj = res.data.today;
                for(const key in todayObj){
                    Obj[key] = todayObj[key];
                }
                var yesterday = res.data.yesterday;
                for(const key in yesterday){
                    Obj['yt'+key] = yesterday[key];
                }
                var beforeYesterday = res.data.beforeYesterday;
                for(const key in beforeYesterday){
                   Obj['ybt'+key] = beforeYesterday[key];
                }
                 this.targetData = Obj;
            })
        } ,
        getChartData(){
            this.$ajax({
                url: '/dsp/rpt/admin/time',
                data:{
                    dataGrain: "hour",
                    eTime: this.eTime,
                    filter: {},
                    page: "1",
                    sTime: this.sTime,
                    size: "20"
                },
                load: true
            }).then(res=>{
                var chartDate = {
                    xAxis: [],
                    advertiserCost: [],
                    view: [],
                    click: [],
                    clickRate: [],
                    action: [],
                    actionRate: [],
                    cpm: [],
                    cpc: []
                }
                res.data.forEach(function(v){
                    chartDate.xAxis.push(v.tsName);
                    chartDate.advertiserCost.push(v.advertiserCost);
                    chartDate.view.push(v.view);
                    chartDate.click.push(v.click);
                    chartDate.clickRate.push(v.clickRate);
                    chartDate.action.push(v.action);
                    chartDate.actionRate.push(v.actionRate);
                    chartDate.cpm.push(v.cpm);
                    chartDate.cpc.push(v.cpc);
                })
                 this.chartData = chartDate;
            })
        }
    },
    components:{
        'target': Target,
        'chart': Chart
    }
    
}
</script>
<style lang="less" scoped>

</style>

