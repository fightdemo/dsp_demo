<template>
    <div class="dsp_report_sku">
        <p class="page-title">报表中心</p>
        <div class="table">
            <div class="table-top cl">
                <h3 class="table-title icon">合约资源报表</h3>
                <div class="table-filter">
                    <dsp-search  @search="search" placeholder="请输入名称"></dsp-search>
                    <dsp-date @select="selectDate"></dsp-date>
                    <dsp-select title="全部广告公司" :list='agentList' valueName="name" keyName="id" @change="selectAgent"></dsp-select>
                    <dsp-select title="全部平台" :list='platformList' valueName="name" keyName="id" @change="selectPlatform"></dsp-select>
                    <dsp-select title="全部资源类型" :list='chargeTypeList' valueName="name" keyName="id" @change="selectChargeType"></dsp-select>
                    <dsp-select title="全部采买类型" :list='dealTypeList' valueName="name" keyName="id" @change="selectDealType"></dsp-select>
                    <dsp-button @click="download">下载报表</dsp-button>
                    <div class="refresh" @click="refreshReport"></div>
                </div>
            </div>
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;">
                    <table class="table-box"  id='tableInfo'  style="width:100%;">
                        <thead>
                            <tr>
                                <th>合约资源名称</th>
                                <th>adxID</th>
                                <th>dealID</th>
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
                                <th>CPM单价(元)<Caret @changeSort="changeSort($event,'cpmSort')" sortType="cpmSort" :curType="curSortType"></Caret></th>
                                <th>CPC单价(元)<Caret @changeSort="changeSort($event,'cpcSort')" sortType="cpcSort" :curType="curSortType"></Caret></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="total" v-for="(t,index) in sumList" :key="index">
                                <td v-if="index==0" :rowspan="rowspan">总计</td>
                                <td>-</td>
                                <td>-</td>
                                <td>
                                    <p v-if="t.dealType == 'pdb'">保价保量</p>
                                    <p v-if="t.dealType == 'pd'">保价不保量</p> 
                                </td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>{{t.advertiserCost ? fmoney(t.advertiserCost, 2) : '-'}}</td>
                                <td>{{t.dspCost ? fmoney(t.dspCost, 2) : '-'}}</td>
                                    <td>{{t.dspProfit ? fmoney(t.dspProfit, 2) : '-'}}</td>
                                <td>{{ t.dspProfitRate*100|number(2)}}%</td>
                                <td>{{ t.view|number }}</td>
                                <td>{{ t.click|number }}</td>
                                <td>{{ t.clickRate*100|number(2)}}%</td>
                                <td>{{t.cpm ? fmoney(t.cpm, 2) : '-'}}</td>
                                <td>{{t.cpc ? fmoney(t.cpc, 2) : '-'}}</td>
                            </tr>
                            <tr v-for="item in tableList">
                                <td>{{ item.skuName }}</td>
                                <td>{{ item.adxID }}</td>
                                <td>{{ item.adxDealID }}</td>
                                <td>
                                    <p v-if="item.dealType=='pdb'">保价保量</p>
                                    <p v-if="item.dealType == 'pd'">保价不保量</p>
                                </td>
                                <td>{{ item.platformTag }}</td>
                                <td>{{ item.chargeType}}</td>
                                <td>
                                    <p v-for="date in item.startDate.replace(' 00:00:00','').replace(' 00:00:00','').split(';')">{{date}}</p>
                                </td>
                                <td>{{item.advertiserCost ? fmoney(item.advertiserCost, 2) : '-'}}</td>
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
                                <th>合约资源名称</th>
                                <th>adxID</th>
                                <th>dealID</th>
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
import Search from '@/common/components/search' 
import dspSelect from '@/common/components/select'
import Page from '@/common/components/page'
import { floatScroll, getNowFormatDate, exportCsv } from "@/common/js/utils"
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    data(){
        return{
            sTime: getNowFormatDate() + " " + "00:00:00",
            eTime: getNowFormatDate() + " " + "23:59:59",
            tableList:[],
            tableShow: false,
            sumList:[],
            rowspan: 1,
            pageObj:{
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter:{},
            sort: ["agencyCost,1"],
            curSortType: "",
            platformList:[{name:'全部平台'},{id:'android',name:'Android'},{id:'ios',name:'iOS'}],
            chargeTypeList: [{name:'全部资源类型'},{id:'cpc',name:'CPC'},{id:'cpm',name:'CPM'}],
            dealTypeList: [{name:'全部采买类型'},{id:'pdb',name:'保价保量'},{id:'pd',name:'保价不保量'}],
            agentList: []
        }
    },
    mounted(){
        this.getList();
        this.getSum();
        this.getAgent();
    },
    methods:{
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
                url: "/dsp/rpt/dsp/deal/sku",
                load: true,
                data: data
            }).then(res => {
                var arr = res.data.data || [];
                // 获得列表
                arr.forEach((v) => {
                    v.dealType = v.dealType=='pdb'?'保价保量':'保价不保量'
                    // v.startDate = this.fmoney(v.dspCost, 2);
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
                            "合约资源名称",
                            "adxID",
                            "dealID",
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
                            "CPM单价(元)",
                            "CPC单价(元)",
                        ],
                        titleForKey: [
                            "skuName",
                            "adxID",
                            "adxDealID",
                            "dealType",
                            "platformTag",
                            "chargeType",
                            "startDate",
                            "advertiserCost",
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
                    "合约资源报表.csv"
                );
            });
        },
        getList(){
            this.$ajax({
                url: '/dsp/rpt/dsp/deal/sku',
                data:{
                    'sTime': this.sTime,
                    'eTime': this.eTime,
                    'page': this.pageObj.currentPage+"",
                    'size': this.pageObj.size+"",
                    "sort": this.sort,
                    'filter': this.filter
                },
                load: true
            }).then(res=>{
                this.tableList = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                this.$nextTick(this.init)
                this.tableShow = true;
            })
        },
        getSum(){
            this.$ajax({
                url:'/dsp/rpt/dsp/deal/sku/sum',
                data:{
                    'sTime': this.sTime,
                    'eTime': this.eTime,
                    'page': '1',
                    'size': '999999',
                    'filter': this.filter
                },
                load: true
            }).then(res=>{
                this.sumList = res.data.data;
                var dealTypeArr = []
                this.sumList.forEach( item => {
                    dealTypeArr.push( item.dealType )
                } )
                if( dealTypeArr.indexOf('pd') != -1 && dealTypeArr.indexOf('pdb') != -1 ){
                    this.rowspan = 2
                }else{
                    this.rowspan = 1
                }
            })
        },
        getAgent(){
            this.$ajax({
                url: '/dsp/agency/list',
                data:{
                    'page':'1',
                    'size':'999999'
                },
                load: true
            }).then(res=>{
                this.agentList = res.data.data;
                this.agentList.unshift({name:'全部广告公司'});
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
            this.filter.skuName = val;
            this.getList();
            this.getSum();
            this.tableShow = true;
        },
        selectAgent(val){
            this.filter.owner = val.id;
            this.getList();
            this.getSum();
        },
        selectPlatform(val){
            this.filter.platform = val.id;
            this.getList();
            this.getSum();
        },
        selectChargeType(val){
            this.filter.chargeType = val.id;
            this.getList();
            this.getSum();
        },
        selectDealType(val){
            this.filter.dealType = val.id;
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
        'dspDate': dspDate,
        'dspSearch': Search,
        'dspSelect': dspSelect,
        'dspPage': Page
    }
    
}
</script>
<style lang="less">
.dsp_report_sku{
    @media screen and (max-width: 1720px) {
        .table-top{
            height: auto;
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
    }
}


</style>