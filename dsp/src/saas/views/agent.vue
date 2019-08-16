<template>
    <div id="dsp_agentM">
        <p class="page-title">
            广告公司管理
            <dsp-button type="success" @click="newAgent">添加广告公司</dsp-button>
        </p>
        <div class="cl">
            <div class="addBox fr"></div>
        </div>
        <div class="table content">
            <div class="table-top">
                <h3 class="table-title icon">广告公司列表</h3>
                <div class="table-filter">
                    <search @search="search" placeholder="公司名称"></search>
                </div>
            </div>

            <div id="scrollWrap" style="overflow:hidden;">     
                <div id="tableWrap" style="overflow-x:scroll;">
                    <table class="table-box" id='tableInfo'  style="width:100%;">
                        <thead>
                            <tr>
                                <th>状态</th>
                                <th>广告公司ID</th>
                                <th>账户名称</th>
                                <th>广告公司类型</th>
                                <th>溢价类型</th>
                                <th>溢价策略</th>
                                <th>广告公司公司名称</th>
                                <th>联系人</th>
                                <th>手机号</th>
                                <th>余额</th>
                                <th>利润设置</th>
                                <th align="center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in tableList" :key="index">
                                <td>
                                    <dsp-switch
                                        :is-check="item.state == '10'"
                                        @change="changeSwitch(item.id,item.state)"
                                    ></dsp-switch>
                                </td>
                                <td>{{item.id}}</td>
                                <td>
                                    <a
                                        :href="'./?uid='+encodeURI(item.enLoginName)+'&password='+item.enPassWord+'&parentToken='+dspToken"
                                        target="_blank"
                                    >{{ item.loginName }}</a>
                                </td>
                                <td>
                                    <p v-if="item.isDirect == 1">直客广告公司</p>
                                    <p v-if="item.isDirect != 1">普通广告公司</p>
                                </td>
                                <td>
                                    <p v-if="item.advanceProfit == 'Y'">预提利润模式</p>
                                    <p v-if="item.advanceProfit == 'N'">单价溢价模式</p>
                                </td>
                                <td>
                                    <p v-if="item.fixedPrice == 'Y'">
                                        固定出价 &nbsp;
                                        <el-button
                                            type="primary"
                                            plain
                                            @click="changeMode(item)"
                                            size="mini"
                                        >修改策略</el-button>
                                    </p>
                                    <p v-if="item.fixedPrice == 'N'">
                                        出价回推 &nbsp;
                                        <el-button
                                            type="primary"
                                            plain
                                            @click="changeMode(item)"
                                            size="mini"
                                        >修改策略</el-button>
                                    </p>
                                    <span v-if="!item.fixedPrice">-</span>
                                </td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.contacts }}</td>
                                <td>{{ item.telephone }}</td>
                                <td>{{ item.balance }}</td>
                                <td>
                                    <dsp-edit
                                        :data.sync="(item.premium*100).toFixed(2)"
                                        @change="setBancle($event,item)"
                                        :showEdit.sync="item.showEdit"
                                    >{{item.premium*100|number(2)}}%</dsp-edit>
                                </td>
                                <td style="white-space:nowrap" align="center">
                                    <dsp-button
                                        type="primary"
                                        plain
                                        round
                                        size="mini"
                                        @click="resetP(item.id)"
                                    >重置密码</dsp-button>
                                    <dsp-button
                                        type="primary"
                                        plain
                                        round
                                        size="mini"
                                        @click="editAgent(item)"
                                    >编辑</dsp-button>
                                    <dsp-button
                                        type="primary"
                                        plain
                                        round
                                        size="mini"
                                        v-if="hasOem"
                                        @click="setOEM(item)"
                                    >OEM设置</dsp-button>
                                    <dsp-button
                                        type="primary"
                                        plain
                                        round
                                        size="mini"
                                        v-if="hasReward"
                                        @click="$router.push({name:'reward'})"
                                    >奖励金</dsp-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="tableList.length || tableShow" ref="floatThead">
                        <thead>
                            <tr>
                                <th>状态</th>
                                <th>广告公司ID</th>
                                <th>账户名称</th>
                                <th>广告公司类型</th>
                                <th>溢价类型</th>
                                <th>溢价策略</th>
                                <th>广告公司公司名称</th>
                                <th>联系人</th>
                                <th>手机号</th>
                                <th>余额</th>
                                <th>利润设置</th>
                                <th align="center">操作</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
            <div class="scroll-wrap">
                <div class="h-bar"></div>
            </div>
            <dsp-page id="pageToolbar" :page="pageObj" @change="getList"></dsp-page>
        </div>
        <el-dialog title="新建广告公司" :visible.sync="addShow" width="600px">
            <el-form :model="add" label-width="150px">
                <el-form-item label="广告公司类型：" class="is-required">
                    <dsp-radio
                        class="ml20"
                        :list="companyType"
                        :defaultVal="isDirect"
                        @change="changeCtype"
                        size="big"
                    ></dsp-radio>
                </el-form-item>
                <el-form-item v-if="isDirect == '0' && profitType" label="溢价模式：" class="is-required">
                    <dsp-radio
                        class="ml20"
                        :list="cType"
                        :defaultVal="advanceProfit"
                        @change="changeType"
                        size="big"
                    ></dsp-radio>
                </el-form-item>
                <el-form-item label="账户名称：" class="is-required">
                    <el-input class="ml20" v-model="add.loginName"></el-input>
                </el-form-item>
                <el-form-item label="账户密码：" class="is-required">
                    <el-input
                        autocomplete="new-password"
                        class="ml20"
                        v-model="add.passWord"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item label="重复密码：" class="is-required">
                    <el-input
                        autocomplete="new-password"
                        class="ml20"
                        v-model="add.passWord2"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商机编号：" class="is-required" v-show="isShowBusinessNumber">
                    <el-input
                        class="ml20"
                        v-model="add.businessNumber"
                        style="float: left; width: 300px;"
                    ></el-input>
                    <el-button style="float: right; color: #fff; background: #32A7FF; border: 1px solid #576BDB;" @click="checkBusinessNumber">检查</el-button>
                </el-form-item>
                <el-form-item label="公司名称：" class="is-required">
                    <el-input class="ml20" :disabled='isShowBusinessNumber' id="sassComName" v-model="add.name"></el-input>
                </el-form-item>
                <el-form-item label="联 系 人：" class="is-required">
                    <el-input class="ml20" v-model="add.contacts"></el-input>
                </el-form-item>
                <el-form-item label="手机号码：" class="is-required">
                    <el-input class="ml20" v-model="add.telephone"></el-input>
                </el-form-item>
                <el-form-item label="利润设置：" class="is-required">
                    <el-input class="w80 ml20" v-model="add.premium"></el-input>
                    <span class="ml20">%</span>
                </el-form-item>
                <el-form-item label="溢价策略：" class="is-required" v-if="advanceProfit != 'Y'">
                    <dsp-radio
                        class="ml20"
                        :list="radioList"
                        defaultVal="N"
                        @change="changeRadio"
                        size="big"
                    ></dsp-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addShow = false;add = {}">取 消</el-button>
                <el-button type="primary" @click="confirmAdd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="重置密码" :visible.sync="passwordShow" width="600px">
            <el-form :model="resetPassword" label-width="150px">
                <el-form-item label="密码：" class="is-required">
                    <el-input
                        autocomplete="new-password"
                        type="password"
                        class="w245 ml20"
                        v-model="resetPassword.newPasswd"
                    ></el-input>
                </el-form-item>
                <el-form-item label="重复密码：" class="is-required">
                    <el-input
                        autocomplete="new-password"
                        type="password"
                        class="w245 ml20"
                        v-model="newPasswd2"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="canelPasw">取 消</el-button>
                <el-button type="primary" @click="confirmPasw">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑广告公司" :visible.sync="editShow" width="600px">
            <el-form :model="edit" label-width="150px">
                <el-form-item label="公司名称：" class="is-required">
                    <el-input class="w245 ml20" v-model="edit.name"></el-input>
                </el-form-item>
                <el-form-item label="联 系 人：" class="is-required">
                    <el-input class="w245 ml20" v-model="edit.contacts"></el-input>
                </el-form-item>
                <el-form-item label="手机号码：" class="is-required">
                    <el-input class="w245 ml20" v-model="edit.telephone"></el-input>
                </el-form-item>
                <el-form-item label="利润设置：" class="is-required">
                    <el-input class="w80 ml20" v-model="edit.premium"></el-input>
                    <span class="ml20">%</span>
                </el-form-item>
                <el-form-item label="溢价策略：" class="is-required">
                    <dsp-radio
                        class="ml20"
                        :list="radioList"
                        :defaultVal="edit.fixedPrice"
                        @change="changeEditR"
                        size="big"
                    ></dsp-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editShow = false">取 消</el-button>
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </span>
        </el-dialog>
        <admin-oem :oemShow.sync="oemShow" :oem.sync="oem" :oemID.sync="orgID"></admin-oem>
    </div>
</template>
<script>
import Search from "@/common/components/search";
import { floatScroll, getNowFormatDate, getParameter } from "@/common/js/utils";
import Page from "@/common/components/page";
import dspButton from "@/common/components/dspButton";
import dspSwitch from "@/common/components/switch";
import dspEdit from "@/common/components/dspEdit";
import dspRadio from "@/common/components/radio";
import oem from "@/common/components/setOEM";
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    data() {
        return {
            sTime: getNowFormatDate() + " " + "00:00:00",
            eTime: getNowFormatDate() + " " + "23:59:59",
            tableList: [],
            tableShow: false,
            hasReward: false,
            hasOem: false,
            radioList: [
                { name: "出价回推策略", label: "N" },
                { name: "固定出价策略", label: "Y" }
            ],
            companyType: [
                { name: "普通广告公司", label: "0" },
                { name: "直客广告公司", label: "1" }
            ],
            cType: [
                { name: "单价溢价模式", label: "N" },
                { name: "预提利润模式", label: "Y" }
            ],
            
            filter: {},
            edit: {
                name: "",
                contacts: "",
                telephone: "",
                fixedPrice: "",
                premium: ""
            },
            passwordShow: false,
            editShow: false,
            oemShow: false,
            addShow: false,
            resetPassword: {},
            add: {
                name: ""
            },
            isDirect: '0',
            profitType: '',     // 直客没有溢价模式
            advanceProfit: 'N', // 预提利润模式没有策略
            newPasswd2: "",
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
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
            isShowBusinessNumber: false,
            dspToken: "",
        };
    },
    mounted() {
        // this.getList();
        this.add.fixedPrice = "N";
        this.add.advanceProfit = "N";
        this.add.isDirect = "0";
        this.dspToken = Base64.encode(localStorage.dspToken)

        this.$ajax.all([getParameter('dsp.feature.reward.allow').then(res => {
            this.hasReward = res.data[0].value == 1;
        }),getParameter('dsp.feature.saas.dsp.oem.edit.self.allow').then(res => {
            this.hasOem = res.data[0].value == 1;
        }),getParameter('dsp.feature.agency.advance.allow').then(res => {
            this.profitType = res.data[0].value == 1;
        })]).then(this.getList)
    },
    methods: {
        //检查商机编号
        checkBusinessNumber() {
            if (!this.add.businessNumber)
                return this.$message.error("商机编号不能为空");
            let filter = {};
            filter.opCode = this.add.businessNumber
            this.$ajax({
                url: "/dsp/yingshou/op-detail",
                data: {
                    filter: filter
                }
            }).then( res => {
                if( res.status == '0' ){
                    this.add.name = res.data.op_company
                    document.getElementById("sassComName").style.background = "#fff";
                    this.$message.success("商机编号正确，已自动填充公司名称！");
                }else{
                    this.$message.error("商机编号不正确，请重新输入！");
                }
            } )
        },
        newAgent() {
            this.isDirect = '0';
            this.advanceProfit = 'N';
            this.addShow = true
            this.$ajax({
                url: "/dsp/yingshou/check-org",
                load: true,
                data: {}
            }).then( res => {
                if( res.data ){
                    this.isShowBusinessNumber = true;
                }else{
                    this.isShowBusinessNumber = false;
                }
            } )
        },
        changeCtype(val) {
            this.add.isDirect = val;
            this.isDirect = val;
        },
        changeRadio(val) {
            this.add.fixedPrice = val;
        },
        changeType(val) {
            this.add.advanceProfit = val;
            this.advanceProfit = val;
        },
        changeEditR(val) {
            this.edit.fixedPrice = val;
        },
        resetP(id) {
            this.passwordShow = true;
            this.resetPassword.id = id;
        },
        confirmPasw() {
            //重置密码
            if (!this.resetPassword.newPasswd)
                return this.$message.error("密码必填");
            if (!this.newPasswd2) return this.$message.error("请再次输入密码");
            if (this.newPasswd2 != this.resetPassword.newPasswd)
                return this.$message.error("两次密码输入的不一致");
            this.$ajax({
                url: "/dsp/reset/adv/passwd",
                data: this.resetPassword,
                load: true
            }).then(res => {
                if (res.status == "0") {
                    this.$message.success("密码重置成功");
                    this.resetPassword.newPasswd = "";
                    this.newPasswd2 = "";
                    this.passwordShow = false;
                    this.getList();
                }
            });
        },
        canelPasw() {
            this.passwordShow = false;
            this.resetPassword.newPasswd = "";
            this.newPasswd2 = "";
        },
        confirmAdd() {
            var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            var premium = this.add.premium;
            if (!this.add.loginName)
                return this.$message.error("账户名不能为空");
            if (!this.add.passWord) return this.$message.error("请输入密码");
            if (this.add.passWord2 != this.add.passWord)
                return this.$message.error("两次密码输入不一致");
            if(this.isShowBusinessNumber){
                if (!this.add.businessNumber)
                    return this.$message.error("商机编号不能为空");
            }
            if (!this.add.name) return this.$message.error("公司名称不能为空");
            if (!this.add.contacts) return this.$message.error("请填写联系人");
            if (!this.add.telephone)
                return this.$message.error("请填写联系电话");
            if (!myreg.test(this.add.telephone))
                return this.$message.error("手机号码格式不正确");
            if (premium == "" || isNaN(premium) || premium < 0)
                return this.$message.error("利润必须为大于等于0的数字！");
            if (premium > 100)
                return this.$message.error("利润设置不能超过100%");
            if(String(premium).indexOf(".") > -1) {
                var y = String(premium).indexOf(".") + 1;  //获取小数点的位置
                var count = String(premium).length - y;          //获取小数点后的个数
                // if (premium.split(".")[1]) {
                //     var regLen = premium.split(".")[1].length;
                //     console.log(regLen);
                //     if (regLen > 2) {
                //         return this.$message.error("保留小数点后两位");
                //     }
                // }
                if (count > 2) {
                    return this.$message.error("保留小数点后两位");
                }
            }
            // if (premium.split(".")[1]) {
            //     var regLen = premium.split(".")[1].length;
            //     console.log(regLen);
            //     if (regLen > 2) {
            //         return this.$message.error("保留小数点后两位");
            //     }
            // }
            var data = {
                contacts: this.add.contacts,
                fixedPrice: this.add.fixedPrice,
                loginName: this.add.loginName,
                advanceProfit: this.add.isDirect == '1'? "" : this.add.advanceProfit,
                name: this.add.name,
                passWord: this.add.passWord,
                passWord2: this.add.passWord2,
                premium: premium / 100 + "",
                telephone: this.add.telephone,
                isDirect: this.add.isDirect,
                yingShouOpCode: this.add.businessNumber,
                type: "2",
                roleID: "1"
            };
            this.$ajax({
                url: "/dsp/advertiser/add",
                data: {
                    data: data
                },
                load: true
            }).then(res => {
                if (res.status == "0") {
                    this.$message.success("添加成功");
                    this.addShow = false;
                    this.getList();
                    this.add = {};
                }
            });
        },
        editAgent(item) {
            this.editShow = true;
            this.edit.id = item.id;
            this.edit.name = item.name;
            this.edit.contacts = item.contacts;
            this.edit.telephone = item.telephone;
            this.edit.fixedPrice = item.fixedPrice;
            this.edit.premium = item.premium * 100;
        },
        confirmEdit() {
            var premium = this.edit.premium;
            var reg = /^\d+(?:\.\d{1,4})?$/;
            if (!this.edit.name) return this.$message.error("公司名称不为空");
            if (!this.edit.contacts) return this.$message.error("联系人不为空");
            if (!this.edit.telephone)
                return this.$message.error("手机号码不为空");
            if (!this.edit.premium)
                return this.$message.error("利润设置不为空");
            if (premium == "" || isNaN(premium) || premium < 0)
                return this.$message.error("利润必须为大于等于0的数字！");
            if (premium > 100)
                return this.$message.error("利润设置不能超过100%");
            console.log(premium) 
            if(String(premium).indexOf(".") > -1) {
                var y = String(premium).indexOf(".") + 1;  //获取小数点的位置
                var count = String(premium).length - y;          //获取小数点后的个数
                // if (premium.split(".")[1]) {
                //     var regLen = premium.split(".")[1].length;
                //     console.log(regLen);
                //     if (regLen > 2) {
                //         return this.$message.error("保留小数点后两位");
                //     }
                // }
                if (count > 2) {
                    return this.$message.error("保留小数点后两位");
                }
            }   
            // if (premium.split(".")[1]) {
            //     var regLen = premium.split(".")[1].length;
            //     console.log(regLen);
            //     if (regLen > 2) {
            //         return this.$message.error("保留小数点后两位");
            //     }
            // }
            var data = {
                name: this.edit.name,
                contacts: this.edit.contacts,
                telephone: this.edit.telephone,
                premium: parseFloat(premium) / 100 + "",
                id: this.edit.id,
                fixedPrice: this.edit.fixedPrice
            };
            this.$ajax({
                url: "/dsp/advertiser/modify",
                data: {
                    data: data
                },
                load: true
            }).then(res => {
                if (res.status == "0") {
                    this.$message.success("修改成功");
                    this.edit = {
                        name: "",
                        contacts: "",
                        telephone: "",
                        premium: ""
                    };
                    this.editShow = false;
                    this.getList();
                }
            });
        },
        setOEM(item) {
            this.orgID = item.id;
            this.$ajax({
                url: "/dsp/user/oem/query/agency",
                load: true,
                data: {
                    data: item.id
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
        setBancle(val, item) {
            if (val == "" || isNaN(val) || val < 0)
                return this.$message.error("利润必须为大于等于0的数字！");
            if (val > 100) return this.$message.error("利润设置不能超过100%");
            if (val.split(".")[1]) {
                var regLen = val.split(".")[1].length;
                console.log(regLen);
                if (regLen > 2) {
                    return this.$message.error("保留小数点后两位");
                }
            }
            var premium = val / 100;
            this.$ajax({
                url: "/dsp/finance/profit/set",
                data: {
                    id: item.id,
                    premium: premium + ""
                }
            }).then(res => {
                if (res.status == "0") {
                    this.$message.success("修改成功");
                    this.getList();
                }
            });
        },
        changeMode(item) {
            var str =
                item.fixedPrice == "N"
                    ? "目前使用的溢价策略是“出价回推”模式；<br/>是否确认切换为“固定出价”模式？"
                    : "目前使用的溢价策略是“固定出价”模式；<br/>是否确认切换为“出价回推”模式？";
            this.$alert(str, {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "保存",
                cancelButtonText: "放弃修改"
            }).then(res => {
                var adv = {
                    id: item.id,
                    fixedPrice: item.fixedPrice == "Y" ? "N" : "Y"
                };
                this.$ajax({
                    url: "/dsp/advertiser/modify",
                    data: {
                        data: adv
                    },
                    load: true
                }).then(res => {
                    item.fixedPrice = adv.fixedPrice;
                    this.$message.success("修改成功");
                });
            });
        },

        changeSwitch(id, state) {
            var tState = state == "10" ? "20" : "10";
            this.$ajax({
                url: "/dsp/advertiser/modify",
                data: {
                    data: {
                        id: id,
                        state: tState
                    }
                },
                load: true
            }).then(res => {
                if (res.status == "0") {
                    this.getList();
                }
            });
        },
        getList() {
            this.$ajax({
                url: "/dsp/agency/list",
                data: {
                    eTime: this.eTime,
                    sTime: this.sTime,
                    page: this.pageObj.currentPage + "",
                    size: this.pageObj.size + "",
                    sort: ["cTime,1"],
                    filter: this.filter
                },
                load: true,
            }).then(res => {
                var tableList = res.data.data;
                tableList.forEach(function(item) {
                    item.showEdit = true;
                    item.enLoginName = Base64.encode(item.loginName)
                    item.enPassWord = Base64.encode(item.passWord)
                });
                this.tableList = tableList;
                this.pageObj.size = res.data.size;
                this.pageObj.total = res.data.total;
                // this.tableShow = true;
                this.$nextTick(this.init)
            });
        },
        search(val) {
            this.pageObj.currentPage = "1";
            this.filter.name = val;
            this.getList();
        }          
    },
    components: {
        search: Search,
        dspPage: Page,
        dspButton: dspButton,
        dspSwitch: dspSwitch,
        dspEdit: dspEdit,
        dspRadio: dspRadio,
        adminOem: oem
    }
};
</script>
<style lang="less" scoped>
#dsp_agentM {
    .addBox {
        margin-bottom: 10px;
    }
    .w80 {
        width: 80px;
    }
    .addIcon {
        display: inline-block;
        width: 26px;
        height: 26px;
        background: url("../../admin/assets/icon_add.png") no-repeat;
        background-size: cover;
        vertical-align: middle;
        cursor: pointer;
    }
    .delBtn {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: url("../../admin/assets/icon-close2.png") no-repeat;
        background-size: cover;
        cursor: pointer;
        margin-left: 10px;
    }
    .w245 {
        width: 245px;
    }
    #sassComName{
        background: #DDDDDD;
    }
    // @media screen and (max-width: 1600px) {
    //     .dsp_button {
    //         display: block;
    //         margin-top: 5px;
    //     }
    // }
}
</style>


