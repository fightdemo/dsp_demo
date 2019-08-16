<template>
    <div>
        <div class="page-title">交易信息
            <dsp-button @click="$router.go(-1)">返回</dsp-button>
        </div>
        <div class="table content">
            <div class="table-top">
                <p class="table-title">交易信息列表</p>
                <div class="table-filter">
                    <m-select title="全部类型" :list="actionList"></m-select>
                    <dsp-button>下载报表</dsp-button>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th style="width: 20%">提取时间</th>
                        <th style="width: 20%">广告主ID</th>
                        <th style="width: 20%">广告主名称</th>
                        <th style="width: 20%">类型</th>
                        <th style="width: 20%">金额</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in list" :key="index">
                        <td>{{item.cTime}}</td>
                        <td>{{item.accountID}}</td>
                        <td>{{item.accountName}}</td>
                        <td>
                            <p v-if="item.action == 'rtbProfit'">竞价交易利润</p>
                            <p v-if="item.action == 'pdbProfit'">保价保量利润</p>
                            <p v-if="item.action == 'adverIn'">充值</p>
                            <p v-if="item.action == 'adverOut'">提现</p>
                        </td>
                        <td>{{item.money}}</td>
                    </tr>
                </tbody>
            </table>
            <page :page="pageObj" @change="getList"></page>
        </div>
    </div>
</template>
<script>
import { exportCsv } from "@/common/js/utils";
export default {
    data() {
        return {
            total: {},
            list: [],
            filter: {
                relateAccount: this.$route.params.id
            },
            actionList: [],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            }
        };
    },
    created() {
        if (this.$route.params.type == 1) {
            this.actionList = [
                { id: "adverIn,adverOut", value: "全部类型" },
                { id: "adverIn", value: "充值" },
                { id: "adverOut", value: "提现" }
            ];
            this.filter.action = "adverIn,adverOut";
        } else {
            this.actionList = [
                { id: "rtbProfit,pdbProfit", value: "全部类型" },
                { id: "rtbProfit", value: "竞价交易利润" },
                { id: "pdbProfit", value: "保价保量利润" }
            ];
            this.filter.action = "rtbProfit,pdbProfit";
        }

        this.getList();
    },
    methods: {
        getList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/advertiser/transaction",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                this.list = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
            });
        },
        download() {
            var data = {
                page: "1",
                size: "99999",
                sort: ["cTime,1"],
                filter: this.filter
            };
            this.ajax({
                url: "/dsp/advertiser/transaction",
                load: true,
                data: data
            }).then(res => {
                var arr = res.data.data || [];
                var actions = {
                    rtbProfit: "竞价交易利润",
                    pdbProfit: "保价保量利润",
                    adverIn: "充值",
                    adverOut: "提现"
                };
                arr.forEach(function(v) {
                    v.action = actions[v.action];
                });
                // 获得列表
                exportCsv(
                    {
                        title: [
                            "提取时间",
                            "广告主ID",
                            "广告主名称",
                            "类型",
                            "金额"
                        ],
                        titleForKey: [
                            "cTime",
                            "accountID",
                            "accountName",
                            "action",
                            "money"
                        ],
                        data: arr
                    },
                    "交易详情.csv"
                );
            });
        }
    }
};
</script>
<style lang="less">
</style>
