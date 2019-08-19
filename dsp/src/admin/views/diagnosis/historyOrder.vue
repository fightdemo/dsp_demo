<template>
    <div id="admin_diag_ho">
        <p class="page-title">订单定向操作记录</p>
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
            <table class="table-box" style="width:4000px">
                <thead>
                    <tr>
                        <th>变更时间</th>
                        <th>订单ID</th>
                        <th>节假日控制</th>
                        <th>投放时间区间定向</th>
                        <th>投放时间区间定向排除</th>
                        <th>收入定向</th>
                        <th>收入定向排除</th>
                        <th>性别定向</th>
                        <th>性别定向排除</th>
                        <th>自定义标签组合</th>
                        <th>自定义标签排除</th>
                        <th>app定向</th>
                        <th>app定向排除</th>
                        <th>优选APP</th>
                        <th>来源定向</th>
                        <th>来源定向排除</th>
                        <th>年龄定向</th>
                        <th>年龄定向排除</th>
                        <th>手机品牌型号定向</th>
                        <th>手机品牌型号排除</th>
                        <th>用户地理位置</th>
                        <th>排除的用户地理位置</th>
                        <th>投放区域</th>
                        <th>系统版本</th>
                        <th>排除的系统版本</th>
                        <th>运营商标识</th>
                        <th>联网方式</th>
                        <th>被屏蔽的广告主名称</th>
                        <th>屏蔽的行业ＩＤ</th>
                        <th>广告位定向</th>
                        <th>广告位定向排除</th>
                        <th>设备类型</th>
                        <th>设备价格区间</th>
                        <th>创建时间</th>
                        <th>最后修改时间</th>
                        <th>设备IP</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in tableList" :key="index">
                        <td>{{item.changeTime}}</td>
                        <td>{{item.orderID}}</td>
                        <td>{{item.holiday}}</td>
                        <td>{{item.deliverTimeIn}}</td>
                        <td>{{item.deliverTimeOut}}</td>
                        <td>{{item.earningIn}}</td>
                        <td>{{item.earningOut}}</td>
                        <td>{{item.genderIn}}</td>
                        <td>{{item.genderOut}}</td>
                        <td>{{item.tagIn}}</td>
                        <td>{{item.tagOut}}</td>
                        <td>{{item.appTypeIn}}</td>
                        <td>{{item.appTypeOut}}</td>
                        <td>{{item.optimizeApp}}</td>
                        <td>{{item.sourceIn}}</td>
                        <td>{{item.sourceOut}}</td>
                        <td>{{item.ageIn}}</td>
                        <td>{{item.ageOut}}</td>
                        <td>{{item.phoneBrandIn}}</td>
                        <td>{{item.phoneBrandOut}}</td>
                        <td>{{item.userLocationIn}}</td>
                        <td>{{item.userLocationOut}}</td>
                        <td>{{item.locationType}}</td>
                        <td>{{item.osVersionIn}}</td>
                        <td>{{item.osVersionOut}}</td>
                        <td>{{item.ISP}}</td>
                        <td>{{item.net}}</td>
                        <td>{{item.forbidAdver}}</td>
                        <td>{{item.forbidIndustry}}</td>
                        <td>{{item.spaceIDIn}}</td>
                        <td>{{item.spaceIDOut}}</td>
                        <td>{{item.devices}}</td>
                        <td>{{item.devicePrice}}</td>
                        <td>{{item.cTime}}</td>
                        <td>{{item.mTime}}</td>
                        <td>{{item.IP}}</td>
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
    data(){
        return{
            val: '',
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
        }
    },
    mounted(){
        if(this.$route.query.ID) {
            this.val = this.$route.query.ID
            this.search()
        }
    },
    mounted() {},
    methods: {
        selectDate(val) {
            this.dataGrain = val.start == val.end ? "hour" : "day";
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.getList();
        },
        search(val){
            this.pageObj.currentPage = "1";
            this.filter.orderID = this.$route.query.ID || val;
            if (this.filter.orderID) {
                this.isShow = true;
                this.getList();
            } else {
                this.isShow = false;
            }
        },
        getList() {
            this.$ajax({
                url: "/dsp/order/direct/history/list",
                data: {
                    page: this.pageObj.currentPage + "",
                    size: this.pageObj.size + "",
                    filter: this.filter,
                    sTime: this.sTime,
                    eTime: this.eTime
                }
            }).then(res=>{
                if(!res.data.data.length) {
                    this.$message.error("没有查询到您要搜索的订单");
                }
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