<template>
    <div>
        <div class="page-title">员工用户管理</div>
        <div class="table content">
            <div class="table-top">
                <p class="table-title">用户列表</p>
                <div class="table-filter">
                    <search @search="search" placeholder="用户名"></search>
                    <dsp-button type="success" @click="showUser()">添加新用户</dsp-button>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th v-if="permission.act[25]">状态</th>
                        <th>登录名</th>
                        <th>用户名</th>
                        <th v-if="permission.act[25]">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in list" :key="item.id">
                        <td v-if="permission.act[25]">
                            <m-switch :isCheck="item.state == 10" @change="setStatus($event,item)"></m-switch>
                        </td>
                        <td>{{item.loginName}}</td>
                        <td>{{item.name}}</td>
                        <td v-if="permission.act[25]">
                            <dsp-button @click="showUser(item)">编辑</dsp-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <page :page="pageObj" @change="getList"></page>
        </div>
        <!-- 用户弹窗 -->
        <el-dialog :title="user.id?'编辑员工':'新增员工'" :visible.sync="userDialogVisible" width="600px">
            <el-form ref="form" :model="user" label-width="120px">
                <el-form-item label="登录名" v-show="!user.id" class="is-required">
                    <el-input v-model="user.loginName"></el-input>
                </el-form-item>
                <el-form-item label="密码" class="is-required">
                    <el-input autocomplete="new-password" v-model="user.password"></el-input>
                </el-form-item>
                <el-form-item label="用户名" v-show="!user.id" class="is-required">
                    <el-input v-model="user.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号" class="is-required">
                    <el-input v-model="user.telephone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="user.email"></el-input>
                </el-form-item>
                <el-form-item label="角色" class="is-required">
                    <m-select
                        :title="user.roleName"
                        valueName="name"
                        :list="roleList"
                        @change="selectRole"
                    ></m-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateUser()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

export default {
    data() {
        return {
            list: [],
            roleList:[],
            filter: {},
            user:{},
            userDialogVisible: false,
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.common.userInfo;
        },
    },
    created() {
        this.filter.orgID = this.userInfo.orgID;
        this.getList();
        this.getRoleList();
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
                url: "/dsp/pri/user/list",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                this.list = res.data.data;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
            });
        },
        showUser(item) {
            item = item || {};
            var user = JSON.parse(JSON.stringify(item));
            user.roleName = "请绑定角色";
            if (user.roleID) {
                this.roleList.forEach(v => {
                    if (v.id == user.roleID) {
                        user.roleName = v.name;
                        return false;
                    }
                });
            }
            this.user = user;
            this.userDialogVisible = true;
        },
        search(value) {
            this.filter.name = value;
            this.pageObj.currentPage = 1;
            this.getList();
        },
        // 开启/关闭广告主
        setStatus(value, item) {
            var user = {
                id: item.id,
                state: value ? "10" : "30"
            };
            this.$ajax({
                url: "/dsp/pri/user/modify",
                load: true,
                data: {
                    data: user
                }
            }).then(() => {
                item.state = item.state == "10" ? "20" : "10";
            });
        },

        // 更新user
        updateUser() {
            var user = this.user;
            if (!user.loginName) return this.$message.error("请输入登录名");
            if (!user.password) return this.$message.error("请输入密码");
            if (!user.name) return this.$message.error("请输入用户名");
            if (!user.telephone) return this.$message.error("请输入手机号");
            if (!user.roleID) return this.$message.error("请绑定角色");

            // id存在调用编辑 不存在调用添加
            var url = user.id ? "/dsp/pri/user/modify" : "/dsp/pri/user/add";

            this.$ajax({
                url: url,
                load: true,
                data: {
                    data: user
                }
            }).then(res => {
                this.$message.success("操作成功");
                this.userDialogVisible = false;
                this.getList();
            });
        },

        // 选择角色
        selectRole(item) {
            this.user.roleID = item.id;
        },

        // 删除账号
        deleteUser(id) {
            this.$confirm("是否确定删除？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$ajax({
                        url: "/dsp/agency/finance/transfer",
                        load: true,
                        data: {
                            id: id
                        }
                    }).then(() => {
                        this.$message.succes("删除成功");
                        this.getList();
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        getRoleList() {
            var data = {
                page: "1",
                size: "99999",
                filter: {
                    roleType: "0"
                },
                sort: ["cTime,1"],
            };
            this.$ajax({
                url: "/dsp/pri/role/list",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                var arr = res.data.data;
                // 移除直客角色
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].name == "代理商管理员(直客)") {
                        arr.splice(i, 1);
                        break;
                    }
                }
                this.roleList = arr;
            });
        }
    }
};
</script>
<style lang="less">
</style>
