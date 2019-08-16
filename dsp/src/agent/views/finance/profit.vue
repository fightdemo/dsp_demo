<template>
    <div class="profit-page">
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
                <li>
                    <p class="finance-title">
                        <i></i>剩余保价保量收入（元）
                    </p>
                    <p class="finance-number">{{finance.pdbProfit | number(2)}}</p>
                </li>
            </ul>
        </div>

        <div class="table content">
            <div class="table-top">
                <p class="table-title">财务信息报表</p>
                <div class="table-filter">
                    <search placeholder="搜索广告主名称" v-if="permission.act[97]" @search="search"></search>
                </div>
            </div>
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;">
                    <table class="table-box" style="width:100%;" id="tableInfo">
                        <thead>
                            <tr>
                                <th>广告主ID</th>
                                <th>广告主</th>
                                <th>总竞价交易利润</th>
                                <th>竞价交易未提取利润</th>
                                <th>竞价交易已提取利润</th>
                                <th>总保价保量收入</th>
                                <th>保价保量未提取收入</th>
                                <th>保价保量已提取收入</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in list" :key="item.id">
                                <td>{{item.id}}</td>
                                <td>{{item.name}}</td>
                                <td>{{item.rtbProfit}}</td>
                                <td>{{item.unExtractRtbProfit}}</td>
                                <td>{{item.extractRtbProfit}}</td>
                                <td>{{item.pdbProfit}}</td>
                                <td>{{item.unExtractPdbProfit}}</td>
                                <td>{{item.extractPdbProfit}}</td>
                                <td>
                                    <router-link
                                        class="a1"
                                        :to="{name:'finance.detail',params:{id:item.id,type:2}}"
                                    >查看记录</router-link>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <a
                                        class="a2"
                                        v-if="permission.act[43]"
                                        href="javascript:;"
                                        @click="showMask(item,'rtb')"
                                    >提取竞价交易利润</a>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    <a
                                        class="a3"
                                        v-if="permission.act[44]"
                                        href="javascript:;"
                                        @click="showMask(item,'pdb')"
                                    >提取保价保量收入</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="list.length || tableShow">
                        <thead>
                            <tr>
                                <th>广告主ID</th>
                                <th>广告主</th>
                                <th>总竞价交易利润</th>
                                <th>竞价交易未提取利润</th>
                                <th>竞价交易已提取利润</th>
                                <th>总保价保量收入</th>
                                <th>保价保量未提取收入</th>
                                <th>保价保量已提取收入</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                    </table>                    
                    <!-- <table class="table-box float-thead2" id="float-thead2" v-if="list.length">
                        <thead>
                            <tr>
                                <th>广告主ID</th>
                                <th>广告主</th>
                            </tr>
                        </thead>
                    </table>                    
                    <table class="table-box float-body" id="float-body" v-if="list.length">
                        <thead>
                            <tr>
                                <th>广告主ID</th>
                                <th>广告主</th>
                            </tr>
                        </thead>
                        <tbody v-for="item in list" :key="item.id">
                            <tr>
                                <td>{{item.id}}</td>
                                <td>{{item.name}}</td>
                            </tr>                               
                        </tbody>
                    </table>                     -->
                </div>
             </div> 
            <div class="scroll-wrap">
                <div class="h-bar"></div>
            </div>
            <page id="pageToolbar" :page="pageObj" @change="getList"></page>
        </div>
        <!-- 资金弹窗 -->
        <el-dialog
            :title="profits.type=='rtb'?'利润提取':'收入提取'"
            :visible.sync="dialogVisible"
            width="600px"
        >
            <el-form ref="form" :model="profits" label-width="120px">
                <el-form-item label="利润提取">
                    <el-input v-model="profits.value" type="number"></el-input>
                    <p>
                        当前可提取金额
                        <span class="money">{{profits.money}}</span>
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
import {floatScroll} from '@/common/js/utils'
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    data() {
        return {
            tableShow: false,
            dialogVisible: false,
            total: {},
            profits: {},
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
        showMask(item, type) {
            this.profits = {
                id: item.id,
                value: "",
                type: type,
                money:
                    type == "rtb"
                        ? item.unExtractRtbProfit
                        : item.unExtractPdbProfit
            };

            this.dialogVisible = true;
        },
        showConfirm() {
            this.$confirm("是否确定提取金额？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
                .then(() => {
                    var profitsObj = this.profits;
                    var data = {
                        "agencyID": this.userInfo.UserID+"",//代理商ID
                        "advertiserID": profitsObj.id,//广告主ID
                        "action":profitsObj.type,//操作转出
                        "money": profitsObj.value//金额
                    }
                    return this.$ajax({
                        url: "/dsp/agency/finance/profit",
                        load: true,
                        data: data
                    });
                })
                .then(res => {
                    this.dialogVisible = false;
                    this.$message.success("操作成功")
                    this.getList();
                    this.$store.dispatch("getBalance");
                });
        },
    }
};
</script>
<style lang="less">
.profit-page {
    .money {
        color: #f56c6c;
    }
    td{
        a{
            display: inline-block;
            width: 60px;
        }
        .a2,.a3{
            width: 100px;
        }
    }
}
</style>
