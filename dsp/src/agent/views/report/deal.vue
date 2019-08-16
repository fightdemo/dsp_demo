<template>
    <div>
        <div class="page-title">合约交易概况</div>
        <Target :data="targetData" :hideName="true" :list="targetList"></Target>
        <div class="table">
            <div class="table-top">
                <p class="table-title">合约交易概况报表</p>
                <div class="table-filter">
                    <select-data @select="selectDate"></select-data>
                    <m-select title="全部资源类型" size="mid" :list="typeList" @change="selectType"></m-select>
                    <m-select title="全部广告主" size="mid" :list="advList" valueName="name" @change="selectAdv"></m-select>
                    <dsp-button @click="download">下载报表</dsp-button>
                    <div class="refresh" @click="refreshReport"></div>
                </div>
            </div>                                
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;">
                    <table class="table-box" style="width:100%;" id="tableInfo">
                        <thead>
                            <tr>
                                <th>广告主名称</th>
                                <th>资源类型</th>
                                <th>成本(元)</th>
                                <th>收入(元)</th>
                                <th>单价(元)</th>
                                <th>展示量</th>
                                <th>点击量</th>
                                <th>点击率</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="total" v-for="(item,index) in total" :key="index">
                                <td v-if="index == 0" :rowspan="total.length">总计</td>
                                <td>
                                    <p v-if="item.dealType == 'pdb'">保价保量</p>
                                    <p v-if="item.dealType == 'pd'">保价不保量</p>
                                    <p v-if="!item.dealType">-</p>
                                </td>
                                <td>
                                    <p v-if="item.dealType == 'pdb'">{{item.agencyPdbCost}}</p>
                                    <p v-if="item.dealType == 'pd'">{{item.agencyCost}}</p>
                                    <p v-if="!item.dealType">-</p>
                                </td>
                                <td>{{item.agencyProfit}}</td>
                                <td>
                                    <p v-if="item.dealType == 'pdb'">{{item.price}}</p>
                                    <p v-if="item.dealType == 'pd'">{{item.dspCost}}</p>
                                    <p v-if="!item.dealType">-</p>
                                </td>
                                <td>{{item.view|number}}</td>
                                <td>{{item.click|number}}</td>
                                <td>{{item.clickRate*100|number(2)}}%</td>
                            </tr>

                            <tr v-for="(item,index) in list" :key="index + '-'">
                                <td
                                    v-if="!(list[index-1] && list[index-1].advertiserID == item.advertiserID)"
                                    :rowspan="(list[index+1] && list[index+1].advertiserID == item.advertiserID)? 2:1"
                                >{{item.advertiserName}}</td>
                                <td>
                                    <p v-if="item.dealType == 'pdb'">保价保量</p>
                                    <p v-if="item.dealType == 'pd'">保价不保量</p>
                                    <p v-if="!item.dealType">-</p>
                                </td>
                                <td>
                                    <p v-if="item.dealType == 'pdb'">{{item.agencyPdbCost}}</p>
                                    <p v-if="item.dealType == 'pd'">{{item.agencyCost}}</p>
                                    <p v-if="!item.dealType">-</p>
                                </td>
                                <td>{{item.agencyProfit}}</td>
                                <td>
                                    <p v-if="item.dealType == 'pdb'">{{item.price}}</p>
                                    <p v-if="item.dealType == 'pd'">{{item.dspCost}}</p>
                                    <p v-if="!item.dealType">-</p>
                                </td>
                                <td>{{item.view|number}}</td>
                                <td>{{item.click|number}}</td>
                                <td>{{item.clickRate*100|number(2)}}%</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="list.length || tableShow">
                        <thead>
                            <tr>
                                <th>广告主名称</th>
                                <th>资源类型</th>
                                <th>成本(元)</th>
                                <th>收入(元)</th>
                                <th>单价(元)</th>
                                <th>展示量</th>
                                <th>点击量</th>
                                <th>点击率</th>
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
import Target from "@/common/components/target";
import { getNowFormatDate, exportCsv, floatScroll } from "@/common/js/utils";
import common from "./common.js";
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    components: {
        Target
    },
    computed: {
        ...common.computed
    },
    data() {
        return Object.assign(common.data(),{
            total: {},
            list: [],
            filter: {},
            typeList: [
                { value: "全部资源类型" },
                { value: "保价保量", id: "1" },
                { value: "保价不保量", id: "2" }
            ],
            advList: [],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            targetData: {},
            targetList: [
                {
                    name: "PD当日花费",
                    t: "pdSpend",
                    yT: "pdYSpend",
                    ybT: "pdYbSpend"
                },
                {
                    name: "PD当日利润",
                    t: "pdProfit",
                    yT: "pdYProfit",
                    ybT: "pdYbProfit"
                },
                {
                    name: "PD当日利润率",
                    isRate: true,
                    t: "pdProfitRate",
                    yT: "rtbYProfitRate",
                    ybT: "rtbYbProfitRate"
                },
                {
                    name: "PB当日收入",
                    t: "pdbIncome",
                    yT: "pdbYIncome",
                    ybT: "pdbYbIncome"
                }
            ],
            eTime: getNowFormatDate() + " 23:59:59",
            sTime: getNowFormatDate() + " 00:00:00"
        })
    },
    created() {
        common.created.call(this)
        this.getList();
        this.getTotal();
        this.getAdvList();
        this.getTarget();
    },
    methods: {
        //刷新报表数据
        refreshReport() {
        this.getList();
        this.getTotal();
        },
        // 选择时间
        selectDate(val) {
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.pageObj.currentPage = 1;
            this.getList();
            this.getTotal();
        },
        getList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"],
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/deal/sku",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                var arr = [];
                // 获得列表
                var list = res.data.data || [];
                for (var i = 0; i < list.length; i++) {
                    arr.push(list[i]);
                    if (!list[i].dealType) {
                        var pdTr = JSON.parse(JSON.stringify(list[i]));

                        list[i].dealType = "pdb";
                        pdTr.dealType = "pd";
                        arr.push(pdTr);
                    }
                }
                this.list = arr;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;

                this.tableShow = true;
                this.$nextTick(this.init)
            });
        },
        getTotal() {
            var data = {
                sort: ["cTime,1"],
                filter: this.filter,
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/deal/sku/sum",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                this.total = res.data.data;
                this.$nextTick(this.init)
            });
        },
        getTarget() {
            // 默认今日
            var time = getNowFormatDate();
            var data = {
                filter: {},
                sTime: time + " 00:00:00",
                eTime: time + " 23:59:59"
            };
            // 竞价交易总额
            this.$ajax({
                url: "/dsp/rpt/agency/main",
                data: data
            }).then(res => {
                this.targetData = res.data.data;
            });
        },
        download() {
            var data = {
                page: "1",
                size: "99999",
                filter: this.filter,
                sort: ["cTime,1"],
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/deal/sku",
                load: true,
                data: data
            }).then(res => {
                var arr = res.data.data || [];
                var agencyCost,price;
                arr.forEach(function(v) {
                    v.dealType =
                        v.dealType == "pdb" ? "保价保量" : "保价不保量";
                    v.clickRate = (v.clickRate * 100).toFixed(2) + "%";
                    agencyCost = v.dealType == "pdb" ? 'agencyPdbCost' : 'agencyCost';
                    price = v.dealType == "pdb" ? 'price' : 'dspCost';
                });

                exportCsv(
                    {
                        title: [
                            "广告主名称",
                            "资源类型",
                            "成本(元)",
                            "收入(元)",
                            "单价(元)",
                            "展示量",
                            "点击量",
                            "点击率"
                        ],
                        titleForKey: [
                            "advertiserName",
                            "dealType",
                            agencyCost,
                            "agencyProfit",
                            price,
                            "view",
                            "click",
                            "clickRate"
                        ],
                        data: arr
                    },
                    "合约交易概况.csv"
                );
            });
        },
        selectType(item) {
            this.filter.DealType = item.id;
            this.pageObj.currentPage = 1;
            this.getList();
            this.getTotal();
        },
        selectAdv(item) {
            this.filter.advertiseID = item.id;
            this.pageObj.currentPage = 1;
            this.getList();
            this.getTotal();
        },
        selectAdv(item) {
            this.filter.advertiseID = item.id;
            this.pageObj.currentPage = 1;
            this.getList();
            this.getTotal();
        },
        getAdvList() {
            var data = {
                page: "1",
                size: "9999",
                sort: ["cTime,1"],
                filter: this.filter
            };
            this.$ajax({
                url: "/dsp/advertiser/putin/list",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                this.advList = res.data.data;
                this.advList.unshift({ name: "全部广告主" });
            });
        }
    }
};
</script>
<style lang="less">
</style>
