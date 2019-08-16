<template>
    <div class="page reward-page">
        <h1 class="page-title">
            奖励金账户
            <dsp-button class="fr btn dsp-btn btn-blue" @click="showReward()">新增奖励</dsp-button>
        </h1>
        <div class="content">
            <ul class="finance-list">
                <li>
                    <p class="finance-title">
                        <i></i>累计奖励(元)
                    </p>
                    <p class="finance-number">{{countData.total | number(2)}}</p>
                </li>
                <li>
                    <p class="finance-title">
                        <i></i>剩余有效奖励(元)
                    </p>
                    <p class="finance-number">{{countData.balance | number(2)}}</p>
                </li>
                <li>
                    <p class="finance-title">
                        <i></i>累计使用(元)
                    </p>
                    <p class="finance-number">{{countData.used | number(2)}}</p>
                </li>
            </ul>
        </div>

        <div class="table content">
            <div class="table-top">
                <p class="table-title">账户列表</p>
                <div class="table-filter">
                    <search @search="search" placeholder="公司名称"></search>
                    <select-data sTime=" " eTime=" " @select="selectDate"></select-data>
                    <m-select title="奖励金类型" :list="typeList" @change="selectType"></m-select>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>公司名称</th>
                        <th>开始时间</th>
                        <th>结束时间</th>
                        <th>创建时间</th>
                        <th>类型</th>
                        <th>金额</th>
                        <th>剩余金额</th>
                        <th>备注说明</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in list" :key="index">
                        <td>{{item.id}}</td>
                        <td>{{item.orgName}}</td>
                        <td>{{item.beginTime}}</td>
                        <td>{{item.endTime}}</td>
                        <td>{{item.cTime}}</td>
                        <td>{{item.category}}</td>
                        <td>{{item.money}}</td>
                        <td>{{item.balance}}</td>
                        <td>{{item.comment}}</td>
                        <td>
                            <dsp-button
                                type="primary"
                                plain
                                round
                                size="mini"
                                @click="showReward(item)"
                            >使用奖励金</dsp-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <page :page="pageObj" @change="getList"></page>
        </div>

        <el-dialog title="新增奖励金" :visible.sync="addDialog" width="600px">
            <el-form label-width="150px">
                <el-form-item label="公司名称：" class="is-required">
                    <m-select title="请选择公司名称" value-name="name" :list="orgList" @change="selectOrg"></m-select>
                </el-form-item>
                <el-form-item label="奖励金类型：" class="is-required">
                    <m-select title="请选择奖励金类型" :list="typeList" @change="selectType"></m-select>
                </el-form-item>
                <el-form-item label="奖励金金额：" class="is-required">
                    <el-input v-model="addData.money"></el-input>
                </el-form-item>
                <el-form-item label="时间：" class="is-required">
                    <select-data @select="selectDate"></select-data>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="addData.comment"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="addReward">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="使用奖励金" :visible.sync="useDialog" width="600px">
            <el-form label-width="150px">
                <el-form-item label="公司名称：" class="is-required">{{useData.agencyName}}</el-form-item>
                <el-form-item label="奖励金金额：" class="is-required">{{useData.countMoney}}</el-form-item>
                <el-form-item label="可用金额：" class="is-required">{{useData.canUseMoney}}</el-form-item>
                <el-form-item label="使用金额：" class="is-required">
                    <el-input v-model="useData.money"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="useData.comment"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="useDialog = false">取 消</el-button>
                <el-button type="primary" @click="useReward">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getNowFormatDate } from "@/common/js/utils";
export default {
    data() {
        return {
            addDialog: false,
            useDialog: false,
            list: [],
            orgList: [],
            filter: {
                beginTime:'',
                endTime:'',
            },
            typeList: [
                { id: 1, value: "充值奖励" },
                { id: 2, value: "消费奖励" },
                { id: 3, value: "消费抵扣" }
            ],
            dialogTypeList: [
                { id: 1, value: "充值奖励" },
                { id: 2, value: "消费奖励" }
            ],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            countData: {},
            useData: {},
            addData: {}
        };
    },
    mounted() {
        this.getList();
        this.getCount();
        this.getOrgList();
    },
    methods: {
        search(val) {
            this.pageObj.currentPage = "1";
            this.filter.name = val;
            this.getList();
            this.getCount();
        },
        selectDate(val) {
            if(this.addDialog) {
                this.addData.beginTime = val.start;
                this.addData.endTime = val.end;
            } else {
                this.filter.beginTime = val.start + " 00:00:00";
                this.filter.endTime = val.end + " 23:59:59";
                this.getList();
                this.getCount();
            }
            
        },
        selectOrg(item) {
            this.addData.agencyID = item.id;
        },
        selectType(item) {
            if(this.addDialog) {
                this.addData.category = item.name;
            } else {
                this.filter.category = item.name;
                this.getList();
                this.getCount();
            }
        },
        showReward(item) {
            if (item) {
                this.useData = {
                    agencyName: item.orgName,
                    countMoney: item.money,
                    canUseMoney: item.balance,
                    id: item.id,
                    agencyID: item.agencyID
                };
                this.useDialog = true;
            } else {
                this.addData = {};
                this.addDialog = true;
            }
        },
        getList() {
            this.$ajax({
                url: "/dsp/reward/list",
                data: {
                    eTime: this.eTime,
                    sTime: this.sTime,
                    page: this.pageObj.currentPage + "",
                    size: this.pageObj.size + "",
                    sort: ["cTime,1"],
                    filter: this.filter
                }
            }).then(res => {
                this.list = res.data.data;

                this.pageObj.size = res.data.size;
                this.pageObj.total = res.data.total;
            });
        },
        getOrgList() {
            this.$ajax({
                url: "/dsp/agency/list",
                data: {
                    filter: this.filter,
                    page: "1",
                    size: "99999"
                }
            }).then(res => {
                this.orgList = res.data.data;
            });
        },
        addReward() {
            this.$ajax({
                url: "/dsp/reward/add",
                data: {
                    data: this.addData
                }
            }).then(res => {
                this.$message.success("新增奖励金成功");
                this.addDialog = false;
                this.getList();
                this.getCount();
            });
        },
        useReward() {
            this.$ajax({
                url: "/dsp/reward/use",
                data: {
                    data: this.useData
                }
            }).then(res => {
                this.$message.success("使用奖励金成功。");
                this.useDialog = false;
                this.getList();
                this.getCount();
            });
        },
        getCount() {
            this.$ajax({
                url: "/dsp/reward/rpt",
                data: {
                    orgName: this.filter.orgName
                }
            }).then(res => {
                this.countData = res.data;
            });
        }
    }
};
</script>
<style lang="less">
.finance-list {
    padding: 20px;
    width: 100%;
    display: flex;
    li {
        width: 300px;
        height: 80px;
        padding: 15px 20px;
        margin-right: 20px;
        background: #fff;
        color: #596679;
        .finance-title {
            font-size: 18px;
            background-size: 20px 20px;
            i {
                width: 20px;
                height: 20px;
                margin-right: 10px;
                display: inline-block;
                vertical-align: middle;
                background: url("~agent@/assets/img/icon_price_02.png")
                    no-repeat center;
            }
        }
        .finance-number {
            font-size: 24px;
        }
    }
    li:nth-child(2) .finance-title i {
        background: url("~agent@/assets/img/icon_price_01.png");
    }
    li:nth-child(3) .finance-title i {
        background: url("~agent@/assets/img/icon_price_03.png");
    }
}
</style>
