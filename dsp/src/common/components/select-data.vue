<template>
    <el-date-picker
        class="new-dropdown"
        @change="handleChange"
        value-format="yyyy-MM-dd"
        v-model="time"
        type="daterange"
        align="right"
        unlink-panels
        :clearable="false"
        range-separator="至"
        :disabled="disabled"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
    ></el-date-picker>
</template>
<script>
var today = new Date();
export default {
    data() {
        return {
            time: [this.sTime || today, this.eTime || today],
            pickerOptions: {
                shortcuts: [
                    {
                        text: "今天",
                        onClick(picker) {
                            picker.$emit("pick", [today, today]);
                        }
                    },
                    {
                        text: "昨天",
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit("pick", [date, date]);
                        }
                    },
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近两周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 14
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {   
                        text: "本月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.setDate(1)
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {   
                        text: "上月",
                        onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            var year = start.getFullYear();
                            var month = start.getMonth();
                            if(month == 0){
                                month = 12;
                                year = year-1;                
                            }
                            if(month < 10){
                                month = '0'+month;
                            }            
                            var myDate = new Date(year,month,0);                
                            var startDate = year+'-'+month+'-01'; //上个月第一天
                            var endDate = year+'-'+month+'-'+myDate.getDate();//上个月最后一天
                            start = new Date(startDate)//转为时间戳
                            end = new Date(endDate)
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            }
        };
    },
    watch: {
        sTime(newVal) {
            this.$set(this.time, 0, newVal);
        },
        eTime(newVal) {
            this.$set(this.time, 1, newVal);
        }
    },
    created() {
        if(this.all) {
            this.pickerOptions.shortcuts.unshift({
                text: "全部时间段",
                onClick(picker) {
                    picker.$emit("pick", ['', '']);
                }
            })
            this.time = ['','']
        }
    },
    methods: {
        handleChange(time) {
            var start = time[0],
                end = time[1];
            this.$emit("update:sTime", time[0]);
            this.$emit("update:eTime", time[1]);
            this.$emit("select", { start: start, end: end });
        }
    },
    props: {
        sTime: {
            type: String,
            default: ""
        },
        eTime: {
            type: String,
            default: ""
        },
        clearable: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        all: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style lang="less">
.new-dropdown.el-date-editor.el-date-editor--daterange.el-input__inner {
    width: 240px;
    vertical-align: middle;
    height: 38px;
    background-color: #e4f5ff;
    color: #8691ca;
    .el-range-input {
        background-color: #e4f5ff;
        color: #8691ca;
    }
    .el-range-separator {
        width: 12%;
        color: #8691ca;
    }
    .el-range__close-icon {
        display: none;
    }
}
@media screen and (max-width: 1720px){
    .new-dropdown.el-date-editor{
        width: 200px;
    }
}
</style>