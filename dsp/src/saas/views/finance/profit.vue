<template>
    <div class="profit-page">
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
                        <i></i>剩余利润（元）
                    </p>
                    <p
                        class="finance-number"
                    >{{finance.rptRTBProfit - finance.rtbProfit | number(2)}}</p>
                </li>
            </ul>
        </div>

        <div class="table content">
            <div class="table-top">
                <p class="table-title">财务信息报表
                    <small class="text-danger">利润为截至前一天0点所获取金额，当日利润次日0点更新</small>
                </p>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th>广告主ID</th>
                        <th>广告主</th>
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
                                :to="{name:'finance.detail',params:{id:item.agencyID,type:2}}"
                            >查看记录</router-link>&nbsp;&nbsp;&nbsp;&nbsp;
                            <a
                                v-if="permission.act[76]"
                                href="javascript:;"
                                @click="showMask(item,'rtb')"
                            >提取竞价交易利润</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <page :page="pageObj" @change="getList"></page>
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
export default {
    data() {
        return {
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
                sort: ["cTime,1"]
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
            });
        },
        showMask(item, type) {
            this.profits = {
                id: item.agencyID,
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
                        agencyID: profitsObj.id,
                        action: profitsObj.type, //操作转出
                        money: profitsObj.value, //金额
                        comment: ""
                    };
                    return this.$ajax({
                        url: "/dsp/saas/dsp/finance/profit",
                        load: true,
                        data: {
                            data: data
                        }
                    });
                })
                .then(res => {
                    this.dialogVisible = false;
                    this.$message.success("操作成功");
                    this.getList();
                    this.$store.dispatch("getBalance");
                });
        }
    }
};
</script>
<style lang="less">
.profit-page {
    .money {
        color: #f56c6c;
    }
}
</style>
