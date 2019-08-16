<template>
    <div class="saas-sku-page">
        <div class="page-title">合约资源管理</div>
        <div class="content">
            <div class="table content">
                <div class="table-top cl">
                    <p class="table-title">合约资源列表</p>
                    <div class="table-filter">
                        <search placeholder="搜索资源名称" @search="setFilter('name',$event)"></search>
                        <select-data @select="selectDate" :all="true"></select-data>
                        <m-select
                            title="全部状态"
                            :list="stateList"
                            @change="setFilter('executeState',$event.id)"
                        ></m-select>
                        <m-select
                            title="全部平台"
                            :list="platformList"
                            @change="setFilter('platform',$event.id)"
                        ></m-select>
                        <m-select
                            title="全部资源类型"
                            :list="chargeTypeList"
                            @change="setFilter('chargeType',$event.id)"
                        ></m-select>
                        <m-select
                            title="全部采买类型"
                            :list="dealTypeList"
                            @change="setFilter('skuType',$event.id)"
                        ></m-select>
                    </div>
                </div>
                <div id="scrollWrap" style="overflow:hidden;">      
                    <div id="tableWrap" style="overflow-x:scroll;">
                        <table class="table-box"  id='tableInfo'  style="width:100%;">
                            <thead>
                                <tr>
                                    <th>状态</th>
                                    <th>adxID</th>
                                    <th>dealID</th>
                                    <th>资源名称</th>
                                    <th>采买时段</th>
                                    <th>所属平台</th>
                                    <th>资源类型</th>
                                    <th>采买类型</th>
                                    <th>单价(元/千次曝光)</th>
                                    <th>量级(千次曝光/每天)</th>
                                    <th>广告位信息</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in list" :key="index" v-show="!(item.executeState == '交易结束' || item.executeState == '已售罄')">
                                    <td
                                        :class="{state1: item.executeState=='执行中',state2: item.executeState=='交易结束',state3: item.executeState=='已售罄'}"
                                    >{{item.executeState}}</td>
                                    <td>{{item.adxID}}</td>
                                    <td>{{item.adxDealID}}</td>
                                    <td>{{item.name}}</td>
                                    <td>
                                        <p v-for="data in item.date.split(';')" :key="data">{{data}}</p>
                                    </td>
                                    <td>{{item.platform}}</td>
                                    <td>{{item.chargeType}}</td>
                                    <td>{{item.skuType}}</td>
                                    <td>{{item.sellPrice}}</td>
                                    <td>{{item.amount}}</td>
                                    <td style="text-align: left;padding-left: 20px">
                                        <p
                                            v-for="(space,index) in item.spaceInfo.split(';')"
                                            :key="index"
                                        >{{space}}</p>
                                    </td>
                                    <td>
                                        <dsp-button class="dsp-btn btn-blue" @click="$router.push({name:'sku.detail',params:{id:item.id,type: 'buy'}})">立即购买</dsp-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table-box float-thead" id="float-thead" v-if="list.length || tableShow" ref="floatThead">
                            <thead>
                                <tr>
                                    <th>状态</th>
                                    <th>adxID</th>
                                    <th>dealID</th>
                                    <th>资源名称</th>
                                    <th>采买时段</th>
                                    <th>所属平台</th>
                                    <th>资源类型</th>
                                    <th>采买类型</th>
                                    <th>单价(元/千次曝光)</th>
                                    <th>量级(千次曝光/每天)</th>
                                    <th>广告位信息</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                        </table>             
                    </div>
                    <div class="slider-bar slider-bottom" id="slider-bar"><div class="bar"></div></div>
                </div>
                <div class="scroll-wrap">
                    <div class="h-bar"></div>
                </div>
                <page id="pageToolbar" :page="pageObj" @change="getList"></page>
            </div>
        </div>
    </div>
</template>
<script>
import { floatScroll, getNowFormatDate } from "@/common/js/utils"
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    data() {
        return {
            list: [],
            tableShow: false,
            platformList: [
                { value: "全部平台" },
                { id: "android", value: "Android" },
                { id: "ios", value: "iOS" }
            ],
            chargeTypeList: [
                { value: "全部资源类型" },
                { id: "cpc", value: "CPC" },
                { id: "cpm", value: "CPM" }
            ],
            dealTypeList: [
                { value: "全部采买类型" },
                { id: "pdb", value: "保价保量" },
                { id: "pd", value: "保价不保量" }
            ],
            stateList: [
                { value: "全部状态" },
                { id: "10", value: "待执行" },
                { id: "20", value: "执行中" },
                { id: "30", value: "交易结束" },
                { id: "40", value: "已售罄" }
            ],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter: {
                self: "0",
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        // 选择时间
        selectDate(val) {
            console.log( val )
            if(val.start && val.end) {
                this.filter.startDate = val.start + " 00:00:00";
                this.filter.endDate = val.end + " 23:59:59";
            } else {
                this.filter.startDate = this.filter.endDate = ""
            }
            this.getList();
        },
        setFilter(attr, val) {
            this.pageObj.currentPage = "1";
            this.filter[attr] = val;
            this.pageObj.currentPage = 1;
            this.getList();           
        },
        getList(pageObj) {
            this.pageObj = pageObj || {
                currentPage: 1,
                size: 20
            };
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/sku/show/list",
                data: data,
                load: true
            }).then(res => {
                var arr = res.data.data || [];
                var skuTypes = {
                    pdb: "保价保量",
                    pd: "保价不保量",
                    rtb: "竞价"
                };
                var executeStates = {
                    "10": "待执行",
                    "20": "执行中",
                    "30": "交易结束",
                    "40": "已售罄"
                };
                arr.forEach(v => {
                    v.skuType = skuTypes[v.skuType];
                    v.executeState = executeStates[v.executeState];
                    var dateStr = "",
                        spaceStr = "";
                    v.date = v.date || [];
                    v.date.forEach(function(data) {
                        dateStr += data.startDate + " - " + data.endDate + ";";
                    });
                    v.spaceInfo.forEach(function(space) {
                        spaceStr +=
                            space.appName + "，" + space.adxSpaceName + ";";
                    });
                    v.date = dateStr;
                    v.spaceInfo = spaceStr;
                });
                this.list = arr;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                this.tableShow = true;
                this.$nextTick(this.init)
            });
        },
          
    }
};
</script>
<style lang="less">
.saas-sku-page {
    .state1 {
        color: #1bca4c;
    }
    .state2 {
        color: #3e9cfa;
    }
    .state3 {
        color: #ec4d4d;
    }
    @media screen and (max-width: 1720px) {
        // .sku-page{
            .table-top{ 
                height: 120px!important;
            }
            .table .table-top .table-filter .m-select-wrap{
                width: 130px!important;
            }
            .search-box {
                width: 150px!important;
            }
            .new-dropdown.el-date-editor.el-date-editor--daterange.el-input__inner{
                width: 225px!important;
            }
        // }
    }
}

</style>

