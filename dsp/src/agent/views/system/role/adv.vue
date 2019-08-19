<template>
    <div>
        <div class="table content">
            <div class="table-top">
                <p class="table-title">用户列表</p>
                <div class="table-filter">
                    <search @search="search" placeholder="角色名"></search>
                    <dsp-button v-if="permission.act[37]" type="success" @click="addUser()">添加新角色</dsp-button>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th>角色名</th>
                        <th>角色备注</th>
                        <th v-if="permission.act[38]">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item,index) in list"
                        :key="index"
                        v-show="item.name != '代理商管理员(直客)'"
                    >
                        <td>{{item.name}}</td>
                        <td>{{item.description}}</td>
                        <td v-if="permission.act[38]">
                            <dsp-button v-if="item.template != 1" @click="addUser(item.id)">编辑</dsp-button>
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
            user: {},
            filter: {
                roleType: "1"
            },
            userDialogVisible: false,
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            }
        };
    },
    computed: {
        permission() {
            return this.$store.state.common.permission;
        }
    },
    created() {
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
                url: "/dsp/pri/role/list",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                this.list = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
            });
        },
        search(value) {
            this.filter.name = value;
            this.pageObj.currentPage = 1;
            this.getList();
        },
        addUser(id) {
            this.$router.push({
                name: "system.permission",
                params: { type: "advertiser", id: id }
            });
        }
    }
};
</script>
<style lang="less">
</style>
