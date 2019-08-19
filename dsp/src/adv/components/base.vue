<template>
    <div class="baseInfo-page content">
        <div class="form">
            <el-form
                ref="info"
                label-position="left"
                :model="info"
                label-width="110px"
                v-show="!edit"
            >
                <el-form-item label="账户名称：">{{info.loginName}}</el-form-item>
                <el-form-item label="公司名称：">{{info.name}}</el-form-item>
                <el-form-item label="公司网址：">{{info.wwwUrl}}</el-form-item>
                <el-form-item label="公司地址：">{{info.address}}</el-form-item>
                <el-form-item label="联系人：">{{info.contacts}}</el-form-item>
                <el-form-item label="手机号码：">{{info.telephone}}</el-form-item>
                <div class="hr"></div>
                <el-form-item label="账户密码：">
                    {{on?info.password:'*********'}}
                    <i
                        class="icon-view"
                        @click="on = !on"
                        :class="{on:on}"
                    ></i>
                </el-form-item>
            </el-form>
            <el-form
                ref="editInfo"
                label-position="left"
                :model="editInfo"
                label-width="110px"
                v-show="edit"
            >
                <el-form-item label="账户名称：">{{editInfo.loginName}}</el-form-item>
                <el-form-item label="公司名称：">
                    <el-input v-model="editInfo.name"></el-input>
                </el-form-item>
                <el-form-item label="公司网址：">
                    <el-input v-model="editInfo.wwwUrl"></el-input>
                </el-form-item>
                <el-form-item label="公司地址：">
                    <el-input v-model="editInfo.address"></el-input>
                </el-form-item>
                <el-form-item label="联系人：">
                    <el-input v-model="editInfo.contacts"></el-input>
                </el-form-item>
                <el-form-item label="手机号码：">
                    <el-input v-model="editInfo.telephone"></el-input>
                </el-form-item>
                <div class="hr"></div>
                <el-form-item label="账户密码：">
                    <el-input v-model="editInfo.password"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <!-- 广告主和代理商基本信息共用此页  71为广告主编辑权限  22为代理商编辑权限 -->
        <div class="btn-group" v-if="canEdit">
            <dsp-button v-show="!edit" type="primary" @click="edit = !edit">编辑信息</dsp-button>
            <dsp-button v-show="edit" @click="edit = !edit">取消</dsp-button>
            <dsp-button v-show="edit" type="success" @click="modify">完成编辑</dsp-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            info: {},
            editInfo: {},
            edit: false,
            on: false
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.common.userInfo
        }
    },
    created() {
        this.getBaseInfo();
    },
    methods: {
        getBaseInfo() {
            this.$ajax({
                url: '/dsp/advertiser',
                load: true,
                data: {
                    id: this.id
                }
            }).then((res) => {
                // 获得列表
                this.info = res.data;
                this.editInfo = JSON.parse(JSON.stringify(res.data));
            })
        },
        resetPWD() {
            var pwd = this.pwd;
            if(!pwd.oldPasswd) return this.$message.error("请输入旧密码!");
            if(pwd.newPasswd != pwd.newPasswd2) return this.$message.error("两次密码不一致!");
            this.$ajax({
                url: '/dsp/reset/passwd',
                load:true,
                data: {
                    uid: this.userInfo.UserID+"",
                    oldPasswd: pwd.oldPasswd,
                    newPasswd: pwd.newPasswd,
                }
            }).then(() => {
            })
        },
        modify() {
            var editInfo = this.editInfo,
                domainReg = /^https?:\/\//,
                phoneReg = /^1\d{10}$/;
            if(!domainReg.test(editInfo.wwwUrl)) return this.$message.error("域名格式有误!");
            if(!phoneReg.test(editInfo.telephone)) return this.$message.error("手机号码格式有误!");

            this.$ajax({
                url: '/dsp/advertiser/modify',
                load:true,
                data: {
                    data:{
                        id: editInfo.id,
                        name: editInfo.name,
                        address: editInfo.address,
                        telephone: editInfo.telephone,
                        wwwUrl: editInfo.wwwUrl,
                        contacts: editInfo.contacts,
                        password: editInfo.password,
                    }
                }
            }).then((res) => {
                this.$message.success("修改成功!");
                this.getBaseInfo();
                this.edit = false;
            })
        }
    },
    props: {
        canEdit: Boolean,
        id: String
    }
};
</script>
<style lang="less">
.baseInfo-page {
    .el-input {
        width: 254px;
    }
    .form {
        padding: 40px;
    }
    .btn-group {
        padding: 30px 40px;
        border-top: 1px solid #DCDCDC;
        button {
            width: 160px;
            padding: 15px;
        }
    }
    .icon-view {
        width: 20px;
        height: 16px;
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        margin-left: 18px;
        background: url("~adv@/assets/img/icon-view-off.jpg") no-repeat center;
    }
    .icon-view.on {
        background-image: url("~adv@/assets/img/icon-view-on.jpg");
    }
}
</style>
