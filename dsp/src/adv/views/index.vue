<template>
    <div>
        <Target :data="targetData" :list="targetList"></Target>
        <div class="content">
            <Chart :targetList="chartTargetList" :data="chartData"></Chart>
        </div>
    </div>
</template>
<script>
import { getNowFormatDate } from "@/common/js/utils";
import Target from "@/common/components/target";
import Chart from "@/common/components/chart";

export default {
    components: {
        Target,
        Chart
    },
    data() {
        return {
            targetList: [
                {
                    name: "曝光量",
                    t: "view",
                    yT: "yView",
                    ybT: "ybView",
                    single: true
                },
                {
                    name: "点击量",
                    t: "click",
                    yT: "yClick",
                    ybT: "ybClick",
                    single: true
                },
                {
                    name: "点击率",
                    isRate: true,
                    t: "clickRate",
                    yT: "yClickRate",
                    ybT: "ybClickRate"
                },
                {
                    name: "花费(元)",
                    t: "rtbSpend",
                    yT: "rtbYSpend",
                    ybT: "rtbYbSpend"
                },
                {
                    name: "CPM(元)",
                    t: "cpm",
                    yT: "yCpm",
                    ybT: "ybCpm"
                },
                {
                    name: "CPC(元)",
                    t: "cpc",
                    yT: "yCpc",
                    ybT: "ybCpc"
                }
            ],
            targetData: {},

            chartTargetList: [
                { id: "click", name: "点击量" },
                { id: "clickRate", name: "点击率" },
                { id: "view", name: "曝光量" },
                { id: "action", name: "转化" },
                { id: "actionRate", name: "转化率" },
                { id: "cpm", name: "cpm" },
                { id: "cpc", name: "cpc" }
            ],
            chartData: {},
            sTime: getNowFormatDate() + " " + "00:00:00",
            eTime: getNowFormatDate() + " " + "23:59:59"
        };
    },
    created() {
        this.getTarget();
        this.getChartData();
    },
    methods: {
        getTarget() {
            this.$ajax({
                url: "/dsp/rpt/adv/summary/sum",
                data: {
                    sTime: this.sTime,
                    eTime: this.eTime
                },
                load: true
            }).then(res => {
                this.targetData = res.data.data;
            });
        },
        getChartData() {
            var data = {
                sTime: this.sTime,
                eTime: this.eTime,
                dataGrain: "hour",
                page: "1",
                size: "24"
            };
            this.$ajax({
                url: "/dsp/rpt/loc/time",
                data: data,
                load: true
            }).then(res => {
                var chartData = {
                    xAxis: [],
                    advertiserCost: [],
                    view: [],
                    click: [],
                    clickRate: [],
                    action: [],
                    actionRate: [],
                    cpm: [],
                    cpc: []
                };
                res.data.data.forEach(function(v) {
                    chartData.xAxis.push(v.tsName);
                    chartData.advertiserCost.push(v.advertiserCost);
                    chartData.view.push(v.view);
                    chartData.click.push(v.click);
                    chartData.clickRate.push(v.clickRate);
                    chartData.action.push(v.action);
                    chartData.actionRate.push(v.actionRate);
                    chartData.cpm.push(v.cpm);
                    chartData.cpc.push(v.cpc);
                });
                this.chartData = chartData;
            });
        }
    }
};
</script>
<style lang="less">
</style>
