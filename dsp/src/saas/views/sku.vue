<template>
    <div class="sku-page">
        <div class="page-title">合约资源管理</div>
        <div class="content">
            <div class="table content">
                <div class="table-top">
                    <p class="table-title">合约资源列表</p>
                    <div class="table-filter">
                        <search placeholder="搜索资源名称" @search="setFilter('name',$event)"></search>
                        <select-data @select="selectDate"></select-data>
                        <m-select
                            title="全部状态"
                            :list="stateList"
                            @change="setFilter('executeState',$event.id)"
                        ></m-select>
                        <m-select
                            title="全部平台"
                            :list="platformList"
                            @change="setFilter('platform',$event.id)"
                        ></m-select>
                        <m-select
                            title="全部资源类型"
                            :list="chargeTypeList"
                            @change="setFilter('chargeType',$event.id)"
                        ></m-select>
                        <m-select
                            title="全部采买类型"
                            :list="dealTypeList"
                            @change="setFilter('skuType',$event.id)"
                        ></m-select>
                    </div>
                </div>
                <table class="table-box">
                    <thead>
                        <tr>
                            <th>状态</th>
                            <th>adxID</th>
                            <th>dealID</th>
                            <th>资源名称</th>
                            <th>采买时段</th>
                            <th>所属平台</th>
                            <th>资源类型</th>
                            <th>采买类型</th>
                            <th>单价(元/千次曝光)</th>
                            <th>量级(千次曝光/每天)</th>
                            <th>广告位信息</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in list" :key="index">
                            <td
                                ng-class="{state1: item.executeState=='执行中',state2: item.executeState=='交易结束',state3: item.executeState=='已售罄'}"
                            >{{item.executeState}}</td>
                            <td>{{item.adxID}}</td>
                            <td>{{item.adxDealID}}</td>
                            <td>{{item.name}}</td>
                            <td>
                                <p v-for="data in item.date.split(';')" :key="data">{{data}}</p>
                            </td>
                            <td>{{item.platform}}</td>
                            <td>{{item.chargeType}}</td>
                            <td>{{item.skuType}}</td>
                            <td>{{item.price}}</td>
                            <td>{{item.amount}}</td>
                            <td style="text-align: left;padding-left: 20px">
                                <p
                                    v-for="(space,index) in item.spaceInfo.split(';')"
                                    :key="index"
                                >{{space}}</p>
                            </td>
                            <td>
                                <dsp-button class="dsp-btn btn-blue">查看详情</dsp-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <page :page="pageObj" @change="getList"></page>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            list: [],
            platformList: [
                { value: "全部平台" },
                { id: "android", value: "Android" },
                { id: "ios", value: "iOS" }
            ],
            chargeTypeList: [
                { value: "全部资源类型" },
                { id: "cpc", value: "CPC" },
                { id: "cpm", value: "CPM" }
            ],
            dealTypeList: [
                { value: "全部采买类型" },
                { id: "pdb", value: "保价保量" },
                { id: "pd", value: "保价不保量" }
            ],
            stateList: [
                { value: "全部状态" },
                { id: "10", value: "待执行" },
                { id: "20", value: "执行中" },
                { id: "30", value: "交易结束" },
                { id: "40", value: "已售罄" }
            ],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter: {}
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
            this.getList();
        },
        setFilter(attr, val) {
            this.pageObj.currentPage = "1";
            this.filter[attr] = val;
            this.getList();
        },
        getList(pageObj) {
            this.pageObj = pageObj || {
                currentPage: 1,
                size: 20
            };
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/sku/show/list",
                data: data,
                load: true
            }).then(res => {
                var arr = res.data.data || [];
                var skuTypes = {
                    pdb: "保价保量",
                    pd: "保价不保量",
                    rtb: "竞价"
                };
                var executeStates = {
                    "10": "待执行",
                    "20": "执行中",
                    "30": "交易结束",
                    "40": "已售罄"
                };
                arr.forEach(v => {
                    v.skuType = skuTypes[v.skuType];
                    v.executeState = executeStates[v.executeState];
                    var dateStr = "",
                        spaceStr = "";
                    v.date = v.date || [];
                    v.date.forEach(function(data) {
                        dateStr += data.startDate + " - " + data.endDate + ";";
                    });
                    v.spaceInfo.forEach(function(space) {
                        spaceStr +=
                            space.appName + "，" + space.adxSpaceName + ";";
                    });
                    v.date = dateStr;
                    v.spaceInfo = spaceStr;
                });
                this.list = arr;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
            });
        }
    }
};
</script>
<style lang="less">
.sku-page {
    .state1 {
        color: #1bca4c;
    }
    .state2 {
        color: #3e9cfa;
    }
    .state3 {
        color: #ec4d4d;
    }
}
</style>

