<template>
    <el-dialog :visible.sync="dialogVisible" width="500px" class="diagnose" :show-close="showclose" :closeOnClickModal="closeOnClickModal">
        <div class="title">
            <span>诊断结果（订单ID：{{ordID}}）</span>
            <i class="icon-close fr" @click="close"></i>
        </div>
        <ul class="list" v-if="NcurrCheckInfo">
            <li>代理商状态：<span class="fr green" :class="{'red': !NcurrCheckInfo.AgencyState.result}">{{NcurrCheckInfo.AgencyState.description}}</span></li>
            <li>广告主状态：<span class="fr green" :class="{'red': !NcurrCheckInfo.AdvertiserState.result}">{{NcurrCheckInfo.AdvertiserState.description}}</span></li>
            <li>广告主实时余额：<span class="fr green" :class="{'red': !NcurrCheckInfo.Balance.result}">{{NcurrCheckInfo.Balance.description}}</span></li>
            <li>活动状态：<span class="fr green" :class="{'red': !NcurrCheckInfo.ActivityState.result}">{{NcurrCheckInfo.ActivityState.description}}</span></li>
            <li>活动总预算余额：<span class="fr green" :class="{'red': !NcurrCheckInfo.ActivityTotalBudget.result}">{{NcurrCheckInfo.ActivityTotalBudget.description}}</span></li>
            <li>活动日预算余额：<span class="fr green" :class="{'red': !NcurrCheckInfo.ActivityDayBudget.result}">{{NcurrCheckInfo.ActivityDayBudget.description}}</span></li>
            <li>活动投放时间：<span class="fr green" :class="{'red': !NcurrCheckInfo.ActivityTime.result}">{{NcurrCheckInfo.ActivityTime.description}}</span></li>
            <li>订单状态：<span class="fr green" :class="{'red': !NcurrCheckInfo.OrderState.result}">{{NcurrCheckInfo.OrderState.description}}</span></li>
            <li>订单预算余额：<span class="fr green" :class="{'red': !NcurrCheckInfo.OrderBudget.result}">{{NcurrCheckInfo.OrderBudget.description}}</span></li>
            <li>订单投放时间：<span class="fr green" :class="{'red': !NcurrCheckInfo.OrderTime.result}">{{NcurrCheckInfo.OrderTime.description}}</span></li>
            <li>订单投放时间(小时)：<span class="fr green" :class="{'red': !NcurrCheckInfo.HourDeliveryTime.result}">{{NcurrCheckInfo.HourDeliveryTime.description}}</span></li>
            <li>订单花费(天)：<span class="fr green" :class="{'red': !NcurrCheckInfo.OrderCostDay.result}">{{NcurrCheckInfo.OrderCostDay.description}}</span></li>
            <li>订单花费(小时)：<span class="fr green" :class="{'red': !NcurrCheckInfo.OrderCostHour.result}">{{NcurrCheckInfo.OrderCostHour.description}}</span></li>
            <li>订单展示量(天)：<span class="fr green" :class="{'red': !NcurrCheckInfo.OrderViewDay.result}">{{NcurrCheckInfo.OrderViewDay.description}}</span></li>
            <li>订单展示量(小时)：<span class="fr green" :class="{'red': !NcurrCheckInfo.OrderViewHour.result}">{{NcurrCheckInfo.OrderViewHour.description}}</span></li>
        </ul>
        <div class="diagnosis-cancel">
            <el-button class="btn" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: this.visible,
            showclose: false,
            closeOnClickModal: false,
            NcurrCheckInfo: ""
        }
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        ordID: {
            type: String,
            default: ""
        },
        currCheckInfo: {
            type: Object,
            default: {}
        }
    },
    watch: {
        visible(val) {
            this.dialogVisible = val;
        },
        currCheckInfo(val) {
            this.NcurrCheckInfo = val
        }
    },
    methods: {
        close() {
            this.dialogVisible = false;
            this.$emit("update:visible",false)
        }
    }
}
</script>

<style lang="less">

.diagnose{ 
    .el-dialog__header{
        padding: 0;
    }
    .el-dialog__body{
        padding: 0;
        padding-bottom: 70px;
    }   
    .title{
        text-align: center;
        height: 40px;
        line-height: 40px;
        background-color: #f5f5f5;
        border-radius: 5px 5px 0 0;
        padding: 0 10px 0 20px;
        font-size: 14px;
        font-weight: 700;
        .icon-close{
            width: 20px;
            height: 20px;
            background: url('../../common/img/images/icon_13.png') no-repeat;
            margin-top: 10px;
            background-size: 100% 100%;
            cursor: pointer;
        }
    }
    .list{
        width: 100%;
        padding: 14px 40px 14px 40px;
        li{
            padding: 0 20px 0 20px;
            height: 24px;
            line-height: 24px;
            text-align: left;
            .fr{
                float: right;
            }
            .green{
                color: #2fca45;
            }
            .red{
                color: #ea4949;
            }
        }
        li:nth-child(even){
            background-color: #f5f5f5;
        }
    }
    .diagnosis-cancel{
        position: absolute;
        width: 100%;
        bottom: 0;
        height: 70px;
        line-height: 70px;
        text-align: center;
        border-top: 1px solid #bfbfbf;
        border-radius: 0px 0px 5px 5px;
        .btn{
            color: #333;
            font-size: 14px;
            padding: 8px 20px;
            border: 1px solid #ccc;
        }
    }
}
</style>
