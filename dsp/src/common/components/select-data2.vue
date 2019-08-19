<template>
    <el-date-picker
        class="new-dropdown"
        @change="handleChange"
        value-format="yyyy-MM-dd"
        v-model="time"
        type="daterange"
        align="left"
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
import { getNowFormatDate, nextDayFnc, getTime } from "@/common/js/utils"
var yesterday = nextDayFnc(getNowFormatDate(), 1, 1);
export default {
    data() {
        return {
            time: [this.sTime || yesterday, this.eTime || yesterday],
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
                        text: "本周",
                        onClick(picker) {
                            var end = new Date();
                            var start = new Date();
                            start = getTime(0,1);
                            end = getNowFormatDate();
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
</style>