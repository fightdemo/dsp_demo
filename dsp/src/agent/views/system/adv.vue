<template>
    <div class="adv-page">
        <div class="page-title">广告主管理</div>
        <div class="table content">
            <div class="table-top">
                <p class="table-title">账户管理列表</p>
                <div class="table-filter">
                    <search @search="search" placeholder="用户名"></search>
                    <dsp-button type="success" @click="newAdv()">添加新用户</dsp-button>
                </div>
            </div>
            <div id="scrollWrap" style="overflow:hidden;">        
                <div id="tableWrap" style="overflow-x:scroll;">
                    <table class="table-box" style="width:100%;" id="tableInfo">
                        <thead>
                            <tr>
                                <th v-if="permission.act['29']">状态</th>
                                <th>广告主ID</th>
                                <th>公司名</th>
                                <th>用户名</th>
                                <th>联系人</th>
                                <th>手机号</th>
                                <th>广告交易平台审核状态</th>
                                <th v-if="permission.view['87']">利润设置</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in list" :key="item.id">
                                <td v-if="permission.act['29']">
                                    <m-switch :isCheck="item.state == 10" @change="setStatus($event,item)"></m-switch>
                                </td>
                                <td>{{item.id}}</td>
                                <td ng-bind>{{item.name}}</td>
                                <td ng-bind>{{item.loginName}}</td>
                                <td ng-bind>{{item.contacts}}</td>
                                <td ng-bind>{{item.telephone}}</td>
                                <td>
                                    <p v-if="item.auditState == 1">待审核</p>
                                    <p class="text-success" v-if="item.auditState == 2">审核通过</p>
                                    <p class="text-danger" v-if="item.auditState == 3">审核拒绝</p>
                                </td>
                                <td v-if="permission.view['87']" style="white-space:nowrap;">
                                    <dsp-edit
                                        :showEditIcon="permission.act['30'] && item.canSetPremiun"                             
                                        :data="((item.premium||0)*100).toFixed(2)"
                                        :showEdit.sync="item.showEdit"
                                        @change="profitSet($event,item)"
                                    >{{((item.premium||0)*100).toFixed(2)}}%</dsp-edit>
                                    <!-- <p
                                        style="position: relative;"
                                        v-if="!(permission.act['30']) || !item.canSetPremiun"
                                    > -->
                                        <!-- {{((item.premium||0)*100).toFixed(2)+'%'}} -->
                                        <!-- <img
                                            ng-mouseenter="tips($event)"
                                            onmouseleave="layer.closeAll();"
                                            src="./images/icon_helpIfo.png"
                                        >-->
                                    <!-- </p> -->
                                </td>
                                <td style="white-space:nowrap">
                                    <dsp-button
                                        type="primary"
                                        plain
                                        size="mini"
                                        round
                                        v-if="item.auditState != 2"
                                        @click="showQua(item.id)"
                                    >资质上传</dsp-button>
                                    <dsp-button
                                        type="primary"
                                        plain
                                        size="mini"
                                        round
                                        v-if="permission.act['32']"
                                        @click="showRePwd(item.id)"
                                    >重置密码</dsp-button>
                                    <dsp-button
                                        type="primary"
                                        plain
                                        size="mini"
                                        round
                                        v-if="permission.act['29']"
                                        @click="updateAdv(item.id,item.canSetPremiun)"
                                    >编辑</dsp-button>
                                    <dsp-button
                                        type="primary"
                                        plain
                                        size="mini"
                                        round
                                        v-if="domainList.length > 0"
                                        @click="updateDomain(item.id)"
                                    >绑定域名</dsp-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="list.length || tableShow" ref="floatThead">
                        <thead>
                            <tr>
                                <th v-if="permission.act['29']">状态</th>
                                <th>广告主ID</th>
                                <th>公司名</th>
                                <th>用户名</th>
                                <th>联系人</th>
                                <th>手机号</th>
                                <th>广告交易平台审核状态</th>
                                <th v-if="permission.view['87']">利润设置</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                    </table>                    
                </div>
             </div>
            <div class="scroll-wrap">
                <div class="h-bar"></div>
            </div>
            <page id="pageToolbar" :page="pageObj" @change="getAdvList"></page>
        </div>
        <!-- 广告主弹窗 -->
        <el-dialog :title="adv.title" :visible.sync="advDialogVisible" width="600px">
            <el-form ref="form" :model="adv" label-width="120px">
                <el-form-item class="is-required" label="账户名" v-show="!adv.id">
                    <el-input v-model="adv.loginName"></el-input>
                </el-form-item>
                <el-form-item class="is-required" label="密码" v-show="!adv.id">
                    <el-input autocomplete="new-password" type="password" v-model="adv.passWord"></el-input>
                </el-form-item>
                <el-form-item class="is-required" label="重复密码" v-show="!adv.id">
                    <el-input autocomplete="new-password" type="password" v-model="adv.passWord2"></el-input>
                </el-form-item>
                <el-form-item class="is-required" label="公司网站">
                    <el-input v-model="adv.wwwUrl" placeholder="http(s)://"></el-input>
                </el-form-item>
                <el-form-item class="is-required" label="公司名称">
                    <el-input v-model="adv.name"></el-input>
                </el-form-item>
                <el-form-item class="is-required" label="品牌">
                    <el-input v-model="adv.brand"></el-input>
                </el-form-item>
                <el-form-item label="公司简称">
                    <el-input v-model="adv.shortName"></el-input>
                </el-form-item>
                <el-form-item class="is-required" label="角色">
                    <m-select
                        :title="adv.roleName"
                        valueName="name"
                        :list="roleList"
                        @change="selectRole"
                    ></m-select>
                </el-form-item>
                <el-form-item class="is-required" label="行业大类">
                    <m-select
                        :title="adv.industryOne"
                        valueName="name"
                        :list="industryOneList"
                        @change="selectOne"
                    ></m-select>
                </el-form-item>
                <el-form-item class="is-required" label="行业小类">
                    <m-select
                        :title.sync="adv.industryTwo"
                        valueName="name"
                        :list="industryTwoList"
                        @change="selectTwo"
                    ></m-select>
                </el-form-item>
                <el-form-item class="is-required" label="域名" v-show="domainList.length > 0">
                    <m-select
                        :title="adv.domainTitle"
                        valueName="name"
                        keyName="name"
                        :list="domainList"
                        @change="selectDomain"
                    ></m-select>
                </el-form-item>
                <el-form-item class="is-required" label="联系人">
                    <el-input v-model="adv.contacts"></el-input>
                </el-form-item>
                <el-form-item class="is-required" label="手机号">
                    <el-input v-model="adv.telephone"></el-input>
                </el-form-item>
                <el-form-item class="is-required" label="公司地址">
                    <el-input v-model="adv.address"></el-input>
                </el-form-item>
                <!-- 新建时不判断权限 -->
                <el-form-item class="is-required" label="利润设置" v-show="!adv.id && isDirect != 1">
                    <el-input class="w120" v-model="adv.premium">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="advDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAdv()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 域名弹窗 -->
        <el-dialog title="设置域名" :visible.sync="domainDialogVisible" width="600px">
            <el-form ref="form" :model="adv" label-width="120px">
                <el-form-item label="域名">
                    <m-select
                        :title="adv.domainTitle"
                        valueName="name"
                        :list="domainList"
                        @change="selectDomain"
                    ></m-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="domainDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDomain()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 密码弹窗 -->
        <el-dialog title="重置密码" :visible.sync="pwdDialogVisible" width="600px">
            <el-form ref="form" :model="advPwd" label-width="120px">
                <el-form-item label="密码">
                    <el-input type="password" v-model="advPwd.passWord"></el-input>
                </el-form-item>
                <el-form-item label="重复密码">
                    <el-input type="password" v-model="advPwd.passWord2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="pwdDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="resetAdvPWD()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getNowFormatDate, floatScroll } from "@/common/js/utils";
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    data() {
        return {
            tableShow: false,
            advDialogVisible: false,
            domainDialogVisible: false,
            pwdDialogVisible: false,
            profitsDialogVisible: false,
            total: {},
            list: [],
            filter: {},
            profits: {},
            advPwd: {},
            adv: {},
            industryOneList: [],
            industryTwoList: [],
            roleList: [],
            domainList: [],
            premiumMax: 0.6,
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            eTime: getNowFormatDate() + " 23:59:59",
            sTime: getNowFormatDate() + " 00:00:00"
        };
    },
    computed: {
        isDirect() {
            return this.$store.state.isDirect;
        },
        userInfo() {
            return this.$store.state.common.userInfo;
        },
        permission() {
            return this.$store.state.common.permission;
        }
    },
    created() {
        // console.log(this.permission)
        this.getAdvList();
        this.getIndustry();
        this.getRoleList();
        this.getPremiumMax();
        this.getDomain();
    },
    methods: {
        search(value) {
            this.filter.name = value;
            this.pageObj.currentPage = 1;
            this.getAdvList();
        },
        showQua(id) {
            this.$router.push({
                name: "system.qualification",
                params: { advID: id }
            });
        },
        profitSet(value,item) {
            var premium = (value / 100).toFixed(4),
                id = item.id;
            if (premium < 0) return this.$message.error("利润必须大于等于0！");
            if (premium > this.premiumMax)
                return this.$message.error(
                    "利润设置不能超过" + this.premiumMax * 100 + "%"
                );
            var data = {
                id: id,
                premium: premium
            };
            this.$ajax({
                url: "/dsp/finance/profit/set",
                load: true,
                data: data
            }).then(res => {
                item.showEdit = true;
                item.premium = premium
            });
        },
        showRePwd(id) {
            this.advPwd = {
                id: id
            };
            this.pwdDialogVisible = true;
        },
        newAdv() {
            this.adv = {
                type: "3",
                title: "新建广告主",
                roleName: "请绑定角色",
                premium: "0",
                domainTitle: "请选择域名",
                industryOne: "请选择行业大类",
                industryTwo: "请选择行业小类"
            };
            if (this.isDirect == 1) {
                this.adv.roleID = "2";
                // 直客账户仅允许创建一个广告主
                if (this.list.length == 1) return;
            }
            this.advDialogVisible = true;
        },
        updateAdv(id, canSetPremiun) {
            var data = {
                id: id
            };
            this.$ajax({
                url: "/dsp/advertiser",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                var adv = res.data;
                this.adv = {
                    title: "编辑广告主",
                    roleName: "请绑定角色",
                    id: adv.id,
                    name: adv.name,
                    address: adv.address,
                    brand: adv.brand,
                    contacts: adv.contacts,
                    wwwUrl: adv.wwwUrl,
                    shortName: adv.shortName,
                    parentIndustry: adv.parentIndustry,
                    industry: adv.industry,
                    telephone: adv.telephone,
                    roleID: adv.roleID,
                    domain: adv.domain,
                    domainTitle: adv.domain,
                    canSetPremiun: canSetPremiun,
                    domainTitle: adv.domain
                };
                this.industryOneList.forEach(v => {
                    if (v.id == adv.parentIndustry) {
                        this.adv.industryOne = v.name;
                        this.industryTwoList = v.subType;
                        v.subType.forEach(sv => {
                            if (sv.id == adv.industry) {
                                this.adv.industryTwo = sv.name;
                                return false;
                            }
                        });
                        return false;
                    }
                });

                if (adv.roleID) {
                    this.roleList.forEach(v => {
                        if (v.id == adv.roleID) {
                            this.adv.roleID = v.id;
                            this.adv.roleName = v.name;
                            return false;
                        }
                    });
                }

                this.advDialogVisible = true;
            });
        },
        updateDomain(id) {
            var data = {
                id: id
            };
            this.$ajax({
                url: "/dsp/advertiser",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                var adv = res.data;
                this.adv = {
                    domainTitle: adv.domain,
                    domain: adv.domain,
                    id: adv.id
                };
                this.domainDialogVisible = true;
            });
        },
        editDomain() {
            var adv = this.adv;
            if (!adv.domain) return this.$message.error("请选择域名!");

            this.$ajax({
                url: "/dsp/advertiser/modify",
                load: true,
                data: {
                    data: adv
                }
            }).then(res => {
                this.$message.success("操作成功!");
                this.domainDialogVisible = false;
            });
        },
        resetAdvPWD() {
            var pwd = this.advPwd;
            if (pwd.passWord != pwd.passWord2)
                return this.$message.error("两次密码不一致!");
            this.$ajax({
                url: "/dsp/reset/adv/passwd",
                load: true,
                data: {
                    id: pwd.id,
                    newPasswd: pwd.passWord
                }
            }).then(() => {
                this.pwdDialogVisible = false;
                this.$message.success("修改成功!");
            });
        },
        addAdv() {
            var adv = JSON.parse(JSON.stringify(this.adv)),
                domainReg = /^https?:\/\//,
                phoneReg = /^1\d{10}$/;
            adv.type = "3";
            // adv.roleID = "2";
            var err = this.advCheck();
            if (err) {
                return this.$message.error(err);
            }
            if (!adv.industry) return this.$message.error("请选择行业!");
            if (!adv.roleID) return this.$message.error("请选择角色!");
            // 域名存在时判断是否选择了域名
            if (this.domainList.length > 0 && !adv.domain)
                return this.$message.error("请选择域名!");
            if (adv.passWord != adv.passWord2)
                return this.$message.error("两次密码不相同!");
            if (!domainReg.test(adv.wwwUrl))
                return this.$message.error(
                    "公司网站格式有误!必须以http://或者https://开头"
                );
            if (!phoneReg.test(adv.telephone))
                return this.$message.error("手机号码格式有误!");

            // 判断是否为新建
            if (!adv.id) {
                if (!adv.premium || adv.premium < 0)
                    return this.$message.error("利润必须大于等于0！");
                if (adv.premium > this.premiumMax * 100)
                    return this.$message.error(
                        "利润设置不能超过" + this.premiumMax * 100 + "%"
                    );

                adv.premium = adv.premium / 100 + "";
            }
            adv.canSetPremiun = null;
            this.$ajax({
                url: "/dsp/advertiser/" + (adv.id ? "modify" : "add"), // id存在修改  不存在添加
                load: true,
                data: {
                    data: adv
                }
            }).then(res => {
                this.$message.success("操作成功!");
                this.advDialogVisible = false;
                this.getAdvList();
            });
        },
        setStatus(value, item) {
            var adv = {
                id: item.id,
                state: value ? "10" : "30"
            };
            this.$ajax({
                url: "/dsp/advertiser/modify",
                load: true,
                data: {
                    data: adv
                }
            }).then(() => {
                item.state = item.state == "10" ? "20" : "10";
            });
        },
        getAdvList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/advertiser/list",
                load: true,
                data: data
            }).then(res => {
                var list;
                // 获得列表
                if (res.data) list = res.data.data || [];
                else list = [];
                list.forEach(item => {
                    item.showEdit = true;
                })
                this.list = list;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                
                this.tableShow = true;
                this.$nextTick(this.init)
            });
        },
        // 获得角色列表
        getRoleList() {
            var data = {
                page: "1",
                size: "99999",
                sort: ["cTime,1"],
                filter: {
                    roleType: "1"
                },
                sTime: this.sTime,
                eTime: this.eTime
            };
            this.$ajax({
                url: "/dsp/pri/role/list",
                load: true,
                data: data
            }).then(res => {
                // 获得列表
                this.roleList = res.data.data;
            });
        },
        // 获得行业分类
        getIndustry() {
            this.$ajax({
                url: "/dsp/industry/type",
                load: true,
                data: {}
            }).then(res => {
                // 获得列表
                this.industryOneList = res.data;
            });
        },
        //check广告主
        advCheck() {
            var adv = this.adv,
                error;
            if (!adv.loginName && !adv.id) {
                return (error = "请输入账户名。");
            }
            if (!adv.passWord && !adv.id) {
                return (error = "请输入密码。");
            }
            if (!adv.passWord2 && !adv.id) {
                return (error = "请输入二次密码。");
            }
            if (!adv.wwwUrl) {
                return (error = "请输入公司网站。");
            }
            if (!adv.name) {
                return (error = "请输入公司名称。");
            }
            if (!adv.brand) {
                return (error = "请输入品牌。");
            }
            if (!adv.contacts) {
                return (error = "请输入联系人。");
            }
            if (!adv.telephone) {
                return (error = "请输入手机号。");
            }
            if (!adv.address) {
                return (error = "请输入公司地址。");
            }
        },
        getPremiumMax() {
            this.$ajax({
                url: "/dsp/sys/parameter/query",
                load: true,
                data: {
                    filter: {
                        feature: "dsp.feature.agency.advertiser.profix.maxvalue"
                    }
                }
            }).then(res => {
                this.premiumMax = res.data[0].value * 1 || 0.6;
            });
        },
        getDomain() {
            // 获取域名列表
            this.$ajax({
                url: "/dsp/user/oem/url/list",
                data: {
                    filter: {
                        orgID: this.userInfo.orgID
                    }
                }
            }).then(res => {
                var arr = res.data || [];
                for (var i = 0; i < arr.length; i++) {
                    var domain = arr[i];
                    arr[i] = {
                        name: domain
                    };
                }
                // 获得列表
                this.domainList = arr;
            });
        },
        // 选择角色
        selectRole(item) {
            this.adv.roleID = item.id;
        },
        // 选择域名
        selectDomain(item) {
            this.adv.domain = item.name;
        },
        // 选择行业大类
        selectOne(item) {
            this.industryTwoList = item.subType;
            this.adv.parentIndustry = item.id;
            this.adv.industryTwo = "选择行业小类"
        },
        // 选择行业小类
        selectTwo(item) {
            this.adv.industry = item.id;
        },
    }
};
</script>
<style lang="less">
.adv-page {
    .w120 {
        width: 120px !important;
    }
}
</style>
