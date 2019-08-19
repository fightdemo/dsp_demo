<template>
    <div class="activityAdd-page">
        <div class="page-title">{{this.edit?'编辑':'添加'}}活动</div>
        <div class="content">
            <el-form ref="form" :model="form" label-width="200px">
                <el-form-item label="活动名称（必填）：">
                    <el-input v-model="form.name" style="width:460px" maxlength="30"></el-input><span style="margin-left:5px;font-size:12px;">{{form.name.length}}/30</span>
                </el-form-item>
                <el-form-item label="活动时间（必填）：">
                    <el-date-picker v-model="startTime" value-format="yyyy-MM-dd" :disabled="edit" type="date" placeholder="选择日期时间"></el-date-picker>
                    <span class="separator">至</span>
                    <el-date-picker
                        v-model="endTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        :disabled="timeLimit"
                        placeholder="选择日期时间"
                    ></el-date-picker>
                    <m-check
                        class="circle-check"
                        @change="checkTimeback"
                        :isCheck.sync="timeLimit"
                    >不设置结束时间</m-check>
                </el-form-item>
                <el-form-item label="总预算（必填）：">
                    <el-input v-model="form.totalBudget" type="number" :disabled="hasAllBudget"></el-input>
                    <m-check class="circle-check" :isCheck.sync="hasAllBudget" @change="allCall">无预算限制</m-check>
                </el-form-item>
                <el-form-item label="日预算：">
                    <el-input v-model="form.dayBudget" type="number" :disabled="hasDayBudget"></el-input>
                    <m-check class="circle-check" :isCheck.sync="hasDayBudget" @change="dayCall">无预算限制</m-check>
                </el-form-item>
                <el-form-item label="频次设置（必填）：">
                    <el-input v-model="form.frequency" type="number" :disabled="frequencyLimit"></el-input>
                    <span class="separator">次</span>
                    <m-select
                        class="frequencyUnit"
                        :title="form.frequencyUnit=='hour'?'小时':'天'"
                        :list="unitList"
                        @change="daySelect"
                    ></m-select>
                    <m-check class="circle-check" :isCheck.sync="frequencyLimit" @change="freqCall">无频次限制</m-check>
                </el-form-item>
                <el-form-item label="行业分类（必填）：">
                    <m-select
                        :title="firstType"
                        valueName="name"
                        :list="firstList"
                        @change="firstCall"
                    ></m-select>
                    <m-select
                        :title.sync="secondType"
                        valueName="name"
                        :list="secondList"
                        @change="secondCall"
                    ></m-select>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <dsp-button class="btn-cancel" @click="$router.go(-1)">取消</dsp-button>
                <dsp-button class="btn-save" @click="saveActive()" type="success">{{edit?'保存':'完成创建'}}</dsp-button>
                <dsp-button class="btn-order" @click="saveActive(true,1)" type="primary">继续创建竞价交易订单</dsp-button>
                <dsp-button class="btn-order" @click="saveActive(true,2)" type="primary">继续创建合约交易订单</dsp-button>
            </div>
        </div>
    </div>
</template>
<script>
import { getNowFormatDate } from "@/common/js/utils";
export default {
    data() {
        return {
            startTime: getNowFormatDate(),
            endTime: "",
            edit: !!this.$route.params.id,
            firstList: [],
            secondList: [],
            timeLimit: true,
            frequencyLimit: true,
            hasAllBudget: true,
            hasDayBudget: true,
            firstType: "选择大类",
            secondType: "选择小类",
            unitList: [
                {
                    id: "day",
                    value: "天"
                },
                {
                    id: "hour",
                    value: "小时"
                }
            ],
            form: {
                name: "",
                industry: "", //行业分类
                frequency: "", // 频次，空字符串表示不限制
                startTime: "",
                endTime: "", // 结束时间，NULL表示不限制
                frequencyUnit: "day", //频次限制单位，默认天
                dayBudget: "", //日预算，0.00表示不限制
                totalBudget: "", //总预算，0.00表示不限制
                industryName: "" //行业分类的名称
            }
        };
    },
    created() {
        console.log(this.$route)
        if (this.edit) {
            this.getIndustry().then(this.getActivity);
        } else {
            this.getIndustry();
        }
    },
    methods: {
        getIndustry() {
            return this.$ajax({
                url: "/dsp/industry/type",
                data: {},
                load: true,
            }).then(res => {
                this.firstList = res.data;
            });
        },
        getActivity() {
            this.$ajax({
                url: "/dsp/activity",
                data: {
                    id: this.$route.params.id
                },
                load: true
            }).then(res => {
                // 获得列表
                var form = (this.form = res.data);
                this.firstType = res.data.industryName.split(",")[0];
                this.secondType = res.data.industryName.split(",")[1];
                
                // 0.00表示无限制
                if(form.totalBudget == "0.00") {
                    form.totalBudget = ''
                } else {
                    this.hasAllBudget = false;
                }
                if(form.dayBudget == "0.00") {
                    form.dayBudget = ''
                } else {
                    this.hasDayBudget = false;
                }
                // 空字符串表示无限制
                this.frequencyLimit = !form.frequency;

                //恢复开始时间，结束时间 开始时间不可以编辑
                this.startTime = form.startTime.split(" ")[0];
                if (form.endTime) {
                    this.endTime = form.endTime.split(" ")[0];
                    this.timeLimit = false;
                }
                var firstList = this.firstList;
                for(var i =0; i < firstList.length;i++) {
                    if(firstList[i].name == this.firstType) {
                        this.secondList = firstList[i].subType;
                        break;
                    }
                }
            });
        },
        //时间限制
        checkTimeback(flag) {
            if (flag) {
                this.endTime = "";
            }
            this.timeLimit = flag;
        },
        //选择频次限制的单位
        daySelect(item) {
            this.form.frequencyUnit = item.id;
        },
        //保存新建活动
        saveActive(type, orderType) {
            var form = this.form;
            //输入判断
            if (!form.name || form.name == "") {
                //活动名称
                this.$message.error("活动名称不能为空!");
                return;
            }
            if (!form.industry || form.industry == "") {
                this.$message.error("请选择行业!");
                return;
            }
            if (this.timeLimit) {
                form.endTime = "NULL";
            } else {
                if (!this.endTime) {
                    return this.$message.error("请选择结束时间");
                } else {
                    form.endTime = this.endTime + " 23:59:59";
                }
            }
            if (this.frequencyLimit) {
                form.frequency = "";
            } else if (!form.frequency) {
                return this.$message.error("请输入频次！");
            }
            if (this.hasAllBudget) {
                form.totalBudget = "0";
            } else if (!form.totalBudget) {
                return this.$message.error("请输入总预算！");
            }
            if (this.hasDayBudget) {
                form.dayBudget = "0";
            } else if (!form.dayBudget) {
                return this.$message.error("请输入日预算！");
            }

            if (!this.edit) {
                var url = "/dsp/activity/add";
            } else {
                var url = "/dsp/activity/modify";
            }
            form.startTime = this.startTime + " 00:00:00";
            this.$ajax({
                url: url,
                data: {
                    data: form
                }
            }).then(res => {
                var activeId;
                if (!this.edit) {
                    activeId = res.data + "";
                } else {
                    activeId = this.$route.params.id;
                }
                // 获得列表
                if (type) {                   
                    this.$router.push({  
                        name:'delivery.newOrder',   
                        query:{           
                            oType: orderType ,
                            orderId: '',
                            activeId: activeId
                        }
                    })
                } else {
                    this.$router.push({
                        name:'delivery.activity',  
                    });
                }
            });
        },
        //跳转订单
        addOrder(orderType) {
            this.saveActive("order", orderType);
        },
        //每日预算
        freqCall(flag) {
            this.frequencyLimit = flag;
            if (flag) {
                this.form.frequency = "";
            }
        },
        //每日预算
        dayCall(flag) {
            this.hasDayBudget = flag;
            if (flag) {
                this.form.dayBudget = "";
            }
        },
        //总预算
        allCall(flag) {
            this.hasAllBudget = flag;
            if (flag) {
                this.form.totalBudget = "";
            }
        },
        firstCall(res) {
            this.form.industryName = "";
            this.form.industry = "";
            this.secondType = "选择小类";
            this.secondList = res.subType;
            this.form.industryName = res.name;
        },
        secondCall(res) {
            if (this.form.industryName.split(",")[0]) {
                this.form.industryName = this.form.industryName.split(",")[0];
            }
            this.form.industry = res.id;
            this.form.industryName += "," + res.name;
        }
    }
};
</script>
<style lang="less">
.activityAdd-page {
    .content {
        padding-top: 40px;
        .btn-group {
            padding: 40px;
            margin-top: 60px;
            border-top: 1px solid #dcdcdc;
            .dsp_button {
                margin-right: 20px;
                button {
                    width: 100%;
                    padding: 15px;
                }
            }
            .btn-cancel {
                width: 100px;
            }
            .btn-save {
                width: 180px;
            }
            .btn-order {
                width: 260px;
            }
            @media screen and (max-width: 1400px) {
                .btn-order{
                    width: 240px;
                }
            }
        }
        .separator {
            margin-left: 10px;
            margin-right: 10px;
        }
        .frequencyUnit {
            width: 80px;
        }
        .el-input {
            width: 254px;
        }
        .el-checkbox {
            margin-left: 10px;
        }
    }
}

</style>
