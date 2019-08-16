<template>
    <div class="info-page">
        <div class="page-title">财务信息</div>
        <div class="content">
            <ul class="finance-list">
                <li v-if="permission.view[85]">
                    <p class="finance-title">
                        <i></i>账户余额（元）
                    </p>
                    <p class="finance-number">{{finance.balance | number(2)}}</p>
                </li>
                <li>
                    <p class="finance-title">
                        <i></i>可转余额（元）
                    </p>
                    <p class="finance-number">{{finance.usableBalance | number(2)}}</p>
                </li>
            </ul>
        </div>

        <div class="table content" style="overflow:hidden;">
            <div class="table-top">
                <p class="table-title">财务信息报表</p>
                <div class="table-filter">
                    <search placeholder="搜索广告主名称" v-if="permission.act[96]" @search="search"></search>
                </div>
            </div>
            <div id="scrollWrap" style="overflow:hidden;">          
                <div id="tableWrap" style="overflow-x:scroll;">
                    <table class="table-box" style="width:100%;" id="tableInfo">
                        <thead>
                            <tr>
                                <th>广告主ID</th>
                                <th>广告主名称</th>
                                <th>现金余额</th>
                                <th v-if="permission.view[92]">总竞价交易利润</th>
                                <th v-if="permission.view[92]">竞价交易未提取利润</th>
                                <th v-if="permission.view[92]">竞价交易已提取利润</th>
                                <th v-if="permission.view[92]">总保价保量收入</th>
                                <th v-if="permission.view[92]">保价保量未提取收入</th>
                                <th v-if="permission.view[92]">保价保量已提取收入</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in list" :key="item.id">
                                <td>{{item.id}}</td>
                                <td>{{item.name}}</td>
                                <td>{{item.balance}}</td>
                                <td v-if="permission.view[92]">{{item.rtbProfit}}</td>
                                <td v-if="permission.view[92]">{{item.unExtractRtbProfit}}</td>
                                <td v-if="permission.view[92]">{{item.extractRtbProfit}}</td>
                                <td v-if="permission.view[92]">{{item.pdbProfit}}</td>
                                <td v-if="permission.view[92]">{{item.unExtractPdbProfit}}</td>
                                <td v-if="permission.view[92]">{{item.extractPdbProfit}}</td>
                                <td>
                                    <router-link
                                        :to="{name:'finance.detail',params:{id:item.id,type:1}}"
                                    >查看记录</router-link>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <a
                                        v-if="permission.act[40]"
                                        href="javascript:;"
                                        @click="showMask('putin',item)"
                                    >转入资金</a>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <a
                                        v-if="permission.act[41] && item.canPutout"
                                        href="javascript:;"
                                        @click="showMask('putout',item,item.balance)"
                                    >转出资金</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="list.length || tableShow">
                        <thead>
                            <tr>
                                <th>广告主ID</th>
                                <th>广告主名称</th>
                                <th>现金余额</th>
                                <th v-if="permission.view[92]">总竞价交易利润</th>
                                <th v-if="permission.view[92]">竞价交易未提取利润</th>
                                <th v-if="permission.view[92]">竞价交易已提取利润</th>
                                <th v-if="permission.view[92]">总保价保量收入</th>
                                <th v-if="permission.view[92]">保价保量未提取收入</th>
                                <th v-if="permission.view[92]">保价保量已提取收入</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                    </table>                    
                </div>
            </div>    
            <div class="scroll-wrap">
                <div class="h-bar"></div>
            </div>
            <page id="pageToolbar" :page="pageObj" @change="getList"></page>
        </div>
        <!-- 资金弹窗 -->
        <el-dialog
            :title="transfer.financeType=='putin'?'转入资金':'转出资金'"
            :visible.sync="dialogVisible"
            width="600px"
        >
            <el-form ref="form" :model="transfer" label-width="120px">
                <el-form-item label="广告主">{{transfer.name}}</el-form-item>
                <el-form-item label="转账金额">
                    <el-input v-model="transfer.money" type="number"></el-input>
                    <p v-if="transfer.financeType == 'putin'">当前可分配余额
                        <span class="money">{{finance.usableBalance}}</span>
                    </p>
                    <p v-if="transfer.financeType != 'putin'">当前可转出余额
                        <span class="money">{{transfer.canPuit}}</span>
                    </p>
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
import { floatScroll } from "@/common/js/utils";
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    data() {
        return {
            tableShow: false,
            dialogVisible: false,
            total: {},
            transfer: {},
            list: [],
            filter: {},
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            }
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
    methods: {
        // 选择时间
        search(val) {
            this.filter.name = val;
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
                url: "/dsp/advertiser/finance/list",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                this.list = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;

                this.tableShow = true;
                this.$nextTick(this.init)
            });
        },
        showMask(type, item, money) {
            this.transfer = {
                financeType: type,
                advertiserID: item.id,
                name: item.name,
                financeType: type,
                canPuit: money
            };
            this.dialogVisible = true;
        },
        showConfirm() {
            var str =
                this.transfer.financeType == "putin" ? "充值" : "转出资金";
            this.$confirm("是否确定" + str + "？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
                .then(()=>{
                    var transfer = this.transfer;
                    var data = {
                        agencyID: this.userInfo.UserID + "", //代理商ID
                        advertiserID: transfer.advertiserID, //广告主ID
                        financeType: transfer.financeType, //转入putin、转出putout
                        money: transfer.money
                    };
                    return this.$ajax({
                        url: "/dsp/agency/finance/transfer",
                        load: true,
                        data: data
                    })
                }).then((res) => {
                    this.transfer.money = "";
                    this.$message.success("操作成功")
                    this.dialogVisible = false;
                    this.getList();
                    this.$store.dispatch("getBalance");
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
    td{
        a{
            display: inline-block;
            width: 60px;
        }
    }
}
</style>
