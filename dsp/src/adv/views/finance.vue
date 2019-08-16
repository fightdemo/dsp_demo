<template>
    <div>
        <div class="page-title">财务管理</div>

        <div class="table content">
            <div class="table-top">
                <h3 class="table-title">财务列表({{pageObj.total}})</h3>
                <div class="table-filter">
                    <select-data @select="selectDate"></select-data>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th>交易类型</th>
                        <th>操作时间</th>
                        <th>金额(元)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in list" :key="index">
                        <td>{{item.action == 'adverIn'?"充值":"转出"}}</td>
                        <td>{{item.cTime}}</td>
                        <td>{{item.money}}</td>
                    </tr>
                </tbody>
            </table>
            <page :page="pageObj" @change="getList"></page>
        </div>
    </div>
</template>
<script>
import { getNowFormatDate, exportCsv } from "@/common/js/utils";
export default {
    data() {
        return {
            list: [],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter: {
                relateAccount: this.$route.params.advID,
                action: "adverIn,adverOut"
            },
            sTime: getNowFormatDate() + " 00:00:00",
            eTime: getNowFormatDate() + " 23:59:59"
        };
    },
    created() {
        this.getList();
    },
    methods: {
        // 选择时间
        selectDate(val) {
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
            this.pageObj.currentPage = "1";
            this.getList();
        },
        getList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sTime: this.sTime,
                eTime: this.eTime,
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/advertiser/transaction",
                data: data,
                load: true
            }).then(res => {
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
