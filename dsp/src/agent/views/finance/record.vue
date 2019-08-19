<template>
    <div>
        <div class="page-title">财务记录</div>
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

        <div class="table content">
            <div class="table-top">
                <p class="table-title">账户概况报表</p>
                <div class="table-filter">
                    <select-data @select="selectDate"></select-data>
                    <m-select title="全部类型" :list="typeList" @change="selectType"></m-select>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th>时间</th>
                        <th>交易类型</th>
                        <th>金额（元）</th>
                        <th>操作说明</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in list" :key="index">
                        <td>{{item.cTime}}</td>
                        <td>
                            {{item.action|action}}
                            {{actionList.indexOf(item.action) != -1? '('+item.name+')':''}}
                        </td>
                        <td>{{item.money}}</td>
                        <td>{{item.comment}}</td>
                    </tr>
                </tbody>
            </table>
            <page :page="pageObj" @change="getList"></page>
        </div>
    </div>
</template>
<script>
import { getNowFormatDate } from "@/common/js/utils";

export default {
    filters: {
        action(val) {
            if (!val) return "";
            return {
                'deposit': "平台充值",
                'adverIn': "转入资金",
                'withdraw': "账户退款",
                'adverOut': "转出资金",
                'rtbProfit': "提取利润",
                'pdbProfit': "提取保价保量收入",
                'purchase': "保价保量扣款",
            }[val];
        }
    },
    data() {
        return {
            total: {},
            list: [],
            filter: {},
            typeList: [{value: '全部类型'}, {id: 'deposit', value: '平台充值'}, {id: 'adverIn', value: '转入资金'}, 
                {id: 'withdraw', value: '账户退款'}, {id: 'adverOut', value: '转出资金'}, {id: 'rtbProfit', value: '提取利润'}, 
                {id: 'pdbProfit', value: '提取保价保量收入'},{id:'purchase',value:"保价保量扣款"}
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
        this.getList();
        this.$store.dispatch("getBalance");
    },
    methods: {
        selectType(item) {
            this.filter.action = item.id;
            this.pageObj.currentPage = 1;
            this.getList();
        },
        // 选择时间
        selectDate(val) {
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
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
                url: "/dsp/finance/transaction",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                this.list = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
            });
        }
    }
};
</script>
<style lang="less">
</style>
