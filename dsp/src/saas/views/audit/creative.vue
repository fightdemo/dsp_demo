<template>
    <div class="creative-page">
        <div class="page-title">创意审核</div>
        <div class="content">
            <div class="table content">
                <div class="table-top">
                    <p class="table-title">
                        <dsp-button v-show="filter.auditState != 2" type="success" @click="auditCretive('2')">通过</dsp-button>
                        <dsp-button v-show="filter.auditState != 3" type="danger" @click="auditCretive('3')">拒绝</dsp-button>
                    </p>
                    <div class="table-filter">
                        <search placeholder="搜索素材名称" @search="setFilter('name',$event)"></search>
                        <m-select title="待审核" :list="stateList" @change="setFilter('auditState',$event.id)"></m-select>
                    </div>
                </div>
                <el-table :data="list" @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column label="素材预览">
                        <template slot-scope="scope">
                            <preview
                                v-if="imgs[scope.row.index].length"
                                :imgs="imgs[scope.row.index]"
                            ></preview>
                            <div class="material-cover" v-if="scope.row.hasVideo">
                                <video :src="scope.row.video" style="width: 100%;height:100%;"></video>
                                <div class="material-cover-mask" @click="showVideo(scope.row.video)"></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="素材提供方信息">
                        <template slot-scope="scope">
                            <div>广告公司名称：{{scope.row.orgName}}</div>
                            <div>
                                广告主名称：{{scope.row.advName}}
                                <div
                                    class="agent-status"
                                    v-if="advAuditList[scope.row.advertiserID]"
                                >状态
                                    <div class="status-box">
                                        <p>
                                            内审状态：
                                            <span
                                                v-show="advAuditList[scope.row.advertiserID].dspAudit == 1"
                                            >待审核</span>
                                            <span
                                                v-show="advAuditList[scope.row.advertiserID].dspAudit == 2"
                                            >审核通过</span>
                                            <span
                                                v-show="advAuditList[scope.row.advertiserID].dspAudit == 3"
                                            >审核拒绝</span>
                                        </p>
                                        <p>
                                            待审平台：
                                            <span
                                                v-for="(k,index) in advAuditList[scope.row.advertiserID].pending"
                                                :key="index"
                                            >{{k.name}}</span>
                                        </p>
                                        <p>
                                            过审平台：
                                            <span
                                                v-for="(k,index) in advAuditList[scope.row.advertiserID].approved"
                                                :key="index"
                                            >{{k.name}}</span>
                                        </p>
                                        <p>
                                            拒绝平台：
                                            <span
                                                v-for="(k,index) in advAuditList[scope.row.advertiserID].uncommit"
                                                :key="index"
                                            >{{k.name}}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p>行业分类：{{scope.row.industryName}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="素材信息">
                        <template slot-scope="scope">
                            <p>素材ID：{{scope.row.id}}</p>
                            <p>素材名称：{{scope.row.name}}</p>
                            <p>广告位类型：{{scope.row.adType | adTypes}}</p>
                            <p>后续行为：{{scope.row.interactionType | interactionTypes}}</p>
                            <p>素材行业：{{scope.row.creativeIndustry}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="素材内容">
                        <template slot-scope="scope">
                            <p
                                v-if="img.image"
                                v-for="(img,index) in scope.row.material"
                                :key="index"
                            >{{`图片${index+1}(${img.image.width}x${img.image.height})`}}：{{img.image.url|imgName}}</p>
                            <p v-show="scope.row.material.video">视频：{{scope.row.material.video}}</p>
                            <p
                                v-if="txt.text"
                                v-for="(txt,index) in scope.row.material"
                                :key="index+'-'"
                            >{{`文字${index+1}`}}：{{txt.text.content}}</p>
                            <p v-show="scope.row.landingUrl">落地页：{{scope.row.landingUrl}}</p>
                            <p v-for="(data, index) in scope.row.material" :key="index+'+'">                                
                                <span v-if="data.data">{{dataType[data.data.type]}}:{{data.data.content}}</span>
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="审核状态">
                        <template slot-scope="scope">
                            <p>系统内审状态：{{scope.row.auditState| auditState}}</p>
                            <p>待审核的平台：{{scope.row.adxAuditList.pendingInfo}}</p>
                            <p>审核通过的平台：{{scope.row.adxAuditList.approvedInfo}}</p>
                            <p>审核拒绝的平台：{{scope.row.adxAuditList.rejectInfo}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <dsp-button v-show="scope.row.auditState != 2" type="success" @click="auditCretive('2',scope.row.id)">通过</dsp-button>
                            <dsp-button v-show="scope.row.auditState != 3" type="danger" @click="auditCretive('3',scope.row.id)">拒绝</dsp-button>
                        </template>
                    </el-table-column>
                </el-table>
                <page :page="pageObj" @change="getList"></page>
            </div>
        </div>
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
            <video :src="videoSrc" controls></video>
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
            if (!val) return "";
            var arr = val.split("/");
            return arr[arr.length - 1];
        }
    },
    components: {
        Preview
    },
    created() {
        this.getList();
    },
    data() {
        return {
            list: [],
            imgs: [],
            checkIds: [],
            advAuditList: [],
            stateList: [
                { id: "1", value: "待审核" },
                { id: "2", value: "审核通过" },
                { id: "3", value: "审核拒绝" }
            ],
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            filter: {
                auditState: "1"
            },
            dialogVisibleVideo: false,
            videoSrc: "",
            dataType: [0, "	品牌名称/贊助信息", "描述信息", "用户评级", "点赞数", "下载数量",
            "价格", "售卖价格", "服务电话", "地址", "描述信息2", "URL", "评论数", "H5","文字按钮"]
        };
    },
    methods: {
        handleSelectionChange(val) {
            var ids = [];
            val.forEach(item => {
                ids.push(item.id);
            });
            this.checkIds = ids;
        },
        setFilter(attr,val) {
            this.pageObj.currentPage = "1";
            this.filter[attr] = val;
            this.pageObj.currentPage = 1;
            this.getList();
        },
        auditCretive(type, ids) {
            var str = type == "2" ? "通过" : "拒绝";
            if (!ids) {
                ids = this.checkIds;
            } else {
                ids = [ids];
            }

            if (ids.length == 0) return this.$message.error("请先选择素材!");

            this.$confirm("是否确定" + str + "？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    var data = {
                        auditState: type,
                        creativeID: ids
                    };
                    return this.$ajax({
                        url: "/dsp/admin/creative/audit",
                        data: {
                            data: data
                        }
                    });
                })
                .then(() => {
                    this.$message.success("操作成功");
                    this.getList();
                });
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
            }).then(res => {
                var list = res.data.data || [],
                    ids = [],
                    advIds = [];
                list.forEach((item, index) => {
                    this.initItem(item);
                    ids.push(item.id);
                    item.index = index;
                    if (advIds.indexOf(item.advertiserID) == -1) {
                        advIds.push(item.advertiserID);
                    }
                });
                this.list = list;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;
                console.log(this.list)
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
                // 获取素材审核状态
                this.getAdxAudit(ids);
                // 获取广告主审核状态
                this.getAdvAudit(advIds);
            });
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
                return ids.join(",");
            });
        },
        getAdvAudit(ids) {
            if (ids.length == 0) return;
            this.$ajax({
                url: "/dsp/advertiser/adx/auditList",
                load: true,
                data: {
                    data: ids
                }
            }).then(res => {
                this.advAuditList = res.data;
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
                    m.txts.push(v.text.content);
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
.creative-page {
    td {
        max-width: 200px;
        p {
            word-break: break-all;
        }
    }
    .preview-box {
        margin: 20px 0;
    }
    .agent-status {
        display: inline-block;
        color: #337ab7;
        padding-right: 20px;
        cursor: pointer;
        position: relative;
        .status-box {
            display: none;
            color: #333;
            cursor: default;
            overflow-y: auto;
            position: absolute;
            width: 300px;
            height: 115x;
            left: 30px;
            top: -40px;
            border: 1px solid #ccc;
            padding: 10px;
            background-color: #fff;
            z-index: 10;
        }
    }
    .agent-status:hover {
        .status-box {
            display: block;
        }
    }
    .el-table .cell,
    .el-table th div {
        overflow: visible;
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

@media screen and (max-width: 1720px) {
    .creative-page{
        .dsp_button{
            float: left;
            margin-left: 5px;
        }
        .dsp_button:nth-child(0){
            margin-left: 0;
        }
    }
}

</style>

