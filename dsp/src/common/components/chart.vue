<template>
    <div class="echart">
        <div class="select cl">
            <div class="l">
                <i class="circle circle-l"></i>
                <m-Select :list="targetList" :title="targetList[0].name" valueName="name" :size="'middle'" @change="changeType1"></m-Select>
            </div>
            <div class="r">
                <i class="circle circle-r"></i>
                <m-Select :list="targetList" :title="targetList[1].name" valueName="name" :size="'middle'" @change="changeType2"></m-Select>
            </div>
        </div>
        <div id="" style="width: 100%;height:400px;" ref="echarts"></div>
    </div>    
</template>

<script>
import echarts from "echarts";
import {getNowFormatDate} from "@/common/js/utils"
export default {
    data() {
        return {
            chartOpt: {
                data1: [],
                data2: [],
                title1: '',
                title2: '',
            },
            title1: "",
            title2: "",
            data1: "",
            data2: "",
            screenWidth: document.body.clientWidth,
        }
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                that.screenWidth = window.screenWidth
            })()
        }  
    },
    computed: {
        silderFlag() {
            return this.$store.state.common.silderFlag
        }
    },
    props: {
        data: Object,
        targetList: Array
    },
    watch: {
        screenWidth(val) {
            this.resize()
        },
        silderFlag() {
            this.resize()
        },
        data(val) {
            var target1 = this.targetList[0],
                target2 = this.targetList[1];
            this.chartOpt = {
                data1: this.data1 || val[target1.id],
                data2: this.data2 || val[target2.id],
                title1: this.title1 || target1.name,
                title2: this.title2 || target2.name,
                xAxis: val.xAxis
            }
            this.setChart(this.chartOpt)
        }
    },
    methods: {
        //取到最近一个能被5整除的数
        fiveMultiple(val) {
            if (val <= 0) return 0;
            if (val <= 1) return 1;
            return val - val % 5 + 5
        },
        setChart(option){
            var myChart = echarts.init(this.$refs.echarts);
            myChart.clear();
            var y1 = {},y2 = {};
            //y1.data = [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3];
            y1.data = option.data1;
            y1.min = 0;
            y1.max = this.fiveMultiple(Math.max.apply(0,y1.data));
            y1.min = y1.min == y1.max ? 0 : y1.min;
            y1.interval = Number(((y1.max - y1.min) / 5).toFixed(3));
            //y2.data = [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2];
            y2.data = option.data2;
            y2.min = 0;
            y2.max = this.fiveMultiple(Math.max.apply(0,y2.data));
            y2.min = y2.min == y2.max ? 0 : y2.min;
            y2.interval = Number(((y2.max - y2.min) / 5).toFixed(3));

            var option = {
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    data:[option.title1, option.title2]
                },
                grid: {
                    left: '1%',
                    right: '1%',
                    bottom: '0',
                    containLabel: true,
                    x:0,
                    y:40,
                    x2:0,
                    y2:0
                },
                xAxis: [
                    {
                        type: 'category',
                        data: option.xAxis,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            // interval: 0
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        // name: option.title1,
                        min: y1.min,
                        max: y1.max,
                        interval: y1.interval,
                        splitLine: {
                            show: false
                        }
                    },
                    {
                        type: 'value',
                        // name: option.title2,
                        min: y2.min,
                        max: y2.max,
                        interval: y2.interval,
                        splitLine: {
                                show: false
                            }
                    }
                ],
                series: [
                    {
                        name:option.title1,
                        type:'bar',
                        color: ["#299ff7"],
                        data: y1.data
                    },
                    {
                        name: option.title2,
                        type: 'line',
                        yAxisIndex: 1,
                        color: ['#8bc34a'],
                        data: y2.data
                    }
                ]
            };;
            myChart.setOption(option);
        },
        resize() {
            var myChart = echarts.init(this.$refs.echarts);
            myChart.resize()
        },
        changeType1(val) {
            this.chartOpt.data1 = this.data[val.id];
            this.chartOpt.title1 = val.name;
            this.data1 = this.data[val.id];
            this.title1 = val.name;
            this.setChart(this.chartOpt);  
        },
        changeType2(val) {
            this.chartOpt.data2 = this.data[val.id];
            this.chartOpt.title2 = val.name;
            this.data2 = this.data[val.id];
            this.title2 = val.name;
            this.setChart(this.chartOpt);      
        }
    }
}
</script>

<style lang="less">
.echart{
    padding: 20px;
    .select{
        .l,.r{
            float: left;
            margin-right: 26px;
            .el-select{
                width: 150px;
                height: 30px;
                .el-input__inner{
                    height: 30px;
                }
                .el-select__caret{
                    line-height: 30px;
                }
            }
            .circle{
                display: inline-block;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                vertical-align: -4px;
                margin-right: 7px;
            }
            .circle-l{
                background: #299ff7;
            }
            .circle-r{
                background: #8bc34a;
            }
        }
    }
}
</style>
