<template>
    <div class="nav-tool">
        <div class="logo" :style="{'background':'url('+oem.staticLogo+') no-repeat center'}"></div>
        <span class="nav-name">{{name}}</span>
        <ul class="nav-list" v-if="navList.length > 0">
            <router-link tag="li" v-for="item in navList" :key="item.name" :to="item.to">
                <a>{{item.name}}</a>
                <i class="icon fa fa-caret-up"></i>
            </router-link>
        </ul>
        <div class="fr">
            <div class="user-info">
                <div class="user-avatar">
                    <i class="icon fa fa-user"></i>
                </div>
                <div class="fl">
                    <p class="login-name">{{userInfo.loginName}}</p>
                    <p>{{userInfo.name}}</p>
                </div>
            </div>
            <div class="logout" @click="logout()">
                <i class="icon fa fa-sign-out"></i>退出
            </div>
        </div>
    </div>
</template>
<script>
require("@/common/css/font.css");

export default {
    props: {
        navList: {
            type: Array,
            default() {
                return []
            }
        },
        name: String,
        userInfo: Object,
        logoutType: String,
    },
    data() {
        return {
            oem: {},
        }
    },
    created() {
        this.oem = {
            url: this.$store.state.common.oem.url || "", //自有域名
            background:
                this.$store.state.common.oem.background ||
                '',
                // "http://cdn.fds.api.xiaomi.com/b2c-bbs/cn/attachment/58c0b912a185289740281d0ce02c210b.jpg", // 登陆页面背景图片
            loginLogo:
                this.$store.state.common.oem.loginLogo ||
                '', //登陆页面Logo地址
            staticLogo:
                this.$store.state.common.oem.staticLogo || require("@/common/img/logo.png"), //导航栏Logo地址
            sdkLogo: this.$store.state.common.oem.sdkLogo || "", //SDK Logo地址
            iconUrl: this.$store.state.common.oem.iconUrl || "", //角标图片地址
            title: this.$store.state.common.oem.title || "投放端", //所有oem文字信息
            icp: this.$store.state.common.oem.icp || "",
            copyright: this.$store.state.common.oem.copyright || "", //版权信息
            // dspTitle: data.title || "Adhub运营后台", //dsp端title

            adLogo: this.$store.state.common.oem.adLogo || "",
            adLogoExt: this.$store.state.common.oem.adLogoExt || "",
            adLogoUrl: this.$store.state.common.oem.adLogoUrl || "",
            adLabel: this.$store.state.common.oem.adLabel || ""
        };
    },
    methods: {
        logout() {
            if( this.logoutType == "true" ){
                window.close()
                return
            }
            this.$ajax({
                url: '/dsp/user/logout',
                data: {},
                load: true
            }).then(res => {
                location.href = "./login.html";
            })
        }
    }
};
</script>
<style lang="less">
.nav-tool {
    height: 70px;
    width: 100%;
    color: #fff;
    background-color: #313446;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    .logo {
        float: left;
        width: 172px;
        height: 34px;
        margin-top: 18px;
        // background: url("~@/common/img/nav-logo.png") no-repeat center;
        background-size: contain;
        margin-left: 30px;
        margin-right: 18px;
    }
    .nav-name {
        float: left;
        height: 30px;
        margin-top: 20px;
        line-height: 30px;
        border-left: 1px solid #aab0d2;
        padding-left: 18px;
        color: #d9ebff;
        font-size: 22px;
        margin-right: 110px;
    }
    .nav-list {
        line-height: 70px;
        li {
            float: left;
            position: relative;
            margin-right: 110px;
            font-size: 16px;
            a {
                color: #a3a9c8;
            }
            i {
                color: #fff;
                position: absolute;
                bottom: 0;
                left: 50%;
                margin-left: -8px;
                font-size: 16px;
                display: none;
            }
        }
        li:last-child {
            margin-right: 0;
        }
        li.active {
            a {
                color: #fff;
            }
            i {
                display: block;
            }
        }
    }
    .user-info {
        width: 220px;
        margin-top: 16px;
        float: left;
        .user-avatar {
            float: left;
            width: 38px;
            height: 38px;
            background-color: #b0b0b0;
            line-height: 38px;
            text-align: center;
            font-size: 24px;
            margin-right: 14px;
            border-radius: 50%;
        }
        p {
            font-size: 12px;
        }
        p.login-name {
            font-size: 14px;
        }
    }
    .logout {
        float: left;
        padding: 0 40px;
        height: 20px;
        margin-top: 25px;
        line-height: 24px;
        font-size: 14px;
        cursor: pointer;
        border-left: 1px solid #aab0d2;
        i {
            margin-right: 6px;
        }
    }
}
</style>
