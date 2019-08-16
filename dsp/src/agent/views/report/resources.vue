<template>
    <div class="resource-page">
        <div class="page-title">
            合约资源
        </div>
        <div class="table">
            <div class="table-top resources">
                <p class="table-title">合约资源报表</p>
                <div class="table-filter">
                    <search placeholder="搜索合约资源名称" @search="setFilter($event,'name')"></search>
                    <select-data @select="selectDate"></select-data>
                    <m-select title="全部采买类型" :list="typeList" size="mid" @change="setFilter($event.id,'dealType')"></m-select>
                    <m-select title="全部资源类型" :list="resList" size="mid" @change="setFilter($event.id,'chargeType')"></m-select>
                    <m-select title="全部平台" :list="platformList" size="mid" @change="setFilter($event.id,'platform')"></m-select>
                    <m-select title="全部广告主" :list="advList" size="mid" valueName="name" @change="setFilter($event.id,'owner')"></m-select>
                    <dsp-button @click="download">下载报表</dsp-button>
                    <div class="refresh" @click="refreshReport"></div>
                </div>
            </div>                       
            <div id="scrollWrap" style="overflow:hidden;">            
                <div id="tableWrap" style="overflow-x:scroll;">
                    <table class="table-box" style="width:100%;" id="tableInfo">
                        <thead>
                            <tr>
                                <th>合约资源名称</th>
                                <th v-if="isDirect != 1">adxID</th>
                                <th v-if="isDirect != 1">dealID</th>
                                <th>采买类型</th>
                                <th>平台类型</th>
                                <th>资源类型</th>
                                <th>投放时段</th>
                                <th>花费(元)</th>
                                <th>成本(元)</th>
                                <th>利润(元)</th>
                                <th>利润率</th>
                                <th>展示量<Caret @changeSort="changeSort($event,'viewSort')" sortType="viewSort" :curType="curSortType"></Caret></th>
                                <th>点击量<Caret @changeSort="changeSort($event,'clickSort')" sortType="clickSort" :curType="curSortType"></Caret></th>
                                <th>点击率<Caret @changeSort="changeSort($event,'clickRateSort')" sortType="clickRateSort" :curType="curSortType"></Caret></th>
                                <th>原价(元)</th>
                                <th>售价(元)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="total" v-for="(item,index) in total" :key="index">
                                <td v-if="index == 0" :rowspan="total.length">总计</td>
                                <td v-if="isDirect != 1">-</td>
                                <td v-if="isDirect != 1">-</td>
                                <td>
                                    <p v-if="item.dealType == 'pdb'">保价保量</p>
                                    <p v-if="item.dealType == 'pd'">保价不保量</p>
                                </td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>{{item.advertiserCost}}</td>
                                <td>{{item.agencyCost}}</td>
                                <td>{{item.agencyProfit}}</td>
                                <td>{{item.agencyProfitRate*100|number(2)}}%</td>
                                <td>{{item.view|number}}</td>
                                <td>{{item.click|number}}</td>
                                <td>{{item.clickRate*100|number(2)}}%</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr v-for="(item,index) in list" :key="index+'-'">
                                <td>{{item.skuName}}</td>
                                <td v-if="isDirect != 1">{{item.adxID}}</td>
                                <td v-if="isDirect != 1">{{item.adxDealID}}</td>
                                <td>
                                    <p v-if="item.dealType == 'pdb'">保价保量</p>
                                    <p v-if="item.dealType == 'pd'">保价不保量</p>
                                </td>
                                <td>{{item.platformTag}}</td>
                                <td>{{item.chargeType}}</td>
                                <td>
                                    <p>共计{{item.durTime}}天</p>
                                    <div v-if="item.startDate">
                                        <p
                                            v-for="date in item.startDate.split(';')"
                                            :key="date"
                                        >{{date.replace(' 00:00:00','').replace(' 00:00:00','')}}</p>
                                    </div>
                                </td>
                                <td>{{item.advertiserCost}}</td>
                                <td>{{item.agencyCost}}</td>
                                <td>{{item.agencyProfit}}</td>
                                <td>{{item.agencyProfitRate*100|number(2)}}%</td>
                                <td>{{item.view|number}}</td>
                                <td>{{item.click|number}}</td>
                                <td>{{item.clickRate*100|number(2)}}%</td>
                                <td>
                                    <p>{{item.price}}</p>
                                </td>
                                <td>
                                    <p>{{item.sellPrice}}</p>                            
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="list.length || tableShow">
                        <thead>
                            <tr>
                                <th>合约资源名称</th>
                                <th v-if="isDirect != 1">adxID</th>
                                <th v-if="isDirect != 1">dealID</th>
                                <th>采买类型</th>
                                <th>平台类型</th>
                                <th>资源类型</th>
                                <th>投放时段</th>
                                <th>花费(元)</th>
                                <th>成本(元)</th>
                                <th>利润(元)</th>
                                <th>利润率</th>
                                <th>展示量<Caret @changeSort="changeSort($event,'viewSort')" sortType="viewSort" :curType="curSortType"></Caret></th>
                                <th>点击量<Caret @changeSort="changeSort($event,'clickSort')" sortType="clickSort" :curType="curSortType"></Caret></th>
                                <th>点击率<Caret @changeSort="changeSort($event,'clickRateSort')" sortType="clickRateSort" :curType="curSortType"></Caret></th>
                                <th>原价(元)</th>
                                <th>售价(元)</th>
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
import { getNowFormatDate, exportCsv, floatScroll } from "@/common/js/utils";
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    data() {
        return {
            curSortType: 'advCostSort',
            sort: ["advCostSort,1"],
            tableShow: false,
            total: {},
            list: [],
            filter: {},
            typeList: [
                { value: "全部采买类型" },
                { value: "保价保量", id: "pdb" },
                { value: "保价不保量", id: "pd" }
            ],
            resList: [
                { value: "全部资源类型" },
                { value: "CPC", id: "cpc" },
                { value: "CPM", id: "cpm" }
            ],
            platformList: [
                { value: "全部平台" },
                { id: "android", value: "Android" },
                { id: "ios", value: "iOS" }
            ],
            advList: [],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            eTime: getNowFormatDate() + " 23:59:59",
            sTime: getNowFormatDate() + " 00:00:00"
        };
    },
    created() {
        this.getList();
        this.getTotal();
        this.getAdvList();
    },
    computed: {
        isDirect() {
            return this.$store.state.isDirect;
        },
        permission() {
            return this.$store.state.common.permission;
        }
    },
    methods: {
        //刷新报表数据
        refreshReport() {
        this.getList();
        this.getTotal();
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
            this.getTotal();
        },
        getList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: this.sort,
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/agc/deal",
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
            }).then(() => {
                this.init()
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
                url: "/dsp/rpt/agc/deal/sum",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                this.total = res.data.data;
                // this.$nextTick(this.init)
                setTimeout( () => {
                    this.init()
                },0 )
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
                url: "/dsp/rpt/agc/deal",
                load: true,
                data: data
            }).then(res => {
                var arr = res.data.data || [];
                arr.forEach(function(v) {
                    if (v.dealType == "pdb") {
                        v.dealType = "保价保量";
                    } else {
                        v.dealType = "保价不保量";
                        v.price = v.advertiserProfit;
                    }
                    v.agencyProfitRate = v.agencyProfitRate * 100 + "%";
                    v.clickRate = v.clickRate * 100 + "%";
                });
                exportCsv(
                    {
                        title: [
                            "合约资源名称",
                            "采买类型",
                            "平台类型",
                            "资源类型",
                            "投放时段",
                            "花费(元)",
                            "成本(元)",
                            "利润(元)",
                            "利润率",
                            "展示量",
                            "点击量",
                            "点击率",
                            "单价"
                        ],
                        titleForKey: [
                            "skuName",
                            "dealType",
                            "platformTag",
                            "chargeType",
                            "startDate",
                            "advertiserCost",
                            "agencyCost",
                            "agencyProfit",
                            "agencyProfitRate",
                            "view",
                            "click",
                            "clickRate",
                            "price"
                        ],
                        data: arr
                    },
                    "合约资源.csv"
                );
            });
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
        },
        setFilter(val,attr) {
            this.filter[attr] = val;
            this.pageObj.currentPage = 1;
            this.getList();
            this.getTotal();
        },
    }
};
</script>
<style lang="less">
.resource-page {
    .dropdown-date {
        float: right;
        margin-right: 20px;
    }
}
@media screen and (max-width: 1720px) {
    .table{
        .resources{
            height: 161px;
        }
    }
}
</style>
