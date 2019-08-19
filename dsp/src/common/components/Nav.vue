<template>
    <div class="nav" :class="{off:silderFlag}">
        <div class="nav-left" ref="navleft">
            <div class="nav-logo-box">
                <div class="nav-logo" :style="'background-image: url('+staticLogo+');'"></div>
                <i class="btn-silder" @click="toggleSilder()"></i>
            </div>
            <div :style="{'overflow': !silderFlag ? 'hidden' : ''}">
                <div :style="{'height': wrapHeight + 'px', 'margin-right': !silderFlag ? '-17px' : '', 'overflow-y': !silderFlag ? 'scroll' : '' }" ref="wrap" @scroll="handleScroll" @mouseover="scrollbarShow=true" @mouseleave="scrollbarShow=false">
                    <ul class="nav-list">
                        <li v-for="item in navList"  :key="item.name"  :class="{'open':item.open, 'active': item.flag}" @click.stop="toitem(item)">
                            <a href="javascript:;">
                                <i class="icon mb" :class="item.icon"></i>
                                <span class="nav-name">{{item.name}}</span>
                                <i v-if="item.sub && !item.hideSub" @click.stop="toggle(item)" class="icon fa fa-angle-right"></i>
                            </a>
                            <!-- 固定二级导航栏 -->
                            <ul v-if="item.sub && !item.hideSub" class="nav-sub-list" @click.stop>
                                <!-- <li v-for="(sub,subi) in item.sub" :key="sub.name" @click="seconed(sub,subi)"> -->
                                    <router-link :to="sub.to" v-for="sub in item.sub" :key="sub.name">
                                        <!-- <a href="javascript:;" :class="{'active': subIndex == subi}"> -->
                                            {{sub.name}}
                                            <i class="icon-disc"></i>
                                        <!-- </a> -->
                                    </router-link>
                                <!-- </li> -->
                            </ul>
                            <!-- 浮动二级导航栏 -->
                            <div v-if="item.sub && !item.hideSub" class="float-box">
                                <ul class="nav-sub-list-float" @click.stop>
                                    <!-- <li v-for="(sub,i) in item.sub" :key="sub.name" @click="silder(sub,i)"> -->
                                        <router-link :to="sub.to" v-for="sub in item.sub" :key="sub.name">
                                            <!-- <a href="javascript:;" :class="{'active': subIndex == i}"> -->
                                                {{sub.name}}
                                                <i class="icon-disc"></i>
                                            <!-- </a> -->
                                        </router-link>
                                    <!-- </li> -->
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="scrollbar-bar is-vertical" v-show="scrollbarShow">
                    <div class="scrollbar-thumb" :style="transform"></div>
                </div>
            </div>
        </div>
        <div class="nav-top bs">
            <div class="tools-box" v-if="navToolList.length > 0" :class="{'disabled': !navToolList[0].name}">
                <i class="icon mb icon-cube"></i>
                <span @click="goToToolPage">工具箱</span>
                <i class="icon fa fa-angle-down"></i>
                <ul class="tools-list" v-if="navToolList.length > 0 && navToolList[0].name">
                    <li v-for="item in navToolList" :key="item.name">
                        <router-link v-if="item.to" :to="item.to" target="_blank">{{item.name}}</router-link>
                        <a v-if="item.href" :href="item.href" target="_blank">{{item.name}}</a>
                    </li>
                </ul>
            </div>
            <ul class="user-info-box fr cl" ref="userInfoBox">
                <li class="user-balance">账户余额(元)：{{balance|number}}</li>
                <li>
                    <div class="user-avatar">
                        <i class="icon fa fa-user"></i>
                    </div>
                </li>
                <li class="user-box" ref='userBox'>
                    <p class="user-account" :title="userInfo.loginName">{{userInfo.loginName}}</p>
                    <p :title="userInfo.name">{{userInfo.name}}</p>
                </li>
                <li v-if="canLogout">
                    <el-button type="danger" class="logout" @click="logout()">
                        <i class="icon fa fa-sign-out"></i>退出
                    </el-button>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {
  number
} from "@/common/js/filter"
require("@/common/css/font.css");

export default {
    filters: {
        number
    },
    computed: {
        getUserInfo() {
            return this.$store.state.common.userInfo;
        },
        staticLogo() {
            if( !this.silderFlag ){
                if( this.getUserInfo && this.getUserInfo.loginName == 'admin' ){
                    return require("@/common/img/nav-logo2.png")
                }else{
                    return this.$store.state.common.oem.staticLogo || require("@/common/img/nav-logo2.png")
                }
            }else{
                if( this.getUserInfo && this.getUserInfo.loginName == 'admin' ){
                    // return require("@/common/img/nav-logo-off2.png")
                }else{
                    //现在后端没有返回小logo，若返回小logo的属性名，应改变staticlog
                    return this.$store.state.common.oem.staticLog || ""
                    // return this.$store.state.common.oem.staticLog || require("@/common/img/nav-logo-off2.png")
                }
            }
        },
        wrap() {
            return this.$refs.wrap;
        },
        wrapH() {
            return this.$refs.navleft;
        },
        
    },
    data() {
        return {
            silderFlag: false,
            parIndex: 0,
            subIndex: 0,
            scrollbarShow: false,
            transform: '',
            moveY: '',
            moveX: '',
            sizeHeight: '',
            sizeWidth: '',
            wrapHeight: '',
            screenHeight: document.body.clientHeight,
        };
    },
    methods: {
        IsPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
                }
            }
            return flag;
        },
        handleScroll() {
            const wrap = this.wrap;

            this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
            this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
            
            this.transform = `transform: translateY(${ this.moveY }%);height: ${this.sizeHeight}`;

        },
        update() {
            let heightPercentage, widthPercentage;
            const wrap = this.wrap;
            if (!wrap) return;

            heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
            // widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);
            this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
            // this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';

            this.wrapHeight = this.wrapH.clientHeight - 56;
            this.transform = `transform: translateY(0%); height: ${this.sizeHeight}`;
        },
        toitem(item) {
            // if(!this.silderFlag) {
                if(item.sub) {
                    this.$set(item,"open",!item.open)
                    this.$router.push({
                        name: item.sub[0].to.name
                    })
                }else {
                    this.$router.push({
                        name: item.to.name
                    })
                }                
            // }            
            this.$nextTick(this.update)
        },
        toggle(item) {
            if(!this.silderFlag) {
                this.$set(item,"open",!item.open)    
            }            
            this.$nextTick(this.update)
        },
        toggleSilder() {
            this.silderFlag = !this.silderFlag;
            document.body.style.paddingLeft = this.silderFlag
                ? "120px"
                : "290px";
        },
        // showSecondNav(item, index) {
        //     if (this.silderFlag) {
        //         // 显示二级导航栏弹框
        //         this.activeNav = index;
        //     } else {
        //         // 直接跳转界面
        //         this.$router.push(item.to);
        //     }
        // },
        // 根据路由获取当前active
        initCurrent() {
            var firstNav = this.navList;
            if(this.$route.name) {
                var firstName = this.$route.name.split('.')[0];
            }                     
            for (var i = 0; i < firstNav.length; i++) {
                this.$set(firstNav[i],"open",false)
                this.$set(firstNav[i],"flag",false)
                // 判断当前选中项是否为该节点 
                if (firstNav[i].to.name == firstName) {
                    this.$set(firstNav[i],"open",true)
                    this.$set(firstNav[i],"flag",true)
                }
            }
        },
        goToToolPage() {
            if(this.navToolList[0].name) {
                this.$router.push({
                    name: 'toolPage',
                    params: {
                        navToolList: this.navToolList
                    }
                })
            }
        },
        logout() {
            this.$ajax({
                url: '/dsp/user/logout',
                data: {},
                load: true
            }).then(res => {
                location.href = "./";
            })
        }
    },
    props: {
        navList: Array,
        balance: {
            type:String|Number,
            default: "--"
        },
        userInfo: {
            type: Object,
            default() {
                return {
                    loginName: '--',
                    name: '--',
                }
            }
        },
        navToolList: {
            type: Array,
            default() {
                return []
            }
        },
        canLogout: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        this.initCurrent();
        this.$nextTick(this.update)
        const that = this;
        window.onresize = () => {
            return (() => {
                window.screenHeight = document.body.clientHeight
                that.screenHeight = window.screenHeight
            })()
        }  
        var bodyDom = document.getElementsByTagName('body')[0]
        if(!this.IsPC()){
            bodyDom.style.minWidth = 1100 + 'px';
            this.$refs.userInfoBox.style.marginLeft = 50 + 'px';
            this.$refs.userBox.style.marginRight = 0 + 'px';
        }
    },
    watch: {
        $route(val) {
            this.initCurrent();
        },
        silderFlag(val) {
            this.$store.commit('setSilderFlag', val)
        },
        screenHeight(val) {
            this.update()
        },
    }
};
</script>
<style lang="less">
body {
    padding-top: 90px;
    padding-left: 290px;
    padding-right: 20px;
    padding-bottom: 60px;
}
.nav {
    z-index: 10;
    position: relative;
    .nav-left {
        width: 270px;
        height: 100%;
        left: 0px;
        top: 0px;
        z-index: 8;
        position: fixed;
        background-color: rgb(49, 52, 70);
        font-size: 16px;
        .nav-logo-box {
            padding-top: 18px;
            padding-left: 30px;
            .nav-logo {
                width: 172px;
                height: 34px;
                display: inline-block;
                // background: url("../img/nav-logo.png") no-repeat center;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: 100% 100%;
            }
            .btn-silder {
                float: right;
                width: 21px;
                height: 17px;
                margin-top: 6px;
                margin-right: 10px;
                cursor: pointer;
                background: url("../img/silder-on.jpg") no-repeat center;
            }
        }
        .nav-list {
            margin-top: 40px;
            width: 100%;
            // width: calc(~'100% - 17px');
            > li {
                margin-bottom: 20px;
                a {
                    display: block;
                    height: 56px;
                    line-height: 56px;
                    overflow: hidden;
                    color: rgb(204, 207, 227);
                    padding-left: 32px;
                    .icon {
                        margin-right: 30px;
                        font-size: 18px;
                        vertical-align: middle;
                        color: rgb(150, 150, 150);
                    }
                    .fa-angle-right {
                        padding: 0 15px;
                        line-height: inherit;
                        float: right;
                        cursor: pointer;
                        margin: 0;
                    }
                }
                .nav-sub-list {
                    display: none;
                    border-top: 1px solid rgb(49, 52, 70);
                    a {
                        height: 74px;
                        line-height: 74px;
                        padding-left: 90px;
                        .icon-disc {
                            width: 8px;
                            height: 8px;
                            float: right;
                            border-radius: 50%;
                            background-color: #fff;
                            margin-top: 33px;
                            margin-right: 15px;
                            display: none;
                        }
                    }
                    a.active {
                        color: #fff;
                        padding-left: 100px;
                        .icon-disc {
                            display: block;
                        }
                    }
                }
                .float-box {
                    position: absolute;
                    top: 50%;
                    left: 75px;
                    padding: 30px;
                    transform: translateY(-50%);
                    display: none;
                }
                .nav-sub-list-float {
                    width: 170px;
                    border-radius: 10px;
                    background-color: rgb(49, 52, 70);
                    box-shadow: rgb(149, 149, 149) 0px 2px 12px 2px;
                    li {
                        .icon-disc {
                            display: none;
                        }
                    }
                    a {
                        height: 56px;
                        line-height: 56px;
                        text-align: center;
                        padding-left: 0;
                        border-radius: 10px;
                    }
                    a.active {
                        background-color: rgb(41, 44, 59);
                    }
                }
            }
            > li.active {
                background-color: rgb(41, 44, 59);
                > a {
                    color: #fff;
                    padding-left: 42px;
                    .icon {
                        font-size: 18px;
                        color: #fff;
                    }
                }
            }
            > li.open {
                .fa-angle-right {
                    transform: rotate(270deg);
                    color: rgb(150, 150, 150);
                }
                .nav-sub-list {
                    display: block;
                }
            }
        }
        .scrollbar-bar{
            position: absolute;
            right: 2px;
            bottom: 2px;
            z-index: 1;
            border-radius: 4px;
            opacity: 1;
            transition: opacity 120ms ease-out;
            .scrollbar-thumb{
                position: relative;
                display: block;
                width: 100%;
                // height: 61%;
                cursor: pointer;
                border-radius: inherit;
                background-color: rgba(144,147,153,.3);
                -webkit-transition: .3s background-color;
                transition: .3s background-color;
            }
        }
        .is-vertical{
            width: 6px;
            top: 2px;
        }
    }
    .nav-top {
        position: fixed;
        width: calc(~"100% - 270px");
        height: 70px;
        line-height: 70px;
        left: 270px;
        top: 0px;
        background-color: #fff;
        box-shadow: rgb(218, 218, 218) 0px 0px 16px 0px;
        min-width: 550px;
        .icon {
            vertical-align: middle;
        }
        .tools-box {
            user-select: none;
            width: 164px;
            height: 70px;
            margin-left: 20px;
            font-size: 16px;
            float: left;
            cursor: pointer;
            position: relative;
            .icon-cube {
                margin-left: 30px;
                margin-right: 10px;
            }
            .fa {
                margin-left: 20px;
                margin-top: -3px;
            }
            .tools-list {
                // width: 621px;
                // height: 174px;
                width: 510px;
                height: 110px;
                position: absolute;
                top: 70px;
                left: 0;
                display: none;
                z-index: 10;
                cursor: default;
                li {
                    width: 160px;
                    margin-left: 47px;
                    float: left;
                    height: 87px;
                    line-height: 87px;
                    font-size: 14px;
                    list-style-type: disc;
                    a {
                        color: #fff;
                    }
                }
            }
        }
        .tools-box:hover {
            color: #fff;
            background-color: rgba(30, 30, 30, 0.7);

            .fa-angle-down {
                transform: rotate(180deg);
            }
            .tools-list {
                background-color: rgba(30, 30, 30, 0.7);
                display: block;
            }
        }
        .tools-box.disabled{
            cursor: not-allowed;
            &:hover{
                background-color: #fff;
                color: #595959;
            }
        }
        .user-info-box {
            li {
                float: left;
                font-size: 14px;
            }
            .user-balance {
                padding-right: 40px;
                height: 20px;
                line-height: 20px;
                vertical-align: middle;
                border-right: 1px solid rgb(82, 94, 113);
                margin-right: 40px;
                margin-top: 25px;
            }
            .user-avatar {
                width: 38px;
                height: 38px;
                margin-top: 16px;
                margin-right: 15px;
                background-color: rgb(176, 176, 176);
                border-radius: 50%;
                text-align: center;
                .icon {
                    font-size: 24px;
                    color: #fff;
                    line-height: 38px;
                    vertical-align: top;
                }
            }
            p {
                line-height: normal;
            }
            .user-box {
                width: 160px;
                margin-right: 40px;
                p {
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
            .user-account {
                margin-top: 15px;
            }
            .logout {
                margin-right: 20px;
                margin-top: 15px;
            }
        }
    }
}
.nav.off {
    .nav-left {
        width: 100px;
        .nav-name {
            display: none;
        }
        .nav-logo-box {
            padding-left: 20px;
            .nav-logo {
                background-image: url("../img/nav-logo-off2.png");
                width: 34px;
                height: 34px;
            }
            .btn-silder {
                background-image: url("../img/silder-off.jpg");
            }
        }
        .nav-list {
            > li {
                position: relative;
                > a {
                    padding-left: 32px;
                    .mb {
                        margin-right: 0;
                    }
                }
                .nav-sub-list {
                    display: none;
                }
            }
            > li.active {
                a .fa-angle-right {
                    color: #fff;
                    transform: rotate(0)
                }
            }
            > li:hover {
                .float-box {
                    display: block;
                }
            }
        }
    }
    .nav-top {
        width: calc(100% - 100px);
        left: 100px;
    }
}
@media screen and (max-width: 1400px) {
    .nav .nav-left .nav-list > li a {
        line-height: 40px;
        height: 40px;
    }
    .nav .nav-left .nav-list > li .nav-sub-list a {
        line-height: 50px;
        height: 50px;
    }
    .nav .nav-left .nav-list > li .nav-sub-list a .icon-disc {
        margin-top: 21px;
    }
    .nav .nav-left .nav-list > li .nav-sub-list {
        padding: 10px 0;
    }
}
</style>
