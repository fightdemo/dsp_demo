<template>
    <div id="app" :style="{'background-image':'url('+oem.background+')'}">
        <div class="form-box">
            <div class="form-group logo-box">
                <img width="84%" height="100%" :src="oem.loginLogo">
            </div>
            <form id="ldoginForm">
                <div class="form-group">
                    <input
                        type="text"
                        class="form-control user-input"
                        name="Uid"
                        placeholder="请输入用户名..."
                        v-model="uid"
                        @keyup.enter="login()"
                    >
                </div>
                <div class="form-group">
                    <input
                        type="password"
                        class="form-control pwd-input"
                        name="Passwd"
                        placeholder="请输入密码..."
                        v-model="passwd"
                        @keyup.enter="login()"
                    >
                </div>
            </form>
            <button class="btn btn-primary btn-login" @click="login();">立即登录</button>
        </div>
        <div class="copyright">{{oem.copyright}}&nbsp;&nbsp;&nbsp;&nbsp;{{oem.icp}}</div>
    </div>
</template>

<script>
import {
  getQueryString
} from '@/common/js/utils'


export default {
    name: "App",
    data() {
        return {
            oem: {},
            uid: "",
            passwd: "",
            staticToken: "",
            // hostname: "127.0.0.1"
            hostname: location.hostname,
            parentToken: "",
        };
    },
    mounted() {
        this.getOem();
        console.log(this.$store._vm.$data)

        // 根据url参数登录
        var uid = getQueryString("uid");
        var password = getQueryString("password");
        var parentToken = getQueryString("parentToken");
        var staticToken = getQueryString("staticToken");
        if (uid && password && parentToken) {
            uid = Base64.decode(uid)
            password = Base64.decode(password)
            parentToken = Base64.decode(parentToken)
            this.uid = uid;
            this.passwd = password;
            this.parentToken = parentToken
            this.login();
        }
        if (staticToken) {
            this.staticToken = staticToken;
            this.login(true);
        }
    },
    methods: {
        login(isEx) {
            var data;
            if (!isEx) {
                data = {
                    uid: this.uid,
                    passwd: this.passwd,
                    hostname: this.hostname == 'localhost'?'127.0.0.1':this.hostname,
                    codeKey: "12313",
                    code: "1234567890",
                    parentToken: this.parentToken
                };
                if (!data.uid) return alert("请输入账户名!");
                if (!data.passwd) return alert("请输入密码!");
            } else {
                data = {
                    uid: "", //登录名
                    passwd: "", //密码
                    hostname: "127.0.0.1", //固定值，写127.0.0.1
                    staticToken: this.staticToken //与登录名绑定的静态token
                };
            }
            this.$ajax({
                url: isEx ? "/dsp/user/loginEx" : "/dsp/user/login",
                laod: true,
                data: data
            }).then(function(data) {
                var token = data.token;
                localStorage.accountType = token.accountType;
                switch (token.accountType) {
                    case "0":
                        localStorage.adminToken = token.token;
                        location.href = "./admin.html#/index";
                        break;
                    case "1":
                        localStorage.dspToken = token.token;
                        location.href = "./saas.html";
                        break;
                    case "2":
                        localStorage["agentToken" + token.agencyID] = token.token;
                        localStorage["agentIsDirect" + token.agencyID] =
                            token.isDirect;
                        location.href =
                            "./agent.html#/" +
                            token.agencyID +
                            "/";
                        break;
                    case "3":
                        localStorage["advToken" + token.advertiserID] =
                            token.token;
                        location.href =
                            "./adv.html#/0/" +
                            token.advertiserID +
                            "/";
                        break;
                }
            });
        },
        getOem() {
            // OEM信息
            this.$ajax({
                url: "/dsp/user/oem/query",
                load: true,
                data: {
                    hostname: this.hostname
                }
            }).then(data => {
                this.oem = {
                    url: data.url || "", //自有域名
                    background:
                        data.background ||
                        require("./assets/login.png"),
                        // "http://cdn.fds.api.xiaomi.com/b2c-bbs/cn/attachment/58c0b912a185289740281d0ce02c210b.jpg", // 登陆页面背景图片
                    loginLogo:
                        data.loginLogo ||
                        require("@/common/img/login_logo.png"), //登陆页面Logo地址
                    staticLogo:
                        data.staticLogo || require("@/common/img/logo.png"), //导航栏Logo地址
                    sdkLogo: data.sdkLogo || "", //SDK Logo地址
                    iconUrl: data.iconUrl || "", //角标图片地址
                    title: data.title || "投放端", //所有oem文字信息
                    icp: data.icp || "",
                    copyright: data.copyright || "", //版权信息
                    // dspTitle: data.title || "Adhub运营后台", //dsp端title

                    adLogo: data.adLogo || "",
                    adLogoExt: data.adLogoExt || "",
                    adLogoUrl: data.adLogoUrl || "",
                    adLabel: data.adLabel || ""
                };

                this.$store.commit("setOem",this.oem)
            });
        }
    }
};
</script>

<style lang="less">
body,
html,
#app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0 !important;
}
#app {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.form-box {
    width: 320px;
    height: 360px;
    position: absolute;
    left: 50%;
    margin-left: -150px;
    top: 50%;
    margin-top: -190px;
}

.logo-box {
    width: 100%;
    text-align: center;
    margin-bottom: 60px;
}
.form-group {
    margin-bottom: 25px;
    padding-left: 0;
    min-height: auto;
}

.form-group label {
    color: #fff;
}

.form-box .form-group input {
    padding-left: 45px;
    height: 46px;
    width: 100%;
    border: 1px solid #dfdfdf;
    background-color: rgba(255, 255, 255, 0.2);
    background-repeat: no-repeat;
    background-position: 14px center;
    color: #fff;
    outline: none;
    opacity: 0.7;
}
.form-box .form-group {
    input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #fff;  
    }

    input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #fff;
    }

    input:-ms-input-placeholder{
        color: #fff;
    }

    input::-webkit-input-placeholder {
        color: #fff;
    }
}
.form-box .form-group input:focus{
    opacity: 1;
}

.form-group .form-control.user-input {
    border-radius: 10px;
    background-size: 16px 20px;
    background-image: url("./assets/user.png");
}

.form-group .form-control.pwd-input {
    border-radius: 10px;
    background-size: 16px 20px;
    background-image: url("./assets/pwd.png");
}

.form-group .form-control.vercode-input {
    background-image: url("./assets/code.png");
    background-size: 16px 20px;
    display: inline-block;
    width: 54%;
}

.vercode-img {
    width: 41%;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 5px;
    margin-top: -3px;
}

.btn-login {
    width: 100%;
    height: 46px;
    font-size: 14px;
    background-color: #28C746;
    border-color: #28C746;
    color: #fff;
    cursor: pointer;
    border-radius: 10px;
    border: none;
    outline: none;
    background-image: linear-gradient(-180deg,#34d058,#28a745 90%);
    &:hover{
        background-color: #269f42;
        background-image: linear-gradient(-180deg,#2fcb53,#269f42 90%);
        background-position: -.5em;
        border-color: rgba(27,31,35,.5);
    }
}
.btn-login:active {
    background-color: #286090;
    border-color: #204d74;
}

/*改变谷歌记住密码样式*/
// input:-webkit-autofill {
//     -webkit-box-shadow: 0 0 0px 1000px #595959 inset !important;
//     -webkit-text-fill-color: #fff;
// }
.copyright {
    position: fixed;
    bottom: 20px;
    text-align: center;
    width: 100%;
    color: #fff;
}
</style>

