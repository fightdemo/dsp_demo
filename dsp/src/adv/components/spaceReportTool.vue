<template>
    <div class="spaceTool-box">
        <p class="toolTitle">订单设置</p>
        <ul>
            <li v-for="item in spaceList" :key="item.id">
                <div><span>订单名称：</span><span>{{item.name}}</span></div>
                <div><span>投放时间：</span><span>{{item.startTime}}——{{item.endTime?item.endTime:'不限'}}</span></div>
                <div><span>出价类型：</span><span>{{item.chargeMode}}</span></div>
                <div><span>预算：</span><span>{{item.orderBudget == '0.00' ? "无限制": item.orderBudget}}</span></div>
                <div><span>速率：</span>
                    <span>
                        <span v-if="item.controlMode == '0'">
                            {{item.speedUp=='0'?'匀速':'加速'}}&nbsp;
                            {{item.limitPrice==0?'不限': item.limitPrice + "元/"}}
                            {{item.limitPrice!=0? item.speedUnit=='day'?'天':'小时':''}}
                        </span>
                        <span v-if="item.controlMode != '0'">
                            展现&nbsp;
                            {{item.limitView==0?'不限': item.limitView + "千次/"}}
                            {{item.limitView!=0? item.speedUnit=='day'?'天':'小时':''}}
                        </span>
                    </span></div> 
                <div><span>频次：</span>
                    <span>
                        <span v-if="item.frequencyLimit != '0'" class="el-nowrap">
                            {{item.frequencyLimit}}/{{item.frequencyUnit=='day'?'天':'小时'}}
                        </span>
                        <span v-if="item.frequencyLimit == '0'">无限制</span>
                    </span>
                </div>  
            </li>
        </ul>
        <p style="margin-top: 40px;" class="toolTitle">设置<button class="exclude" @click='excludedRecord'>排除记录</button></p>
        <div class="budget">
            <div>
                <span>广告位预算分配：</span>
                <m-Radio style="margin-right: 50px;" :value.sync="budget" :list="[{'label': '1', 'name': '不设置预算分配'},{'label': '2', 'name': '设置预算分配'}]" :size="'big'" :defaultVal="budget"></m-Radio>
                <!-- <m-Radio :value.sync="budget" :list="[]" :size="'big'" :defaultVal="budget"></m-Radio> -->
            </div>
            <p v-if="budget == '2'">
                广告位预算分配
                <m-Input style="display: inline-block;" placeholder="输入金额" size="small" :value.sync="budgetMoney" :name="budgetMoney"></m-Input> 元
            </p>
            <div style="margin-top: 20px;">
                <span>目标设置</span>
                <m-Radio style="margin-right: 62px; margin-left: 50px;" :value.sync="conditions" :list="[{'label': '1', 'name': '满足任一条件'},{'label': '2', 'name': '满足全部条件'}]" :size="'big'" :defaultVal="conditions"></m-Radio>
                <!-- <m-Radio :value.sync="conditions" :list="[]" :size="'big'" :defaultVal="conditions"></m-Radio> -->
            </div>
            <div class="conditionsSelect">
                <div class="conditionsOne" v-for="(item,index) in adsConditions" :key="index">
                    <div id="coditionOne">
                        当
                        <m-Select style="width: 120px;" :id.sync="item.whenType" :list="viewAndClickList" :idVal="item.whenType" :title.sync="item.whenTypeTitle" size="middle"></m-Select>
                        <m-Select style="width: 120px;" :id.sync="item.whenCondition" :list="compareList" :idVal="item.whenCondition" :title.sync="item.whenConditionTitle" size="middle"></m-Select>
                        <m-Input style="display: inline-block; width: 100px;" placeholder="输入量级" size="small" :value.sync="item.whenQuantity" :name="item.whenQuantity"></m-Input>
                        {{item.whenType=="click" ? '点击数量' : "曝光数量"}}时，
                    </div>
                    <div id="coditionTwo">
                        <m-Select style="width: 120px;" :id.sync="item.kpiType" :list="chargeModeList" :idVal="item.kpiType" :title.sync="item.kpiTypeTitle" size="middle"></m-Select>
                        <m-Select style="width: 120px;" :id.sync="item.kpiCondition" :list="compareList" :idVal="item.kpiCondition" :title.sync="item.kpiConditionTitle" size="middle"></m-Select>
                        <m-Input style="display: inline-block; width: 100px;" placeholder="输入单价" size="small" :value.sync="item.kpiTarget" :name="item.kpiTarget"></m-Input>
                        元，排除该App或广告位
                        <i v-if="adsConditions.length > 1" class="iconStyle el-icon-error" @click="deleteCondition(index)"></i>
                    </div>
                    
                </div>
                <el-button class="addCondition" @click="addCondition">
                    <i class='el-icon-plus'></i>增加条件
                </el-button>
            </div>
        </div>
        <div class="saveBtnwrap">
            <el-button class="saveBtn" type="primary" @click="saveCondition()">
                保 存
            </el-button>
        </div>
        <el-dialog :visible.sync="dialogVisible" width="680px" title="排除记录">
            <div class="copy-order-box">
                <div class="form-group">
                    <ul style="height: 370px; overflow-y: auto;">
                        <li v-for="item in kpiList" :key="item.id" style='line-height: 40px; border-bottom: 1px solid #DDDDDD;display: flex; align-items: center; justify-content: space-between;'>
                            <span style=" width: 500px;">
                                {{item.cTime}} ；{{item.spaceName}}{{item.appName?"("+item.appName+")；": ""}}
                                <p>原因：{{item.reason}}</p>
                            </span>
                            <el-button type='primary' plain :disabled='item.state == "20" ' @click="recover(item)">恢复</el-button>
                        </li>
                    </ul>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            off: false,
            budget: '1',        //广告位预算分配-radio
            budgetMoney: '',    //广告位预算分配金额
            conditions: '1',    //目标设置--满足条件
            adsConditions: [{
                whenType: '',   //曝光量点击量选择
                whenCondition: '',    //曝光量点击量比较
                whenQuantity: '',  //量级
                kpiType: '', //计费方式
                kpiCondition: '', //计费方式比较
                kpiTarget: '', //单价
                whenTypeTitle: '选择条件',
                whenConditionTitle: '选择条件',
                kpiTypeTitle: '选择条件',
                kpiConditionTitle: '选择条件',
            }],
            viewAndClickList: [
                {'id': '', 'value': '选择条件'},
                {'id': 'view', 'value': '曝光量'},
                {'id': 'click', 'value': '点击量'}
            ], //曝光量点击量选择列表
            compareList: [
                {'id': '0', 'value': '选择条件'},
                {'id': '1', 'value': '大于'},
                {'id': '2', 'value': '等于'},
                {'id': '3', 'value': '小于'}
            ],    //比较列表
            chargeModeList: [
                {'id': '0', 'value': '选择条件'},
                {'id': 'cpc', 'value': 'CPC'},
                {'id': 'cpe', 'value': 'CPE'},
                {'id': 'cpa', 'value': 'CPA'},
            ], //计费方式列表
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter: {},
            dialogVisible: false,
            kpiList: [],
        }
    },
    props: {
        spaceList: Array,
        orderID: String,
        orderKpiList: Object,
        changeFlag: Number,
    },
    watch: {
        orderKpiList(val){
            this.getOrderKpiList()
        },
        changeFlag(val){
            this.getOrderKpiList()
        }
    },
    mounted() {

    },
    methods: {
        //删除
        deleteCondition(index) {
            this.adsConditions.splice(index, 1)
        },
        //恢复
        recover(item) {
            this.$ajax({
                url: '/dsp/rpt/order/kpi/space/reset',
                data: {
                    data: {
                        id: item.id,
                        state: '20'
                    }
                }
            }).then( res => {
                this.$message.success('操作成功');
                this.getKpiList();
            } )
        },
        //回填kpiList
        getOrderKpiList() {
            let kpiList = this.orderKpiList
            if( JSON.stringify(this.orderKpiList) != "{}" ){
                if( kpiList ) {
                    if( Number(kpiList.spaceBudget) > 0 ){
                        this.budget = '2';
                        this.budgetMoney = kpiList.spaceBudget
                    }else{ 
                        this.budget = '1'
                        this.budgetMoney = '0';
                    }
                    this.conditions = kpiList.satisfy;
                    var list = kpiList.kpi;
                    list.forEach(item => {
                        item.whenTypeTitle= '选择条件'
                        item.whenConditionTitle= '选择条件'
                        item.kpiTypeTitle= '选择条件'
                        item.kpiConditionTitle= '选择条件'
                        // item.whenQuantity = ""
                        // item.kpiTarget = ''
                        if( item.whenType == 'view' ){
                            item.whenTypeTitle = '曝光量'
                        }else{
                            item.whenTypeTitle = '点击量'
                        }
                        if( item.whenCondition == '1' ){
                            item.whenConditionTitle = '大于'
                        }else if( item.whenCondition == '2' ){
                            item.whenConditionTitle = '等于'
                        }else{
                            item.whenConditionTitle = '小于'
                        }
                        if( item.kpiType == 'cpc' ){
                            item.kpiTypeTitle = 'CPC';
                        }else if( item.kpiType == 'cpe' ){
                            item.kpiTypeTitle = 'CPE';
                        }else{
                            item.kpiTypeTitle = 'CPA';
                        }
                        if( item.kpiCondition == '1' ){
                            item.kpiConditionTitle = '大于'
                        }else if( item.kpiCondition == '2' ){
                            item.kpiConditionTitle = '等于'
                        }else{
                            item.kpiConditionTitle = '小于'
                        }
                    });
                    this.adsConditions = kpiList.kpi
                }
            }else{
                this.budgetMoney = "";
                this.budget = '1'
                this.conditions = '1'
                this.adsConditions= [{
                    whenType: '',   //曝光量点击量选择
                    whenCondition: '',    //曝光量点击量比较
                    whenQuantity: '',  //量级
                    kpiType: '', //计费方式
                    kpiCondition: '', //计费方式比较
                    kpiTarget: '', //单价
                    whenTypeTitle: '选择条件',
                    whenConditionTitle: '选择条件',
                    kpiTypeTitle: '选择条件',
                    kpiConditionTitle: '选择条件',
                }]
            }
        },
        //排除记录
        excludedRecord() {
            this.dialogVisible = true;
            this.getKpiList();
        },
        //保存
        saveCondition() {
            var arrCondition = this.adsConditions;
            for( var i = 0 ; i < arrCondition.length ; i++ ){
                if(!arrCondition[i].whenType){
                    this.$message.error("请选择条件")
                    i = arrCondition.length
                    return;
                }
                if(!arrCondition[i].whenCondition){
                    this.$message.error("请选择条件")
                    i = arrCondition.length
                    return;
                }
                if(!arrCondition[i].whenQuantity){
                    this.$message.error("请输入量级")
                    i = arrCondition.length
                    return;
                }
                if(!arrCondition[i].kpiType){
                    this.$message.error("请选择条件")
                    i = arrCondition.length
                    return;
                }
                if(!arrCondition[i].kpiCondition){
                    this.$message.error("请选择条件")
                    i = arrCondition.length
                    return;
                }
                if(!arrCondition[i].kpiTarget){
                    this.$message.error("请输入单价")
                    i = arrCondition.length
                    return;
                }
            }
            this.$ajax({
                url: '/dsp/rpt/order/kpi/set',
                data: {
                    data: {
                        id: this.orderKpiList.id || '',
                        orderID: this.orderID,
                        spaceBudget: this.budget == '1' ? "0" :this.budgetMoney,
                        satisfy: this.conditions,
                        kpi: this.adsConditions
                    }
                }
            }).then( res => {
                if( res.status == '0' ){
                    this.$message.success('操作成功')
                }
            } )
        },
        //增加条件
        addCondition() {
            this.adsConditions.push({
                whenType: '', 
                whenCondition: '', 
                whenQuantity: '',
                kpiType: '', 
                kpiCondition: '', 
                kpiTarget: '',
                whenTypeTitle: '选择条件',
                whenConditionTitle: '选择条件',
                kpiTypeTitle: '选择条件',
                kpiConditionTitle: '选择条件',
            })
        },
        getKpiList() {
            this.$ajax({
                url: '/dsp/rpt/order/kpi/space/list',
                data: {
                    filter: { orderID: this.orderID },
                    sort: ['cTime, 1'],
                    size: this.pageObj.size+"",
                    page: this.pageObj.currentPage+"",
                }
            }).then( res => {
                this.kpiList = res.data.data
            } )
        }
    }
}
</script>
<style lang="less">
.spaceTool-box {
    padding: 0 80px;
    .toolTitle{
        font-size: 16px;
        color: rgba(16, 16, 16, 1);
        text-align:left;
        font-weight: bold;
        .exclude{
            width: 61px;
            height: 22px;
            border-radius: 4px;
            background: #32A7FF;
            color: #fff;
            font-size: 12px;
            text-align: center;
            border: 0;
            margin-left: 16px;
        }
    }
    ul{
        li{
            font-size: 14px;
            div{
                display: inline-block;
                line-height: 40px;
                font-size: 14px;
                color: rgba(16, 16, 16, 1);
                margin-right: 100px;
            }
            div:last-child{
                margin-right: 0px;
            }
        }
    }
    .budget{
        line-height: 40px;
        p{
            margin-left: 125px;
            line-height: 60px;
        }
        .conditionsSelect{
            margin-left: 100px;
            font-size: 14px;
            text-align: center;
            .el-input__inner{
                height: 30px;
            }
            line-height: 70px;
            background: #F9F9F9;
            .conditionsOne{
                border-bottom: 1px solid #BBBBBB;
                text-align: left;
                #coditionOne{
                    display: inline-block;
                }
                #coditionTwo{
                    display: inline-block;
                    .iconStyle{
                        font-size: 18px;
                        color: red;
                    }
                }
            }   
            .addCondition{
                width: 220px;
                height: 30px;
                line-height: 30px;
                padding: 0;
                text-align: center;
                background: #8BC34A;
                color: #fff;
                font-size: 14px;
                border-color:#259B24;
                border-radius: 4px;
                i{
                    font-size: 12px;
                }
            }
        }
    }
    .saveBtnwrap{
        width: 100%;
        text-align: center;
        margin-top: 30px;
        .saveBtn{
            width: 220px;
            height: 36px;
            font-weight: bold;
        }
        
    }
}
</style>

