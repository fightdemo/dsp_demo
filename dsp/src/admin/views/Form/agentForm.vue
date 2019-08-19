<template>
    <div id="admin_form_agent">
        <p class="page-title">代理商报表中心</p>
        <div class="table content">
            <div class="table-top">
                <h3 class="table-title icon">代理商报表</h3>
                <div class="table-filter cl">
                    <admin-date @select="selectDate"></admin-date>
                    <admin-search @search="search"></admin-search>
                </div>
            </div>
            
            <div id="scrollWrap" style="overflow:hidden;">       
                <div id="tableWrap" style="overflow-x:scroll;"> 
                    <table class="table-box" id='tableInfo'  style="width:100%;">
                        <thead>
                            <tr>
                                <th>代理商ID</th>
                                <th>代理商名称</th>
                                <th>曝光数</th>
                                <th>点击数</th>
                                <th>点击率</th>
                                <th>到达数</th>
                                <th>转化</th>
                                <th>转化率</th>
                                <th>CPM单价（元）</th>
                                <th>CPC单元（元）</th>
                                <th>代理商成本</th>
                                <th>代理商利润</th>
                                <th>代理商利润率</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in tableList" :key="index">
                                <td>{{ item.dspID }}</td>
                                <td>{{ item.dspName }}</td>
                                <td>{{ item.view|number }}</td>
                                <td>{{ item.click|number }}</td>
                                <td>{{ item.clickRate*100|number(2)}}%</td>
                                <td>{{ item.arrive|number }}</td>
                                <td>{{ item.action|number }}</td>
                                <td>{{ item.actionRate*100|number(2)}}%</td>
                                <td>{{item.cpm ? fmoney(item.cpm, 2) : '-'}}</td>
                                <td>{{item.cpc ? fmoney(item.cpc, 2) : '-'}}</td>
                                <td>{{item.dspCost ? fmoney(item.dspCost, 2) : '-'}}</td>
                                <td>{{item.dspProfit ? fmoney(item.dspProfit, 2) : '-'}}</td>
                                <td>{{ item.dspProfitRate*100|number(2)}}%</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="tableList.length || tableShow" ref="floatThead">
                        <thead>
                            <tr>
                                <th>代理商ID</th>
                                <th>代理商名称</th>
                                <th>曝光数</th>
                                <th>点击数</th>
                                <th>点击率</th>
                                <th>到达数</th>
                                <th>转化</th>
                                <th>转化率</th>
                                <th>CPM单价（元）</th>
                                <th>CPC单元（元）</th>
                                <th>代理商成本</th>
                                <th>代理商利润</th>
                                <th>代理商利润率</th>
                            </tr>
                        </thead>
                    </table>
                    <!-- <table class="table-box float-thead2"  id="float-thead2">
                        <thead>
                            <tr>
                                <th>代理商ID</th>
                                <th>代理商名称</th>
                            </tr>
                        </thead>
                    </table>
                    <table class="table-box float-body"  id="float-body"  v-if="tableList.length">
                        <thead>
                            <tr>
                                <th>代理商ID</th>
                                <th>代理商名称</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in tableList" :key="index">
                                <td>{{ item.dspID }}</td>
                                <td>{{ item.dspName }}</td>
                            </tr>
                        </tbody>
                    </table> -->
                </div>
                <!-- <div class="slider-bar slider-bottom" id="slider-bar"><div class="bar"></div></div> -->
            </div>
            <div class="scroll-wrap">
                <div class="h-bar"></div>
            </div>
            <admin-page id="pageToolbar" :page="pageObj" @change="getList"></admin-page>
        </div>
        
    </div>
</template>
<script>
import adminDate from "@/common/components/select-data";
import adminSearch from "@/common/components/search";
import { floatScroll, getNowFormatDate } from "@/common/js/utils";
import Page from "@/common/components/page";
import {mixin} from './common.js'
export default {
    mixins: [mixin],
    data() {
        return {
            sTime: getNowFormatDate() + " " + "00:00:00",
            eTime: getNowFormatDate() + " " + "23:59:59",
            tableList: [],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter: {},
            transform: '',
            moveX: 0,
        };
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            this.$ajax({
                url: "/dsp/rpt/all/saasdsp",
                data: {
                    page: this.pageObj.currentPage + "",
                    size: this.pageObj.size + "",
                    filter: this.filter,
                    eTime: this.eTime,
                    sTime: this.sTime,
                    sort: ["cTime,1"]
                },
                load: true
            }).then(res => {
                this.tableList = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                this.$nextTick(this.init)
                // setTimeout(() => {
                //     this.init()
                // },1000)
            });
        },
        search(val) {
            this.pageObj.currentPage = "1";
            this.filter.dspName = val;
            this.getList();
            this.tableShow = true;
        },
        selectDate(val) {
            this.dataGrain = val.start == val.end ? "hour" : "day";
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.getList();
        },     
    },
    components: {
        adminDate: adminDate,
        adminSearch: adminSearch,
        adminPage: Page
    }
};
</script>
<style lang="less" scoped>
// .table{
//     overflow-y: hidden;
//     overflow-x: scroll;
//     white-space: nowrap;
// }
// .table-box{
//     width: 1593px;
// } 
</style>


