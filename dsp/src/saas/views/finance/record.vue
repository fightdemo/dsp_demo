<template>
    <div>
        <div class="page-title">财务记录</div>
        <div class="content">
            <ul class="finance-list">
                <li>
                    <p class="finance-title">
                        <i></i>账户余额（元）
                    </p>
                    <p class="finance-number">{{finance.bookBalance | number(2)}}</p>
                </li>
                <li>
                    <p class="finance-title">
                        <i></i>可转余额（元）
                    </p>
                    <p class="finance-number">{{finance.cashBalance | number(2)}}</p>
                </li>
            </ul>
        </div>

        <div class="table content">
            <div class="table-top">
                <p class="table-title">财务信息列表</p>
                <div class="table-filter">
                    <select-data @select="selectDate"></select-data>
                    <m-select title="全部交易类型" :list="typeList" @change="selectType"></m-select>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th>时间</th>
                        <th>广告公司ID</th>
                        <th>广告公司名称</th>
                        <th>交易类型</th>
                        <th>金额（元）</th>
                        <th>备注</th>
                        <th v-if="showAction">操作</th>
                        <!-- <th>操作说明</th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in list" :key="index">
                        <td>{{item.cTime}}</td>
                        <td>{{item.accountID}}</td>
                        <td>{{item.relateName}}</td>
                        <td>
                            {{item.action|action}}
                            {{actionList.indexOf(item.action) != -1?item.name:''}}
                        </td>
                        <td>{{item.money}}</td>
                        <td style="width: 200px;">{{item.comment}}</td>
                        <td v-if="showAction">
                            <el-button type="primary" v-if="item.action == 'agencyIn' && item.yingShouOpCode && !item.yingShouApplyCode" class="bind-btn" @click="bindCode(item)">绑定申请单号</el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <page :page="pageObj" @change="getList"></page>
        </div>

        <!-- 绑定申请单号弹窗 -->
        <el-dialog 
            title="绑定申请单号"
            width="600px"
            :visible.sync="dialogVisible"
            >
            <el-form ref="form" :model="bindInfo" label-width="180px">
                <el-form-item label="广告公司名称：">{{bindInfo.relateName}}</el-form-item>
                <el-form-item label="选择申请单号（必填）：">
                    <el-select v-model="depositValue" placeholder="请选择" @change="selectCode">
                        <el-option
                            v-for="item in depositList"
                            :key="item.type"
                            :label="item.code"
                            :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="充值金额（必填）：">
                    <div>预充值{{bindInfo.money|number(2)}}元</div>
                    <div style="font-size:12px;">该申请单号金额为：<span style="color:red">{{bindInfo.amount|number(2)}}</span>元</div>
                </el-form-item>
                <el-form-item label="备注：">
                    <div class="comment-box">{{bindInfo.comment}}</div>
                </el-form-item>
            </el-form>
            <el-footer slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="bindOk">确 定</el-button>
            </el-footer>
        </el-dialog>
    </div>
</template>
<script>
import { getNowFormatDate } from "@/common/js/utils";

export default {
    filters: {
        action(val) {
            if (!val) return "";
            return {
                'deposit': "admin转入资金",
                'agencyIn': "广告公司充值",
                'withdraw': "admin转出资金",
                'agencyOut': "广告公司提现",
                'rtbProfit': "提取利润",
                'pdbProfit': "保价保量收入",
                'purchase': "保价保量扣款",
                'receipts': "保价保量收入",
            }[val];
        }
    },
    data() {
        return {
            showAction: false,
            dialogVisible: false,
            bindInfo: {},
            depositList: [],
            depositValue: "",
            total: {},
            list: [],
            filter: {},
            typeList: [{value: '全部交易类型'}, {id: 'deposit', value: 'Admin转入资金'}, {id: 'withdraw', value: 'Admin转出资金'},
                {id: 'agencyIn', value: '广告公司充值'},  {id: 'agencyOut', value: '广告公司提现'}, {id: 'rtbProfit', value: '提取利润'}, 
                {id:'purchase',value:"保价保量扣款"},{id:'receipts',value:"保价保量收入"}
            ],
            actionList: ["adverIn", "adverOut", "pdbProfit", "rtbProfit"],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            eTime: getNowFormatDate() + " 23:59:59",
            sTime: getNowFormatDate() + " 00:00:00"
        };
    },
    computed: {
        finance() {
            return this.$store.state.balance;
        }
    },
    created() {
        this.checkOrg();
        this.getList();
        this.$store.dispatch("getBalance");
    },
    watch: {
        dialogVisible(val) {
            if(!val) {
                this.depositValue = ""
            }
        }
    },
    methods: {
        selectType(item) {
            this.filter.action = item.id;
            this.getList();
        },
        // 选择时间
        selectDate(val) {
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.getList();
        },
        getList() {
            // this.pageObj = pageObj || {
            //     currentPage: 1,
            //     size: 20
            // };
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"],
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/saas/dsp/finace/list",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                this.list = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
            });
        },

        //绑定申请单号    
        bindCode(item) {
            this.$ajax({
                url: "/dsp/yingshou/applies/deposit/list",
                data: {
                    filter: {
                        opCode: item.yingShouOpCode
                    }
                },
                load: true
            }).then(res => {
                var data = res.data;
                data.unshift({"type":"", "code": "请选择申请单号", "amount":"0"})
                this.depositList = data;
                item.amount = "0";
                this.bindInfo = JSON.parse(JSON.stringify(item));
                this.dialogVisible = true;
            })           
        },

        bindOk() {
            if(!this.bindInfo.yingShouApplyCode) {
                this.$message.error("请选择申请单号！"); 
                return
            }
            this.$ajax({
                url: "/dsp/yingshou/applies/bind",
                data: {
                    data: {
                        id: this.bindInfo.id + "",
                        yingShouApplyCode: this.bindInfo.yingShouApplyCode,
                        yingShouApplyType: this.bindInfo.yingShouApplyType,
                        money: this.bindInfo.amount
                    }
                },
                load: true
            }).then(res => {
                this.dialogVisible = false;
                this.getList();
            })
        },
        selectCode(val) {
            let obj = {};
            obj = this.depositList.find(item => {
                return item.type === val;
            });
            this.bindInfo.yingShouApplyCode = obj.code;
            this.bindInfo.amount = obj.amount;
            this.bindInfo.yingShouApplyType = obj.type;
        },
        checkOrg() {
            this.$ajax({
                url: "/dsp/yingshou/check-org",
                load: true,
                data: {}
            }).then(res => {
                this.showAction = res.data;
            })
        }
    }
};
</script>
<style lang="less">
.bind-btn {
    padding: 0;
    width: 120px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    border-radius: 16px;
    background-color: #32A7ff;
}
.comment-box {
    width: 340px;
    padding: 0 15px;
    border: 1px solid #dcdfe6;     
    border-radius: 4px;
    background-color: #ddd;
    word-break: break-all;
}
</style>
