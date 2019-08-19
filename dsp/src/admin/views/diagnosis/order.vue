<template>
    <div id="admin_diag_order">
        <p class="page-title">订单历史操作</p>
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
                <span class="tiptext">请先输入您要查看的订单ID</span>
            </div>
        </div>
        <div class="table content mt20" v-show="isShow" style="overflow-x:auto;">
            <div class="table-top cl">
                <h3 class="table-title icon">操作记录</h3>
            </div>
            <table class="table-box" style="width:2500px">
                <thead>
                    <tr>
                        <th>变更时间</th>
                        <th>订单ID</th>
                        <th>订单名称</th>
                        <th>代理商</th>
                        <th>广告主</th>
                        <th>活动ID</th>
                        <th>系统</th>
                        <th>创意形式</th>
                        <th>订单状态</th>
                        <th>计费方式</th>
                        <th>订单类型</th>
                        <th>竞价</th>
                        <th>订单优先级</th>
                        <th>利润</th>
                        <th>交互方式</th>
                        <th>加速单位</th>
                        <th>请求限制/天（次）</th>
                        <th>请求限制/时（次）</th>
                        <th>预算控制</th>
                        <th>控制模式</th>
                        <th>速度</th>
                        <th>加速价格</th>
                        <th>曝光量控制</th>
                        <th>开始时间</th>
                        <th>结束时间</th>
                        <th>检测站点</th>
                        <th>检测转化点</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in tableList" :key="index">
                        <td>{{item.changeTime}}</td>
                        <td>{{item.orderID}}</td>
                        <td>{{item.name}}</td>

                        <!-- 代理商名字 -->
                        <td>{{item.agencyName}}</td>
                        <!-- 广告主名字 -->
                        <td>{{item.advertiserName}}</td>
                        <td>{{item.activityID}}</td>
                        <td>{{item.platform}}</td>
                        <td>{{item.creativeType}}</td>
                        <td>{{item.state}}</td>
                        <td>{{item.chargeMode}}</td>
                        <td>{{item.type}}</td>
                        <td>{{item.bidPrice}}</td>
                        <td>{{item.priority}}</td>
                        <td>{{item.profit}}</td>
                        <td>{{item.interactionType}}</td>
                        <td>{{item.speedUnit}}</td>
                        <td>{{item.dailyFrequentLimit}}</td>
                        <td>{{item.hourlyFrequentLimit}}</td>
                        <td>{{item.orderBudget}}</td>
                        <td>{{item.controlMode}}</td>
                        <td>{{item.speedUp}}</td>
                        <td>{{item.limitPrice}}</td>
                        <td>{{item.limitView}}</td>
                        <td>{{item.startTime}}</td>
                        <td>{{item.endTime}}</td>
                        <td>{{item.monitorSite}}</td>
                        <td>{{item.monitorConvert}}</td>
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
            this.filter.orderID = val;
            if (this.filter.orderID) {
                this.isShow = true;
                this.getList();
            } else {
                this.isShow = false;
            }
        },
        getList() {
            this.$ajax({
                url: "/dsp/order/history/list",
                data: {
                    page: this.pageObj.currentPage + "",
                    size: this.pageObj.size + "",
                    filter: this.filter,
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