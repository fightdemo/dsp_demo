<template>
    <div>
        <div class="page-title">广告主列表</div>
        <div class="table content">
            <div class="table-top">
                <p class="table-title">广告主列表</p>
                <div class="table-filter" v-if="permission.act[94]">
                    <search placeholder="请输入公司名称或ID" @search="search"></search>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th v-if="permission.act[19]">账户状态</th>
                        <th>广告主ID</th>
                        <th>账户名称</th>
                        <th>公司名称</th>
                        <th>现金余额（元）</th>
                        <th v-if="permission.act[20]">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in list" :key="item.id">
                        <td v-if="permission.act[19]">
                            <m-switch :isCheck="item.state == 10" @change="change($event,item)"></m-switch>
                        </td>
                        <td>{{item.id}}</td>
                        <td>{{item.loginName}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.balance}}</td>
                        <td v-if="permission.act[20]">
                            <router-link target="_blank" :to="{name:'transfer',params:{advID:item.id}}">进入账户</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
            <page :page="pageObj" @change="getList"></page>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            list: [],
            filter: {},
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            }
        };
    },
    methods: {
        search(value) {
            this.filter.name = value;
            this.pageObj.currentPage = 1;
            this.getList();
        },
        getList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size+"",
                filter: this.filter,
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/advertiser/putin/list",
                data: data,
                load: true
            }).then(res => {
                // 获得列表
                this.list = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
            });
        },
        change(value, item) {
            var adv = {
                id: item.id,
                state: value ? "10" : "20"
            };
            this.$ajax({
                url: "/dsp/advertiser/modify",
                load: true,
                data: {
                    data: adv
                }
            }).then(() => {
                item.state = item.state == "10" ? "20" : "10";
            });
        },
        gotoAdv(id) {
            this.$ajax({
                url: "/dsp/agency/chargeAdv",
                data: {
                    advertiserID: id
                },
                load: true
            }).then(res => {
                // 存下adv的token
                localStorage["advToken" + id] = res.data;
                // 存下当前代理商id
                localStorage["advOrgID" + id] = this.$route.params.agentID;
                window.open("./adv.html#/1/" + id + "/index");
            });
        }
    },
    created() {
        this.getList();
    }
};
</script>
<style lang="less">
</style>
