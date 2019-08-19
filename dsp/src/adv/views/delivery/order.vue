<template>
    <div class="page-order">
        <p class="page-title">订单管理
            <span style="float:right;margin-right:30px;line-height: 82px;">
                <el-button v-if="permission.act[65]" class="bid" @click="addOrder('1')"><i class="icon-bid icon mb icon-plus-o"></i>添加竞价交易订单</el-button>
                <el-button v-if="permission.act[112]" class="contract" @click="addOrder('2')"><i class="icon-contract icon mb icon-plus-o"></i>添加合约交易订单</el-button>
            </span>
        </p>
        <div class="table">
            <div class="table-top">
                <h3 class="table-title">订单列表({{pageObj.total}})</h3>
                <div class="table-filter">
                    <span style="width:238px;height:35px;display:inline-block">
                        <el-input placeholder="输入名称或ID" v-model="val" @keyup.enter.native="search">
                            <i class="el-icon-search icon" slot="suffix" @click="search"></i>
                        </el-input>
                    </span>
                    <m-select @change="modify($event,'orderState')" title="全部状态" idVal="all" :list="[{id:'all',value:'全部状态'},{id:'10',value:'待投放'},{id:'20',value:'投放中'},{id:'30',value:'结束'},{id:'40',value:'暂停'}]" :size="'mid'" style="display:inline-block"></m-select>
                    <m-select @change="modify($event,'orderType')" title="全部交易类型" idVal="all" :list="[{id:'all',value:'全部交易类型'},{id:'rtb',value:'竞价交易'},{id:'pdb,pd',value:'合约交易'}]" :size="'mid'" style="display:inline-block"></m-select>
                    <m-select @change="modify($event,'chargeMode')" title="全部出价类型" idVal="all" :list="[{id:'all',value:'全部出价类型'},{id:'cpm',value:'CPM'},{id:'cpc',value:'CPC'}]" :size="'mid'" style="display:inline-block"></m-select>
                    <m-select @change="modify($event,'activityID')" title="全部活动" idVal="all" :list="activity" style="display:inline-block"></m-select>
                </div>
            </div>
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;">             
                    <div class="slider-content">
                        <table class="table-box" style="width:100%;" id="tableInfo">
                            <thead>
                                <tr>
                                    <th v-if="permission.act[67]">订单状态</th>
                                    <th>订单ID</th>
                                    <th>订单名称</th>
                                    <th>交易类型</th>
                                    <th>出价类型</th>
                                    <th>后续行为</th>
                                    <th>所属活动</th>
                                    <th>总预算(元)</th>
                                    <th>频次</th>
                                    <th>投放速率</th>
                                    <th>出价(元)</th>
                                    <th align="center">实时分钟花费(元)</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody v-for="item in list" :key="item.id">
                                <tr>
                                    <td v-if="permission.act[67]">
                                        <m-switch :isCheck="item.state == '10'" :state="item.switch" @change="setState($event,item)"></m-switch>
                                    </td>
                                    <td>{{item.id}}</td>
                                    <td class="el-nowrap">
                                        <dsp-edit :showEditIcon="permission.act[67]" :data="item.name" :showEdit.sync="item.nameEdit" @change="modifyOrder($event,item,'name',0)">
                                            <span @click="gotoCreative(item.id,item.activityID)" style="cursor:pointer" class="order-name">{{item.name}}</span>
                                        </dsp-edit>
                                    </td>
                                    <td>{{item.type=='rtb' ? '竞价交易' : '合约交易'}}</td>
                                    <td>{{item.chargeMode}}</td>
                                    <td>{{item.interactionType == '1' ? '仅展示' : item.interactionType == '2' ? '应用下载' : '跳转网页'}}</td>
                                    <td style="white-space:nowrap">{{item.activityName}}</td>
                                    <td class="el-nowrap">
                                        <dsp-edit :showEditIcon="permission.act[67]" v-if="item.orderBudget != '0.00'" :showEdit.sync="item.orderBudgetEdit" :data="item.orderBudget" @change="modifyOrder($event,item,'orderBudget',1)">{{item.orderBudget}}</dsp-edit>
                                        {{item.orderBudget == '0.00' ? "无限制": ""}}                            
                                    </td>
                                    <td v-if="item.frequencyLimit != '0'" class="el-nowrap">
                                        <dsp-edit :showEditIcon="permission.act[67]" :showEdit.sync="item.frequencyLimitEdit" :data="item.frequencyLimit" @change="modifyOrder($event,item,'frequencyLimit',2)">
                                            {{item.frequencyLimit}}/{{item.frequencyUnit=='day'?'天':'小时'}}
                                        </dsp-edit>
                                        <!-- /{{item.frequencyUnit=='day'?"天":"小时"}} -->
                                    </td>
                                    <td v-if="item.frequencyLimit == '0'">无限制</td>
                                    <td>
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
                                    </td>
                                    <td v-if="item.bidPrice != '0.00'" class="el-nowrap">
                                        <dsp-edit :showEditIcon="permission.act[67]" :showEdit.sync="item.bidPriceEdit" :data="item.bidPrice" @change="modifyOrder($event,item,'bidPrice',3)">{{item.bidPrice}}</dsp-edit>
                                    </td>
                                    <td v-if="item.bidPrice == '0.00' || item.bidPrice == '0'" class="el-nowrap">
                                        {{item.bidPrice}}
                                    </td>
                                    <td align="center">{{item.minuteCost}}</td>
                                    <td style="white-space:nowrap">
                                        <dsp-button v-if="permission.act[66]" type="warning" plain size="mini" round @click.stop="checkOrder(item)" style="position: relative">诊断<i :class="{'icon fa fa-exclamation-circle':item.isError}" style="position: absolute; top: -5px;right: 0;"></i></dsp-button>
                                        <dsp-button v-if="permission.act[67]" type="primary" plain size="mini" round @click.stop="edit({'oType': item.type=='rtb'? '1':'2', orderId: item.id,'activeId': item.activityID})">编辑</dsp-button>
                                        <dsp-button v-if="permission.act[65] && item.type=='rtb'" type="primary" plain size="mini" round @click.stop="copyOrder(item)">复制订单</dsp-button>
                                        <dsp-button v-if="permission.act[112] && item.type!='rtb'" type="primary" plain size="mini" round @click.stop="copyOrder(item)">复制订单</dsp-button>
                                        <dsp-button v-if="permission.act[75]" type="primary" plain size="mini" round @click.stop="gotoReport(item)">查看报表</dsp-button>
                                    </td>
                                </tr>
                                <tr v-show="item.flag">
                                    <td colspan="99">
                                        <table>
                                            <thead>
                                                <th style="padding-left: 87px;">素材</th>
                                                <th>广告简介</th>
                                                <th>创意信息</th>
                                                <th>素材内容</th>
                                                <th>审核状态</th>
                                                <th>推广APP信息</th>
                                                <th style="min-width: 140px;">操作</th>
                                            </thead>
                                            <tbody>
                                                {{item.id}}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table-box float-thead" id="float-thead" v-if="list.length || tableShow" ref="floatThead">
                            <thead>
                                <tr>
                                    <th v-if="permission.act[67]">订单状态</th>
                                    <th>订单ID</th>
                                    <th>订单名称</th>
                                    <th>交易类型</th>
                                    <th>出价类型</th>
                                    <th>后续行为</th>
                                    <th>所属活动</th>
                                    <th>总预算(元)</th>
                                    <th>频次</th>
                                    <th>投放速率</th>
                                    <th>出价(元)</th>
                                    <th align="center">实时分钟花费(元)</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                        </table>                    
                    </div>
                </div> 
            </div>
            <div class="scroll-wrap">
                <div class="h-bar"></div>
            </div>
            <page id="pageToolbar" :page="pageObj" @change="getList"></page>
        </div>
        <Diagnose :visible.sync="visible" :ordID="orderID" :currCheckInfo="diagnoseData"></Diagnose>   
        <el-dialog :visible.sync="dialogVisible" width="460px" title="复制订单">
            <div class="copy-order-box">
                <div class="form-group">
                    <label class="label">订单名称：</label>
                    <el-input class="form-control" v-model="copy.name"></el-input>
                    <m-Check :isCheck.sync="copy.isCopy">复制此订单下的创意</m-Check>
                </div>
                <div class="btn-box">
                    <el-button class="dsp-btn btn-white2" @click="dialogVisible=false">取消</el-button>
                    <el-button class="dsp-btn btn-blue" @click="copyOk">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Diagnose from '@/common/components/loadingDiagnose'
import {floatScroll} from '@/common/js/utils'
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    components: {
        Diagnose: Diagnose
    },
    data() {
        return {
            tableShow: false,
            cpcMax:'',
            cpmMax: '',
            state: '',
            val: '',
            filter: {},
            list: [],
            activity: [],
            visible: false,
            dialogVisible: false,
            copy: {
                name: "",
                isCopy: true,
            },
            storeCopyName: "",
            copyData: {},
            orderID: '',
            diagnoseData: {},
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            }
        }
    },
    mounted() {
        this.getList();
        this.getActivity();
        this.getPriceMax();
    },
    methods: {
        
        gotoCreative(id,activityID) {
            this.$router.push({
                name:'delivery.creative',
                query: {
                    id: id,
                    activityID: activityID
                }
            })
        },
        addOrder(type) {
            this.$router.push({  
                path:'newOrder',   
                query:{           
                    oType: type ,
                    orderId: '',
                    activeId: type == '1' ? '' : '0'
                }
            })
        },

        getList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size+"",
                filter: this.filter,
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/order/list",
                data: data,
                load: true
            }).then(res => {
                this.list = res.data.data;
                this.list.forEach(item => {
                    this.$set(item, 'nameEdit', true)
                    this.$set(item, 'orderBudgetEdit', true)
                    this.$set(item, 'frequencyLimitEdit', true)
                    this.$set(item, 'bidPriceEdit', true)
                    this.$set(item, 'flag', false)
                    this.$set(item, 'switch', '')
                })
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;

                this.$nextTick(this.init)
                this.tableShow = true;
            });
        },
        getActivity() {
            var data = {
                size: '-1',
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/activity/list",
                data: data,
                load: true
            }).then(res => {
                var list = res.data.data;
                if(list.length) {
                    list.forEach( item => {
                    this.activity.push(
                            {id: item.activityID, value: item.name}
                        )
                    }) 
                    this.activity.unshift({id: 'all', value: '全部活动'})
                }
            });
        },
        modifyOrder(value,item,attr,index) {
            var numVertify = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
            var data = {
                id: item.id,
            }
            data[attr] = value;
            if(attr == 'name') {
                if(value.length > 30) {
                    this.$message.error('订单名称最多为30字符!')
                    return;
                }
            }
            if(attr == 'bidPrice') {
                if( !numVertify.test(value) ){
                    this.$message.error('请输入正确的数字');
                    return;
                }
                if(value <= 0) {
                    this.$message.error('订单出价要大于0');
                    return;
                }
                if(item.chargeMode == 'cpm') {
                    if(value > this.cpmMax) {
                        this.$message.error("订单出价不能超过" + (this.cpmMax) + "元")
                        return;
                    }
                }else if(item.chargeMode == 'cpc') {
                    if(value > this.cpcMax) {
                        this.$message.error("订单出价不能超过" + (this.cpcMax) + "元")
                        return;
                    }
                }
            }
            if(attr == 'frequencyLimit') {                               
                data.frequencyUnit = item.frequencyUnit 
                if( !numVertify.test(data.frequencyLimit) ){
                    this.$message.error('请输入正确的数字');
                    return;
                }    
            }
            this.$ajax({
                url: "/dsp/order/modify",
                data: {
                    data: data
                }
            }).then(res => {              
                item[attr] = value;
                item[attr + 'Edit'] = true;  
                this.$message.success("操作成功");
            });
        },
        checkOrder(item) {
            this.$ajax({
                url: "/dsp/check/order",
                data: {
                    orderID: item.id
                }
            }).then(res => {
                this.diagnoseData = res.data;
                this.visible = true;
                this.orderID = item.id
            })
        },
        search() {
            this.filter.orderName = this.val;
            this.pageObj.currentPage = "1";
            this.getList()
        },
        setState($event,item) {
            item.switch = ''
            this.$ajax({
                url: "/dsp/order/modify",
                data: {
                    data: {
                        state: $event ? "10" : "20",
                        id: item.id
                    }
                },
                load: false
            }).then(res => {
                item.state == "10" ? "20" : "10"; 
                this.$message.success("操作成功");
            }).catch(error => {
                item.switch = item.state == "10" ? true : false; 
            });
        },
        modify($event,val) {
            var data = $event.id == 'all' ? '' : $event.id
            this.filter[val] = data;
            this.getList()
        },
        edit(option) {
            this.$router.push({  
                name:'delivery.newOrder',   
                query: option
            })
        },
        gotoReport(item) {
            this.$router.push({
                name: "report.delivery.order",
                params: {activityID: item.activityID, orderID: item.id, secondTitle: item.name}
            });
        },
        copyOrder(item) {
            this.copy.name = item.name;
            this.dialogVisible = true;
            this.copyData = {
                orderID: item.id,
                cloneCreative: "",
                activityID: item.activityID,
                orderName: item.name
            };
        },
        copyOk() {           
            var data = {
                orderID: this.copyData.orderID,
                cloneCreative: this.copy.isCopy + "",
                activityID: this.copyData.activityID,
                orderName: this.copy.name == this.copyData.orderName ? undefined : this.copy.name,
            }
            this.$ajax({
                url: '/dsp/order/clone',
                data: {
                    data: data
                },
                load: true
            }).then(res => {
                if (res.status == '0') {
                    this.dialogVisible = false;
                    this.$message.info("复制订单成功。")
                    this.getList()
                }
            })
        },
        // 控制CPC/CPM最高价格
        getPriceMax() {
            this.$ajax({
                url: '/dsp/sys/parameter/query',
                data: {
                    "filter":{"feature":"dsp.feature.advertiser.order.cpc.maxvalue"}
                }
            }).then(res => {
                this.cpcMax = res.data[0].value*1 || 99;
            });
            this.$ajax({
                url: '/dsp/sys/parameter/query',
                data: {
                    "filter":{"feature":"dsp.feature.advertiser.order.cpm.maxvalue"}
                }
            }).then(res => {
                this.cpmMax = res.data[0].value*1 || 999;
            })
        },  
    }
}
</script>
<style lang="less">
.page-order{
    .order-name{
        color: #337ab7;
        &:hover{
            color: #23527c;
        }
    }
    .bid{
        background-color: #32A7FF;
    }
    .contract{
        background-color: #D56CEE;
    }
    .el-button{
        padding: 12px 33px 12px 37px;
        color: #fff;
    }
    .icon-bid,.icon-contract{
        vertical-align: -3px;
        font-size: 18px;
        margin-right: 13px;        
    }
    .order-table-btn{
        display: inline-block;
    }
    .el-input{
        height: 35px;
        .el-input__inner{
            height: 100%;
            line-height: 35px;
        }
        .icon{
            line-height: 35px;
            margin-right: 10px;
            cursor: pointer;
        }
    }   
    .el-dialog__wrapper{
        .copy-order-box{
            width: 100%;
            height: 100%;
            text-align: left;
            .form-group{
                margin: 0;
                padding: 10px 0;
                min-height: 50px;
                line-height: 30px;
                position: relative;
                padding-left: 120px;
                .label{
                    width: 110px;
                    text-align: right;
                    position: absolute;
                    line-height: 30px;
                    top: 10px;
                    left: 0;
                    margin: 0;
                }
                .form-control{
                    width: 190px;
                    height: 30px;
                    // border: 1px solid #e1e5ec;
                    border-radius: 5px;
                    // padding-left: 10px;
                    background: #fff;
                    line-height: 28px;
                }
            }
            .btn-box{
                text-align: center;
                margin-top: 25px;
                .btn-white2{
                    color: #333;
                    background-color: #fff;
                    border: 1px solid #ccc;
                }
                .btn-blue{
                    border: 1px solid #4a9dd2;
                    background: #4a9dd2;
                    color: white;
                }
            }
        }
    }
}
</style>
