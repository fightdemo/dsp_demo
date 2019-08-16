<template>
    <div id="admin_tool">
        <p class="page-title">OEM设置</p>
        <div class="table content">
            <div class="table-top">
                <div class="table-filter">
                    <radio
                        size="big"
                        :list="radioList"
                        :defaultVal="filter.accountType"
                        @change="changeType"
                    ></radio>
                    <admin-select
                        class="ml20"
                        v-show="filter.accountType == 2"
                        :title.sync="selectTitle"
                        :list="dspList"
                        valueName="orgName"
                        keyName="orgID"
                        @change="selectDsp"
                    ></admin-select>
                    <search class="ml20" placeholder="公司名称" @search="search"></search>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th>代理商ID</th>
                        <th>账户名称</th>
                        <th>代理商公司名称</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in tableList" :key="index">
                        <td>{{ item.orgID }}</td>
                        <td>{{ item.loginName }}</td>
                        <td>{{ item.orgName }}</td>
                        <td>
                            <dsp-button
                                type="primary"
                                plain
                                round
                                size="mini"
                                @click="setOEM(item)"
                            >OEM设置</dsp-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <page :page="pageObj" @change="getList"></page>
        </div>
        <admin-oem :oemShow.sync="oemShow" :oem.sync="oem" :oemID.sync="orgID"></admin-oem>
    </div>
</template>
<script>
import Radio from "@/common/components/radio";
import Search from "@/common/components/search";
import Select from "@/common/components/select";
import Page from "@/common/components/page";
import oem from "@/common/components/setOEM";
import dspButton from "@/common/components/dspButton";

export default {
    data() {
        return {
            oemShow: false,
            tableList: [],
            resData: [],
            radioList: [
                { name: "代理商OEM", label: "1" },
                { name: "广告公司OEM", label: "2" }
            ],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter: {
                accountType: "1"
            },
            urlShow: false,
            resUrl: [],
            dspList: [],
            orgID: "",
            oem: [{
                background: "", // 登陆页面背景图片
                loginLogo: "", //登陆页面Logo地址
                staticLogo: "", //导航栏Logo地址
                sdkLogo: "", //SDK Logo地址
                iconUrl: "", //角标图片地址
                title: "", //所有oem文字信息
                copyright: "", //版权信息
                adLogo: "",
                adLogoExt: "",
                adLogoUrl: "",
                adLabel: "",
                orgID: "",
                url: ""
            }], //存储页面信息

            oemInfos: {}, //存储要提交的数据

            selectTitle: '请选择代理商',//下拉选择框的默认值
        };
    },
    mounted() {
        this.getList();
        this.filter.accountType = "1";
    },
    methods: {
        setOEM(item) {
            this.orgID = item.orgID;
            this.$ajax({
                url: "/dsp/user/oem/query/agency",
                load: true,
                data: {
                    data: item.orgID
                }
            }).then(res => {
                var data = res.data;
                this.oem = data.length != 0? data : [{
                    url: '',
                    background: "", // 登陆页面背景图片
                    loginLogo: "", //登陆页面Logo地址
                    staticLogo: "", //导航栏Logo地址
                    sdkLogo: "", //SDK Logo地址
                    iconUrl: "", //角标图片地址
                    title: "", //所有oem文字信息
                    copyright: "", //版权信息
                    adLogo: "",
                    adLogoExt: "",
                    adLogoUrl: "",
                    adLabel: ""
                }];
                this.oemShow = true;
            });
        },
        search(val) {
            this.pageObj.currentPage = "1";
            this.filter.name = val;
            this.getList();
        },
        changeType(val) {
            if (val == "2") {
                this.selectTitle = '请选择代理商'
                this.getDspList();
            }else if( val == '1' ){
                delete this.filter.parentID
            }
            this.filter.accountType = val + "";
            this.getList();
        },
        getList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/account/info/list",
                data: data,
                load: true
            }).then(res => {
                var tableList = res.data.data|| [];
                tableList.forEach(function(item) {
                    item.bool = false;
                });
                this.tableList = tableList;
                this.pageObj.size = res.data.size;
                this.pageObj.total = res.data.total;
            });
        },
        getDspList() {
            this.$ajax({
                url: "/dsp/account/info/list",
                data: {
                    page: "1",
                    size: "99999",
                    filter: { accountType: "1" },
                    sort: ["cTime,1"]
                }
            }).then(res => {
                this.dspList = res.data.data;
            });
        },
        selectDsp(item) {
            this.filter.parentID = item.orgID;
            this.getList();
        }
    },
    components: {
        radio: Radio,
        search: Search,
        adminSelect: Select,
        page: Page,
        adminOem: oem,
        dspButton: dspButton
    }
};
</script>
<style lang="less" scoped>
</style>


