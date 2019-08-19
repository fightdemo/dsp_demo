<template>
    <div id="admin_diag_activity">
        <p class="page-title">活动历史操作</p>
        <div class="filter cl">
            <div class="fl">
                <admin-date @select="selectDate"></admin-date>
            </div>
            <div class="fr">
                <admin-search @search="search"></admin-search>
            </div>
        </div>
        <div class="tipInfo" v-show="!isShow">
            <div>
                <i class="tipIcon el-icon-warning"></i>
                <span class="tiptext">请先输入您要查看的活动ID</span>
            </div>
        </div>
        <div class="table content mt20" v-show="isShow" style="overflow-x:auto;">
            <div class="table-top cl">
                <h3 class="table-title icon">操作记录</h3>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th>变更时间</th>
                        <th>活动ID</th>
                        <th>活动名称</th>
                        <th>代理商</th>
                        <th>广告主</th>
                        <th>行业名称</th>
                        <th>日预算</th>
                        <th>总预算</th>
                        <th>完成状态</th>
                        <th>开始时间</th>
                        <th>结束时间</th>
                        <th>限制曝光量</th>
                        <th>控制单位</th>
                        <th>频次限制</th>
                        <th>循环周期</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in tableList" :key="index">
                        <td>{{item.changeTime}}</td>
                        <td>{{item.activityID}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.agencyName}}</td>
                        <td>{{item.advertiserName}}</td>
                        <td>{{item.industryName}}</td>
                        <td>{{item.dayBudget}}</td>
                        <td>{{item.totalBudget}}</td>
                        <td>{{item.state}}</td>
                        <td>{{item.startTime}}</td>
                        <td>{{item.endTime}}</td>
                        <td>{{item.limitView}}</td>
                        <td>{{item.frequencyControl}}</td>
                        <td>{{item.frequency}}</td>
                        <td>{{item.frequencyUnit}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <admin-page :page="pageObj" @change="getList" v-show="isShow"></admin-page>
    </div>
</template>
<script>
import adminDate from "@/common/components/select-data";
import adminSearch from "@/common/components/search";
import { getNowFormatDate } from "@/common/js/utils";
import Page from "@/common/components/page";
export default {
    data() {
        return {
            sTime: getNowFormatDate() + " " + "00:00:00",
            eTime: getNowFormatDate() + " " + "23:59:59",
            filter: {},
            tableList: [],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            isShow: false
        };
    },
    mounted() {},
    methods: {
        selectDate(val) {
            this.dataGrain = val.start == val.end ? "hour" : "day";
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.getList();
        },
        search(val) {
            this.pageObj.currentPage = "1";
            this.filter.activityID = val;
            if (this.filter.activityID) {
                this.isShow = true;
                this.getList();
            } else {
                this.isShow = false;
            }
        },
        getList() {
            this.$ajax({
                url: "/dsp/activity/history/list",
                data: {
                    page: this.pageObj.currentPage + "",
                    size: this.pageObj.size + "",
                    filter: this.filter,
                    sort: ["changeTime,1"],
                    sTime: this.sTime,
                    eTime: this.eTime
                }
            }).then(res => {
                this.tableList = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
            });
        }
    },
    components: {
        adminDate: adminDate,
        adminSearch: adminSearch,
        adminPage: Page
    }
};
</script>
<style lang="less" scoped>
.tipInfo {
    text-align: center;
    line-height: 300px;

    .tipIcon {
        display: inline-block;
        padding-right: 10px;
        font-size: 25px;
    }
    .tiptext {
        font-size: 25px;
    }
}
</style>