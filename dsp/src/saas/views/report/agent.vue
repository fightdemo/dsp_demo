<template>
<div id="dsp_report_agent">
    <p class="page-title">报表中心</p>
    <div class="table content">
        <div class="table-top">
           <h3 class="table-title icon">广告公司报表</h3>
            <div class="table-filter">
                <dsp-date @select="selectDate"></dsp-date>
                <dsp-search @search="search" placeholder="广告公司名称或ID"></dsp-search>
                <dsp-button @click="download">下载报表</dsp-button>
                <div class="refresh" @click="refreshReport"></div>
            </div>
        </div>
        <div id="scrollWrap" style="overflow:hidden;">
            <div id="tableWrap" style="overflow-x:scroll;"> 
                <table class="table-box" id='tableInfo' style="width:100%;">
                    <thead>
                        <tr>
                            <th>广告公司ID</th>
                            <th>广告公司公司名称</th>
                            <th>广告公司花费(元)</th>
                            <th>DSP成本(元)</th>
                            <th>利润(元)</th>
                            <th>利润率</th>
                            <th>展示量<Caret @changeSort="changeSort($event,'viewSort')" sortType="viewSort" :curType="curSortType"></Caret></th>
                            <th>点击量<Caret @changeSort="changeSort($event,'clickSort')" sortType="clickSort" :curType="curSortType"></Caret></th>
                            <th>点击率<Caret @changeSort="changeSort($event,'clickRateSort')" sortType="clickRateSort" :curType="curSortType"></Caret></th>
                            <th>CPM单价(元)<Caret @changeSort="changeSort($event,'cpmSort')" sortType="cpmSort" :curType="curSortType"></Caret></th>
                            <th>CPC单价(元)<Caret @changeSort="changeSort($event,'cpcSort')" sortType="cpcSort" :curType="curSortType"></Caret></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="total" v-for="(t,index) in totalList" :key="index+'-'">
                            <td>总计</td>
                            <td>-</td>
                            <td>{{t.agencyCost ? fmoney(t.agencyCost, 2) : '-'}}</td>
                            <td>{{t.dspCost ? fmoney(t.dspCost, 2) : '-'}}</td>
                            <td>{{t.dspProfit ? fmoney(t.dspProfit, 2) : '-'}}</td>
                            <td>{{ t.dspProfitRate*100|number(2)}}%</td>
                            <td>{{ t.view|number }}</td>
                            <td>{{ t.click|number }}</td>
                            <td>{{ t.clickRate*100|number(2)}}%</td>
                            <td>{{t.cpm ? fmoney(t.cpm, 2) : '-'}}</td>
                            <td>{{t.cpc ? fmoney(t.cpc, 2) : '-'}}</td>
                        </tr>
                        <tr v-for="(item,index) in tableList" :key="index">
                            <td>{{ item.agencyID }}</td>
                            <td>{{ item.agencyName }}</td>
                            <td>{{item.agencyCost ? fmoney(item.agencyCost, 2) : '-'}}</td>
                            <td>{{item.dspCost ? fmoney(item.dspCost, 2) : '-'}}</td>
                            <td>{{item.dspProfit ? fmoney(item.dspProfit, 2) : '-'}}</td>
                            <td>{{ item.dspProfitRate*100|number(2)}}%</td>
                            <td>{{ item.view|number }}</td>
                            <td>{{ item.click|number }}</td>
                            <td>{{ item.clickRate*100|number(2)}}%</td>
                            <td>{{item.cpm ? fmoney(item.cpm, 2) : '-'}}</td>
                            <td>{{item.cpc ? fmoney(item.cpc, 2) : '-'}}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="table-box float-thead" id="float-thead" v-if="tableList.length || tableShow" ref="floatThead">
                    <thead>
                        <tr>
                            <th>广告公司ID</th>
                            <th>广告公司公司名称</th>
                            <th>广告公司花费(元)</th>
                            <th>DSP成本(元)</th>
                            <th>利润(元)</th>
                            <th>利润率</th>
                            <th>展示量<Caret @changeSort="changeSort($event,'viewSort')" sortType="viewSort" :curType="curSortType"></Caret></th>
                            <th>点击量<Caret @changeSort="changeSort($event,'clickSort')" sortType="clickSort" :curType="curSortType"></Caret></th>
                            <th>点击率<Caret @changeSort="changeSort($event,'clickRateSort')" sortType="clickRateSort" :curType="curSortType"></Caret></th>
                            <th>CPM单价(元)<Caret @changeSort="changeSort($event,'cpmSort')" sortType="cpmSort" :curType="curSortType"></Caret></th>
                            <th>CPC单价(元)<Caret @changeSort="changeSort($event,'cpcSort')" sortType="cpcSort" :curType="curSortType"></Caret></th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        <div class="scroll-wrap">
            <div class="h-bar"></div>
        </div>
        <dsp-page id="pageToolbar" :page="pageObj" @change="getList"></dsp-page>
    </div>
</div>
    
</template>
<script>
import dspDate from '@/common/components/select-data'
import Page from '@/common/components/page'
import Search from '@/common/components/search' 
import { getNowFormatDate, exportCsv } from "@/common/js/utils"
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    data(){
        return{
            sTime: getNowFormatDate() + " " + "00:00:00",
            eTime: getNowFormatDate() + " " + "23:59:59",
            tableList:[],
            totalList:[],
            pageObj:{
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter:{},
            curSortType: "",
            sort: ["agencyCost,1"],
        }

    },
    mounted(){
        this.getList();
        this.getSum();
    },
    methods:{
        download() {
            var data = {
                page: "1",
                size: "99999",
                filter: {},
                sort: ["agencyCost,1"],
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/agency",
                load: true,
                data: data
            }).then(res => {
                var arr = res.data.data || [];
                // 获得列表
                arr.forEach((v) => {
                    v.agencyCost = this.fmoney(v.agencyCost, 2);
                    v.dspCost = this.fmoney(v.dspCost, 2);
                    v.dspProfit = this.fmoney(v.dspProfit, 2);
                    v.dspProfitRate = (v.dspProfitRate * 100).toFixed(2) + "%";
                    v.clickRate = (v.clickRate * 100).toFixed(2) + "%";
                    v.cpm = this.fmoney(v.cpm, 2);
                    v.cpc = this.fmoney(v.cpc, 2);
                });
                exportCsv(
                    {
                        title: [
                            "广告公司ID",
                            "广告公司公司名称",
                            "广告公司花费(元)",
                            "DSP成本(元)",
                            "利润(元)",
                            "利润率",
                            "展示量",
                            "点击量",
                            "点击率",
                            "CPM单价(元)",
                            "CPC单价(元)"
                        ],
                        titleForKey: [
                            "agencyID",
                            "agencyName",
                            "agencyCost",
                            "dspCost",
                            "dspProfit",
                            "dspProfitRate",
                            "view",
                            "click",
                            "clickRate",
                            "cpm",
                            "cpc",
                        ],
                        data: arr
                    },
                    "广告公司报表.csv"
                );
            });
        },
        getList(){
            this.$ajax({
                url: '/dsp/rpt/agency',
                data:{
                    'sTime': this.sTime,
                    'eTime': this.eTime,
                    'page': this.pageObj.currentPage+"",
                    'size': this.pageObj.size+"",
                    "sort": this.sort,
                    'filter':this.filter
                }
            }).then(res=>{
                this.tableList = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                this.$nextTick(this.init)
            })
        },
        getSum(){
            this.$ajax({
                url: '/dsp/rpt/agency/sum',
                data:{
                    'page': '1',
                    'size': '999999',
                    'sTime': this.sTime,
                    'eTime': this.eTime,
                    'filter': this.filter
                },
                load: true
            }).then(res=>{
                this.totalList = res.data.data;
                this.$nextTick(this.init)
            })
        },
        selectDate(val) {
            this.dataGrain = val.start == val.end ? "hour" : "day";
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.getList();
            this.getSum();
        },
        search(val){
            this.pageObj.currentPage = "1";
            this.filter.name = val;
            this.getList();
            this.getSum();
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
        //刷新报表数据
        refreshReport() {
            this.getList();
            this.getSum();
        }
    },
    components:{
        'dspPage': Page,
        'dspDate': dspDate,
        'dspSearch': Search
    } 
}
</script>
<style lang="less" scoped>
</style>


