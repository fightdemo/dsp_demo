<template>
    <div class="table content">
        <div class="table-top cl">
            <h3 class="table-title">活动报表</h3>
            <div class="table-filter">
                <search placeholder="搜索活动ID或名称"  @search="search"></search>
                <select-data @select="selectDate"></select-data>
                <dsp-button @click="download">下载报表</dsp-button>
                <div class="refresh" @click="refreshReport"></div>
            </div>
        </div>
        <ChartBox>
            <Chart class="chart" :targetList="chartTargetList" :data="chartData"></Chart>
        </ChartBox>
        <div id="scrollWrap" style="overflow:hidden;">
            <div id="tableWrap" style="overflow-x:scroll;">             
                <div class="slider-content">
                    <table class="table-box" style="width:100%;" id="tableInfo">
                        <thead>
                            <tr>
                                <th>活动ID</th>
                                <th>活动名称</th>
                                <th>曝光量<Caret @changeSort="changeSort($event,'viewSort')" sortType="viewSort" :curType="curSortType"></Caret></th>
                                <th>点击量<Caret @changeSort="changeSort($event,'clickSort')" sortType="clickSort" :curType="curSortType"></Caret></th>
                                <th>点击率<Caret @changeSort="changeSort($event,'clickRateSort')" sortType="clickRateSort" :curType="curSortType"></Caret></th>
                                <th>到达量</th>
                                <th>到达率</th>
                                <th>转化量</th>
                                <th>转化率</th>
                                <th>花费(元)<Caret @changeSort="changeSort($event,'advCostSort')" sortType="advCostSort" :curType="curSortType"></Caret></th>
                                <th>CPM(元)<Caret @changeSort="changeSort($event,'cpmSort')" sortType="cpmSort" :curType="curSortType"></Caret></th>
                                <th>CPC(元)<Caret @changeSort="changeSort($event,'cpcSort')" sortType="cpcSort" :curType="curSortType"></Caret></th>
                                <th>CPE(元)</th>
                                <th>CPA(元)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="total">
                                <td>总计</td>
                                <td></td>
                                <td>{{total.view|number}}</td>
                                <td>{{total.click|number}}</td>
                                <td>{{total.clickRate ? Number(total.clickRate * 100).toFixed(2)+'%': '-'}}</td>
                                <td>{{total.arrive|number}}</td>
                                <td>{{total.arriveRate ? Number(total.arriveRate*100).toFixed(2)+'%' : '-'}}</td>
                                <td>{{total.action1|number}}</td>
                                <td>{{total.actionRate ? Number(total.actionRate*100).toFixed(2)+'%' : '-'}}</td>
                                <td>{{total.advertiserCost|number(2)}}</td>
                                <td>{{total.cpm ? fmoney(total.cpm, 2) : '-'}}</td>
                                <td>{{total.cpc ? fmoney(total.cpc, 2) : '-'}}</td>
                                <td>{{total.cpe ? fmoney(total.cpe, 2) : '-'}}</td>
                                <td>{{total.cpa ? fmoney(total.cpa, 2) : '-'}}</td>
                            </tr>
                            <tr v-for="item in list" :key="item.activityID">
                                <td>{{item.campID}}</td>
                                <td>{{item.campName}}</td>
                                <td>{{item.view|number}}</td>
                                <td>{{item.click|number}}</td>
                                <td>{{item.clickRate ? Number(item.clickRate*100).toFixed(2)+'%' : '-'}}</td>
                                <td>{{item.arrive|number}}</td>
                                <td>{{item.arriveRate ? Number(item.arriveRate*100).toFixed(2)+'%' : '-'}}</td>
                                <td>{{item.action1|number}}</td>
                                <td>{{item.actionRate ? Number(item.actionRate*100).toFixed(2)+'%' : '-'}}</td>
                                <td>{{item.advertiserCost|number(2)}}</td>
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
                                <th>活动ID</th>
                                <th>活动名称</th>
                                <th>曝光量<Caret @changeSort="changeSort($event,'viewSort')" sortType="viewSort" :curType="curSortType"></Caret></th>
                                <th>点击量<Caret @changeSort="changeSort($event,'clickSort')" sortType="clickSort" :curType="curSortType"></Caret></th>
                                <th>点击率<Caret @changeSort="changeSort($event,'clickRateSort')" sortType="clickRateSort" :curType="curSortType"></Caret></th>
                                <th>到达量</th>
                                <th>到达率</th>
                                <th>转化量</th>
                                <th>转化率</th>
                                <th>花费(元)<Caret @changeSort="changeSort($event,'advCostSort')" sortType="advCostSort" :curType="curSortType"></Caret></th>
                                <th>CPM(元)<Caret @changeSort="changeSort($event,'cpmSort')" sortType="cpmSort" :curType="curSortType"></Caret></th>
                                <th>CPC(元)<Caret @changeSort="changeSort($event,'cpcSort')" sortType="cpcSort" :curType="curSortType"></Caret></th>
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
</template>
<script>
import common from "../common.js";
export default {
    components: {
        ...common.components
    },
    computed: {
        ...common.computed
    },
    watch: {
        ...common.watch
    },
    data() {
        return Object.assign(common.data(), {
            tableShow: false,
            curSortType: 'advCostSort',
            url: "/dsp/rpt/loc/camp",
            name: "campName",
            title: [
                "活动ID",
                "活动名称",
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
                "campID",
                "campName",
                "view",
                "click",
                "clickRate",
                "arrive",
                "action1",
                "advertiserCost",
                "cpm",
                "cpc"
            ],
            reprotName: "活动报表"
        });
    },
    created() {
        this.filter.campID = this.$route.params.activityID;
        common.created.call(this);
    },
    methods: {
        ...common.methods
    }
};
</script>
<style lang="less">
</style>
