<template>
    <div>
        <div class="page-title">合约资源管理</div>
        <div class="table content">
            <div class="table-top cl">
                <p class="table-title">已购列表</p>
                <div class="table-filter">
                    <select-data :hasAll="true" @select="selectDate"></select-data>
                </div>
            </div>
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;">
                    <table class="table-box" id='tableInfo'  style="width:100%;">
                        <thead>
                            <tr>
                                <th>状态</th>
                                <th>adxID</th>
                                <th>dealID</th>
                                <th>合约资源名称</th>
                                <th>资源类型</th>
                                <th>投放时段</th>
                                <th>原价(元/千次曝光)</th>
                                <th>售价(元/千次曝光)</th>
                                <th>天量(千次曝光/每天)</th>
                                <th>合约资源详情</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in list" :key="index">
                                <td
                                    :class="{state1: item.executeState=='执行中',state2: item.executeState=='交易结束',state3: item.executeState=='已售罄'}"
                                >{{item.executeState}}</td>
                                <td>{{item.adxID}}</td>
                                <td>{{item.adxDealID}}</td>
                                <td>{{item.name}}</td>
                                <td>{{item.skuType}}</td>
                                <td>
                                    <p v-for="data in item.date.split(';')" :key="data" style="white-space: nowrap;">{{data}}</p>
                                </td>
                                <td>{{item.price}}</td>
                                <td>{{item.sellPrice}}</td>
                                <td>{{item.amount|number}}</td>
                                <td style="text-align: left;padding-left: 20px">
                                    <p style="white-space: nowrap;"
                                        v-for="(space,index) in item.spaceInfo.split(';')" :key="index"
                                    >{{space}}</p>
                                </td>
                                <td>
                                    <dsp-button v-show="item.executeState != '交易结束' && item.executeState != '已售罄'" @click="$router.push({name:'sku.detail',params:{id:item.id,type: 'modify'}})">修改价格</dsp-button>
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
                                <th>合约资源名称</th>
                                <th>资源类型</th>
                                <th>投放时段</th>
                                <th>原价(元/千次曝光)</th>
                                <th>售价(元/千次曝光)</th>
                                <th>天量(千次曝光/每天)</th>
                                <th>合约资源详情</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                    </table>
                    <!-- <table class="table-box float-thead2"  id="float-thead2">
                        <thead>
                            <tr>
                                <th>状态</th>
                                <th>adxID</th>
                                <th>dealID</th>
                                <th>合约资源名称</th>
                            </tr>
                        </thead>
                    </table>
                    <table class="table-box float-body"  id="float-body"  v-if="list.length">
                        <thead>
                            <tr>
                                <th>状态</th>
                                <th>adxID</th>
                                <th>dealID</th>
                                <th>合约资源名称</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in list" :key="index">
                                <td
                                    :class="{state1: item.executeState=='执行中',state2: item.executeState=='交易结束',state3: item.executeState=='已售罄'}"
                                >{{item.executeState}}</td>
                                <td>{{item.adxID}}</td>
                                <td>{{item.adxDealID}}</td>
                                <td>{{item.name}}</td>
                            </tr>
                        </tbody>
                    </table> -->
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
import { floatScroll, getNowFormatDate } from "@/common/js/utils";
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    data() {
        return {
            total: {},
            list: [],
            tableShow: false,
            filter: {
                startDate:'',
                endDate:'',
                self: "1"
            },
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        // 选择时间
        selectDate(val) {
            if(val.start && val.end) {

                this.filter.startDate = val.start + " 00:00:00";
                this.filter.endDate = val.end + " 23:59:59";
            } else {
                this.filter.startDate = this.filter.endDate = ""
            }
            this.pageObj.currentPage = 1;
            this.getList();
        },
        getList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/sku/show/list",
                load: true,
                data: data
            }).then(res => {
                var arr = res.data.data || [];
                var executeStates = {
                    "10": "待执行",
                    "20": "执行中",
                    "30": "交易结束",
                    "40": "已售罄"
                };
                arr.forEach((v) => {
                    v.skuType = v.skuType == 'pd'?'保价不保量':'保价保量';
                    v.executeState = executeStates[v.executeState];
                    var dateStr = "",spaceStr = "";
                    v.date = v.date || [];
                    v.date.forEach(function (data) {
                        dateStr += data.startDate + ' - ' + data.endDate + ";";
                    })
                    v.spaceInfo.forEach(function (space) {
                        spaceStr += space.appName + " - " + space.adxSpaceName + ";";
                    })
                    v.date = dateStr;
                    v.spaceInfo = spaceStr;
                })
                // 获得列表
                this.list = arr;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                this.$nextTick(this.init)
            });
        },  
    }
};
</script>
<style lang="less">
.state1 {
    color: #1bca4c;
}
.state2 {
    color: #3e9cfa;
}
.state3 {
    color: #ec4d4d;
}
</style>
