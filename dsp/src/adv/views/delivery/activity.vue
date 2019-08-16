<template>
    <div class="page-activity">
        <p class="page-title">
            活动管理
            <dsp-button type="primary" @click="addActivity()" v-if="permission.act[62]">
                <i class="el-icon-circle-plus-outline"></i>添加活动
            </dsp-button>
        </p>
        <div class="table">
            <div class="table-top">
                <h3 class="table-title">活动管理({{pageObj.total}})</h3>
                <div class="table-filter">
                    <search placeholder="输入名称..." @search="setFilter($event,'name')"></search>
                    <m-select
                        title="全部状态"
                        :list="statusList"
                        @change="setFilter($event.id,'state')"
                    ></m-select>
                </div>
            </div>
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;">             
                    <div class="slider-content">
                        <table class="table-box" style="width:100%;" id="tableInfo">
                            <thead>
                                <tr>
                                    <th v-if="permission.act[63]">活动状态</th>
                                    <th>活动ID</th>
                                    <th>活动名称</th>
                                    <th>频次</th>
                                    <th>总预算(元)</th>
                                    <th>日预算(元)</th>
                                    <th>活动时间段</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in list" :key="item.activityID">
                                    <td v-if="permission.act[63]">
                                        <m-switch :is-check="item.state == 10" @change="setStatus($event,item)"></m-switch>
                                    </td>
                                    <td>{{item.activityID}}</td>
                                    <td class="el-nowrap">
                                        <dsp-edit
                                            :showEditIcon="permission.act[63]"
                                            :data="item.name"
                                            :showEdit.sync="item.nameEdit"
                                            @change="modify($event,item,'name')"
                                        >{{item.name}}</dsp-edit>
                                    </td>
                                    <td class="el-nowrap">
                                        <dsp-edit
                                            :showEditIcon="permission.act[63]"
                                            v-if="item.frequency != 0"
                                            :data="item.frequency"
                                            :showEdit.sync="item.frequencyEdit"
                                            @change="modify($event,item,'frequency')"
                                        >{{item.frequency}}次/{{item.frequencyUnit=='day'?'天':'小时'}}</dsp-edit>
                                        {{item.frequency == 0? '无限制':''}}
                                    </td>
                                    <td class="el-nowrap">
                                        <dsp-edit
                                            :key="item.id"
                                            :showEditIcon="permission.act[63]"
                                            v-if="item.totalBudget != 0"
                                            :data="item.totalBudget"
                                            :showEdit.sync="item.totalBudgetEdit"
                                            @change="modify($event,item,'totalBudget')"
                                        >{{item.totalBudget|number(2)}}</dsp-edit>
                                        {{item.totalBudget == 0? '无限制':''}}
                                    </td>
                                    <td class="el-nowrap">
                                        <dsp-edit
                                            :key="item.id"
                                            :showEditIcon="permission.act[63]"
                                            v-if="item.dayBudget != 0"
                                            :data="item.dayBudget"
                                            :showEdit.sync="item.dayBudgetEdit"
                                            @change="modify($event,item,'dayBudget')"
                                        >{{item.dayBudget|number(2)}}</dsp-edit>

                                        {{item.dayBudget == 0? '无限制':''}}
                                    </td>
                                    <td class="el-nowrap">
                                        <div v-if="!item.endTime">{{item.startTime}}-不限</div>
                                        <div
                                            v-if="item.endTime"
                                        >{{item.startTime.split(' ')[0]}} — {{item.endTime.split(' ')[0]}}</div>
                                    </td>
                                    <td style="white-space:nowrap">
                                        <dsp-button
                                            type="primary"
                                            plain
                                            size="mini"
                                            round
                                            v-if="permission.act[63]"
                                            @click="addActivity(item.activityID)"
                                        >编辑</dsp-button>
                                        <dsp-button
                                            type="primary"
                                            plain
                                            size="mini"
                                            round
                                            v-if="permission.act[112]"
                                            @click="addOrder('2',item.activityID)"
                                        >添加合约订单</dsp-button>
                                        <dsp-button
                                            type="primary"
                                            plain
                                            size="mini"
                                            round
                                            v-if="permission.act[65]"
                                            @click="addOrder('1',item.activityID)"
                                        >添加竞价订单</dsp-button>
                                        <dsp-button
                                            type="primary"
                                            plain
                                            size="mini"
                                            round
                                            v-if="permission.act[74]"
                                            @click="gotoReport(item)"
                                        >查看报表</dsp-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table-box float-thead" id="float-thead" v-if="list.length || tableShow" ref="floatThead">
                            <thead>
                                <tr>
                                    <th v-if="permission.act[63]">活动状态</th>
                                    <th>活动ID</th>
                                    <th>活动名称</th>
                                    <th>频次</th>
                                    <th>总预算(元)</th>
                                    <th>日预算(元)</th>
                                    <th>活动时间段</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                        </table>                    
                    </div>
                </div> 
            </div>
            <div class="scroll-wrap">
                <div class="h-bar"></div>
            </div>
            <page id="pageToolbar" :page="pageObj" @change="getList"></page>
        </div>
    </div>
</template>
<script>
import {floatScroll} from '@/common/js/utils'
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    data() {
        return {
            tableShow: false,
            list: [],
            filter: {
                state: "10,20"
            },
            statusList: [
                {
                    id: "10,20",
                    value: "全部"
                },
                {
                    id: "10",
                    value: "开启"
                },
                {
                    id: "20",
                    value: "暂停"
                }
            ],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        setFilter(val, attr) {
            this.filter[attr] = val;
            this.pageObj.currentPage = "1";
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
                url: "/dsp/activity/list",
                data: data,
                load: true
            }).then(res => {
                var list = res.data.data || [];
                list.forEach(item => {
                    item.nameEdit = true;
                    item.frequencyEdit = true;
                    item.totalBudgetEdit = true;
                    item.dayBudgetEdit = true;
                })
                this.list = list
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;

                this.tableShow = true;    
                this.$nextTick(this.init)
            });
        },
        addActivity(id) {
            this.$router.push({
                name: "delivery.activityAdd",
                params: { id: id }
            });
        },
        setStatus(value, item) {
            this.$ajax({
                url: "/dsp/activity/modify",
                data: {
                    data: {
                        state: value ? "10" : "20",
                        activityID: item.activityID
                    }
                },
                load: true
            }).then(res => {
                item.state == "10" ? "20" : "10";
            },res => {
                // item.state=
            });
        },
        gotoReport(item) {
            this.$router.push({
                name: "report.delivery.activity",
                params: { activityID: item.activityID }
            });
        },
        modify(value, item, attr) {
            var data = {
                activityID: item.activityID,
            }
            data[attr] = value;
            if(attr == 'name') {
                if(value.length > 30) {
                    this.$message.error('活动名称最多为35字符!')
                    return;
                }
            }else {
                // 0表示无限制 
                if(attr == 'totalBudget') {
                    if(Number(value) < Number(item.dayBudget) && Number(value) != 0) {
                        this.$message.error('日预算不可以大于总预算!')
                        return;
                    }
                }else if(attr == 'dayBudget') {
                    if(Number(value) > Number(item.totalBudget) && Number(item.totalBudget) != 0) {
                        this.$message.error('日预算不可以大于总预算!')
                        return;
                    }
                    if(Number(item.totalBudget) > 0 && Number(value) == 0) {
                        this.$message.error('日预算不可以大于总预算!')
                        return;
                    }
                }
                
            }            
            this.$ajax({
                url: "/dsp/activity/modify",
                data: {
                    data: data
                }
            }).then(res => {
                item[attr+"Edit"] = true;
                item[attr] = value;
                this.$message.success("操作成功");
            });
        },
        addOrder(type,activityID) {
            this.$router.push({  
                name:'delivery.newOrder',   
                query:{           
                    oType: type ,
                    orderId: '',
                    activeId: activityID
                }
            })
        },
   
    }
};
</script>
<style lang="less">
.page-activity {
    .page-title {
        .el-button {
            width: 192px;
            height: 45px;
        }
    }
}

</style>
