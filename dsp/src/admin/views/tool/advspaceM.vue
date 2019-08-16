<template>
    <div class="audiences-page">
        <p class="page-title">广告位管理</p>
        <div class="table">
            <div class="table-top">
                <h3 class="table-title">广告位管理({{pageObj.total}})</h3>
                <div class="table-filter">
                    <search placeholder="搜索app名称" @search="search"></search>
                    <m-select title="全部状态" :list="stateList" @change="selectState($event,'state')"></m-select>
                    <m-select title="全部接入方式" :list="dockingWayList" @change="selectState($event,'dockingWay')"></m-select>
                    <m-select title="全部广告位形式" :list="advTypeList" @change="selectState($event,'adType')"></m-select>
                    <m-select title="全部归属类别" :list="mediaTypeList" @change="selectState($event,'spaceType')"></m-select>
                </div>
            </div>
            <div class="">            
                <table class="table-box">
                    <thead>
                        <tr>
                            <th style="width: 60px"></th>
                            <th>APP状态</th>
                            <th>APP名称</th>
                            <th style="width: 300px;">所属平台</th>
                            <!-- <th>APP分类</th> -->
                            <!-- <th>操作</th> -->
                            <!-- <th>操作</th> -->
                        </tr>
                    </thead>
                    <tbody v-for="item in list" :key="item.id">
                        <tr>
                            <td>
                                <span
                                    v-show="item.spaceInfo"
                                    @click="showSub(item)"
                                    class="icon-toggle"
                                    :class="{'el-icon-remove-outline': item.flag,'el-icon-circle-plus-outline':!item.flag}"
                                ></span>
                                <i v-show="item.flag" class="icon mb icon-tri-arrow-up"></i>
                            </td>
                            <td>
                                <m-switch :isCheck="item.state == '10'" @change="setAppStatus($event,item)">展示资源</m-switch>
                            </td>
                            <td>{{item.adxAppName}}</td>
                            <td>{{item.platform == '1' ? 'Android' : 'iOS'}}</td>
                            <!-- <td>-</td> -->
                            <!-- <td>{{item.comment || '-'}}</td> -->
                            <!-- <td>
                                <dsp-button
                                    @click="editApp(item)"
                                    type="primary"
                                    plain
                                    size="mini"
                                    round
                                >编辑</dsp-button>
                            </td> -->
                        </tr>
                        <tr v-show="item.flag">
                            <td class="table-td" colspan="99">
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>广告位状态</th>
                                            <th>广告位名称</th>
                                            <th>广告位类型</th>
                                            <th>广告位尺寸</th>
                                            <th>接入方式</th>
                                            <th>归属类别</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="(i,index) in item.spaceInfo" :key="index">
                                            <td></td>
                                            <td><m-switch :isCheck="i.state == '10'" @change="setSpaceStatus($event,i)"></m-switch></td>
                                            <td>{{i.adxSpaceName}}</td>
                                            <td>{{adType[i.adType]}}</td>
                                            <td>{{i.width}}&times;{{i.height}}</td>
                                            <td>{{dockingWayT[i.dockingWay]}}</td>
                                            <td>{{i.spaceTypeName}}</td>
                                            <td>
                                                <dsp-button
                                                    type="primary"
                                                    plain
                                                    size="mini"
                                                    round
                                                    @click="editSpace(i)"
                                                >编辑</dsp-button>
                                            </td>                                        
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <page :page="pageObj" @change="getList"></page>
            </div>
        </div>
        
        <!-- 编辑APP -->
        <el-dialog title="编辑App" :visible.sync="appDialogVisible" width="600px">
            <el-form label-width="120px">
                <el-form-item label="App名称">
                    <el-input v-model="adxAppInfo.name"></el-input>
                </el-form-item>
                <!-- <el-form-item label="App">
                    <el-input v-model="arrive.url"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="appDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addArrive()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑接入方式 -->
        <el-dialog title="编辑" :visible.sync="dockingWayDialogVisible" width="600px">
            <el-form label-width="120px">
                <el-form-item label="接入方式 :">
                    <m-select :title.sync="dockingWayTitle" :list="dockingWayListE" :idVal.sync="dockingWayE" @change="editSpaceDockingWay"></m-select>
                </el-form-item>   
                <el-form-item label="归属类别 :">
                    <m-select :title.sync="mediaWayTitle" :list="mediaWayListE" :idVal.sync="mediaWayE" @change="editSpaceMediaWay"></m-select>
                </el-form-item>               
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dockingWayDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dockingWayOk()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import NavTool from "@/common/components/NavTool";

export default {
    components: {
        NavTool
    },
    computed: {
        userInfo() {
            return this.$store.state.common.userInfo;
        }
    },
    data() {
        return {
            dockingWayT: ['-','PB API','JSON API','SDK(私有)','JSSDK'],
            adType: ['-','banner','开屏','插屏','视屏贴片','原生','激励视频'],
            dockingWayTitle: '全部接入方式',
            mediaWayTitle: '全部归属类别',
            dockingWayE: '',
            mediaWayE: '',
            navList: [],
            list: [],
            filter: {},
            stateList:[
                {value:'全部状态'},
                {value:'正常',id:'10'},
                {value:'暂停',id:'20'},
                {value:'归档',id:'30'},
                {value:'删除',id:'40'},
                {value:'行投放',id:'50'}
            ],
            dockingWayList: [
                {value:'全部接入方式'},
                {value:'PB API',id:'1'},
                {value:'JSON API',id:'2'},
                {value:'SDK(私有)',id:'3'},
                {value:'JSSDK',id:'4'}
            ],
            dockingWayListE: [
                {value:'PB API',id:'1'},
                {value:'JSON API',id:'2'},
                {value:'SDK(私有)',id:'3'},
                {value:'JSSDK',id:'4'}
            ],
            mediaWayListE: [
                {value:'精选媒体',id:'10'},
                {value:'推荐媒体',id:'11'},
                {value:'激励视频媒体',id:'12'}
            ],
            advTypeList: [
                {value:'全部广告位类型'},
                {value:'banner',id:'1'},
                {value:'开屏',id:'2'},
                {value:'插屏',id:'3'},
                {value:'视屏贴片',id:'4'},
                {value:'原生',id:'5'},
                {value:'激励视频',id:'6'}
            ],
            mediaTypeList: [
                {value:'全部归属类别'},
                {value:'精选媒体',id:'10'},
                {value:'推荐媒体',id:'11'},
                {value:'激励视频媒体',id:'12'},
            ],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            appDialogVisible: false,
            dockingWayDialogVisible: false,
            adxAppInfo: {},
            adxSpaceInfo: {},
            logoutType: "true",
        };
    },
    created() {
        this.getList();
    },
    watch: {
        dockingWayDialogVisible(val) {
            if(!val) {
                this.dockingWayE = '';
                this.mediaWayE = '';
            }
        }
    },
    methods: {
        //编辑App名称确定
        addArrive() {
            
        },
        //过滤app
        search(val) {
            this.filter.name = val;
            this.pageObj.currentPage = "1";
            this.getList();
        },
        //过滤
        selectState(val, type) {
            this.filter[type] = val.id;
            this.pageObj.currentPage = "1";
            this.getList();
        },
        //获取广告位list
        getList() {
            var data = {
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + "",
                filter: this.filter,
                sort: ["cTime,1"]
            };
            this.$ajax({
                url: "/dsp/admin/dsp/adx/app/space/list",
                data: data,
                load: true
            }).then(res => {
                var list = res.data.data;
                var spaceList = {
                    "0": '-',
                    '10': '精选媒体',
                    '11': '推荐媒体',
                    '12': '激励视频媒体'
                }
                list.forEach(item => {
                    item.flag = false;
                    if( item.spaceInfo ){
                        item.spaceInfo.forEach( i => {
                            i.spaceTypeName = spaceList[i.spaceType]
                        } )
                    }
                });
                // 获得列表
                this.list = list;
                // 分页
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
            });
        },
        //展示广告位信息
        showSub(item) {
            item.flag = !item.flag;
        },
        //编辑app
        editApp(item) {
            this.appDialogVisible = true;
            this.adxAppInfo.name = item.adxAppName;
        },
        //编辑广告位
        editSpace(item) {
            this.dockingWayDialogVisible = true;
            this.dockingWayE = item.dockingWay;
            this.dockingWayTitle = this.dockingWayT[item.dockingWay];
            this.mediaWayTitle = item.spaceTypeName
            this.mediaWayE = item.spaceType
            this.adxSpaceInfo = JSON.parse(JSON.stringify(item));
        },
        //编辑接入方式
        editSpaceDockingWay(val) {
            this.adxSpaceInfo.dockingWayE = val.id;          
        },
        //编辑归属类别
        editSpaceMediaWay(val) {
            this.adxSpaceInfo.spaceType = val.id;     
        },
        
        dockingWayOk() {            
            var dockingWay = this.adxSpaceInfo.dockingWayE || this.dockingWayE;
            if(dockingWay == '0') {
                this.$message.error("请选择接入方式！"); 
                return;
            }
            if(this.adxSpaceInfo.spaceType == '0') {
                this.$message.error("请选择归属类别！"); 
                return;
            }
            this.$ajax({
                url: "/dsp/admin/dsp/adx/space/modify/state-dockingWay",
                data: {
                    data: {
                        adxID: this.adxSpaceInfo.adxID,
                        adxAppID: this.adxSpaceInfo.adxAppID,
                        adxSpaceID: this.adxSpaceInfo.adxSpaceID,
                        state: this.adxSpaceInfo.state,
                        dockingWay: this.adxSpaceInfo.dockingWayE || this.dockingWayE,
                        spaceType: this.adxSpaceInfo.spaceType,
                        id: this.adxSpaceInfo.id
                    }
                },
                load: true
            }).then(res => {
                this.$message.success("操作成功");
                this.dockingWayDialogVisible = false;
                this.getList()
            })
        },
        //修改app状态
        setAppStatus(val, item) {
            this.$ajax({
                url: "/dsp/admin/dsp/adx/app/modify/state",
                data: {
                    data: {
                        adxID: item.adxID,
                        adxAppID: item.adxAppID,
                        state: val ? "10" : "20"    // space状态, 10正常 20暂停 30归档 40删除  50行投放
                    }
                },
                load: true
            }).then(res => {
                this.$message.success("操作成功");
            });
        },
        //修改广告位状态
        setSpaceStatus(val, item) {
            this.$ajax({
                url: "/dsp/admin/dsp/adx/space/modify/state-dockingWay",
                data: {
                    data: {
                        adxID: item.adxID,
                        adxAppID: item.adxAppID,
                        adxSpaceID: item.adxSpaceID,
                        state: val ? "10" : "20",
                        dockingWay: item.dockingWay,
                        id: item.id
                    }
                },
                load: true
            }).then(res => {
                this.$message.success("操作成功");
            });
        }
    }
};
</script>

<style lang="less">
.audiences-page {
    .w100 {
        width: 100% !important;
    }
    .page-title {
        .btn-info {
            float: none;
            button {
                width: 200px;
                vertical-align: super;
            }
        }
        .btn-add {
            button {
                width: 200px;
                height: 45px;
                vertical-align: middle;
                i {
                    font-size: 18px;
                    margin-right: 10px;
                    vertical-align: middle;
                }
            }
        }
    }
    .table table.table-box td:first-child {
        padding-left: 0;
        text-align: center;
        position: relative;
        .icon-tri-arrow-up {
            color: #6b9dff;
            position: absolute;
            bottom: -5px;
            font-size: 16px;
            left: 50%;
            margin-left: -8px;
        }
    }
    .table-td {
        padding: 0 !important;
        table {
            width: 100%;
            border-collapse: collapse;
            thead tr {
                background-color: #ebebeb;
                th:first-child {
                    width: 60px;
                    background-color: #6b9dff;
                }
            }
            tbody tr td:first-child {
                width: 60px;
                background-color: #e4f5ff;
            }
        }
    }
    .icon-toggle {
        font-size: 22px;
        color: #6b9dff;
        cursor: pointer;
    }
}
</style>
