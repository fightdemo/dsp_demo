<template>
    <div id="admin_diag_account">
        <p class="page-title">账户历史操作</p>
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
                <span class="tiptext">请先输入您要查看的账户ID</span>
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
                        <th>公司ID</th>
                        <th>公司名称</th>
                        <th>联系方式</th>
                        <th>品牌</th>
                        <th>公司地址</th>
                        <th>联系人</th>
                        <th>类型</th>
                        <th>父级ID</th>
                        <th>状态</th>
                        <th>代理商分类</th>
                        <th>审核状态</th>
                        <th>公司网址</th>
                        <th>公司简称</th>
                        <th>行业ID</th>
                        <th>溢价比例</th>
                        <th>是否是预提利润</th>
                        <th>是否开启固定出价</th>
                        <th>广告主类型</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in tableList" :key="index">
                        <td>{{item.changeTime}}</td>
                        <td>{{item.orgID}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.telephone}}</td>
                        <td>{{item.brand}}</td>
                        <td>{{item.address}}</td>
                        <td>{{item.contacts}}</td>
                        <td>{{item.type}}</td>
                        <td>{{item.parentID}}</td>
                        <td>{{item.state}}</td>
                        <td>{{item.isDirect=="1"?"直客代理商":"普通代理商"}}</td>
                        <td>{{item.auditState}}</td>
                        <td>{{item.wwwUrl}}</td>
                        <td>{{item.ShortName}}</td>
                        <td>{{item.industry}}</td>
                        <td>{{item.premium}}</td>
                        <td>{{item.advanceProfit}}</td>
                        <td>{{item.fixedPrice}}</td>
                        <td>{{item.advType}}</td>
                    </tr>
                </tbody>
            </table>
            <admin-page :page="pageObj" @change="getList"></admin-page>
        </div>
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
            this.filter.orgID = val;
            if (this.filter.orgID) {
                this.isShow = true;
                this.getList();
            } else {
                this.isShow = false;
            }
        },
        getList() {
            this.$ajax({
                url: "/dsp/account/history/list",
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