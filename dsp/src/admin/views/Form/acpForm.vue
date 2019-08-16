<template>
    <div id="admin_form_agent">
        <p class="page-title">广告公司报表中心</p>
        <div class="table content">
            <div class="table-top">
                <h3 class="table-title icon">广告公司报表</h3>
                <div class="table-filter cl">
                    <admin-date @select="selectDate"></admin-date>
                    <admin-select
                        title="全部代理商"
                        :list="dspList"
                        valueName="dspName"
                        keyName="dspID"
                        @change="selectAgent"
                    ></admin-select>
                    <admin-search @search="search"></admin-search>
                </div>
            </div>
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;"> 
                    <table class="table-box" id='tableInfo' style="width:100%;">
                        <thead>
                            <tr>
                                <th>广告公司ID</th>
                                <th>广告公司名称</th>
                                <th>填充数</th>
                                <th>曝光数</th>
                                <th>点击数</th>
                                <th>点击率</th>
                                <th>到达数</th>
                                <th>转化</th>
                                <th>转化率</th>
                                <th>CPM单价（元）</th>
                                <th>CPC单价（元）</th>
                                <th>广告公司利润</th>
                                <th>广告公司利润率</th>
                                <th>广告公司RTB</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in tableList" :key="index">
                                <td>{{item.agencyID}}</td>
                                <td style="word-break:break-all;">{{item.agencyName}}</td>
                                <td>{{item.fill|number}}</td>
                                <td>{{item.view|number}}</td>
                                <td>{{item.click|number}}</td>
                                <td>{{item.clickRate*100|number(2)}}%</td>
                                <td>{{item.arrive|number}}</td>
                                <td>{{item.action|number}}</td>
                                <td>{{item.actionRate*100|number(2)}}%</td>
                                <td>{{item.cpm ? fmoney(item.cpm, 2) : '-'}}</td>
                                <td>{{item.cpc ? fmoney(item.cpc, 2) : '-'}}</td>
                                <td>{{item.agencyProfit ? fmoney(item.agencyProfit, 2) : '-'}}</td>
                                <td>{{item.agencyProfitRate*100|number(2)}}%</td>
                                <td>{{item.agencyDealProfitRate*100|number(2)}}%</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="tableList.length || tableShow" ref="floatThead">
                        <thead>
                            <tr>
                                <th>广告公司ID</th>
                                <th>广告公司名称</th>
                                <th>填充数</th>
                                <th>曝光数</th>
                                <th>点击数</th>
                                <th>点击率</th>
                                <th>到达数</th>
                                <th>转化</th>
                                <th>转化率</th>
                                <th>CPM单价（元）</th>
                                <th>CPC单价（元）</th>
                                <th>广告公司利润</th>
                                <th>广告公司利润率</th>
                                <th>广告公司RTB</th>
                            </tr>
                        </thead>
                    </table>
                </div>
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
import adminSelect from "@/common/components/select";
import adminSearch from "@/common/components/search";
import { getNowFormatDate } from "@/common/js/utils";
import Page from "@/common/components/page";
import {mixin} from './common.js'
export default {
    mixins: [mixin],
    data() {
        return {
            sTime: getNowFormatDate() + " " + "00:00:00",
            eTime: getNowFormatDate() + " " + "23:59:59",
            tableList: [],
            filter: {},
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            dspList: []
        };
    },
    components: {
        adminDate: adminDate,
        adminSearch: adminSearch,
        adminSelect: adminSelect,
        adminPage: Page
    },
    mounted() {
        this.getList();
        this.getDspList();
    },
    methods: {
        search(val) {
            this.pageObj.currentPage = "1";
            this.filter.agencyName = val;
            this.getList();
        },
        getList() {
            this.$ajax({
                url: "/dsp/rpt/all/agency",
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
            });
        },
        getDspList() {
            this.$ajax({
                url: "/dsp/rpt/admin/dspname",
                data: {}
            }).then(res => {
                this.dspList = res.data;
                this.dspList.unshift({ dspName: "全部代理商" });
            });
        },
        selectDate(val) {
            this.dataGrain = val.start == val.end ? "hour" : "day";
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.getList();
        },
        selectAgent(d) {
            if (!d.dspID) {
                this.filter.dspID = "";
            } else {
                this.filter.dspID = d.dspID;
            }
            this.getList();
        },
    }
};
</script>
<style lang="less" scoped>
</style>
