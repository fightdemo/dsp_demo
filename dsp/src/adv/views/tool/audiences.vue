<template>
    <div class="audiences-page">
        <NavTool name="监测管理" :navList="navList" :userInfo="userInfo" :logoutType="logoutType"></NavTool>
        <div class="page-title">网站监测管理
            <dsp-button class="btn-info" size="small" type="success" round @click="lpDialogVisible = true">查看落地页修改用例</dsp-button>
            <dsp-button class="btn-add" type="primary" @click="showMask(1)" v-if="permission.act[69]">
                <i class="icon mb icon-plus-o"></i>创建监测站点
            </dsp-button>
        </div>
        <div class="table content">
            <div class="table-top">
                <h3 class="table-title">监测列表({{pageObj.total}})</h3>
                <div class="table-filter">
                    <search placeholder="监测站点名称" @search="search"></search>
                    <m-select title="全部状态" :list="stateList" @change="selectState"></m-select>
                </div>
            </div>
            <table class="table-box">
                <thead>
                    <tr>
                        <th style="width: 60px"></th>
                        <th>状态</th>
                        <th>监测站点名称</th>
                        <th style="width: 300px;">监测站点链接</th>
                        <th>转化点数量</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody v-for="item in list" :key="item.id">
                    <tr>
                        <td>
                            <span
                                v-show="item.events"
                                @click="showSub(item)"
                                class="icon-toggle"
                                :class="{'el-icon-remove-outline': item.flag,'el-icon-circle-plus-outline':!item.flag}"
                            ></span>
                            <i v-show="item.flag" class="icon mb icon-tri-arrow-up"></i>
                        </td>
                        <td>
                            <m-switch :isCheck="item.state == 10" @change="setStatus($event,item)"></m-switch>
                        </td>
                        <td>{{item.name}}</td>
                        <td>{{item.url}}</td>
                        <td>{{item.events?item.events.length:0}}</td>
                        <td>{{item.comment || '-'}}</td>
                        <td>
                            <dsp-button
                                @click="showCode(item,'arrive')"
                                type="primary"
                                plain
                                size="mini"
                                round
                            >获取代码</dsp-button>
                            <dsp-button
                                v-if="permission.act[69] && (!item.events || item.events.length < 3 )"
                                @click="showMask(2,item)"
                                type="primary"
                                plain
                                size="mini"
                                round
                            >创建转化监测点</dsp-button>
                        </td>
                    </tr>
                    <tr v-show="item.flag">
                        <td class="table-td" colspan="99">
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>序号</th>
                                        <th>转化点名称</th>
                                        <th>备注</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="(i,index) in item.events" :key="index">
                                        <td></td>
                                        <td>{{index+1}}</td>
                                        <td>{{i.name}}</td>
                                        <td>{{i.comment}}</td>
                                        <td>
                                            <dsp-button
                                                type="primary"
                                                plain
                                                size="mini"
                                                round
                                                @click="showCode(i,'change');"
                                            >获取代码</dsp-button>
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
        <!-- 落地页修改用例 -->
        <lp-box :visible.sync="lpDialogVisible"></lp-box>
        <!-- 代码弹窗 -->
        <el-dialog title="html代码" :visible.sync="htmlDialogVisible" width="600px">
            <el-input class="w100" type="textarea" ref="codeInput" :rows="10" readonly v-model="code"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="htmlDialogVisible = false">返 回</el-button>
                <el-button type="primary" @click="copy()">复 制</el-button>
            </span>
        </el-dialog>
        <!-- 监测站点弹窗 -->
        <el-dialog title="新增监测站点" :visible.sync="siteDialogVisible" width="600px">
            <el-form label-width="120px">
                <el-form-item label="监测站点名称">
                    <el-input v-model="arrive.name"></el-input>
                </el-form-item>
                <el-form-item label="监测站点url">
                    <el-input v-model="arrive.url"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="siteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addArrive()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 转化弹窗 -->
        <el-dialog title="创建到达监测站点" :visible.sync="conversionDialogVisible" width="600px">
            <el-form label-width="120px">
                <el-form-item label="监测点名称">
                    <el-input v-model="conversion.name"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :rows="3" v-model="conversion.comment"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="conversionDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addConversion()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import NavTool from "@/common/components/NavTool";
import lpBox from "@/common/components/loadingPageInfo";

export default {
    components: {
        NavTool,
        lpBox
    },
    computed: {
        userInfo() {
            return this.$store.state.common.userInfo;
        }
    },
    data() {
        return {
            navList: [],
            list: [],
            filter: {},
            stateList:[
                {value:'全部状态'},
                {value:'开启',id:'10'},
                {value:'关闭',id:'20'},
            ],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            lpDialogVisible: false,
            htmlDialogVisible: false,
            siteDialogVisible: false,
            conversionDialogVisible: false,
            arrive: {},
            conversion: {},
            code: "",
            logoutType: "true",
        };
    },
    created() {
        this.getList();
    },
    methods: {
        search(val) {
            this.filter.name = val;
            this.pageObj.currentPage = "1";
            this.getList();
        },
        selectState(item) {
            this.filter.state = item.id;
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
                url: "/dsp/monitor/list",
                data: data,
                load: true
            }).then(res => {
                var list = res.data.data;
                list.forEach(item => {
                    item.flag = false;
                });
                // 获得列表
                this.list = list;
                // 分页
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
            });
        },
        showSub(item) {
            item.flag = !item.flag;
        },

        addArrive() {
            var data = this.arrive;
            if (!data.name) return this.$message.error("请输入监测站点名称！");
            if (!data.url) return this.$message.error("请输入监测站点url！");
            this.add(data);
        },
        addConversion() {
            var data = this.conversion;
            if (!data.name) return this.$message.error("请输入监测站点名称！");
            this.add(data);
        },

        add(data) {
            this.$ajax({
                url: "/dsp/monitor/add",
                data: {
                    data: data
                },
                load: true
            }).then(() => {
                this.$message.success("操作成功");
                this.getList();
                this.siteDialogVisible = false;
                this.conversionDialogVisible = false;
            });
        },

        showMask(type, item) {
            if (type == 1) {
                this.arrive = {};
                this.siteDialogVisible = true
            } else {
                this.conversion = {
                    parentID: item.id
                };
                this.conversionDialogVisible = true;
            }
        },
        showInfo() {
            layer.open({
                type: 1,
                title: "落地页宏替换",
                content: $(".lp-info-box"),
                area: ["672px", "534px"]
            });
        },

        showCode(item, type) {
            if (type != "arrive") {
                this.code = `<!-- 说明：这一行代码放在页面上 -->\n<script src="http://res1.hubcloud.com.cn/sdk/monitor.js"><\/script>\n\n<!-- 说明：这一行代码放在行为函数上 -->\nadhub_monitor({src: "${
                    item.code
                }",action: "${type}"})`;
            } else {
                this.code = `<script src="http://res1.hubcloud.com.cn/sdk/monitor.js"><\/script>\n<script>adhub_monitor({src: "${
                    item.code
                }",action: "${type}"})<\/script>`;
            }
            this.htmlDialogVisible = true;
        },

        setStatus(val, item) {
            this.$ajax({
                url: "/dsp/monitor/modify/state",
                data: {
                    data: {
                        ids: [item.id],
                        state: val ? "10" : "20"
                    }
                },
                load: true
            }).then(res => {
                this.$message.success("操作成功");
            });
        },
        copy() {
            this.$refs.codeInput.select();
            var successful = document.execCommand("copy");

            window.getSelection().removeAllRanges();

            //提示
            if (successful) {
                this.$message.success("已成功复制");
            } else {
                this.$message.error("浏览器不支持复制");
            }
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
