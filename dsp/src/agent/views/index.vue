<template>
    <div class="index-page">
        <Target :data="targetData" :hideName="true" :list="targetList"></Target>
        <div>
            <div class="table content fl">
                <div class="table-top">
                    <p class="table-title">广告主近30日花费</p>
                </div>
                <table class="table-box">
                    <thead>
                        <tr>
                            <th>广告主名称</th>
                            <th>花费(元)</th>
                            <th>成本(元)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in dayTotal" :key="index">
                            <td>总计</td>
                            <td>{{item.advertiserCost}}</td>
                            <td>{{item.agencyCost}}</td>
                        </tr>
                        <tr v-for="item in dayList" :key="item.advertiserName">
                            <td>{{item.advertiserName}}</td>
                            <td>{{item.advertiserCost}}</td>
                            <td>{{item.agencyCost}}</td>
                        </tr>
                        <tr v-show="advDayPage.total > dayList.length">
                            <td colspan="99">
                                <a href="javascript:;" @click="getAdvDay()">点击加载更多...</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="table content fr">
                <div class="table-top">
                    <p class="table-title">近30日花费情况</p>
                </div>
                <table class="table-box">
                    <thead>
                        <tr>
                            <th>日期</th>
                            <th>花费(元)</th>
                            <th>曝光</th>
                            <th>CPM(元)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in countTotal" :key="index">
                            <td>总计</td>
                            <td>{{item.advertiserCost}}</td>
                            <td>{{item.view|number}}</td>
                            <td>{{item.cpm}}</td>
                        </tr>
                        <tr v-for="item in countList" :key="item.tsName">
                            <td>{{item.tsName}}</td>
                            <td>{{item.advertiserCost}}</td>
                            <td>{{item.view|number}}</td>
                            <td>{{item.cpm}}</td>
                        </tr>
                        <tr v-show="advCountPage.total > countList.length">
                            <td colspan="99" style="text-align:center">
                                <a href="javascript:;" @click="getAdvCount()">点击加载更多...</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import Target from "@/common/components/target";
import { getNowFormatDate,nextDayFnc } from "@/common/js/utils";
export default {
    components: {
        Target
    },
    data() {
        return {
            targetList: [
                {
                    name: "RTB当日花费",
                    t: "rtbSpend",
                    yT: "rtbYSpend",
                    ybT: "rtbYbSpend"
                },
                {
                    name: "RTB当日利润",
                    t: "rtbProfit",
                    yT: "rtbYProfit",
                    ybT: "rtbYbProfit"
                },
                {
                    name: "RTB当日利润率",
                    isRate: true,
                    t: "rtbProfitRate",
                    yT: "rtbYProfitRate",
                    ybT: "rtbYbProfitRate"
                },
                {
                    name: "广告主数量",
                    t: "customerNum",
                    single: true,
                },
                {
                    name: "活跃广告主数量",
                    t: "customerActiveNum",
                    single: true,
                },
                {
                    name: "待审核广告主",
                    t: "customerApplyNum",
                    single: true,
                },{
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
                    yT: "pdYProfitRate",
                    ybT: "pdYbProfitRate"
                },
                {
                    name: "PDB当日收入",
                    t: "pdbIncome",
                    yT: "pdbYIncome",
                    ybT: "pdbYbIncome"
                }
            ],
            targetData: {},
            advDayPage: {
                page: 1,
                total: 0
            },
            advCountPage: {
                page: 1,
                total: 0
            },
            dayList: [],
            dayTotal: [],
            countList: [],
            countTotal: [],
            countAllList: [],
            
            eTime: getNowFormatDate() + " 23:59:59",
            sTime: nextDayFnc(getNowFormatDate(),30,1) + " 00:00:00",
        };
    },
    created() {
        // 根据权限初始化指标项
        this.setTatgetList();
        // 获取指标值
        this.getTarget();
        this.getAdvDay();
        this.getAdvCount();
        this.getAdvDayTotal();
        this.getAdvCountTotal();
    },
    computed: {
        permission() {
            return this.$store.state.common.permission
        }
    },
    methods: {
        getTarget() {
            var data = {
                filter: {},
                sort: ["cTime,1"],
                sTime: getNowFormatDate() + " 00:00:00",
                eTime: getNowFormatDate() + " 23:59:59"
            };
            // 竞价交易总额
            this.$ajax({
                url: "/dsp/rpt/agency/main",
                data: data
            }).then(res => {
                this.targetData = res.data.data;
            });
        },
        getAdvDay() {
            var data = {
                page: this.advDayPage.page + "",
                size: "10",
                filter: {},
                sort: ["cTime,1"],
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/consume",
                data: data,
                load: true
            }).then(res => {
                this.dayList = this.dayList.concat(res.data.data);
                this.advDayPage.total = res.data.total;
                this.advDayPage.page++;
            });
        },
        getAdvDayTotal() {
            var data = {
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/consume/total",
                data: data
            }).then(res => {
                this.dayTotal = res.data.data;
            });
        },
        getAdvCount() {
            if (this.countAllList.length > 0) {
                this.countList = this.countList.concat(
                    this.countAllList.splice(0, 10)
                );
                return;
            }
            var data = {
                page: this.advCountPage.page + "",
                size: "99",
                filter: {},
                sort: ["cTime,1"],
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/dsp/timeChart",
                data: data,
                load: true
            }).then(res => {
                this.countAllList = res.data.data.reverse();
                this.advCountPage.total = this.countAllList.length;
                this.countList = this.countList.concat(
                    this.countAllList.splice(0, 10)
                );
            });
        },
        getAdvCountTotal() {
            if (this.countAllList.length > 0) {
                this.countList = this.countList.concat(
                    this.countAllList.splice(0, 10)
                );
                return;
            }
            var data = {
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/rpt/dsp/timeChart/sum",
                data: data
            }).then(res => {
                this.countTotal = res.data.data;
            });
        },
        
        // 根据权限变更指标
        setTatgetList() {
            var targetList = this.targetList,
                permission = this.permission;
            if(!permission.view[88]) {
                // 移除‘客户数量’ ‘活跃客户数量’ ‘待审核客户’
                for(var i = 0; i < targetList.length; i++) {
                    if(targetList[i].t == 'customerNum') {
                        targetList.splice(i,3);
                        break;
                    }
                }
            }
            if(!permission.view[93]) {
                // 移除 利润相关字段
                for(var i = 0; i < targetList.length; i++) {
                    if(targetList[i].t == 'rtbProfit') {
                        targetList.splice(i,2);
                        i--;
                    }
                    if(targetList[i].t == 'pdProfit') {
                        targetList.splice(i,3);
                        break;
                    }
                }
            }
        }
    }
};
</script>
<style lang="less">
.index-page {
    .table {
        width: 49%;
        min-width: auto;
    }
}
</style>
