<template>
    <div id="admin_agent">
        <p class="page-title">SaaS代理商管理</p>
        <div class="table content">
            <div class="table-top cl">
                <div class="fl">
                    <search @search="search" placeholder="公司名称"></search>
                </div>
                <div class="fr">
                    <dsp-button v-if="permission.act[305]" type="success" @click="addSaaS">添加代理商</dsp-button>
                </div>
            </div>
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;"> 
                    <table class="table-box" id="tableInfo" style="width:100%;">
                        <thead>
                            <tr>
                                <th>状态</th>
                                <th>代理商ID</th>
                                <th>账户名称</th>
                                <th>代理商公司名称</th>
                                <th>联系人</th>
                                <th>手机号</th>
                                <th>余额</th>
                                <th>利润设置</th>
                                <th align="center">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,key) in tableList" :key="key">
                                <td>
                                    <admin-switch
                                        :is-check="item.state == '10'"
                                        @change="change(item.id,item.state)"
                                    ></admin-switch>
                                </td>
                                <td>{{ item.id }}</td>
                                <td>
                                    <a v-if="permission.act[303]" href="javascript:;" @click="showUrl(item)">{{ item.loginName }}</a>
                                    <span v-if="!permission.act[303]">{{ item.loginName }}</span>
                                </td>
                                <td style="width: 250px;">{{ item.name }}</td>
                                <td>{{ item.contacts }}</td>
                                <td style="white-space: nowrap;">{{ item.telephone }}</td>
                                <td style="white-space: nowrap;">{{ item.balance }}</td>
                                <td>
                                    <dsp-edit
                                        :key="item.id"
                                        v-if="permission.act[308]"
                                        :showEditIcon="permission.act[308]"
                                        :data="(item.premium*100)"
                                        @change="setBancle($event,item)"
                                        :showEdit.sync="item.showEdit"
                                    >{{item.premium*100|number(2)}}%</dsp-edit>
                                    <span v-if="!permission.act[308]">{{item.premium*100|number(2)}}%</span>
                                </td>
                                <td style="white-space:nowrap" align="center">
                                    <dsp-button
                                        type="primary"
                                        plain
                                        round
                                        size="mini"
                                        v-if="permission.act[304]"
                                        @click="restPassword(item)"
                                    >重置密码</dsp-button>
                                    <dsp-button
                                        type="primary"
                                        plain
                                        round
                                        size="mini"
                                        v-if="permission.act[306]"
                                        @click="editSaaS(item)"
                                    >编辑</dsp-button>
                                    <dsp-button
                                        type="primary"
                                        plain
                                        round
                                        size="mini"
                                        v-if="permission.act[307]"
                                        @click="setOEM(item)"
                                    >OEM设置</dsp-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="tableList.length || tableShow" ref="floatThead">
                        <thead>
                            <tr>
                                <th>状态</th>
                                <th>代理商ID</th>
                                <th>账户名称</th>
                                <th>代理商公司名称</th>
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
            <div class="page">
                <page id="pageToolbar" :page="pageObj" @change="getList"></page>
            </div>
        </div>
        <el-dialog title="新建SaaS代理商" :visible.sync="addShow" width="600px">
            <el-form :model="add" label-width="150px">
                <el-form-item label="账户名称：" class="is-required">
                    <el-input class="ml20" placeholder="输入账户名称..." v-model="add.loginName"></el-input>
                </el-form-item>
                <el-form-item label="账户密码：" class="is-required">
                    <el-input
                        autocomplete="new-password"
                        class="ml20"
                        v-model="add.passWord"
                        type="password"
                        placeholder="输入账户密码..."
                    ></el-input>
                </el-form-item>
                <el-form-item label="重复密码：" class="is-required">
                    <el-input
                        autocomplete="new-password"
                        class="ml20"
                        v-model="add.passWord2"
                        type="password"
                        placeholder="重复输入账户密码..."
                    ></el-input>
                </el-form-item>
                <el-form-item label="商机编号：" class="is-required" v-show="isShowBusinessNumber">
                    <el-input
                        class="ml20"
                        v-model="add.businessNumber"
                        style="float: left; width: 300px;"
                        placeholder="输入商机编号..."
                    ></el-input>
                    <el-button style="float: right; color: #fff; background: #32A7FF; border: 1px solid #576BDB;" @click='checkBusinessNumber'>检查</el-button>
                </el-form-item>
                <el-form-item label="公司名称：" class="is-required">
                    <el-input class="ml20" :disabled='isShowBusinessNumber' v-model="add.name" placeholder="输入公司名称..."></el-input>
                </el-form-item>
                <el-form-item label="联 系 人：" class="is-required">
                    <el-input class="ml20" v-model="add.contacts" placeholder="输入联系人姓名..."></el-input>
                </el-form-item>
                <el-form-item label="手机号码：" class="is-required">
                    <el-input class="ml20" v-model="add.telephone" placeholder="输入手机号码..."></el-input>
                </el-form-item>
                <el-form-item label="广告公司溢价上限：" class="is-required">
                    <el-input class="w80 ml20" placeholder="输入上限数字..." v-model="add.agencyMaxPremium"></el-input>
                    <span class="ml20">%</span>
                </el-form-item>
                <el-form-item label="广告主溢价上限：" class="is-required">
                    <el-input class="w80 ml20" placeholder="输入上限数字..." v-model="add.advMaxPremium"></el-input>
                    <span class="ml20">%</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addShow = false;add = {}">取 消</el-button>
                <el-button type="primary" @click="confirmAdd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="重置密码" :visible.sync="passwordShow" :type="maskType" width="600px">
            <el-form :model="repeatPassword" label-width="150px">
                <el-form-item label="密码：" class="is-required">
                    <el-input
                        autocomplete="new-password"
                        type="password"
                        class="w245 ml20"
                        v-model="repeatPassword.newPasswd"
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
                <el-button @click="passwordShow = false">取 消</el-button>
                <el-button type="primary" @click="confirmPasw">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="请选择跳转地址" :visible.sync="urlShow" :type="maskType" width="600px">
            <el-form :model="repeatPassword" label-width="150px">
                <el-form-item v-for="(item,index) in urlList" :key="index" label="地址：">
                    <a :href="`http://${item}?uid=${resData.loginName}&password=${resData.password}&parentToken=${adminToken}`" target="_blank">{{item}}</a>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="编辑SaaS代理商" :visible.sync="editShow" :type="maskType" width="600px">
            <el-form :model="edit" label-width="150px" v-show="editShow">
                <el-form-item label="公司名称：" class="is-required">
                    <el-input class="w245 ml20" v-model="edit.name"></el-input>
                    <!-- <input type="text" v-model="edit.name"> -->
                </el-form-item>
                <el-form-item label="联 系 人：" class="is-required">
                    <el-input class="w245 ml20" v-model="edit.contacts"></el-input>
                </el-form-item>
                <el-form-item label="手机号码：" class="is-required">
                    <el-input class="w245 ml20" v-model="edit.telephone"></el-input>
                </el-form-item>
                <el-form-item label="广告公司溢价上限：" class="is-required">
                    <el-input class="w80 ml20" v-model="edit.agencyMaxPremium"></el-input>
                    <span class="ml20">%</span>
                </el-form-item>
                <el-form-item label="广告主溢价上限：" class="is-required">
                    <el-input class="w80 ml20" v-model="edit.advMaxPremium"></el-input>
                    <span class="ml20">%</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editShow = false">取 消</el-button>
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- oem设置 -->
        <admin-oem :oemShow.sync="oemShow" :oem.sync="oem" :oemID.sync="orgID"></admin-oem>
    </div>
</template>
<script>
import { floatScroll, getNowFormatDate } from "@/common/js/utils";
import Search from "@/common/components/search";
import dspButton from "@/common/components/dspButton";
import adminSwitch from "@/common/components/switch";
import Page from "@/common/components/page";
import adminEdit from "@/common/components/dspEdit";
import fileUpload from "@/common/js/fileUpload";
import oem from "@/common/components/setOEM";

export default {
    data() {
        return {
            showOEM: false,
            sTime: getNowFormatDate() + " " + "00:00:00",
            eTime: getNowFormatDate() + " " + "23:59:59",

            tableList: [],
            // admainList: [], //用来存储添加域名数据
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter: {},
            orgID: "",
            addShow: false,
            editShow: false,
            passwordShow: false,
            oemShow: false,
            urlShow: false,
            tableShow: false,
            isImg: false,
            isTrue: false,
            maskType: "",
            addForm: {},
            setFilter: "",
            add: {
                name: ""
            },
            edit: {
                name: "",
                contacts: "",
                telephone: "",
                agencyMaxPremium: "",
                advMaxPremium: ""
            },
            repeatPassword: {},
            imgObj: {},

            newPasswd2: "",
            urlList: [],
            resData:{},
            adminToken: "",
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
            isShowBusinessNumber: false,
        };
    },
    mounted() {
        console.log(this.permission)
        this.getList();
    },
    computed: {
        silderFlag() {
            return this.$store.state.common.silderFlag
        },
        wrap() {
            return this.$refs.wrap;
        }
    },
    watch: {
        silderFlag() {
            $('.table-box').css('marginLeft', '0px');
            $('.h-bar').css('left', '0px');
            this.init()
        }
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
                    this.$message.success("商机编号正确，已自动填充公司名称！");
                }else{
                    this.$message.error("商机编号不正确，请重新输入！");
                }
            } )
        },
        setBancle(val, item) {
            if (val == "" || isNaN(val) || val < 0)
                return this.$message.error("利润必须为大于等于0的数字！");
            if (val > 100) return this.$message.error("利润设置不能超过100%");

            if (val.split(".")[1]) {
                var regLen = val.split(".")[1].length;
                if (regLen > 2) {
                    this.$message.error("保留小数点后两位");
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
        showUrl(item) {
            var adminToken = localStorage.adminToken;
            this.adminToken = Base64.encode(adminToken)
            var urlArr = item.url;
            item = JSON.parse(JSON.stringify(item));
            this.resData = item;
            this.resData.loginName = Base64.encode(this.resData.loginName)
            this.resData.password = Base64.encode(this.resData.password)
            if (urlArr.length == 1) {
                if (urlArr[0] == "") {
                    window.open(
                        "./?uid=" +
                            item.loginName +
                            "&password=" +
                            item.password + 
                            "&parentToken=" + this.adminToken
                    );
                } else {
                    var url = item.url;
                    window.open(
                        "http://" +
                            url +
                            "?uid=" +
                            item.loginName +
                            "&password=" +
                            item.password +
                            "&parentToken=" + this.adminToken
                    );
                }
            } else {
                this.urlList = urlArr;
                this.urlShow = true;
            }
        },
        change(id, state) {
            var tState = state == "10" ? "20" : "10";
            this.$ajax({
                url: "/dsp/admin/dsp/modify/state",
                data: {
                    data: {
                        orgId: id,
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
        search(val) {
            this.pageObj.currentPage = "1";
            this.filter.name = val;
            this.getList();
            this.tableShow = true;
        },
        getList() {
            this.$ajax({
                url: "/dsp/admin/dsp/list",
                load: true,
                data: {
                    eTime: this.eTime,
                    sTime: this.sTime,
                    filter: this.filter,
                    sort: ["cTime,1"],
                    size: this.pageObj.size + "",
                    page: this.pageObj.currentPage + ""
                }
            }).then(res => {
                var tableList = res.data.data;
                if(tableList) {
                    if(tableList.length) {
                        tableList.forEach(function(item) {
                            item.showEdit = true;
                        });
                    }else {
                        tableList = [];
                    } 
                }else {
                    tableList = [];
                }
                this.tableList = tableList;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;

                // this.$nextTick(this.init)
                setTimeout(() => {
                    this.init()
                },1000)
            });
        },
        addSaaS() {
            this.addShow = true;
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
        confirmAdd() {
            var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
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
            if (!this.add.agencyMaxPremium)
                return this.$message.error("请设置广告公司溢价上限");
            if (!this.add.advMaxPremium)
                return this.$message.error("请设置广告主溢价上限");
            if (
                isNaN(this.add.agencyMaxPremium) ||
                this.add.agencyMaxPremium < 0
            )
                return this.$message.error(
                    "广告公司溢价必须为大于等于0的数字！"
                );
            if (this.add.agencyMaxPremium > 100)
                return this.$message.error("广告公司溢价不能超过100%");
            if (isNaN(this.add.advMaxPremium) || this.add.advMaxPremium < 0)
                return this.$message.error(
                    "广告公司溢价必须为大于等于0的数字！"
                );
            if (this.add.advMaxPremium > 100)
                return this.$message.error("广告公司溢价不能超过100%");
            var data = {
                loginName: this.add.loginName,
                name: this.add.name,
                password: this.add.passWord,
                telephone: this.add.telephone,
                contacts: this.add.contacts,
                agencyMaxPremium: this.add.agencyMaxPremium / 100 + "",
                advMaxPremium: this.add.advMaxPremium / 100 + "",
                yingShouOpCode: this.add.businessNumber,
            };
            this.$ajax({
                url: "/dsp/admin/dsp/add",
                data: {
                    data: data
                },
                load: true
            }).then(res => {
                if (res.status == "0") {
                    this.$message.success("提交成功");
                    this.addShow = false;
                    this.add = {};
                    this.getList();
                }
            });
        },
        restPassword(val) {
            this.repeatPassword.orgID = val.id;
            this.repeatPassword.userID = val.userID;
            this.passwordShow = true;
        },
        confirmPasw() {
            if (!this.repeatPassword.newPasswd)
                return this.$message.error("请输入密码");
            if (!this.newPasswd2) return this.$message.error("请再次输入密码");
            if (this.newPasswd2 != this.repeatPassword.newPasswd)
                return this.$message.error("两次密码不一致");
            this.$ajax({
                url: "/dsp/admin/dsp/reset/passwd",
                data: {
                    data: this.repeatPassword
                }
            }).then(res => {
                if (res.status == "0") {
                    this.$message.success("密码重置成功");
                    this.repeatPassword = {};
                    this.newPasswd2 = "";
                    this.passwordShow = false;
                }
            });
        },
        editSaaS(val) {
            this.edit.name = val.name;
            this.edit.contacts = val.contacts;
            this.edit.telephone = val.telephone;
            this.edit.agencyMaxPremium = val.agencyMaxPremium * 100;
            this.edit.advMaxPremium = val.advMaxPremium * 100;
            this.edit.id = val.id;
            this.editShow = true;
        },
        confirmEdit() {
            var reg = /^\d+(?:\.\d{1,4})?$/;
            var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if (!this.edit.name) return this.$message.error("公司名称不能为空");
            if (!this.edit.contacts)
                return this.$message.error("联系人不能为空");
            if (!this.edit.telephone)
                return this.$message.error("联系手机号不能为空");
            if (!myreg.test(this.edit.telephone))
                return this.$message.error("手机号码格式不正确");
            if (!this.edit.agencyMaxPremium)
                return this.$message.error("广告公司溢价设置不能为空");
            if (
                isNaN(this.edit.agencyMaxPremium) ||
                this.add.agencyMaxPremium < 0
            )
                return this.$message.error(
                    "广告公司溢价必须为大于等于0的数字！"
                );
            if (this.edit.agencyMaxPremium > 100)
                return this.$message.error("广告公司溢价不能超过100%");
            if (!this.edit.advMaxPremium)
                return this.$message.error("广告主溢价设置不能为空");
            if (isNaN(this.edit.advMaxPremium) || this.add.advMaxPremium < 0)
                return this.$message.error(
                    "广告公司溢价必须为大于等于0的数字！"
                );
            if (this.edit.advMaxPremium > 100)
                return this.$message.error("广告公司溢价不能超过100%");
            var data = {
                id: this.edit.id,
                name: this.edit.name,
                contacts: this.edit.contacts,
                telephone: this.edit.telephone,
                agencyMaxPremium:
                    parseFloat(this.edit.agencyMaxPremium) / 100 + "",
                advMaxPremium: parseFloat(this.edit.advMaxPremium) / 100 + ""
            };

            this.$ajax({
                url: "/dsp/advertiser/modify",
                data: {
                    data: data
                },
                load: true
            }).then(res => {
                if (res.status == "0") {
                    this.$message.success("提交成功");
                    (this.edit = {
                        name: "",
                        contacts: "",
                        telephone: "",
                        agencyMaxPremium: "",
                        advMaxPremium: ""
                    }),
                        (this.editShow = false);
                    this.getList();
                }
            });
        },
        //查询oem信息
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
        confirmOEM() {
            var arr = [];
            var obj = this.cloneObj(this.oem);
            obj.orgID = this.oemInfos.orgID;

            this.admainList.forEach(function(v, i) {
                if (v.url) {
                    obj.url = v.url;
                    arr.push(obj);
                }
            });
            this.$ajax({
                url: "/dsp/user/oem/modify/agency",
                data: {
                    data: {
                        orgID: this.oemInfos.orgID,
                        oemInfos: arr
                    }
                },
                load: true
            }).then(res => {
                if (res.status == "0") {
                    this.$message.success("提交成功");
                    this.oemShow = false;
                    this.getList();
                }
            });
        },
        encodeURI(item) {
            return window.encodeURI(item)
        },
        //表格
        init() {
            this.floatThead($("#tableInfo thead"),$("#float-thead"),$('#float-thead2'));
            // this.floatBody($("#tableInfo thead"),$("#float-body"))
            floatScroll($("#tableWrap"),function(left){
                $(".float-thead").css({left:left});
                
            })
            $("html,body").scrollTop(0)
        },
        floatThead($thead,$float,$float2) {
            if(!$thead) return;
            var $floatTh = $float.find("th");
            // var $floatTh2 = $float2.find("th");
            var top = $thead.offset().top - 70;
            $float.css($.extend({},{width:$thead.width(),height:$thead.height()},{position:'absolute','z-index':"1",margin:"0",top:0}))
            // 设置宽度
            $thead.find("tr > th").each(function(i,v){
                if($floatTh[i]){
                    $floatTh[i].style.width = v.offsetWidth+"px";
                }
                // if($floatTh2[i]){
                //     $floatTh2[i].style.width = v.offsetWidth+"px";
                // }
            })
            
            $thead.css({visibility: 'hidden'})
            $float.show();

            var oldTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.onscroll = function() {
                top = $thead.offset().top - 70;
                var newTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
                // 判断是否为横向滚动
                if(oldTop == newTop) return;
                oldTop = newTop;
                if(top < oldTop) {
                    $float.css({top:oldTop - top})
                    // $('#float-thead2').css({top:oldTop - top}) 
                } else {
                    $float.css({top:0})
                    // $('#float-thead2').css({top:0}) 
                }
            }
            // 移动滚动条 触发onscroll事件
            document.documentElement.scrollTop++;
            document.body.scrollTop++;
        },
        floatBody($body,$float) {
            if(!$body) return;
            var $floatTh = $float.find("th");
            var $floatTr =$float.find("tbody tr");
            $body.find("tr > th").each(function(i,v){
                if($floatTh[i]){
                    $floatTh[i].style.width = v.offsetWidth+"px";
                }
            })   
            // $("#tableInfo tbody").find("tr").each( function( i, v ){
            //     if($floatTr[i]){
            //         $floatTr[i].style.height = v.offsetHeight+"px";
            //     }
            // } )   
            // $("#float-body").css('top','2px')            
        },    

    },
    components: {
        search: Search,
        dspButton: dspButton,
        adminSwitch: adminSwitch,
        page: Page,
        dspEdit: adminEdit,
        adminOem: oem
    }
};
</script>
<style lang="less">
.w245 {
    width: 245px;
}
.w80 {
    width: 80px;
}

.table {
    // width: 100%;
    .table-top {
        line-height: 60px;
    }
}


// @media screen and (max-width: 1720px) {
//     .dsp_edit{
//         white-space: nowrap;
//     }
// }
</style>


