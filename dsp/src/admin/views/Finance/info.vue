<template>
    <div id="admin_finance_info">
        <p class="page-title">财务信息</p>
        <div class="table content">
            <div class="table-top cl">
                <h3 class="table-title icon">财务信息列表</h3>
                <div class="table-filter">
                    <search @search="search" placeholder="代理商名称"></search>
                </div>
            </div>
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;">   
                    <table class="table-box" id="tableInfo" style="width:100%;">
                        <thead>
                            <tr>
                                <th>代理商ID</th>
                                <th>代理商名称</th>
                                <th>已提取RTB利润</th>
                                <th>未提取RTB利润</th>
                                <th>RTB总利润</th>
                                <th>已提取PDB利润</th>
                                <th>未提取PDB利润</th>
                                <th>PDB总利润</th>
                                <th>余额</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in tableList" :key="index">
                                <td>{{ item.saasDspID }}</td>
                                <td>{{ item.saasDspName }}</td>
                                <td style="white-space: nowrap">{{ item.extractRtbProfit }}</td>
                                <td style="white-space: nowrap">{{ item.unExtractRtbProfit }}</td>
                                <td style="white-space: nowrap">{{ item.rtbProfit }}</td>
                                <td style="white-space: nowrap">{{ item.extractPdbProfit }}</td>
                                <td style="white-space: nowrap">{{ item.unExtractPdbProfit }}</td>
                                <td style="white-space: nowrap">{{ item.pdbProfit }}</td>
                                <td style="white-space: nowrap">{{ item.balance }}</td>
                                <td style="white-space:nowrap">
                                    <dsp-button
                                        type="primary"
                                        size="mini"
                                        round
                                        plain
                                        @click="showMask('putin',item)"
                                    >充值</dsp-button>
                                    <dsp-button
                                        type="primary"
                                        size="mini"
                                        round
                                        plain
                                        @click="showMask('putout',item)"
                                    >转出资金</dsp-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="tableList.length || tableShow" ref="floatThead">
                        <thead>
                            <tr>
                                <th>代理商ID</th>
                                <th>代理商名称</th>
                                <th>已提取RTB利润</th>
                                <th>未提取RTB利润</th>
                                <th>RTB总利润</th>
                                <th>已提取PDB利润</th>
                                <th>未提取PDB利润</th>
                                <th>PDB总利润</th>
                                <th>余额</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
            <div class="scroll-wrap">
                <div class="h-bar"></div>
            </div>
            <admin-page id="pageToolbar" :page="pageObj" @change="getTbaleList"></admin-page>
        </div>
        <el-dialog :title="opreaType" :visible.sync="opreaShow" width="600px">
            <el-form label-width="120px">
                <el-form-item label="代理商：">
                    <span>{{opreaData.name}}</span>
                </el-form-item>
                <el-form-item label="选择申请单号：" v-show="opreaData.isYingShou">
                    <el-select :disabled='beforeCharge' v-show="opreaData.type == 'putin'"  v-model="requestCode1" placeholder="选择申请单号"
                      @change="changeApplyCode1">
                        <el-option
                        v-for="item in putinOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-show="opreaData.type == 'putout'" v-model="requestCode2" placeholder="选择申请单号"
                      @change="changeApplyCode2">
                        <el-option
                        v-for="item in putoutOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" v-if="opreaData.type == 'putin'&&opreaData.isYingShou">
                    <el-checkbox v-model="beforeCharge">预充值</el-checkbox>
                </el-form-item>
                <el-form-item :label="opreaData.type == 'putin' ? '充值金额：': '退款金额：'">
                    <el-input class="w245" v-if="opreaData.type == 'putin'" :disabled='opreaData.isYingShou&&!beforeCharge' placeholder="请填写金额..." v-model="opreaFilter.money"></el-input>
                    <el-input class="w245" v-if="opreaData.type == 'putout'" placeholder="请填写金额..." v-model="opreaFilter.money"></el-input>
                    <p class="pl80" v-if="opreaData.isYingShou" v-show="opreaData.type == 'putout'">
                        申请单号金额
                        <span class="pl5 red">{{ applyCodeMoney|number(2) }}</span>元
                    </p>
                    <p class="pl80">
                        代理商账户余额
                        <span class="pl5 red">{{ opreaData.money|number(2) }}</span>元
                    </p>
                </el-form-item>
                <el-form-item label="备注：" v-if='!beforeCharge'>
                    <el-input class="w245" placeholder="请填写备注..." v-model="opreaFilter.comment"></el-input>
                </el-form-item>
                <el-form-item label="备注：" v-if="opreaData.type == 'putin'&&beforeCharge">
                    <div class="beforeComment" id="refBeforeCharge">
                        代理商：{{opreaData.name}}，预充值{{opreaFilter.money}}元；后续绑定申请单号请至“财务记录”
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="opreaShow = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Search from "@/common/components/search";
import dspButton from "@/common/components/dspButton";
import Page from "@/common/components/page";
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    data() {
        return {
            tableList: [],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter: {},
            opreaShow: false,
            opreaType: "",
            opreaData: {},
            opreaFilter: {
                money: '',
                comment: '',
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
            beforeCharge: false,    //是否预充值
        };
    },
    mounted() {
        this.getTbaleList();
    },
    watch: {
        beforeCharge(val){
            this.requestCode1 = '';
            this.opreaFilter.money = '';
            this.opreaFilter.yingShouApplyCode = '';
            this.opreaFilter.yingShouApplyType = '';
            this.opreaFilter.comment = '';
        }
    },
    methods: {
        getTbaleList() {
            this.$ajax({
                url: "/dsp/admin/dsp/finace/info/list",
                data: {
                    page: this.pageObj.currentPage + "",
                    size: this.pageObj.size + "",
                    sort: ["cTime,1"],
                    filter: this.filter
                },
                load: true
            }).then(res => {
                this.tableList = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                this.tableList.forEach(item => {
                    if( !item.yingShouOpCode ){
                        item.isYingShou = false;
                    }else{
                        item.isYingShou = true;
                    }
                });
                this.$nextTick(this.init)
            });
        },
        search(val) {
            this.pageObj.currentPage = "1";
            this.filter.name = val;
            this.getTbaleList();
        },
        showMask(type, val) {
            this.opreaFilter.money = '';
            this.opreaFilter.comment = '';
            this.beforeCharge = false;
            this.requestCode1 = ''
            this.requestCode2 = ''

            this.opreaShow = true;
            this.opreaType = type;
            this.opreaData.type = type
            this.opreaData.name = val.saasDspName;
            this.opreaData.money = val.balance;
            this.opreaData.isYingShou = val.isYingShou;
            this.opreaFilter.saasDspID = val.saasDspID + "";
            if (this.opreaType == "putin") {
                this.opreaType = "充值";
                if( val.yingShouOpCode ){                    
                    this.ajaxPutIndata(val.yingShouOpCode)
                }
            }
            if (this.opreaType == "putout") {
                this.opreaType = "转出资金";
                if( val.yingShouOpCode ){
                    this.ajaxPutoutdata( val.yingShouOpCode )
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
            this.opreaFilter.money = val.amount;
            this.opreaFilter.yingShouApplyCode = val.code
            this.opreaFilter.yingShouApplyType = val.type
        },
        changeApplyCode2(val) {
            val = JSON.parse(val)
            this.applyCodeMoney = val.amount
            // this.opreaFilter.money = val.amount;
            // this.opreaFilter.yingShouApplyCode = val.code
            // this.opreaFilter.yingShouApplyType = val.type
        },
        confirm() {
            var data = this.opreaFilter;
            console.log(data)
            if (this.opreaType == "充值") {
                if( this.opreaData.isYingShou&&!this.requestCode1&&!this.beforeCharge ) {
                    this.$message.error('请选择申请单号')
                    return;
                }
                if( this.beforeCharge ){
                    this.opreaFilter.comment = document.getElementById("refBeforeCharge").innerHTML
                }
                this.$ajax({
                    url: "/dsp/saas/dsp/finace/deposit",
                    data: {
                        data: data
                    },
                    load: true
                }).then(res => {
                    if (res.status == "0") {
                        this.$message.success("操作成功!");
                        this.opreaFilter.money = "";
                        this.opreaShow = false;
                        this.getTbaleList();
                        this.requestCode1 = '请选择申请单号'
                    }
                });
            } else if (this.opreaType == "转出资金") {
                if( this.opreaData.isYingShou&&!this.requestCode2 ) {
                    this.$message.error('请选择申请单号')
                    return;
                }
                this.$ajax({
                    url: "/dsp/saas/dsp/finace/withdraw",
                    data: {
                        data: data
                    },
                    load: true
                }).then(res => {
                    if (res.status == "0") {
                        this.$message.success("操作成功!");
                        this.opreaFilter.money = "";
                        this.opreaShow = false;
                        this.getTbaleList();
                        this.requestCode2 = '请选择申请单号'
                    }
                });
            }
        }
    },
    components: {
        search: Search,
        dspButton: dspButton,
        adminPage: Page
    }
};
</script>
<style lang="less">
#admin_finance_info {
}
.beforeComment{
    width: 340px;
    line-height: 40px;
    padding: 0 10px;
    background-color: #DDDDDD;
    border-radius: 5px;
}
// #applyAutoAdd{
//     background: #DDDDDD;
// }
</style>


