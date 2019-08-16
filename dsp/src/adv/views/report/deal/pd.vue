<template>
    <div class="table">
        <div class="table-top cl">
            <h3 class="table-title">保价不保量报表</h3>
            <div class="table-filter">
                <search placeholder="搜索订单活动ID或名称"  @search="search"></search>
                <select-data @select="selectDate"></select-data>
                <m-select title="全部操作系统" :list="osList" keyName="name" @change="changeOs"></m-select>
                <dsp-button @click="download">下载报表</dsp-button>
                <div class="refresh" @click="refreshReport"></div>
            </div>
        </div>
        <div class="">
            
            <ChartBox>
                <Chart class="chart" :targetList="chartTargetList" :data="chartData"></Chart>
            </ChartBox> 
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;">             
                    <div class="slider-content">
                        <table class="table-box" style="width:100%;" id="tableInfo">
                            <thead>
                                <tr>
                                    <th>订单ID</th>
                                    <th>订单名称</th>
                                    <th>操作系统</th>
                                    <th>投放时间</th>
                                    <th>曝光量</th>
                                    <th>点击量</th>
                                    <th>点击率</th>
                                    <th>到达量</th>
                                    <th>到达率</th>
                                    <th>转化量</th>
                                    <th>转化率</th>
                                    <th>活动花费(元)</th>
                                    <th>单价(元)</th>
                                    <th>CPM(元)</th>
                                    <th>CPC(元)</th>
                                    <th>CPE(元)</th>
                                    <th>CPA(元)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="total" v-for="(item,index) in totalList" :key="index">
                                    <td v-if="index == 0" colspan="2" :rowspan="totalList.length">总计</td>
                                    <td>{{item.platformTag}}</td>
                                    <td></td>
                                    <td>{{item.view|number}}</td>
                                    <td>{{item.click|number}}</td>
                                    <td>{{item.clickRate ? Number(item.clickRate * 100).toFixed(2)+'%' : '-'}}</td>
                                    <td>{{item.arrive|number}}</td>
                                    <td>{{item.arriveRate ? Number(item.arriveRate * 100).toFixed(2)+'%' : '-'}}</td>
                                    <td>{{item.action|number}}</td>
                                    <td>{{item.actionRate ? Number(item.actionRate * 100).toFixed(2)+'%' : '-'}}</td>
                                    <td>{{item.advertiserCost|number(2)}}</td>
                                    <td>-</td>       
                                    <td>{{item.cpm ? fmoney(item.cpm, 2) : '-'}}</td>
                                    <td>{{item.cpc ? fmoney(item.cpc, 2) : '-'}}</td>
                                    <td>{{item.cpe ? fmoney(item.cpe, 2) : '-'}}</td>
                                    <td>{{item.cpa ? fmoney(item.cpa, 2) : '-'}}</td>
                                </tr>
                                <tr v-for="item in list" :key="item.activityID">
                                    <td>{{item.orderID}}</td>
                                    <td>{{item.skuName}}</td>
                                    <td>{{item.platformTag}}</td>
                                    <td>
                                        <p v-for="data in item.startDate.split(';')" :key="data">
                                            {{data.replace('00:00:00','').replace('00:00:00','')}}
                                        </p>
                                    </td>
                                    <td>{{item.view|number}}</td>
                                    <td>{{item.click|number}}</td>
                                    <td>{{item.clickRate ? Number(item.clickRate * 100).toFixed(2)+'%' : '-'}}</td>
                                    <td>{{item.arrive|number}}</td>
                                    <td>{{item.arriveRate ? Number(item.arriveRate * 100).toFixed(2)+'%' : '-'}}</td>
                                    <td>{{item.action|number}}</td>
                                    <td>{{item.actionRate ? Number(item.actionRate * 100).toFixed(2)+'%' : '-'}}</td>
                                    <td>{{item.advertiserCost|number(2)}}</td>
                                    <td>{{item.price}}</td>
                                    <td>{{item.cpm ? fmoney(item.cpm, 2) : '-'}}</td>
                                    <td>{{item.cpc ? fmoney(item.cpc, 2) : '-'}}</td>
                                    <td>{{item.cpe ? fmoney(item.cpe, 2) : '-'}}</td>
                                    <td>{{item.cpa ? fmoney(item.cpa, 2) : '-'}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table-box float-thead" id="float-thead" v-if="list.length || tableShow">
                            <thead>
                                <tr>
                                    <th>订单ID</th>
                                    <th>订单名称</th>
                                    <th>操作系统</th>
                                    <th>投放时间</th>
                                    <th>曝光量</th>
                                    <th>点击量</th>
                                    <th>点击率</th>
                                    <th>到达量</th>
                                    <th>到达率</th>
                                    <th>转化量</th>
                                    <th>转化率</th>
                                    <th>活动花费(元)</th>
                                    <th>单价(元)</th>
                                    <th>CPM(元)</th>
                                    <th>CPC(元)</th>
                                    <th>CPE(元)</th>
                                    <th>CPA(元)</th>
                                </tr>
                            </thead>
                        </table>                                     
                    </div>
                </div> 
            </div>
            <div class="scroll-wrap">
                <div class="h-bar"></div>
            </div>
            <page id="pageToolbar" :page="pageObj" @change="getList"></page>
        </div>
    </div>
</template>
<script>
import common from "../common.js"
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    components: {
        ...common.components
    },
    computed: {
        ...common.computed
    },
    data() {
        return Object.assign(common.data(),{
            url: '/dsp/rpt/deal/list',
            name: 'skuName',
            sort: "",
            osList: [
                {
                    name: '',
                    value: '全部操作系统'
                },{
                    name:'ios',
                    value: 'ios'
                },{
                    name:'android',
                    value: 'android'
                }
            ],
            filter: {dealType: "pd"},
            title: [
                "订单名称",
                "操作系统",
                "曝光量",
                "点击量",
                "点击率",
                "到达量",
                "转化量",
                "花费(元)",
                "CPM(元)",
                "CPC(元)",
            ],
            titleForKey: [
                "skuName",
                "platformTag",
                "view",
                "click",
                "clickRate",
                "arrive",
                "action1",
                "advertiserCost",
                "cpm",
                "cpc"
            ],
            reprotName: "保价不保量交易报表"
        })
    },
    created() {
        common.created.call(this)
    },
    methods: {
        ...common.methods
    }
};
</script>
<style lang="less">
</style>
