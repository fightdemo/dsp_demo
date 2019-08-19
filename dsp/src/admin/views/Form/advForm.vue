<template>
    <div id="admin_form_adv">
        <p class="page-title">广告主报表中心</p>
        <div class="table content">
            <div class="table-top">
                <h3 class="table-title icon">广告主报表</h3>
                <div class="table-filter cl">
                    <admin-date @select="selectDate"></admin-date>
                    <admin-select
                        :title.sync="agentTitle"
                        :list="dspList"
                        valueName="dspName"
                        keyName="dspID"
                        @change="selectDsp"
                    ></admin-select>
                    <admin-select
                        :title.sync="advTitle"
                        :list="agencyList"
                        valueName="agencyName"
                        keyName="agencyID"
                        @change="selectAgency"
                        :idVal="idVal"
                    ></admin-select>
                    <admin-search @search="search"></admin-search>
                </div>
            </div>
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;"> 
                    <table class="table-box" id='tableInfo' style="width:100%;">
                        <thead>
                            <tr>
                                <th>广告主ID</th>
                                <th>广告主名称</th>
                                <th>填充数</th>
                                <th>曝光数</th>
                                <th>点击量</th>
                                <th>点击率</th>
                                <th>到达数</th>
                                <th>转化</th>
                                <th>转化率</th>
                                <th>CPM单价(元)</th>
                                <th>CPC单价(元)</th>
                                <th>广告主成本</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in tableList" :key="index">
                                <td>{{item.advertiserID}}</td>
                                <td style="word-break:break-all;">{{item.advertiserName}}</td>
                                <td>{{item.fill|number}}</td>
                                <td>{{item.view|number}}</td>
                                <td>{{item.click|number}}</td>
                                <td>{{item.clickRate*100|number(2)}}%</td>
                                <td>{{item.arrive|number}}</td>
                                <td>{{item.action|number}}</td>
                                <td>{{item.actionRate*100|number(2)}}%</td>
                                <td>{{item.cpm ? fmoney(item.cpm, 2) : '-'}}</td>
                                <td>{{item.cpc ? fmoney(item.cpc, 2) : '-'}}</td>
                                <td>{{item.advertiserCost ? fmoney(item.advertiserCost, 2) : '-'}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="tableList.length || tableShow" ref="floatThead">
                        <thead>
                            <tr>
                                <th>广告主ID</th>
                                <th>广告主名称</th>
                                <th>填充数</th>
                                <th>曝光数</th>
                                <th>点击量</th>
                                <th>点击率</th>
                                <th>到达数</th>
                                <th>转化</th>
                                <th>转化率</th>
                                <th>CPM单价(元)</th>
                                <th>CPC单价(元)</th>
                                <th>广告主成本</th>
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
            agentTitle: "全部代理商",
            advTitle: "全部广告公司",
            filter: {},
            tableList: [],
            agencyList: [],
            dspList: [],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            idVal: ""
        };
    },
    mounted() {
        this.getList();
        this.getDsp();
    },
    methods: {
        getList() {
            this.$ajax({
                url: "/dsp/rpt/all/advertiser",
                data: {
                    page: this.pageObj.currentPage + "",
                    size: this.pageObj.size + "",
                    filter: this.filter,
                    sort: ["advertiserCost,1"],
                    sTime: this.sTime,
                    eTime: this.eTime
                }
            }).then(res => {
                this.tableList = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                this.$nextTick(this.init)
            });
        },
        getDsp() {
            this.$ajax({
                url: "/dsp/rpt/admin/dspname",
                data: {}
            }).then(res => {
                this.dspList = res.data;
                this.dspList.unshift({ dspName: "全部代理商" });
            });
        },
        getAgency(data) {
            this.$ajax({
                url: "/dsp/rpt/admin/Agency",
                data: {
                    filter: {
                        dspID: data
                    }
                }
            }).then(res => {
                this.agencyList = res.data.data;
                this.agencyList.unshift({ agencyName: "全部广告公司" });
            });
        },
        search(val) {
            this.pageObj.currentPage = "1";
            this.filter.advertisername = val;
            this.getList();
        },
        selectDate(val) {
            this.dataGrain = val.start == val.end ? "hour" : "day";
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.getList();
        },
        selectAgency(d) {
            this.filter.agencyID = d.agencyID;
            this.getList();
        },
        selectDsp(d) {
            this.filter.dspID = d.dspID;
            this.filter.agencyID = "";
            this.advTitle = "全部广告公司";
            this.idVal = "";

            this.getAgency(d.dspID);
            // this.getList();
        }
    },
    components: {
        adminDate: adminDate,
        adminSearch: adminSearch,
        adminSelect: adminSelect,
        adminPage: Page
    }
};
</script>
<style lang="less" scoped>
</style>
