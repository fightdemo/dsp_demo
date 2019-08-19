<template>
<div id="dsp_home">
    <p class="page-title">首页</p>
    <dsp-target :data="targetData" :list="targetList" hideName></dsp-target>
    <div class="content">
        <dsp-chart :targetList="chartTargetList" :data="chartData"></dsp-chart>
    </div>  
</div>
    
</template>
<script>
import { getNowFormatDate } from "@/common/js/utils";
import Target from "@/common/components/target"; 
import Chart from "@/common/components/chart";
export default {
    data(){
        return{
            sTime: getNowFormatDate() + " " + "00:00:00",
            eTime: getNowFormatDate() + " " + "23:59:59",
            targetData: {},
             targetList: [
                {
                    name: '广告公司当日花费',
                    t: 'rtbSpend',
                    yT: 'rtbYSpend',
                    ybT: 'rtbYbSpend'
                   
                },{
                    name: '代理商成本',
                    t: 'cost',
                    yT: 'yCost',
                    ybT: 'ybCost'
                },{
                    name: '当日利润',
                    t: 'rtbProfit',
                    yT: 'rtbYProfit',
                    ybT: 'rtbYbProfit'
                    
                },{
                    name: '当日利润率',
                    t: 'rtbProfitRate',
                    isRate: true,
                    yT: 'rtbYProfitRate',
                    ybT: 'rtbYbProfitRate'
                },{
                    name: 'CPM',
                    t: 'cpm',
                    yT: 'yCpm',
                    ybT: 'ybCpm'
                },{
                    name: 'CPC',
                    t: 'cpc',
                    yT: 'yCpc',
                    ybT: 'ybCpc'
                }
            ],
            chartTargetList:[
                {id:"click",name:"点击量"},
                {id:"clickRate",name:"点击率"},
                {id:"view",name:"曝光量"},
                {id:"action",name:"转化"},
                {id:"actionRate",name:"转化率"},
                {id:"cpm",name:"cpm"},
                {id:"cpc",name:"cpc"}
            ],
            chartData:{}
        }
    },
    mounted(){
        this.getTarget();
        this.getChartData();
    },
    methods:{
        getTarget(){
            this.$ajax({
                url: '/dsp/rpt/dsp/summary',
                data:{
                    'filter':{},
                    'sTime': this.sTime,
                    'eTime': this.eTime,
                },
                load: true
            }).then(res=>{
                this.targetData = res.data.data;
            })
        },
         getChartData(){
             this.$ajax({
                 url: '/dsp/rpt/dsp/time',
                 data:{
                    "sTime": this.sTime,
                    "eTime": this.eTime,
                    "dataGrain":"hour",
                    "page": "1",
                    "size": "20"
                 },
                 load: true
             }).then(res=>{
                 var chartDate = this.chartDate;
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
                  res.data.data.forEach(function(v){
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
        'dspTarget': Target,
        'dspChart': Chart
    }
    
}
</script>
<style lang="less" scoped>
#dsp_home{
    
}

</style>


