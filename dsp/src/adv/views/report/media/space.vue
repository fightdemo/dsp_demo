<template>
    <div class="table">
        <div class="table-top cl">
            <h3 class="table-title">广告位报表</h3>
            <div class="table-filter">
                <search placeholder="搜索广告位名称"  @search="search"></search>
                <select-data @select="selectDate"></select-data>
                <m-select :title="firstTitle" :list="activityList" keyName="activityID" valueName="name" @change="changeActivity"></m-select>
                <m-select :title.sync="secondTitle" :list="orderList" keyName="id" valueName="name" @change="changeOrder" :idVal.sync="idVal"></m-select>
                <dsp-button @click="download">下载报表</dsp-button>
                <div class="refresh" @click="refreshReport"></div>
            </div>
        </div>
        <div class="">
            <ChartBox :defaultOpen='spaceTooLList.length>0'>
                <Chart v-if="!isOpenTool" class="chart" :targetList="chartTargetList" :data="chartData"></Chart>
                <spaceReportTool v-if="isOpenTool" v-show="spaceTooLList.length>0" :spaceList='spaceTooLList' :changeFlag='changeFlag' :orderKpiList='orderKpiList' :orderID='filter.orderID'></spaceReportTool>
            </ChartBox>
            <div id="scrollWrap" style="overflow:hidden;">
            <div id="tableWrap" style="overflow-x:scroll;">             
                    <table class="table-box" style="width:100%;" id="tableInfo">
                        <thead>
                            <tr>
                                <th>广告位名称</th>
                                <th>所属App</th>
                                <th>曝光量<Caret @changeSort="changeSort($event,'viewSort')" sortType="viewSort" :curType="curSortType"></Caret></th>
                                <th>点击量<Caret @changeSort="changeSort($event,'clickSort')" sortType="clickSort" :curType="curSortType"></Caret></th>
                                <th>点击率<Caret @changeSort="changeSort($event,'clickRateSort')" sortType="clickRateSort" :curType="curSortType"></Caret></th>
                                <th>到达量</th>
                                <th>到达率</th>
                                <th>转化量</th>
                                <th>转化率</th>
                                <th>活动花费(元)<Caret @changeSort="changeSort($event,'advCostSort')" sortType="advCostSort" :curType="curSortType"></Caret></th>
                                <th>CPM(元)<Caret @changeSort="changeSort($event,'cpmSort')" sortType="cpmSort" :curType="curSortType"></Caret></th>
                                <th>CPC(元)<Caret @changeSort="changeSort($event,'cpcSort')" sortType="cpcSort" :curType="curSortType"></Caret></th>
                                <th>CPE(元)</th>
                                <th>CPA(元)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="total">
                                <td>总计</td>
                                <td>{{total.appName}}</td>
                                <td>{{total.view|number}}</td>
                                <td>{{total.click|number}}</td>
                                <td>{{total.clickRate ? Number(total.clickRate * 100).toFixed(2)+'%': '-'}}</td>
                                <td>{{total.arrive|number}}</td>
                                <td>{{total.arriveRate ? Number(total.arriveRate*100).toFixed(2)+'%' : '-'}}</td>
                                <td>{{total.action1|number}}</td>
                                <td>{{total.actionRate ? Number(total.actionRate*100).toFixed(2)+'%' : '-'}}</td>
                                <td>{{total.advertiserCost|number(2)}}</td>
                                <td>{{total.cpm ? Number(total.cpm).toFixed(2) : '-'}}</td>
                                <td>{{total.cpc ? Number(total.cpc).toFixed(2) : '-'}}</td>
                                <td>{{total.cpe ? Number(total.cpe).toFixed(2) : '-'}}</td>
                                <td>{{total.cpa ? Number(total.cpa).toFixed(2) : '-'}}</td>
                            </tr>
                            <tr v-for="item in list" :key="item.activityID">
                                <td>{{item.placeName}}</td>
                                <td>{{item.appName}}</td>
                                <td>{{item.view|number}}</td>
                                <td>{{item.click|number}}</td>
                                <td>{{item.clickRate ? Number(item.clickRate*100).toFixed(2)+'%' : '-'}}</td>
                                <td>{{item.arrive|number}}</td>
                                <td>{{item.arriveRate ? Number(item.arriveRate*100).toFixed(2)+'%' : '-'}}</td>
                                <td>{{item.action1|number}}</td>
                                <td>{{item.actionRate ? Number(item.actionRate*100).toFixed(2)+'%' : '-'}} </td>
                                <td>{{item.advertiserCost|number(2)}}</td>
                                <td>{{item.cpm ? Number(item.cpm).toFixed(2) : '-'}}</td>
                                <td>{{item.cpc ? Number(item.cpc).toFixed(2) : '-'}}</td>
                                <td>{{item.cpe ? Number(item.cpe).toFixed(2) : '-'}}</td>
                                <td>{{item.cpa ? Number(item.cpa).toFixed(2) : '-'}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="list.length || tableShow">
                        <thead>
                            <tr>
                                <th>广告位名称</th>
                                <th>所属App</th>
                                <th>曝光量<Caret @changeSort="changeSort($event,'viewSort')" sortType="viewSort" :curType="curSortType"></Caret></th>
                                <th>点击量<Caret @changeSort="changeSort($event,'clickSort')" sortType="clickSort" :curType="curSortType"></Caret></th>
                                <th>点击率<Caret @changeSort="changeSort($event,'clickRateSort')" sortType="clickRateSort" :curType="curSortType"></Caret></th>
                                <th>到达量</th>
                                <th>到达率</th>
                                <th>转化量</th>
                                <th>转化率</th>
                                <th>活动花费(元)<Caret @changeSort="changeSort($event,'advCostSort')" sortType="advCostSort" :curType="curSortType"></Caret></th>
                                <th>CPM(元)<Caret @changeSort="changeSort($event,'cpmSort')" sortType="cpmSort" :curType="curSortType"></Caret></th>
                                <th>CPC(元)<Caret @changeSort="changeSort($event,'cpcSort')" sortType="cpcSort" :curType="curSortType"></Caret></th>
                                <th>CPE(元)</th>
                                <th>CPA(元)</th>
                            </tr>
                        </thead>
                    </table>                    
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
import spaceReportTool from 'adv@/components/spaceReportTool'
export default {
    mixins: [mixin],
    components: {
        ...common.components,
        spaceReportTool
    },
    computed: {
        ...common.computed,
    },
    data() {
        return Object.assign(common.data(),{
            curSortType: 'advCostSort',
            url: '/dsp/rpt/loc/place',
            name: 'placeName',
            title: [
                "广告位名称",
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
                "placeName",
                "view",
                "click",
                "clickRate",
                "arrive",
                "action1",
                "advertiserCost",
                "cpm",
                "cpc"
            ],
            reprotName: "广告位报表"
        })
    },
    created() {
        common.created.call(this)
        this.getActivity();
        this.getOrder();
    },
    methods: {
        ...common.methods
    }
};
</script>
<style lang="less">
</style>
