<template>
    <div class="report-page page">
        <div class="report-page-top">
            <div class="date-select cl">
                <dsp-Date @select="selectData"></dsp-Date>
                <div class="select-r">
                    <m-Radio @change="showAdv" :list="radioList" :size="'big'"></m-Radio>
                </div>
            </div>
            <ul class="deal-list">
                <li>
                    <p>广告主预算（元）</p>
                    <h3 class="ng-binding">{{homeInfoList.advBudget|number(2)}}</h3>
                </li>
                <li>
                    <p>活跃广告主</p>
                    <h3 class="ng-binding">{{homeInfoList.activeAdv|number}}</h3>
                </li>
                <li>
                    <p>活跃活动</p>
                    <h3 class="ng-binding">{{homeInfoList.activeAct|number}}</h3>
                </li>
                <li>
                    <p>活跃订单</p>
                    <h3 class="ng-binding">{{homeInfoList.activeOrd|number}}</h3>
                </li>
            </ul>
            <ul class="deal-list">
                <li>
                    <p>广告主消费（元）</p>
                    <h3 class="ng-binding">{{homeInfoList.advSpend|number(2)}}</h3>
                </li>
                <li>
                    <p>完成率大于<span ng-if="homeInfoList.configRate">{{(homeInfoList.configRate)*100}}</span>%的广告主</p>
                    <h3 class="ng-binding">{{homeInfoList.finishAdv|number}}</h3>
                </li>
                <li>
                    <p>完成率大于<span ng-if="homeInfoList.configRate">{{(homeInfoList.configRate)*100}}</span>%的活动</p>
                    <h3 class="ng-binding">{{homeInfoList.finishAct|number}}</h3>
                </li>
                <li>
                    <p>完成率大于<span ng-if="homeInfoList.configRate">{{(homeInfoList.configRate)*100}}</span>%的订单</p>
                    <h3 class="ng-binding">{{homeInfoList.finishOrd|number}}</h3>
                </li>   
            </ul>
            <ul class="rate-list">
                <li>
                    <div class="complete-rate">
                        <span class="l">预算完成率</span>
                        <span class="r">{{Number((homeInfoList.advBudgetRate*100).toFixed(0))}}%</span>
                    </div>                
                </li>
                <li>
                    <div class="complete-rate">
                        <span class="l">广告主完成率</span>
                        <span class="r">{{Number((homeInfoList.advFinishRate*100).toFixed(0))}}%</span>
                    </div>                
                </li>
                <li>
                    <div class="complete-rate">   
                        <span class="l">活动完成率</span>
                        <span class="r">{{Number((homeInfoList.actFinishRate*100).toFixed(0))}}%</span>
                    </div>               
                </li>
                <li>
                    <div class="complete-rate">
                        <span class="l">订单完成率</span>
                        <span class="r">{{Number((homeInfoList.ordFinishRate*100).toFixed(0))}}%</span>
                    </div>               
                </li>
            </ul>
        </div>    
        <div class="report-content">
            <ul class="report-content-tab cl">
                <li v-for="(v,k) in list" :key="k" @click="select(v,k)">
                    <span :class="{'active': k == index}">{{v.name}}</span>
                </li>
            </ul>
            <div class="chart-wrap cl">
                <div class="chart chart-pie" id="chart-pie" ref="chartpie"></div>
                <ul class="cl">
                    <li :class="{'active': k == chartIndex[0]}" v-for="(v,k) in timeList1" @click="selectTime(v,k,0)" :key="k">{{v.name}}</li>
                </ul>
            </div>
            <div class="chart-wrap">
                <div class="chart chart-line" id="chart-line2" ref="chartline2"></div>
                <ul class="cl">
                    <li :class="{'active': k == chartIndex[2]}" v-for="(v,k) in timeList2" @click="selectTime(v,k,2)" :key="k">{{v.name}}</li>
                </ul>
            </div>
            <div class="chart-wrap">
                <div class="chart chart-line" id="chart-line1" ref="chartline3"></div>
                <ul class="cl">
                    <li :class="{'active': k == chartIndex[1]}" v-for="(v,k) in timeList2" @click="selectTime(v,k,1)" :key="k">{{v.name}}</li>
                </ul>
            </div>        
        </div>
    </div>
</template>
<script>
import dspDate from '@/common/components/select-data2'
import echarts from "echarts"
import { getNowFormatDate,nextDayFnc,getTime,ymd,number } from "@/common/js/utils"
export default {
    data () {
        return{
            radioList: [
                {'name':'显示有消耗的广告主','label':'1'},
                {'name':'余额大于100的广告主','label':'0'}
            ],
            list: [
                {id:'order', name:'订单'},
                {id:'activity', name:'活动'},
                {id:'adv', name:'广告主'} 
            ],
            today: {
                start: getNowFormatDate() + ' 00:00:00',
                end: getNowFormatDate() + ' 23:59:59'
            },
            yesterday:{
                start: nextDayFnc(getNowFormatDate(), 1, 1) + ' 00:00:00',
                end: nextDayFnc(getNowFormatDate(), 1, 1) + ' 23:59:59'
            },
            thisWeek: {
                start: getTime(0,1) + ' 00:00:00',
                end: getNowFormatDate() + ' 23:59:59'
            },
            lastWeek: {
                start: getTime(7,1) + ' 00:00:00',
                end: getTime(1,1) + ' 23:59:59'
            },
            twoWeek: {                
                start: getTime(7,1) + ' 00:00:00',
                end: getNowFormatDate() + ' 23:59:59'
            },
            fourWeek: {            
                start: getTime(21,1) + ' 00:00:00',
                end: getNowFormatDate() + ' 23:59:59'
            },
            timeList1: [
                {name: '今日', start: getNowFormatDate() + ' 00:00:00', end: getNowFormatDate() + ' 23:59:59'},
                {name: '昨日', start: nextDayFnc(getNowFormatDate(), 1, 1) + ' 00:00:00', end: nextDayFnc(getNowFormatDate(), 1, 1) + ' 23:59:59'},
                {name: '本周', start: getTime(0,1) + ' 00:00:00', end: getNowFormatDate() + ' 23:59:59'},
                {name: '上周', start: getTime(7,1) + ' 00:00:00', end: getTime(1,1) + ' 23:59:59'},
                {name: '近两周', start: getTime(7,1) + ' 00:00:00', end: getNowFormatDate() + ' 23:59:59'},
                {name: '近四周', start: getTime(21,1) + ' 00:00:00', end: getNowFormatDate() + ' 23:59:59'}
            ],
            timeList2: [
                {name: '本周', start: getTime(0,1) + ' 00:00:00', end: getNowFormatDate() + ' 23:59:59'},
                {name: '上周', start: getTime(7,1) + ' 00:00:00', end: getTime(1,1) + ' 23:59:59'},
                {name: '近两周', start: getTime(7,1) + ' 00:00:00', end: getNowFormatDate() + ' 23:59:59'},
                {name: '近四周', start: getTime(21,1) + ' 00:00:00', end: getNowFormatDate() + ' 23:59:59'}
            ],
            index:2,       //默认广告主  0订单 1活动 2广告主   
            pieIndex:1,    //默认昨日    0今日 1昨日 2本周 3上周 4近两周 5近四周
            linetIndex:3,  //默认近四周  0本周 1上周 2近两周 3近四周  
            linebIndex:3,  //默认近四周  0本周 1上周 2近两周 3近四周  
            chartIndex: [1, 3, 3],

            homeInfoList: {},
            nChartOpt1: { title: ""},
            nChartOpt2: {             
                name: "",
                title1: "",
                title2: "",
                title3: ""
            },
            nChartOpt3: { name: ""},
            sTime: nextDayFnc(getNowFormatDate(), 1, 1) + ' 00:00:00',     
            eTime: nextDayFnc(getNowFormatDate(), 1, 1) + ' 23:59:59',
            sTime2: nextDayFnc(getNowFormatDate(), 1, 1) + ' 00:00:00',
            eTime2: nextDayFnc(getNowFormatDate(), 1, 1) + ' 23:59:59',
            sTime3: getTime(28,1) + ' 00:00:00',
            eTime3: getTime(1,1) + ' 23:59:59',
            sTime4: getTime(28,1) + ' 00:00:00',
            eTime4: getTime(1,1) + ' 23:59:59',
            value: "0",
            filter: {
                type: "0",
                num: "0"           
            }
        }
    },
    components:{
        dspDate: dspDate
    },
    mounted(){
        this.getHomeInfo();
        this.getChartPieDate();    
        this.getChartLineAdv();
        this.getChartLineActiveAdv();
    },
    computed: {
        silderFlag() {
            return this.$store.state.common.silderFlag
        }
    },
    watch: {
        homeInfoList(val) {
            this.homeInfoList = val
        },
        silderFlag() {
            var chart1 = echarts.init(this.$refs.chartpie),
                chart2 = echarts.init(this.$refs.chartline2),
                chart3 = echarts.init(this.$refs.chartline3);
            chart1.resize()
            chart2.resize()
            chart3.resize()    
        },
    },
    methods:{
        selectData(val) {
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.getHomeInfo();
        },
        showAdv(val) {
            this.filter.type = val;
            if(val == '0') {
                this.filter.num = '100';
            }else if(val == '1') {
                this.filter.num = '0'
            }
           this.getHomeInfo()
        },
        getHomeInfo() {
            var data = {
                filter: this.filter,
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: '/dsp/rpt/budget/spend/summary',
                data: data,
                load: true
            }).then(res => {
                this.homeInfoList = res.data
            })
        },
        //选择 广告主/活动/订单
        select(v,k) {
            if(this.index === k){
                return;
            }else{
                this.index = k;
                this.nChartOpt1 = { title: v.name}
                this.nChartOpt2 = {             
                    name: v.name,
                    title1: v.name + '预算',
                    title2: v.name + '消费',
                    title3: v.name + '预算完成率'
                }
                this.nChartOpt3 = {              
                    name: '活跃' + v.name + '数量'
                }
                
                this.getChartPieDate(5-k+'')                // 3广告主 4活动 5订单
                this.getChartLineAdv(5-k+'')
                this.getChartLineActiveAdv(5-k+'')
            }  
        },
        //选择时间
        selectTime(v, k, index) {
            if(this.chartIndex[index] === k){
                return;
            }else{
                this.chartIndex[index] = k;
                this.$forceUpdate();
                this['sTime'+ (index + 2)] = v.start;
                this['eTime'+ (index + 2)] = v.end;
                if(index == 0) {
                    this.getChartPieDate();
                    return;
                }
                if(index == 1) {
                    this.getChartLineActiveAdv();
                    return;
                }
                if(index == 2) {
                    this.getChartLineAdv();
                    return;
                }
            }           
        },
        //首页饼图信息
        getChartPieDate(unitType, dataGrain){
            this.chartIndex[0] > 1 ? dataGrain = 'day' : dataGrain = 'hour'
            var data = {
                filter: {
                    unitType: unitType || '3',
                    dataGrain: dataGrain || 'hour'
                },
                sTime: this.sTime2,
                eTime: this.eTime2
            }
            this.$ajax({
                url: '/dsp/rpt/budget/spend/chart/pie',
                data: data,
                load: true
            }).then(res => {
                var chartDate = {
                    name:[],
                    value:[] 
                };
                var time = '';
                res.data.forEach(function(v){
                    chartDate.name.push('完成率小于' + v.rate + '%');
                    chartDate.value.push(v.num);
                    v.name = '完成率小于' + v.rate + '%';
                    v.value = v.num;
                })
                switch (this.chartIndex[0]) {
                    case 0:
                        time = '今日: '+ ymd(this.today.start.split(" ")[0])
                        break;
                    case 1:
                        time = '昨日: '+ ymd(this.yesterday.start.split(" ")[0])
                        break;
                    case 2:
                        time = '本周: '+ ymd(this.thisWeek.start.split(" ")[0])+'-'+ymd(this.thisWeek.end.split(" ")[0])
                        break;
                    case 3:
                        time = '上周: '+ ymd(this.lastWeek.start.split(" ")[0])+'-'+ymd(this.lastWeek.end.split(" ")[0])
                        break;
                    case 4:
                        time = '近两周: '+ ymd(this.twoWeek.start.split(" ")[0])+'-'+ymd(this.twoWeek.end.split(" ")[0])
                        break;  
                    case 5:
                        time = '近四周: '+ ymd(this.fourWeek.start.split(" ")[0])+'-'+ymd(this.fourWeek.end.split(" ")[0])
                        break;              
                    default:
                        break;
                }
                this.chartOpt = {
                    'legend.data': chartDate.name,
                    'series.data': res.data,
                    'title': this.nChartOpt1.title || '广告主',
                    'time': time,
                    'type': '1'
                }
                this.setChart(this.chartOpt,true)
            })
        },
        //首页折线图信息t
        getChartLineAdv(unitType){
            var data = {
                filter: {
                    unitType: unitType || '3'
                },
                sTime: this.sTime4,
                eTime: this.eTime4
            }
            this.$ajax({
                url: '/dsp/rpt/budget/spend/chart/upper',
                data: data,
                load: true
            }).then(res => {
                var chartDate = {
                    ts:[],
                    budget:[],
                    spend:[],
                    finishRate:[] 
                },data = res.data;
                data.sort(function(a, b){
                    return Number(a.ts.replace(/[-]/ig,"")) - Number(b.ts.replace(/[-]/ig,""))
                })
                data.forEach(function(v){
                    chartDate.ts.push(v.ts)
                    chartDate.budget.push(v.budget.toFixed(3)+"")
                    chartDate.spend.push(v.spend.toFixed(3)+"")
                    chartDate.finishRate.push((v.finishRate*100).toFixed(3))
                })
                this.chartOpt2 = {
                    name: this.nChartOpt2.name || '广告主',
                    title1: this.nChartOpt2.title1 || '广告主预算',
                    title2: this.nChartOpt2.title2 || '广告主消费',
                    title3: this.nChartOpt2.title3 || '广告主预算完成率',  
                    data1: chartDate.budget,
                    data2: chartDate.spend,
                    data3: chartDate.finishRate,
                    xAxis: chartDate.ts,
                    type: '2'
                }
                this.setChart(this.chartOpt2,true)
            })
        },   
        //首页折线图信息b
        getChartLineActiveAdv(unitType){
            var data = {
                filter: {
                    unitType: unitType || '3',
                },
                sTime: this.sTime3,
                eTime: this.eTime3
            }
            this.$ajax({
                url: '/dsp/rpt/budget/spend/chart/lower',
                data: data,
                load: true
            }).then(res => {
                var chartDate = {
                    title1:"",
                    title2:"",
                    title3:"",
                    title4:"",
                    title5:"",
                    title6:"",
                    title7:"",
                    ts:[],
                    activeNum:[],
                    data1:[],
                    data2:[],
                    data3:[],
                    data4:[],
                    data5:[],
                    data6:[],
                    data7:[]
                },data = res.data;
                data.sort(function(a, b){
                    return Number(a.ts.replace(/[-]/ig,"")) - Number(b.ts.replace(/[-]/ig,""))
                })
                data.forEach(function(v){                   
                    chartDate.title1 = "完成率小于" + v.list[0].rate + "%"
                    chartDate.title2 = "完成率小于" + v.list[1].rate + "%"
                    chartDate.title3 = "完成率小于" + v.list[2].rate + "%"
                    chartDate.title4 = "完成率小于" + v.list[3].rate + "%"
                    chartDate.title5 = "完成率小于" + v.list[4].rate + "%"
                    chartDate.title6 = "完成率小于" + v.list[5].rate + "%"
                    chartDate.title7 = "完成率小于" + v.list[6].rate + "%"
                    chartDate.ts.push(v.ts)
                    chartDate.activeNum.push(v.activeNum)
                    chartDate.data1.push(v.list[0].num)
                    chartDate.data2.push(v.list[1].num)
                    chartDate.data3.push(v.list[2].num)
                    chartDate.data4.push(v.list[3].num)
                    chartDate.data5.push(v.list[4].num)
                    chartDate.data6.push(v.list[5].num)
                    chartDate.data7.push(v.list[6].num)
                })
                this.chartOpt = {
                    name: this.nChartOpt3.name || '活跃广告主数量',
                    title1: chartDate.title1,
                    title2: chartDate.title2,
                    title3: chartDate.title3,
                    title4: chartDate.title4,
                    title5: chartDate.title5,
                    title6: chartDate.title6,
                    title7: chartDate.title7,
                    activeNum: chartDate.activeNum, 
                    data1: chartDate.data1,
                    data2: chartDate.data2,
                    data3: chartDate.data3,
                    data4: chartDate.data4,
                    data5: chartDate.data5,
                    data6: chartDate.data6,
                    data7: chartDate.data7,
                    xAxis: chartDate.ts,
                    type: '3'
                }
                this.setChart(this.chartOpt,true)
            })
        },
        setChart(option){
            var chart1 = echarts.init(this.$refs.chartpie),
                chart2 = echarts.init(this.$refs.chartline2),
                chart3 = echarts.init(this.$refs.chartline3);
            var y = {},y0 = {},y1 = {},y2 = {},y3 = {},y4 = {},y5 = {},y6 = {},y7 = {},y8 = {};            

            //折线图（上）信息    
            y1.data = option.data1;
            y1.min = 0;
            y1.max = this.fiveMultiple(Math.max.apply(0,y1.data));
            y1.min = y1.min == y1.max ? 0 : y1.min;
            y1.interval = Number(((y1.max - y1.min) / 5).toFixed(3));

            y2.data = option.data2;
            y2.min = 0;
            y2.max = this.fiveMultiple(Math.max.apply(0,y2.data));
            y2.min = y2.min == y2.max ? 0 : y2.min;
            y2.interval = Number(((y2.max - y2.min) / 5).toFixed(3));       
            
            y.min = y1.min;
            y.max = y1.max > y2.max ? y1.max : y2.max;
            y.interval = y1.interval > y2.interval ? y1.interval : y2.interval;

            y3.data = option.data3;
            y3.min = 0;
            y3.max = this.fiveMultiple(Math.max.apply(0,y3.data));
            y3.min = y3.min == y3.max ? 0 : y3.min;
            y3.interval = Number(((y3.max - y3.min) / 5).toFixed(3));

            //折线图（下）信息 
            y0.data = option.activeNum;
            y0.min = 0;
            y0.max = this.fiveMultiple(Math.max.apply(0,y0.data));
            y0.min = y0.min == y0.max ? 0 : y0.min;
            y0.interval = Number(((y0.max - y0.min) / 5).toFixed(3)); 
                        
            y4.data = option.data4;
            y4.max = this.fiveMultiple(Math.max.apply(0,y4.data));
            y5.data = option.data5;
            y5.max = this.fiveMultiple(Math.max.apply(0,y5.data));
            y6.data = option.data6;
            y6.max = this.fiveMultiple(Math.max.apply(0,y6.data));
            y7.data = option.data7;
            y7.max = this.fiveMultiple(Math.max.apply(0,y7.data));
            // y8.data = [y1.max, y2.max, y3.max, y4.max, y5.max, y6.max, y7.max];
            y8.data = [Number(y1.max) + Number(y2.max) + Number(y3.max) + Number(y4.max) + Number(y5.max) + Number(y6.max) + Number(y7.max)];
            y8.min = 0;
            y8.max = this.fiveMultiple(Math.max.apply(0,y8.data));
            y8.min = y8.min == y8.max ? 0 : y8.min;
            y8.interval = Number(((y8.max - y8.min) / 5).toFixed(3));
            
            if(option.type == '1') {
                // console.log(option)
                var option1 = {
                    title : {
                        subtext: option.time,
                        x:'center',
                        bottom: '16%',
                        subtextStyle: {
                            color: '#000'
                        }
                    },
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        // orient: 'vertical',
                        icon:'circle',
                        bottom: '1%',
                        borderWidth: '1',
                        borderRadius: 40,
                        padding: [20,30], 
                        data: option['legend.data'],
                    },
                    grid: {
                        left: '1%',
                        right: '1%',
                        bottom: '1%',
                        x:0,
                        y:0,
                        x2:0,
                        y2:0
                    },
                    series: [                       
                        {
                            name: option.title,
                            type:'pie',
                            radius: '50%',
                            color: ["#8bc34a","#ffc776","#ffaf39","#ff9800","#ff9abc","#ff689c","#ff4081"],
                            data: option['series.data'],
                        }
                    ]
                };
                // console.log(option1)
                chart1.setOption(option1,true);                
            }
            if(option.type == '2') {
                // console.log(option)
                var option2 = {
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        icon:'circle',
                        bottom: '1%',
                        borderWidth: '1',
                        borderRadius: 40,
                        padding: [20,30], 
                        itemGap: 50,
                        data: [option.title1, option.title2, option.title3],
                        color: ['#3caeec','#ff9800','#8bc34a']
                    },
                    grid: {
                        left: '1%',
                        right: '1%',
                        bottom: '20%',
                        containLabel: true,
                        x:0,
                        y:40,
                        x2:0,
                        y2:0
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: option.xAxis,
                            // data: ['10月28日-11月3日','11月4日-11月10日','11月11日-11月17日','11月18日-11月24日'],                        
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        // {
                        //     type: 'value',
                        //     // name: option.title1,
                        //     min: y1.min,
                        //     max: y1.max,
                        //     interval: y1.interval,
                        //     splitLine: {
                        //         show: false
                        //     }, 
                        // },
                        {
                            type: 'value',
                            min: y.min,
                            max: y.max,
                            interval: y.interval,
                            splitLine: {
                                show: false
                            }, 
                        },
                        {
                            type: 'value',
                            // name: option.title3,
                            min: y3.min,
                            max: y3.max,
                            interval: y3.interval,
                            axisLabel:{
                                formatter: '{value} %'
                            },
                            splitLine: {
                                show: false
                            }, 
                        }
                    ],
                    series: [
                        {
                            name: option.title1,
                            type:'line',
                            color: ["#3caeec"],
                            data: y1.data
                        },
                        {
                            name: option.title2,
                            type: 'line',
                            color: ['#ff9800'],
                            yAxisIndex: 0,
                            data: y2.data
                        },
                        {
                            name: option.title3,
                            type: 'line',
                            color: ['#8bc34a'],
                            yAxisIndex: 1,
                            data: y3.data,
                            itemStyle:{
                                normal:{
                                    label:{
                                        formatter: '{b}\n{c}%'
                                    }
                                }
                            }
                        }
                    ]
                };
                chart2.setOption(option2,true);
            }
            if(option.type == '3') {
                var option3 = {
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        icon:'circle',
                        bottom: '1%',
                        borderWidth: '1',
                        borderRadius: 40,
                        padding: [20,30], 
                        data: [option.name, option.title1, option.title2, option.title3, option.title4, option.title5, option.title6, option.title7],
                    },
                    grid: {
                        left: '1%',
                        right: '1%',
                        bottom: '20%',
                        containLabel: true,
                        x:0,
                        y:40,
                        x2:0,
                        y2:0
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: option.xAxis,
                            boundaryGap : false,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            min: y0.min,
                            max: y0.max,
                            interval: y0.interval,
                            splitLine: {
                                show: false
                            }, 
                        },
                        {
                            type: 'value',
                            min: y8.min,
                            max: y8.max,
                            interval: y8.interval,
                            splitLine: {
                                show: false
                            }, 
                        },
                    ],
                    series: [
                        {
                            name: option.name,
                            type:'line',
                            color: ["#3caeec"],
                            data: y0.data,
                            // data: y1.data                            
                        },
                        {
                            name: option.title1,
                            type: 'line',
                            color: ['#8bc34a'],
                            data: y1.data,
                            stack: '总量',
                            areaStyle: {normal: {}},
                            yAxisIndex: 1,
                        },
                        {
                            name: option.title2,
                            type: 'line',
                            color: ['#ffc776'],
                            data: y2.data,
                            stack: '总量',
                            areaStyle: {normal: {}},
                            yAxisIndex: 1,
                        },
                        {
                            name: option.title3,
                            type: 'line',
                            color: ['#ffaf39'],
                            data: y3.data,
                            stack: '总量',
                            areaStyle: {normal: {}},
                            yAxisIndex: 1,
                        },
                        {
                            name: option.title4,
                            type: 'line',
                            color: ['#ff9800'],
                            data: y4.data,
                            stack: '总量',
                            areaStyle: {normal: {}},
                            yAxisIndex: 1,
                        },
                        {
                            name: option.title5,
                            type: 'line',
                            color: ['#ff9abc'],
                            data: y5.data,
                            stack: '总量',
                            areaStyle: {normal: {}},
                            yAxisIndex: 1,
                        },
                        {
                            name: option.title6,
                            type: 'line',
                            color: ['#ff689c'],
                            data: y6.data,
                            stack: '总量',
                            areaStyle: {normal: {}},
                            yAxisIndex: 1,
                        },
                        {
                            name: option.title7,
                            type: 'line',
                            color: ['#ff4081'],
                            data: y7.data,
                            stack: '总量',
                            areaStyle: {normal: {}},
                            yAxisIndex: 1,
                        }
                    ]
                };
                chart3.setOption(option3,true);
            }
            //自适应 
            window.onresize = function(){
                chart1.resize()
                chart2.resize()
                chart3.resize()
            }           
        },
        //取到最近一个能被5整除的数
        fiveMultiple(val) {
            if (val <= 0) {return 0;}
            return val - val % 5 + 5
        } 
    }  
}
</script>
<style lang="less">
.report-page{
    .report-page-top{
        padding: 10px;
        border: 1px solid #BBBBBB;
        .select-l{
            float: left;
        }
        .select-r{
            float: right;
            height: 34px;
            line-height: 34px;
            .consume,.balance{
                cursor: pointer;
                margin-left: 10px;
                .consume-input,.balance-input{
                    cursor: pointer;
                    width: 16px;
                    height: 16px;
                }
                .balance-tit,.consume-tit{
                    font-weight: 500;
                    vertical-align: 3px;
                    font-size: 14px;
                    .balance-num{
                        width: 50px;
                        height: 30px;
                        border: none;
                        border: 1px solid #BBBBBB;
                        border-radius: 2px;
                        outline: 0;
                        padding: 0 3px;
                        text-align: center;
                    }
                    &:hover{
                        color: #337ab7;
                    }
                }
            }
        }
        .deal-list,.rate-list {
            margin-top: 20px;
            display: flex;
            // flex-flow: row wrap;
            // justify-content: space-between;
            li {
                width: 25%;
                padding: 20px;               
                margin-right: 20px;
                border: 1px solid #BBBBBB;
                background-color: #ffffff;
                background-position: right -15px bottom -15px;
                background-repeat: no-repeat;
                background-size: 100px;
                p {
                    font-size: 14px;
                    line-height: 14px;
                    height: 0;
                    padding-bottom: 14px;
                    small {
                        font-size: 12px;
                    }
                }
                h3 {
                    margin-top: 20px;
                    font-size: 22px;
                    height: 0;
                    padding-bottom: 50px;
                    line-height: 50px;
                    text-align: right;
                }
            }
            li.empty {
                visibility: hidden;
            }
            li:nth-child(1) {
                // color: #f7c94d;
                // background-image: url("../../assets/icon_target7.png");
            }
            li:nth-child(2) {
                // color: #55ec80;
                // background-image: url("../../assets/icon_target1.png");
            }
            li:nth-child(3) {
                // color: #f58c31;
                // background-image: url("../../assets/icon_target13.png");
            }
            li:nth-child(4) {
                // color: #49d6f2;
                // background-image: url("../../assets/icon_target8.png");
                margin-right: 0;
            }
        }
        .deal-list{
            li{
                height: 120px;
            }
        }
        .deal-list:first-child{
            margin-top: 68px;
            margin-bottom: 20px;
        }
        .rate-list{
            margin-top: 0;
            li{
                border-top: none;
                padding-top: 0;
                padding-bottom: 0;
                .complete-rate{
                    width: 100%;
                    height: 41px;
                    font-size: 14px;
                    background: #FFFEF8;
                    line-height: 41px;
                    .l{
                        float: left;
                        height: 100%;
                    }
                    .r{
                        float: right;
                        height: 100%;
                    }
                }
            }
        }
    }
    .report-content{
        margin-top: 48px;
        border: 1px solid #BBBBBB;
        .report-content-tab{
            li{
                float: left;
                font-size: 14px;
                text-align: center;
                padding: 15px 0;
                cursor: pointer;
                span{
                    padding: 0 40px;
                    border-right: 1px solid #BBBBBB;
                }
                .active{
                    color: #337ab7;
                    font-weight: bold;
                }
            }
        }
        .chart-wrap{
            position: relative;
            .chart{
                // width: 50%;
                height: 600px;
                border-top: 1px solid #BBBBBB;
                padding: 20px;            
            }
            ul{
                position: absolute;
                left: 20px;
                top: 20px;
                li{
                    float: left;
                    font-size: 12px;
                    color: #000;
                    padding: 4px 25px;
                    border: 1px solid #BBBBBB;
                    cursor: pointer;
                    // border-right: none;
                    // margin-right: -1px;
                }
                .active{
                    background: #6094f7;
                    color: #fff;
                    border-color: #455bbd;
                }
            }
        }
    }
}

</style>