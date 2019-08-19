<template>
    <div class="adminDirectEx">
        <p class="page-title">定向扩量配置</p>
        <div class="table">
            <div class="table-top">
                <h3 class="table-title">广告主列表</h3>
                <div class="table-filter">
                    <search placeholder="输入广告公司名称或ID..." @search="search"></search>
                    <m-select style="width: 240px;" title="全部代理商" :list="dspList" valueName="dspName" keyName="dspID" @change="selectState($event,'dspID')"></m-select>
                    <m-select style="width: 240px;" title="全部广告公司" :list="agencyList" valueName="agencyName" keyName="agencyID" @change="selectState($event,'agencyID')"></m-select>
                </div>
            </div>
            <div>
                <table class="table-box">
                    <thead>
                        <tr>
                            <th>功能开关</th>
                            <th>广告主ID</th>
                            <th>广告主名称</th>
                            <th>所属广告公司</th>
                            <th>广告公司类型</th>
                            <th>所属代理商</th>
                            <th>扩量比例</th>
                            <th>扩量跟随</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list" :key="item.advertiserID">
                            <td>
                                <m-switch :is-check="item.state == '1'" @change="setAppStatus(item.advertiserID, item.state)">展示资源</m-switch>
                            </td>
                            <td>{{item.advertiserID}}</td>
                            <td>{{item.advertiserName}}</td>
                            <td>{{item.agencyName}}</td>
                            <td>{{item.isDirectFlag}}</td>
                            <td>{{item.dspName}}</td>
                            <td>{{item.directRate}}（定向）：{{item.spreadRate}}（扩量）</td>
                            <td>{{item.followDirectFlag}}</td>
                            <td>
                                <dsp-button
                                type="primary"
                                plain
                                round
                                size="mini"
                                @click="editBtn(item)"
                            >编辑</dsp-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <page :page="pageObj" @change="getList"></page>
            </div>
            <el-dialog title="创建检测站点" :visible.sync="dialogVisible" width="600px">
                <el-form ref="form" label-width="160px">
                    <el-form-item label="扩量比例设置：">
                        定向
                        <el-input style="width: 80px;" v-model="directRate"  type="number"></el-input>
                        ：扩量
                        <el-input style="width: 80px; margin-right: 20px;" v-model="spreadRate" type="number"></el-input>
                        <el-checkbox v-model="followDirect">比例自动跟随</el-checkbox>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button style="width: 100px;" type="success" @click="saveEdit">完成</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            dspList: [],
            agencyList: [],
            adCompanyList: [],
            dialogVisible: false,
            directRate: '1',
            spreadRate: '1',
            followDirect: true,  //比例自动跟随
            advertiserID: "",   //广告主ID，编辑中使用
            filter: {},
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            list: [],
        }
    },
    mounted(){
        this.getList()
        this.getDsp()
        this.getAgency()
    },
    methods: {
        saveEdit() {
            var data = {
                directRate: this.directRate,
                spreadRate: this.spreadRate,
                followDirect: this.followDirect ? '1' : '0',
                advertiserID: this.advertiserID
            }
            this.$ajax({
                url: '/dsp/order/spread/adv/modify/rate',
                data: {
                    data
                },
                load: true
            }).then( res => {
                if( res.status == '0' ){
                    this.$message.success('操作成功')
                    this.dialogVisible =false;
                    this.getList();
                }
            } )
        },
        editBtn(item) {
            this.dialogVisible =true;
            //回填
            this.directRate = item.directRate
            this.spreadRate = item.spreadRate
            this.followDirect = item.followDirect == '1' ? true : false
            this.advertiserID = item.advertiserID
        },
        setAppStatus(advertiserID,state) {
            var tState = state == "1" ? "0" : "1";
            this.$ajax({
                url: "/dsp/order/spread/adv/modify/state",
                data: {
                    data: {
                        AdvertiserID: advertiserID,
                        state: tState
                    }
                },
                load: true
            }).then(res => {
                if (res.status == "0") {
                    this.$message.success("操作成功")
                    this.getList();
                }
            });
        },
        search(val) {
            this.filter.name = val;
            this.pageObj.currentPage = "1";
            this.getList();
        },
        selectState(val, type) {
            if( type == 'dspID' ){
                this.getAgency(val.dspID)
            }
            this.filter[type] = val[type];
            this.pageObj.currentPage = "1";
            this.getList();
        },
        getDsp() {
            this.$ajax({
                url: "/dsp/rpt/admin/dspname",
                data: {}
            }).then(res => {
                this.dspList = res.data;
                this.dspList.unshift({ dspName: "全部代理商" });
            });
        },
        getAgency(data) {
            this.$ajax({
                url: "/dsp/rpt/admin/Agency",
                data: {
                    filter: {
                        dspID: data
                    }
                }
            }).then(res => {
                this.agencyList = res.data.data;
                this.agencyList.unshift({ agencyName: "全部广告公司" });
            });
        },
        getList(){
            this.$ajax({
                url: "/dsp/order/spread/adv/list",
                data: {
                    page: this.pageObj.currentPage + "",
                    size: this.pageObj.size + "",
                    filter: this.filter,
                    sort: [],
                },
                load: true
            }).then( res => {
                let list = res.data.data
                list.forEach( item => {
                    item.isDirectFlag = item.isDirect == '0' ? '普通广告公司' : '直客广告公司'
                    item.followDirectFlag = item.followDirect == '1' ? '使用' : '不使用'
                } )
                this.list = list
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
            } )
        }
    }
}
</script>
<style lang="less">

</style>
