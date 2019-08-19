<template>
    <div class="info-page">
        <div class="page-title">财务信息</div>
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
                <p class="table-title">财务信息报表</p>
                <div class="table-filter">
                    <search placeholder="搜索广告公司ID或名称" @search="search"></search>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th>广告公司ID</th>
                        <th>广告公司名称</th>
                        <th>余额</th>
                        <th>总利润</th>
                        <th>未提取利润</th>
                        <th>已提取利润</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in list" :key="item.id">
                        <td>{{item.agencyID}}</td>
                        <td>{{item.agencyName}}</td>
                        <td>{{item.balance}}</td>
                        <td>{{item.rtbProfit}}</td>
                        <td>{{item.unExtractRtbProfit}}</td>
                        <td>{{item.extractRtbProfit}}</td>
                        <td>
                            <router-link
                                :to="{name:'finance.detail',params:{id:item.agencyID,type:1}}"
                            >查看记录</router-link>&nbsp;&nbsp;&nbsp;&nbsp;
                            <a
                                v-if="permission.act[76]"
                                href="javascript:;"
                                @click="showMask('putin',item)"
                            >充值</a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a
                                v-if="permission.act[77]"
                                href="javascript:;"
                                @click="showMask('putout',item)"
                            >转出资金</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <page :page="pageObj" @change="getList"></page>
        </div>
        <!-- 资金弹窗 -->
        <el-dialog
            :title="transfer.financeType=='putin'?'转入资金':'转出资金'"
            :visible.sync="dialogVisible"
            width="600px"
        >
            <el-form ref="form" :model="transfer" label-width="120px">
                <el-form-item label="广告公司">{{transfer.agencyName}}</el-form-item>
                <el-form-item label="选择申请单号" v-show="transfer.isYingShou">
                    <el-select v-show="transfer.financeType == 'putin'" :disabled="beforeCharge"  v-model="requestCode1" placeholder="选择申请单号"
                     style="border: 1px solid #A8D5EE; border-radius: 4px;" @change="changeApplyCode1">
                        <el-option
                        v-for="item in putinOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-show="transfer.financeType == 'putout'" v-model="requestCode2" placeholder="选择申请单号"
                     style="border: 1px solid #A8D5EE; border-radius: 4px;" @change="changeApplyCode2">
                        <el-option
                        v-for="item in putoutOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" v-if="transfer.financeType == 'putin'&&transfer.isYingShou">
                    <el-checkbox v-model="beforeCharge">预充值</el-checkbox>
                </el-form-item>
                <el-form-item label="转账金额">
                    <el-input v-model="transfer.money" v-if="transfer.financeType == 'putin'"  :disabled='transfer.isYingShou&&!beforeCharge' type="number"></el-input>
                    <el-input v-model="transfer.money" v-if="transfer.financeType == 'putout'" type="number"></el-input>
                    <p v-if="transfer.isYingShou" v-show="transfer.financeType == 'putout'">
                        申请单号金额
                        <span class="pl5 red">{{ applyCodeMoney|number(2) }}</span>元
                    </p>
                    <p>广告公司余额
                        <span class="money">{{transfer.balance|number(2)}}</span>
                    </p>
                </el-form-item>
                <el-form-item label="备注：" v-if="!beforeCharge">
                    <el-input class="w245" v-model="transfer.comment"></el-input>
                </el-form-item>
                <el-form-item label="备注：" v-if="transfer.financeType == 'putin'&&beforeCharge">
                    <div class="beforeComment"  id="refBeforeCharge">
                        代理商：{{transfer.agencyName}}，预充值{{transfer.money|number(2)}}元；后续绑定申请单号请至“财务记录”
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="showConfirm()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible: false,
            total: {},
            transfer: {},
            list: [],
            filter: {},
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            requestCode1: '',
            requestCode2: '',
            putinList: [],
            putoutList: [],
            putinOptions: [{
                value: '',
                label: '选择申请单号'
            }],
            putoutOptions: [{
                value: '',
                label: '选择申请单号'
            }],
            applyCodeMoney: 0,
            beforeCharge: false,    //预充值
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.common.userInfo;
        },
        finance() {
            return this.$store.state.balance;
        },
        permission() {
            return this.$store.state.common.permission;
        }
    },
    created() {
        this.getList();
        this.$store.dispatch("getBalance");
    },
    watch: {
        beforeCharge(val){
            this.requestCode1 = '';
            this.transfer.money = '';
            this.transfer.yingShouApplyCode = '';
            this.transfer.yingShouApplyType = '';
            this.transfer.comment = '';
        }
    },
    methods: {
        // 选择时间
        search(val) {
            this.pageObj.currentPage = "1";            
            if(val) {
                this.filter.name = val;
            }else {
                this.filter = {}
            }
            this.pageObj.currentPage = 1;
            this.getList();
        },
        getList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"],
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/saas/dsp/finace/agency",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                this.list = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                this.list.forEach(item => {
                    if( !item.yingShouOpCode ){
                        item.isYingShou = false;
                    }else{
                        item.isYingShou = true;
                    }
                });
            });
        },
        showMask(type, item) {
            this.requestCode1 = ''
            this.requestCode2 = ''
            this.transfer = {
                financeType: type,
                agencyID: item.agencyID,
                agencyName: item.agencyName,
                balance: item.balance,
                money: ''
            };
            this.dialogVisible = true;
            this.transfer.isYingShou = item.isYingShou;
            if (this.transfer.financeType == "putin") {
                if( item.yingShouOpCode ){
                    this.ajaxPutIndata(item.yingShouOpCode)
                }
            }
            if (this.transfer.financeType == "putout") {
                if( item.yingShouOpCode ){
                    this.ajaxPutoutdata( item.yingShouOpCode )
                }
            }
        },
        ajaxPutIndata(yingShouOpCode){ 
            let filter = {};
            let putinOptions = []
            putinOptions.push( {value:"", label: '选择申请单号'} )
            filter.opCode = yingShouOpCode
            // filter.opCode = 'TF201903220014'
            this.$ajax({
                url: '/dsp/yingshou/applies/deposit/list',
                data: {
                    filter: filter
                }
            }).then( res => {

                res.data.forEach( (item, index) => {
                    putinOptions.push( {value: JSON.stringify(item), label: item.code} )
                } )
                this.putinOptions = putinOptions;
                this.putinList = res.data
            } )
        },
        ajaxPutoutdata(yingShouOpCode){
            let filter = {};
            let putoutOptions  = []
            putoutOptions.push( {value:"", label: '选择申请单号'} )
            filter.opCode = yingShouOpCode
            // filter.opCode = 'TF201903220014'
            this.$ajax({
                url: '/dsp/yingshou/applies/refund/list',
                data: {
                    filter: filter
                }
            }).then( res => {
                res.data.forEach( (item, index) => {
                    putoutOptions.push( {value: JSON.stringify(item), label: item.code} )
                } )
                this.putoutOptions = putoutOptions;
            } )
        },
        changeApplyCode1(val) {
            val = JSON.parse(val)
            this.transfer.money = val.amount;
            this.transfer.yingShouApplyCode = val.code
            this.transfer.yingShouApplyType = val.type
        },
        changeApplyCode2(val) {
            val = JSON.parse(val)
            this.applyCodeMoney = val.amount
            // this.transfer.money = val.amount;
            // this.transfer.yingShouApplyCode = val.code
            // this.transfer.yingShouApplyType = val.type
        },
        showConfirm() {
            var str,url;
            if(this.transfer.financeType == "putin") {
                str = "充值";
                if( this.transfer.isYingShou&&!this.requestCode1&&!this.beforeCharge ) {
                    this.$message.error('请选择申请单号')
                    return;
                }
                if( this.beforeCharge ){
                    this.transfer.comment = document.getElementById("refBeforeCharge").innerHTML
                }
                url = '/dsp/admin/agencyfinance/deposit';
            } else {
                str = "转出资金";
                if( this.transfer.isYingShou&&!this.requestCode2 ) {
                    this.$message.error('请选择申请单号')
                    return;
                }
                url = '/dsp/admin/agencyfinance/withdraw';
            }
            this.$confirm("是否确定" + str + "？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
                .then(()=>{
                    var transfer = this.transfer;
                    var data = {
                        agenID: transfer.agencyID,
                        money: transfer.money+"",
                        comment: transfer.comment,
                        yingShouApplyCode : transfer.yingShouApplyCode,
                        yingShouApplyType : transfer.yingShouApplyType,
                    };
                    return this.$ajax({
                        url: url,
                        load: true,
                        data: {
                            data: data
                        }
                    })
                }).then((res) => {
                    this.transfer.money = "";
                    this.$message.success("操作成功")
                    this.dialogVisible = false;
                    this.getList();
                    this.$store.dispatch("getBalance");
                    this.requestCode1 = '请选择申请单号'
                    this.requestCode2 = '请选择申请单号'
                });
        }
    }
};
</script>
<style lang="less">
.info-page {
    .money {
        color: #f56c6c;
    }
}
.beforeComment{
    width: 340px;
    line-height: 40px;
    padding: 0 10px;
    background-color: #DDDDDD;
    border-radius: 5px;
}
</style>
