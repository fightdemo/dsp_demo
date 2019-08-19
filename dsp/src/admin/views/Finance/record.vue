<template>
    <div id="admin_finance_record">
        <p class="page-title">财务记录</p>

        <div class="table content">
            <div class="table-top cl">
                <h3 class="table-title icon">财务信息列表</h3>
                <div class="table-filter">
                    <dsp-date @select="selectDate"></dsp-date>
                    <dsp-select
                        title="全部类型"
                        :list="filterType"
                        valueName="name"
                        keyName="action"
                        @change="selectType"
                    ></dsp-select>
                    <dsp-select
                        title="全部代理商"
                        :list="agentList"
                        valueName="dspName"
                        keyName="dspID"
                        @change="selectAgent"
                    ></dsp-select>
                </div>
            </div>

            <table class="table-box">
                <thead>
                    <tr>
                        <th>时间</th>
                        <th>交易类型</th>
                        <th>金额（元）</th>
                        <th>代理商ID</th>
                        <th>代理商账户</th>
                        <th>备注</th>
                        <th v-if="isShowOporte">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in tableList" :key="index">
                        <td>{{ item.cTime }}</td>
                        <td>{{ item.action }}</td>
                        <td style="white-space: nowrap">{{ item.money|number(2) }}</td>
                        <td>{{item.id}}</td>
                        <td>{{ item.relateName }}</td>
                        <td style="width: 200px;">{{ item.comment }}</td>
                        <td v-if="isShowOporte">
                            <el-button v-if="!item.yingShouApplyCode&&item.yingShouOpCode&&item.action == '充值'" type='primary' class="bindApplyCode" @click="bindApplyCode(item)">绑定申请单号</el-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <admin-page :page="pageObj" @change="getTableList"></admin-page>
            <el-dialog title="绑定申请单号" :visible.sync="isShowApplyCode" width="600px">
                <el-form label-width="120px">
                    <el-form-item label="代理商名称：">
                        <span>{{bindCodeObj.relateName}}</span>
                    </el-form-item>
                    <el-form-item label="选择申请单号：">
                        <el-select v-model="bindCodeObj.preApplyCode" placeholder="选择申请单号"
                         @change="changeApplyCode1">
                            <el-option
                            v-for="item in bindCodeObj.putinOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="充值金额(必填):">
                        <p>预充值{{bindCodeObj.money|number(2)}}元</p>
                        <p class="" style="font-size: 12px;">
                            该申请单号金额为：
                            <span class="pl5 red">{{bindCodeObj.amount|number(2)}}</span>元
                        </p>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <div class="beforeComment">
                            代理商：{{bindCodeObj.relateName}}，预充值{{bindCodeObj.money|number(2)}}元；后续绑定申请单号请至“财务记录”(已完成绑定)
                        </div>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isShowApplyCode = false">取 消</el-button>
                    <el-button type="primary" @click="confirm">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import dspDate from "@/common/components/select-data";
import dspSelect from "@/common/components/select";
import { getNowFormatDate } from "@/common/js/utils";
import Page from "@/common/components/page";
export default {
    data() {
        return {
            sTime: getNowFormatDate() + " " + "00:00:00",
            eTime: getNowFormatDate() + " " + "23:59:59",
            tableList: [],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter: {},
            filterType: [
                { action: "", name: "全部类型" },
                { action: "purchase", name: "合约扣款" },
                { action: "deposit", name: "充值" },
                { action: "withdraw", name: "提取" }
            ],
            agentList: [],
            isShowApplyCode: false,
            bindCodeObj: {
                putinOptions: [{
                    value: '',
                    label: '选择申请单号'
                }],
                preApplyCode: "",
                relateName: '',
                amount: 0,
                yingShouApplyType: ''
            },
            isShowOporte: false,
        };
    },
    mounted() {
        this.getTableList();
        this.getAgentList();
        this.checkOrg();
    },
    methods: {
        checkOrg() {
            this.$ajax({
                url: "/dsp/yingshou/check-org",
                load: true,
                data: {}
            }).then( res => {
                if( res.data ){
                    this.isShowOporte = true;
                }else{
                    this.isShowOporte = false;
                }
            } )
        },
        confirm() {
            if( !this.bindCodeObj.preApplyCode ) {
                this.$message.error('请选择申请单号')
                return;
            }
            this.$ajax({
                url: '/dsp/yingshou/applies/bind',
                data: {
                    data: {
                        id: this.bindCodeObj.id + "",
                        yingShouApplyCode: this.bindCodeObj.code,
                        yingShouApplyType: this.bindCodeObj.yingShouApplyType,
                        money: this.bindCodeObj.money
                    }
                },
                load: true
            }).then( res => {
                if( res.status == '0' ){
                    this.$message.success("操作成功")
                    this.isShowApplyCode = false;
                    this.getTableList()
                }
            } )
        },
        changeApplyCode1(val) {
            val = JSON.parse(val)
            this.bindCodeObj.code = val.code
            this.bindCodeObj.amount = val.amount;
            this.bindCodeObj.yingShouApplyType = val.type
        },
        //绑定申请单号
        bindApplyCode(item) {
            this.bindCodeObj.preApplyCode = ""

            this.isShowApplyCode = true;
            this.bindCodeObj.relateName = item.relateName;
            this.bindCodeObj.money = item.money;
            this.bindCodeObj.id = item.id
            this.bindCodeObj.yingShouOpCode = item.yingShouOpCode
            this.bindCodeObj.yingShouApplyCode = item.yingShouApplyCode

            let filter = {};
            let putinOptions = [];
            filter.opCode = item.yingShouOpCode
            putinOptions.push( {value:"", label: '选择申请单号'} )
            this.$ajax({
                url: '/dsp/yingshou/applies/deposit/list',
                data: {
                    filter: filter
                }
            }).then( res => {
                res.data.forEach( (item, index) => {
                    putinOptions.push( {value: JSON.stringify(item), label: item.code} )
                } )
            } )
            this.bindCodeObj.putinOptions = putinOptions
        },
        // 选择时间
        selectDate(val) {
            this.dataGrain = val.start == val.end ? "hour" : "day";
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.getTableList();
        },
        //选择类型
        selectType(val) {
            this.pageObj.currentPage = 1;
            this.filter.action = val.action;
            this.getTableList();
        },
        //选择代理商
        selectAgent(d) {
            if (!d.dspID) {
                this.filter.relateAccount = "";
            } else {
                this.filter.relateAccount = d.dspName;
            }
            this.getTableList();
        },
        getTableList() {
            this.$ajax({
                url: "/dsp/admin/dsp/finace/record/list",
                data: {
                    page: this.pageObj.currentPage + "",
                    size: this.pageObj.size + "",
                    filter: this.filter,
                    sort: ["cTime,1"],
                    sTime: this.sTime,
                    eTime: this.eTime
                }
            }).then(res => {
                this.tableList = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                var len = this.tableList.length;
                for (let i = 0; i < len; i++) {
                    if (this.tableList[i].action == "purchase") {
                        this.tableList[i].action = "合约扣款";
                    } else if (this.tableList[i].action == "deposit") {
                        this.tableList[i].action = "充值";
                    } else if (this.tableList[i].action == "withdraw") {
                        this.tableList[i].action = "提取";
                    }
                }
            });
        },
        getAgentList() {
            this.$ajax({
                url: "/dsp/rpt/admin/dspname",
                data: {}
            }).then(res => {
                this.agentList = res.data;
                this.agentList.unshift({ dspName: "全部代理商" });
            });
        }
    },
    components: {
        dspDate: dspDate,
        dspSelect: dspSelect,
        adminPage: Page
    }
};
</script>
<style lang="less" scoped>
#admin_finance_record {
}
.bindApplyCode{
    padding: 0;
    width: 120px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    border-radius: 16px;
}
.beforeComment{
    width: 340px;
    line-height: 40px;
    padding: 0 10px;
    background-color: #DDDDDD;
    border-radius: 5px;
}
</style>


