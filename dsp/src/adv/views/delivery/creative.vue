<template>
    <div class="page-creative">
        <div class="page-title">素材管理</div>
        <div class="table">
            <div class="table-top">
                <h3 class="table-title">素材列表({{pageObj.total}})</h3>
                <div class="table-filter">
                    <search placeholder="搜索素材名称" @search="search"></search>
                    <m-select
                        :title="firstTitle"
                        :list="activityList"
                        :idVal.sync="activityID"
                        keyName="activityID"
                        valueName="name"
                        @change="changeActivity"
                    ></m-select>
                    <m-select
                        :title.sync="secondTitle"
                        :idVal.sync="id"
                        :list="orderList"
                        keyName="id"
                        valueName="name"
                        @change="changeOrder"
                    ></m-select>
                </div>
            </div>
            <div class="">
                <table class="table-box">
                    <thead>
                        <tr>
                            <th>素材预览</th>
                            <th>素材信息</th>
                            <th>所属订单/活动</th>
                            <th>素材内容</th>
                            <th>监测地址</th>
                            <th>审核状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in list" :key="item.activityID">
                            <td>
                                <div class="material-cover" v-if="item.hasVideo">
                                    <video :src="item.video" style="width:100%;height:100%;"></video>
                                    <div class="material-cover-mask" @click="showVideo(item.video)"></div>
                                </div>
                                <preview
                                    v-if="imgs[i].length"
                                    :imgs="imgs[i]"
                                ></preview>
                            </td>
                            <td>
                                <p>素材ID：{{item.id}}</p><br>
                                <p>素材名称：{{item.name}}</p><br>
                                <p>广告位类型：{{item.adType | adTypes}}</p><br>
                                <p>后续行为：{{item.interactionType | interactionTypes}}</p><br>
                                <p>素材行业：{{item.creativeIndustry}}</p>
                            </td>
                            <td>
                                <p>活动：
                                    <span v-if="item.activitys">
                                        <span v-for="(v,k) in item.activitys" :key="k">{{v.activityName}}{{k == item.activitys.length -1 ? '' : ','}}</span>
                                    </span>
                                </p><br>
                                <p>订单：
                                    <span v-if="item.orders">
                                        <span v-for="(v,k) in item.orders" :key="k">{{v.orderName}}{{k == item.orders.length -1 ? '' : ','}}</span>
                                    </span>
                                </p>
                            </td>
                            <td>
                                <div style="word-break: break-all;" v-if="img.image" v-for="(img,index) in item.material">
                                    <span>{{`图片${index+1}(${img.image.width}x${img.image.height})`}}：{{img.image.url|imgName}}</span>
                                    <span></span><br><br>
                                </div>
                                <div style="word-break: break-all;" v-if="img.video" v-for="(img,index) in item.material">
                                    <span>视频：</span>
                                    <span>{{img.video.url}}</span><br><br>
                                </div>
                                <div style="word-break: break-all;" v-if="img.text" v-for="(img,index) in item.material">
                                    <span>{{`文字${index+1}`}}：</span>
                                    <span>{{img.text.content}}</span><br><br>
                                </div>
                                <div style="word-break: break-all;" v-if="img.data" v-for="(img,index) in item.material">
                                    <span>{{dataType[img.data.type]}}：</span>
                                    <span>{{img.data.content}}</span><br><br>
                                </div>
                                <div style="word-break: break-all;">
                                    落地页：
                                    <dsp-edit showEditIcon="true" style="display:inline-block;" :showEdit.sync="item.flag" :data="item.landingUrl" @change="modifyUrl($event,item)">
                                        {{item.landingUrl}}
                                    </dsp-edit>
                                </div>
                            </td>
                            <td>
                                <p>曝光监测：{{(item.viewUrls||[]).join(',')}}</p><br>
                                <p>点击监测：{{(item.clickUrls||[]).join(',')}}</p><br>
                            </td>
                            <td>
                                <p>系统内审状态：{{item.auditState| auditState}}</p><br>
                                <p>待审核的平台：{{item.adxAuditList.pendingInfo}}</p><br>
                                <p>审核通过的平台：{{item.adxAuditList.approvedInfo}}</p><br>
                                <p>审核拒绝的平台：{{item.adxAuditList.rejectInfo}}</p>
                            </td>
                            <td>
                                <dsp-button
                                    type="warning"
                                    plain
                                    size="mini"
                                    round
                                    @click="check(item)"
                                    style="position: relative"
                                >诊断
                                <i :class="{'icon fa fa-exclamation-circle':!item.isError}" style="position: absolute; top: -5px;right: 0; color: #ff7378; "></i></dsp-button>
                                <br>
                                <br>
                                <dsp-button
                                    type="danger"
                                    plain
                                    size="mini"
                                    round
                                    @click="deleteCreative(item)"
                                >删除</dsp-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <page :page="pageObj" @change="getList"></page>
            </div>
        </div>
        <!-- 诊断弹窗 -->
        <el-dialog
            :title="`诊断结果（创意ID：${currCheckInfo.id}）`"
            :visible.sync="dialogVisible"
            class="check-box"
            width="600px"
        >
            <ul>
                <li>
                    创意状态：
                    <span
                        class="fr green"
                        :class="{'red': !currCheckInfo.diagnosticItem.state.result}"
                    >{{currCheckInfo.diagnosticItem.state.description}}</span>
                </li>
                <li>
                    创意内审状态：
                    <span
                        class="fr green"
                        :class="{'red': !currCheckInfo.diagnosticItem.auditState.result}"
                    >{{currCheckInfo.diagnosticItem.auditState.description}}</span>
                </li>
                <li>
                    创意ADX审核状态：
                    <span class="fr">
                        <span class="blue">{{currCheckInfo.adxAuditList.pending.length}}待审核</span>
                        <span class="green">{{currCheckInfo.adxAuditList.approved.length}}通过</span>
                        <span class="red">{{currCheckInfo.adxAuditList.reject.length}}拒绝</span>
                    </span>
                </li>
                <li>
                    创意投放时间：
                    <span
                        class="fr green"
                        :class="{'red': !currCheckInfo.diagnosticItem.time.result}"
                    >{{currCheckInfo.diagnosticItem.time.description}}</span>
                </li>
                <li>
                    创意核心状态：
                    <span
                        class="fr green"
                        :class="{'red': !currCheckInfo.diagnosticItem.CMDServer.result}"
                    >{{currCheckInfo.diagnosticItem.CMDServer.description}}</span>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">返 回</el-button>
            </span>
        </el-dialog>
        <!-- 视频预览 -->
        <div class="video-box">
            <video :src="videoSrc" controls></video>
        </div>
        <!-- 视频弹窗 -->
        <el-dialog 
            :visible.sync="dialogVisibleVideo"
            width="600px"
            class="iframe-box"
        >
            <video :src="videoSrc" controls style="width:100%;height:100%;"></video>
        </el-dialog>
    </div>
</template>
<script>
import Preview from "@/common/components/preview";
import {
    adTypes,
    interactionTypes,
    dataTypes,
    auditState
} from "@/common/js/filter";
export default {
    filters: {
        adTypes,
        interactionTypes,
        dataTypes,
        auditState,
        imgName(val) {
            if(!val) return ""
            var arr = val.split('/');
            return arr[arr.length-1]
        }
    },
    components: {
        Preview
    },
    data() {
        return {
            videoSrc: '',
            times: 0,
            list: [],
            imgs: [],
            activityList: [],
            orderList: [],
            currCheckInfo: {
                id: "",
                name: "",
                adxAuditList: {
                    pending: [],
                    approved: [],
                    reject: [],
                    uncommit: [],
                    dspAudit: ""
                },
                diagnosticItem: {
                    CMDServer: {},
                    auditState: {},
                    state: {},
                    time: {}
                }
            },
            dialogVisible: false,
            dialogVisibleVideo: false,
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter: {},
            firstTitle: '全部活动',
            secondTitle: '全部订单',
            id: 'undefined',
            activityID: 'undefined',
            dataType: [0, "	品牌名称/贊助信息", "描述信息", "用户评级", "点赞数", "下载数量",
            "价格", "售卖价格", "服务电话", "地址", "描述信息2", "URL", "评论数", "H5","文字按钮"]
        };
    },
    created() { 
        this.getActivity()       
        if(this.$route.query.id && this.$route.query.activityID) {
            var obj = {
                id: this.$route.query.id,
                activityID: this.$route.query.activityID
            }                   
            this.changeOrder(obj)
            this.filter.activityID = this.$route.query.activityID; 
            this.getOrder()
            this.id = this.$route.query.id; 
            this.activityID = this.$route.query.activityID;
        }else {
            this.getOrder();
            this.getList()
        }        
    },
    mounted() {
        // $('.video-box video')[0].oncanplay = function () {
        //     this.play();
        // }
    },
    methods: {
        modifyUrl($event,item) {    
            var urlReg = /^((ht|f)tps?):\/\//;        
            var data = {
                id: item.id,
                templateID: item.templateID
            }
            data.landingUrl = $event;
            if (!data.landingUrl) {
                this.$message.error("落地页地址不能为空。")
                return;
            }
            if (!urlReg.test(data.landingUrl)) {
                this.$message.error("落地页地址不合法。")
                return;
            }
            this.$ajax({
                url: "/dsp/creative/modify",
                data: {
                    data: data
                }
            }).then(res => {                
                item.landingUrl = $event;
                item.flag = true;
                this.$message.success("操作成功");
            });
        },
        search(val) {
            this.filter.name = val;
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
            return this.$ajax({
                url: "/dsp/creative/list",
                data: data,
                load: true
            })
                .then(res => {
                    var list = res.data.data || [],
                        ids = [];
                    list.forEach(item => {
                        this.initItem(item);
                        ids.push(item.id);
                    });
                    this.list = list;
                    this.pageObj.total = res.data.total;
                    this.pageObj.currentPage = res.data.page;                

                    this.list.forEach(item => {
                        this.$set(item, 'flag', true)
                    })
                    //查看素材详情时，只有第一次加载触发
                    if(this.times < 1) {
                        this.list.forEach(item => {
                            if(item.activitys){
                                if(item.activitys[0].activityID == this.$route.query.activityID) {
                                    this.firstTitle = item.activitys[0].activityName
                                }
                            }
                            if(item.orders) {
                                if(item.orders[0].orderID == this.$route.query.id) {
                                    this.secondTitle = item.orders[0].orderName
                                }
                            }                           
                        })
                    }

                    //创意图片
                    var imgs = [];
                    this.list.forEach((item,index) => {
                        imgs[index] = [];
                        item.material.forEach((v,i) => {
                            if(v.image) {
                                imgs[index].push({'w':v.image.width,'h':v.image.height,'src':v.image.url})
                            }
                        })
                    })
                    this.imgs = imgs;

                    return ids;
                })
                .then(this.getAdxAudit)
                .then(this.getErrorStatus);
        },
        getAdxAudit(ids) {
            if (ids.length == 0) return;
            return this.$ajax({
                url: "/dsp/creative/adx/auditList",
                load: true,
                data: {
                    data: ids
                }
            }).then(res => {
                // 获得列表
                ids.forEach((v, i) => {
                    var audit = res.data[v],
                        name;
                    for (var k in audit) {
                        audit[k] = audit[k] || [];
                        name = [];
                        audit[k].forEach(function(v, i, arr) {
                            name.push(v.name);
                        });
                        audit[k + "Info"] = `${name.length}个`;
                        if (name.length > 0) {
                            audit[k + "Info"] += `(${name.join(";")})`;
                        }
                    }
                    this.list[i].adxAuditList = audit;
                });
                return ids.join(",")
            });
        },
        initItem(item) {
            var m = item.material || [];
            item.adxAuditList = {
                pending: [],
                approved: [],
                reject: []
            };
            m.imgs = [];
            m.txts = [];
            for (var i = 0; i < m.length; i++) {
                var v = m[i];
                if (v.image) {
                    item.hasImg = true;
                    var arr = v.image;
                    m.imgs.push({
                        src: v.image.url,
                        w: v.image.width,
                        h: v.image.height
                        // name:
                    });
                    break;
                }
                if (v.text) {
                    m.txts.push(v.text.content)
                    break;
                }
                if (v.video) {
                    item.hasVideo = true;
                    item.video = v.video.url;
                    break;
                }
                if (v.data && v.data.type == "13") {
                    item.hasHtml = true;
                    item.html = v.data.content;
                    break;
                }
            }
        },
        disable() {
            var data = {
                state: "40"
            };
            this.$ajax({
                url: "/dsp/creative/modify",
                data: data
            }).then(res => {
                this.$message.success("停用成功");
            });
        },
        getActivity() {
            this.$ajax({
                url: "/dsp/activity/list",
                data: {
                    size: "-1",
                    sort: ["cTime,1"]
                }
            }).then(res => {
                var activityList = res.data.data || [];
                activityList.unshift({
                    name: "全部活动"
                });
                this.activityList = activityList;

            });
        },
        getOrder() {
            this.$ajax({
                url: "/dsp/order/list",
                data: {
                    size: "-1",
                    sort: ["cTime,1"],
                    filter: {
                        activityID: this.filter.activityID
                    }
                }
            }).then(res => {
                var orderList = res.data.data || [];
                orderList.unshift({
                    name: "全部订单"
                });
                this.orderList = orderList;               
            });
        },
        changeActivity(item) {
            this.times ++ ;
            this.filter.activityID = item.activityID;
            this.pageObj.currentPage = "1";
            this.secondTitle = "全部订单";
            this.id = 'undefined';
            this.getOrder()
            this.getList();
        },
        changeOrder(item) {
            this.filter.orderID = item.id;
            this.pageObj.currentPage = "1";
            this.getList();
        },
        deleteCreative(item) {
            var ordID = [],orderIDs;
            if(item.orders) {
                item.orders.forEach(v => {
                    ordID.push(v.orderID)
                })
                orderIDs = ordID.join(",")
            }
            this.$confirm("此操作将解除该创意与订单的关联关系, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    return this.$ajax({
                        url: "/dsp/order/creative/del",
                        data: {
                            orderID: orderIDs,
                            creativeID: item.id
                        },
                        load: true
                    });
                })
                .then(() => {
                    this.getList();
                    this.$message.success("操作成功");
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                })
        },
        check(item) {
            this.$ajax({
                url: "/dsp/order/check",
                data: {                    
                    creativeID: item.id                    
                },
                load: true
            }).then(res => {
                this.currCheckInfo = res.data.Creatives[0];
                this.currCheckInfo.id = item.id;

                this.dialogVisible = true;
            });
        },
        getErrorStatus(ids) {
            return this.$ajax({
                url: '/dsp/creative/check',
                data: {
                    data: {
                        creativeID: ids
                    }
                }
            }).then(res => {
                var status = res.data.status;
                this.list.forEach(item => {
                    this.$set(item,'isError',status[item.id]);
                })
                return ids;
            })
        },
        showVideo(src) {                
            var video = $('.video-box video')[0];
            if(this.videoSrc == src) {
                video.currentTime = 0;
                video.pause();
            } else {
                this.videoSrc = src;
            }
            this.dialogVisibleVideo = true;      
        }
        
    }
};
</script>
<style lang="less">
.page-creative {
    td {
        max-width: 200px;
        p {
            word-break: break-all;
        }
    }
    .preview-box {
        margin: 20px 0;
    }
    .check-box {
        ul {
            width: 100%;
            li {
                padding: 0 20px 0 20px;
                height: 24px;
                line-height: 24px;
                text-align: left;
            }
            li:nth-child(even) {
                background-color: #f5f5f5;
            }
        }
    }
    .green {
        color: #2fca45;
    }
    .red {
        color: #ea4949;
    }
    .blue {
        color: #4292d6;
    }
    .video-box {
        display: none;
        video {
            width: 500px;
            display: block;
        }
    }
    .material-cover {
        width: 150px;
        height: 150px;
        background-color: #808080;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        cursor: pointer;
        position: relative;
        iframe {
            height: 100%;
        }
        iframe, video {
            width: 100%;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(0,-50%);
        }
        .material-cover-mask {
            width: 100%;
            height: 100%;
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            background: url("../../../common/img/images/icon_magnify.png") no-repeat center;
        }
    }
    .material-cover:hover .material-cover-mask {
        display: block;
    }
    .iframe-box{
        background: rgba(0,0,0,0.85);
        .el-dialog{
            background: transparent;
            box-shadow: 0 0 0 rgba(0,0,0,0);
        }
    }
}
</style>
