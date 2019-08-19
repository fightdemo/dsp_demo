<template>
    <div>
        <div class="page-title">竞价交易概况</div>
        <Target :data="total" :hideName="true" :list="targetList"></Target>
        <div class="table content">
            <div class="table-top">
                <p class="table-title">账户概况报表</p>
                <div class="table-filter">
                    <select-data @select="selectDate"></select-data>
                    <dsp-button @click="download">下载报表</dsp-button>
                    <div class="refresh" @click="refreshReport"></div>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th>广告主ID</th>
                        <th>公司</th>
                        <th>广告主花费</th>
                        <th>代理商成本</th>
                        <th>利润</th>
                        <th>利润率</th>
                        <th>展示量<Caret @changeSort="changeSort($event,'viewSort')" sortType="viewSort" :curType="curSortType"></Caret></th>
                        <th>点击量<Caret @changeSort="changeSort($event,'clickSort')" sortType="clickSort" :curType="curSortType"></Caret></th>
                        <th>点击率<Caret @changeSort="changeSort($event,'clickRateSort')" sortType="clickRateSort" :curType="curSortType"></Caret></th>
                        <th>CPM(元)<Caret @changeSort="changeSort($event,'cpmSort')" sortType="cpmSort" :curType="curSortType"></Caret></th>
                        <th>CPC(元)<Caret @changeSort="changeSort($event,'cpcSort')" sortType="cpcSort" :curType="curSortType"></Caret></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in list" :key="item.id">
                        <td>{{item.advertiserID}}</td>
                        <td>{{item.advertiserName}}</td>
                        <td>{{item.advertiserCost|number(2)}}</td>
                        <td>{{item.agencyCost|number(2)}}</td>
                        <td>{{item.agencyProfit|number(2)}}</td>
                        <td>{{item.agencyDealProfitRate*100|number(2)}}</td>
                        <td>{{item.view|number}}</td>
                        <td>{{item.click|number}}</td>
                        <td>{{item.clickRate*100|number(2)}}</td>
                        <td>{{item.cpm|number(2)}}</td>
                        <td>{{item.cpc|number(2)}}</td>
                    </tr>
                </tbody>
            </table>
            <!-- <el-table :data="list" class="table-total" style="width: 100%">
                <el-table-column prop="advertiserID" label="广告主ID"></el-table-column>
                <el-table-column prop="advertiserName" label="公司"></el-table-column>
                <el-table-column label="广告主花费">
                    <template slot-scope="scope">
                        {{scope.row.advertiserCost|number(2)}}
                    </template>
                </el-table-column>
                <el-table-column label="代理商成本">
                    <template slot-scope="scope">
                        {{scope.row.agencyCost|number(2)}}
                    </template>
                </el-table-column>
                <el-table-column label="利润">
                    <template slot-scope="scope">
                        {{scope.row.agencyProfit|number(2)}}
                    </template>
                </el-table-column>
                <el-table-column label="利润率">
                    <template slot-scope="scope">
                        {{scope.row.agencyDealProfitRate*100|number(2)}}%
                    </template>
                </el-table-column>
                <el-table-column label="展示量">
                    <template slot-scope="scope">
                        {{scope.row.view|number}}
                    </template>
                </el-table-column>
                <el-table-column label="点击量">
                    <template slot-scope="scope">
                        {{scope.row.click|number}}
                    </template>
                </el-table-column>
                <el-table-column label="点击率">
                    <template slot-scope="scope">
                        {{scope.row.clickRate*100|number(2)}}%
                    </template>
                </el-table-column>
                <el-table-column label="CPM">
                    <template slot-scope="scope">
                        {{scope.row.cpm|number(2)}}
                    </template>
                </el-table-column>
                <el-table-column label="CPC">
                    <template slot-scope="scope">
                        {{scope.row.cpc|number(2)}}
                    </template>
                </el-table-column>
            </el-table> -->
            <page :page="pageObj" @change="getList"></page>
        </div>
    </div>
</template>
<script>
import Target from "@/common/components/target";
import { getNowFormatDate, exportCsv } from "@/common/js/utils";
import common from "./common.js"
import {mixin} from "saas@/views/common.js"
import Caret from '@/common/components/caret'
export default {
    mixins: [mixin],
    components: {
        Target
    },
    data() {
        return Object.assign(common.data(),{
            curSortType: 'advCostSort',
            sort: ["advCostSort,1"],
            total: {},
            list: [],
            filter: {},
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            targetList: [
                {
                    name: "广告主花费",
                    t: "advertiserCost"
                },
                {
                    name: "代理商成本",
                    t: "agencyCost"
                },
                {
                    name: "利润",
                    t: "agencyProfit"
                },
                {
                    name: "利润率",
                    isRate: true,
                    t: "agencyDealProfitRate"
                },
                {
                    name: "展示量",
                    t: "view"
                },
                {
                    name: "点击量",
                    t: "click"
                }
            ],
            eTime: getNowFormatDate() + " 23:59:59",
            sTime: getNowFormatDate() + " 00:00:00"
        })
    },
    computed: {
        ...common.computed
    },
    created() {
        common.created.call(this)
        this.getList();
    },
    methods: {
        ...common.methods,
        //刷新报表数据
        refreshReport() {
            this.getList();
        },
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
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.pageObj.currentPage = 1;
            this.getList();
        },
        getList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: {},
                sort: this.sort,
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/rtb/deal",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                var list = res.data.data || [];
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                return list;
            }).then(this.getTotal);
        },
        getTotal(list) {
            var data = {
                sort: ["cTime,1"],
                filter: {},
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/rtb/deal/sum",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                var total = res.data.data[0] || {
                    advertiserCost: "0", //花费
                    agencyProfit: "0", //利润
                    agencyDealProfitRate: "0", //利润率
                    dspCost: "0", //成本
                    view: "0", //展示量
                    click: "0", //点击量
                    clickRate: "0",
                    agencyCost: "0",
                    cpm: "0",
                    cpc: "0"
                };
                total.advertiserID = "总计"
                list.unshift(total)
                this.list = list;
                this.total = total;

                
            });
        },
        download() {
            var data = {
                page: "1",
                size: "99999",
                filter: {},
                sort: ["cTime,1"],
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/rtb/deal",
                load: true,
                data: data
            }).then(res => {
                var arr = res.data.data || [];
                // 获得列表
                arr.forEach(function(v) {
                    v.agencyDealProfitRate =
                        (v.agencyDealProfitRate * 100).toFixed(2) + "%";
                    v.clickRate = (v.clickRate * 100).toFixed(2) + "%";
                });
                exportCsv(
                    {
                        title: [
                            "公司",
                            "广告主花费",
                            "代理商成本",
                            "利润",
                            "利润率",
                            "展示量",
                            "点击量",
                            "点击率",
                            "CPM",
                            "CPC"
                        ],
                        titleForKey: [
                            "advertiserName",
                            "advertiserCost",
                            "agencyCost",
                            "agencyProfit",
                            "agencyDealProfitRate",
                            "view",
                            "click",
                            "clickRate",
                            "cpm",
                            "cpc"
                        ],
                        data: arr
                    },
                    "账户概况.csv"
                );
            });
        }
    }
};
</script>
<style lang="less">
</style>
