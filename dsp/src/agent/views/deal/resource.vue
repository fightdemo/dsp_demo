<template>
    <div class="resourcces-page">
        <h3 class="page-title">合约资源管理</h3>
        <div class="content">
            <div class="contractRes-title">
                <h5>合约资源</h5>
                <div class="content-title-filter">
                    <select-data :all="true" @select="selectDate"></select-data>
                    <search placeholder="请输入名称" @search="search"></search>
                    <m-select title="全部平台" :list="platformList" @change="selectPlatform"></m-select>
                    <m-select title="全部资源类型" :list="resList" @change="selectRes"></m-select>
                </div>
            </div>
            <ul class="grid">
                <li class="grid-item" v-for="(item, index) in list" :key="index">
                    <div class="grid-top">
                        <h3 class="res-title"><img class="icon-os" :src="item.platform=='android' ? imgSrc1 : imgSrc2" alt="">{{item.name}}</h3>
                        <ul class="app-cover-list">
                            <li class="app-cover-list-li" v-for="(app, index) in item.appDetail" :key="index" 
                                v-show="(item.appDetail.length <= 4) || (item.appDetail.length > 4 && $index < 3)"
                                v-bind:style="{backgroundImage:'url('+app.iconUrl+')'}"
                                >
                            </li>
                            <div class="app-cover-list-li" v-if="item.appDetail.length > 4">
                                <a href="javascript:;">查看更多</a>
                                <div class="app-more">
                                    <div v-for="(app,index) in item.appDetail" :key="index"  class="app-more-info">
                                        <div class="app-more-cover"></div>
                                        <p class="app-more-name">{{app.name}}</p>
                                        <p class="app-more-introduce">{{app.appType}}</p>
                                    </div>
                                </div>
                            </div>
                        </ul>
                        <p class="app-name">
                            <span v-for="(app, index) in item.appDetail" :key="index">
                                {{index==0 ? "" : ","}}{{app.appName}}
                            </span>
                        </p>
                        <div class="line"></div>
                        <div class="app-info">
                            <p class="info-name">资源类型：</p>
                            <p class="info-contant">{{item.chargeType.toUpperCase()}}资源</p>
                        </div>
                        <div class="app-info">
                            <p class="info-name">时间段(共计{{item.totalDay}}天)：</p>
                            <p v-for="(date, index) in item.date" :key="index" class="info-contant">{{date.startDate}}—{{date.endDate}}</p>
                        </div>
                        <!-- <div class="app-info">
                            <p class="info-name">购买单价：</p>
                            <p class="info-contant" v-if="item.skuType == 'pdb'">保价保量：{{item.sellPrice}} 元/千次曝光</p>
                            <p class="info-contant" v-if="item.skuType == 'pd'">保价不保量：{{item.sellPrice}} 元/千次曝光</p>
                        </div> -->
                        <div class="app-info">
                            <p class="info-name">售卖单价：</p>
                            <p class="info-contant" v-if="item.skuType == 'pdb'">保价保量：{{item.sellPrice}} 元/千次曝光</p>
                            <p class="info-contant" v-if="item.skuType == 'pd'">保价不保量：{{item.sellPrice}} 元/千次曝光</p>
                        </div>
                        <div class="app-info" v-if="item.skuType != 'pd'">
                            <p class="info-name">量级：</p>
                            <p class="info-contant" v-if="item.chargeType == 'cpm'">{{item.amount}} 千次曝光/每天</p>
                            <p class="info-contant" v-if="item.chargeType == 'cpc'">{{item.amount}} 千次点击/每天</p>
                        </div>
                        <div class="app-info last">
                            <p class="info-name">广告位：</p>
                            <p class="info-contant" v-for="(space, index) in item.spaceInfo" :key="index">{{space.appName}}-{{space.adxSpaceName}}</p>
                        </div>
                        <button class="btn-detail btn-white" @click="goToDetail(item.id)">查看资源详情</button>
                    </div>
                    <button class="btn-blue" v-if="permission.act[46]" @click="goToShop(item.id)">立即采买合约</button>
                </li>
            </ul>
            <page :page="pageObj" @change="getList"></page>
        </div>
    </div>
</template>
<script>
import { getNowFormatDate, exportCsv } from "@/common/js/utils";
export default {
    data() {
        return {
            filter: {
                startDate:'',
                endDate:'',
                self: "0",
                executeState: "10,20"
            },
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            // eTime: getNowFormatDate() + " 23:59:59",
            // sTime: getNowFormatDate() + " 00:00:00",
            eTime: "",
            sTime: "",
            platformList : [{value:'全部平台'},{id:'android',value:'Android'},{id:'ios',value:'iOS'}],
            resList : [{value:'全部资源类型'},{id:'cpc',value:'CPC'},{id:'cpm',value:'CPM'}],
            list: [],
            imgSrc1: require('../../../common/img/images/icon_android.png'),
            imgSrc2: require('../../../common/img/images/icon_ios.png')
        }
    },
    created(){
        this.getList()
    },
    methods: {
        // 选择时间
        selectDate(val) {
            this.filter.startDate = val.start;
            this.filter.endDate = val.end;
            this.pageObj.currentPage = 1;
            this.getList();
        },
        //搜索事件
        search(val) {
            this.filter.name = val;
            this.pageObj.currentPage = 1;
            this.getList();
        },
        //下拉框事件
        selectPlatform(item) {
            this.filter.platform = item.id;
            this.pageObj.currentPage = 1;
            this.getList();
        },
        selectRes(item){
            this.filter.chargeType = item.id;
            this.pageObj.currentPage = 1;
            this.getList();
        },
        //跳转到详情页面
        goToDetail( id ){
            this.$router.push({
                name: 'deal.detail',
                params: { id: id }
            })
        },
        goToShop(id){
            this.$router.push({
                name: 'deal.shop',
                params: { id: id }
            })
        },
        //获取合约资源数据
        getList(){
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"]
            }
            this.$ajax({
                url: "/dsp/sku/show/list",
                load: true,
                data: data
            }).then(res => {
                console.log( res )
                this.list = res.data.data;
                this.list.forEach(function(sku){
                    var appInfo = {};
                    var temp = [];
                    sku.appDetail = sku.appDetail || [];
                    sku.appDetail.forEach(function(space){
                        var app = appInfo[space.appID];
                        if(!app) {
                            appInfo[space.appID] = space;
                            temp.push({
                                appName: space.appName,
                                iconUrl: space.iconUrl,
                                appType: space.appType
                            })
                        }
                    })
                    sku.appDetail = temp;
                })
            })
        }
    }
}
</script>
<style lang="less" scoped>
.resourcces-page{
    .contractRes-title{
        font-size: 14px;
        padding: 10px 20px;
        // font-weight: bold;
        border-bottom: 1px solid #cccccc;
        h5{
            font-size: 18px;
            float: left;
            font-weight: bold;
            margin-top: 9px;
        }
        .content-title-filter{
            float: right;
        }
    }
    .contractRes-title:after{
        display: block;
        clear: both;
        content: "";
        visibility: hidden;
        height: 0;
        width: 0;
        line-height: 0;
    }
    .grid{
        margin: 20px;
        overflow: hidden;
        margin-left: 0;
        >li{
            float: left;
            width: 320px;
            margin-left: 20px;
            margin-bottom: 20px;
            padding-bottom: 36px;
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.125);
            .grid-top {
                border: 1px solid #cccccc;
                border-radius: 5px;
                z-index: 2;
                position: relative;
                background: #fff;
            }
        }
        .res-title{
            font-size: 14px;
            color: #3d3d3d;
            text-align: center;
            margin-top: 20px;
            font-weight: bold;
            padding: 0;
            .icon-os {
                width: 14px;
                height: 16px;
                vertical-align: sub;
                margin-right: 5px;
                display: inline-block;
            }
        }
        .app-cover-list {
            width: 135px;
            height: 135px;
            margin: 20px auto 0;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-around;
            align-items: center;
            border-radius: 16px;
            background-color: #e6e6e6;
            .app-cover-list-li {
                height: 52px;
                width: 52px;
                border-radius: 15px;
                position: relative;
                background-size: 100% 100%;
                background-position: center;
                a {
                display: block;
                width: 100%;
                height: 100%;
                color: #44a1f7;
                text-align: center;
                padding: 10px;
                border-radius: 15px;
                background-color: #ffffff;
                }
            }
        }
        .app-name {
            font-size: 14px;
            color: #3d3d3d;
            margin: 10px 20px 0;
            text-align: center;
        }
        .line {
            margin: 0 10px;
            height: 1px;
            background: #bfbfbf;
            margin-top: 20px;
        }
        .app-info {
            margin: 0 15px;
            padding: 10px 5px;
            font-size: 12px;
            border-bottom: 1px dashed #e6e6e6;
            p {
                margin: 0;
                word-break: break-all;
            }
            .info-name {
                color: #8c8c8c;
            }
            .info-contant {
                margin-top: 10px;
                color: #3d3d3d;
            }
        }
        .app-info.last {
            border-bottom: none;
        }
        .btn-white {
            width: 260px;
            height: 35px;
            display: block;
            color: #737373;
            border: 1px solid #d6d6d6;
            border-radius: 5px;
            background: url("../../../common/img/images/select-bg.png") repeat;
            background-size: 1px 100%;
            margin: 15px auto 20px;
        }
        .btn-blue {
            width: 100%;
            height: 40px;
            // position: absolute;
            // bottom: 0px;
            border-radius: 0 0 5px 5px;
            left: 0;
            z-index: 1;
            padding: 0;
            border-radius: 0 0 5px 5px;
            border: 1px solid #489df2;
            background: url("../../../common/img/images/bg_blue.png") repeat;
            background-size: 1px 100%;
            color: #fff;
        }
        .app-more {
            width: 440px;
            position: absolute;
            padding: 20px;
            padding-bottom: 0;
            background-color: #fff;
            top: -20px;
            left: 60px;
            border-radius: 5px;
            box-shadow: 0px 0px 5px 2px #ccc;
            z-index: 10;
            .app-more-info {
                width: 50%;
                margin-bottom: 20px;
                .app-more-cover {
                height: 52px;
                width: 52px;
                float: left;
                margin-right: 20px;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                }
                > p {
                margin: 0;
                line-height: 26px;
                }
            }
        }
    }
}
@media screen and (max-width: 1720px) {
    .content-title-filter{
        .m-select-wrap{
            width: 180px;
        }
        .search-box{
            width: 200px;
        }
    }
}
</style>
