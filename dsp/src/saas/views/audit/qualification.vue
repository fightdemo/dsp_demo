<template>
    <div class="qua-page">
        <div class="page-title">资质审核</div>

        <div class="content">
            <div class="table content">
                <div class="table-top">
                    <p class="table-title">广告主列表</p>
                    <div class="table-filter">
                        <search placeholder="搜索资质" @search="setFilter('name',$event)"></search>
                        <m-select
                            title="全部审核状态"
                            :list="stateList"
                            @change="setFilter('auditState',$event.id)"
                        ></m-select>
                        <m-select
                            title="全部账户类型"
                            :list="advList"
                            @change="setFilter('adverType',$event.id)"
                            v-if="permission.act[133]"
                        ></m-select>
                    </div>
                </div>
                <table class="table-box">
                    <thead>
                        <tr>
                            <th>广告主ID</th>
                            <th style="width: 20%;">广告主账号</th>
                            <th>广告主名称</th>
                            <th>所属广告公司</th>
                            <th>审核状态</th>
                            <th v-if="permission.act[133]">账户类型</th>
                            <th style="text-align: left;padding-left: 20px;">平台审核</th>
                            <th ng-if="permission.act['审核管理'].sub['广告主审核']">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in list" :key="index">
                            <td>{{item.id}}</td>
                            <td>{{item.loginName}}</td>
                            <td>{{item.name}}</td>
                            <td>{{item.agencyName}}</td>
                            <td>
                                <p v-if="item.auditState==1">待审核</p>
                                <p v-if="item.auditState==2" class="text-success">审核通过</p>
                                <p v-if="item.auditState==3" class="text-danger">审核拒绝</p>
                            </td>
                            <td v-if="permission.act[133]">
                                <dspEditSelect
                                    showEditIcon='true'
                                    :data="item.adverTypeName"
                                    :showEdit.sync='item.adverShowEdit'
                                    @change="modify($event,item)"
                                >{{item.adverTypeName}}</dspEditSelect>
                            </td>
                            <td class="adxList" v-if="item.adxList">
                                <p>
                                    待审核:
                                    <span
                                        v-for="(k,index) in item.adxList.pending"
                                        :key="index"
                                    >{{k.name}}</span>
                                </p>
                                <p>
                                    已通过:
                                    <span
                                        v-for="(k,index) in item.adxList.approved"
                                        :key="index"
                                    >{{k.name}}</span>
                                </p>
                                <p>
                                    已拒绝:
                                    <span
                                        v-for="(k,index) in item.adxList.reject"
                                        :key="index"
                                    >{{k.name}}</span>
                                </p>
                                <p>
                                    未提交:
                                    <span
                                        v-for="(k,index) in item.adxList.uncommit"
                                        :key="index"
                                    >{{k.name}}</span>
                                </p>
                            </td>
                            <td ng-if="permission.act['审核管理'].sub['广告主审核']">
                                <dsp-button type="primary" v-show="item.auditState!=2" @click="showAudit(item)">审核</dsp-button>
                                <dsp-button v-if="item.auditState==2" @click="showAudit(item)">查看</dsp-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <page :page="pageObj" @change="getList"></page>
            </div>
        </div>
        <el-dialog title="资质列表" :visible.sync="dialogVisible" width="600px">
            <el-form ref="form" label-width="160px">
                <el-form-item label="广告主账户类型" v-if="permission.act[133]">
                    <m-Radio :isDisabled="auditState==2" :value.sync="advAccountType" :list="advAccountlist" :size="'big'" :defaultVal="advAccountType"></m-Radio>
                </el-form-item>
                <el-form-item v-for="(item,index) in quaList" :key="index" :label="item.name">
                    <div v-if="item.isString">{{item.url}}</div>
                    <img-button v-if="!item.isString" :url="item.url"></img-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" v-show="auditState != 2" @click="audit(2)">审核通过</el-button>
                <el-button type="danger" v-show="auditState == 1" @click="audit(3)">审核拒绝</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import imgButton from "@/common/components/imgButton"
export default {
    components: {
        imgButton
    },
    data() {
        return {
            dialogVisible: false,
            
            advertiserID: null,
            auditState: null,
            advAccountType: '1',
            list: [],
            quaList:[],
            stateList: [
                { value: "全部审核状态" },
                { id: "1", value: "待审核" },
                { id: "2", value: "审核通过" },
                { id: "3", value: "审核拒绝" }
            ],
            advList: [
                { value: "全部账户类型" },
                { id: "1", value: "正企类广告主" },
                { id: "2", value: "效果类广告主" },
            ],
            advAccountlist: [
                {'label':'1', 'name':'正企类广告主'},
                {'label':'2', 'name':'效果类广告主'}
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
        //账户类型修改
        modify($event, item) {
            this.$ajax({
                url: '/dsp/advertiser/update',
                data:{
                    data: {
                        advertiserID: [item.id],
                        adverType: $event
                    }
                }
            }).then( res => {
                if( res.status == '0' ){
                    this.$message.success("操作成功")
                    item.adverShowEdit = true;
                    item.adverType = $event;
                    var adverTypeList = {
                        "1": "正企类广告主",
                        "2": "效果类广告主"
                    }
                    item.adverTypeName = adverTypeList[$event];
                }
            } )
        },
        setFilter(attr, val) {
            this.pageObj.currentPage = "1";
            this.filter[attr] = val;
            this.pageObj.currentPage = 1;
            this.getList();
        },
        getList() {
            // console.log( pageObj )
            // this.pageObj = pageObj || {
            //     currentPage: 1,
            //     size: 20
            // };
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/advertiser/list",
                data: data,
                load: true
            })
                .then(res => {
                    var list = res.data.data || [],
                        ids = [];
                    var adverTypeList = {
                        "1": "正企类广告主",
                        "2": "效果类广告主"
                    }
                    list.forEach(item => {
                        ids.push(item.id);
                        item.adverTypeName = adverTypeList[item.adverType]
                        item.adverShowEdit = true
                    });
                    this.list = list;
                    this.pageObj.total = res.data.total;
                    this.pageObj.currentPage = res.data.page;
                    return ids;
                })
                .then(this.getAdxAudit);
        },
        getAdxAudit(ids) {
            if (ids.length == 0) return;
            this.$ajax({
                url: "/dsp/advertiser/adx/auditList",
                load: true,
                data: {
                    data: ids
                }
            }).then(res => {
                // 获得列表
                ids.forEach((v, i) => {
                    this.$set(this.list[i],"adxList",res.data[v])
                });
            });
        },
        showAudit(item) {
            this.advAccountType = item.adverType
            this.advertiserID = item.id;
            this.auditState = item.auditState;
            this.$ajax({
                url: "/dsp/advertiser/qualification/list",
                load: true,
                data: {
                    sort: ["cTime,1"],
                    filter: {
                        orgID: item.id
                    }
                }
            }).then(res => {
                // 获得列表
                this.quaList = res.data;
                this.dialogVisible = true;
            });
        },
        audit(state) {
            var data;
            if( this.permission.act[133] ) {
                data = {
                    advertiserID: [this.advertiserID],
                    auditState: state + "",
                    adverType: this.advAccountType + ""
                }
            }else{
                data = {
                    advertiserID: [this.advertiserID],
                    auditState: state + "",
                }
            }
            this.$ajax({
                url: "/dsp/admin/advertiser/audit",
                load: true,
                data: {data}
            }).then(() => {
                this.$message.success("操作成功!");
                this.dialogVisible = false;
                this.getList();
            });
        }
    }
};
</script>
<style lang="less">
.qua-page {
}
</style>