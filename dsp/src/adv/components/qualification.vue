<template>
    <div class="qua-page content">
        <button id="fileButton" ref="fileButton" style="display:none"></button>
        <div class="form">
            <!-- 查看 -->
            <el-form label-position="left" label-width="150px" v-show="!edit">
                <!-- 默认资质 -->
                <el-form-item v-for="item in list" :key="item.name" :label="item.name">
                    <div v-if="item.isString">{{item.url}}</div>
                    <dsp-button
                        v-if="!item.isString && item.url"
                        :data-src="item.url"
                        @click="$imageViewer"
                        type="primary"
                        plain
                        size="mini"
                        round
                    >查看</dsp-button>
                    <a v-if="!item.isString && !item.url" style="color: #19bc98 !important">暂未上传</a>
                </el-form-item>
            </el-form>
            <!-- 编辑 -->
            <el-form label-position="left" label-width="150px" v-show="edit">
                <!-- 默认资质 -->
                <el-form-item v-for="item in list" :key="item.name" :label="item.name">
                    <div v-if="item.isString">
                        <el-input v-model="item.url"></el-input>
                    </div>
                    <div v-if="!item.isString && item.url">
                        <dsp-button type="success" @click="upImg(item)">替换物料</dsp-button>
                        <div class="formImg" :style="{backgroundImage: `url(${item.url})`}">
                            <div class="mask">
                                <div
                                    class="enlarge el-icon-zoom-in"
                                    :data-src="item.url"
                                    @click="$imageViewer"
                                ></div>
                                <div class="delImg el-icon-circle-close" @click="item.url = ''"></div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!item.isString && !item.url">
                        <dsp-button type="primary" @click="upImg(item)">上传物料</dsp-button>
                    </div>
                </el-form-item>
                <div class="hr"></div>
                <!-- 其他资质 -->
                <el-form-item v-for="(item,index) in quaList" :key="index" label="其他资质">
                    <el-input class="mb20" v-model="item.name" placeholder="资质名称"></el-input>
                    <i class="delImg el-icon-circle-close" @click="deleteQua(item, index)"></i>
                    <div v-if="item.url">
                        <dsp-button type="success" @click="upImg(item)">替换物料</dsp-button>
                        <div class="formImg" :style="{backgroundImage: `url(${item.url})`}">
                            <div class="mask">
                                <div
                                    class="enlarge el-icon-zoom-in"
                                    :data-src="item.url"
                                    @click="$imageViewer"
                                ></div>
                                <div class="delImg el-icon-circle-close" @click="item.url = ''"></div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!item.url">
                        <dsp-button type="primary" @click="upImg(item)">上传物料</dsp-button>
                    </div>
                </el-form-item>
                <el-form-item>
                    <dsp-button type='success' @click="addQua"><i class="el-icon-plus"></i>添加其他资质</dsp-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="btn-group" v-if="canEdit">
            <dsp-button type="primary" v-show="!edit" @click="edit = !edit">编辑信息</dsp-button>
            <dsp-button v-show="edit" @click="edit = !edit">取消</dsp-button>
            <dsp-button type="success" v-show="edit" @click="saveQualification">完成编辑</dsp-button>
        </div>
    </div>
</template>
<script>
import fileUpload from "@/common/js/fileUpload";
import {hex_md5} from "@/common/js/md5";
export default {
    data() {
        return {
            edit: false,
            quaList: [],
            list: [],
            current: {}
        };
    },
    mounted() {
        this.getList();
        this.fileUpload();
    },
    methods: {
        addQua() {
            this.quaList.push({
                name: "",
                url: ""
            });
        },
        deleteQua(item, index) { 
            this.quaList.splice(index, 1);
        },
        upImg(item) {
            this.current = item;
            this.$refs.fileButton.click();
        },

        checkUrl(url) {
            var reg = /^https?:\/\//;
            if (!reg.test(url))
                return this.$message.error("公司网址格式不正确！格式为http://xxxxx");
            window.open(url);
        },
        getList() {
            this.$ajax({
                url: "/dsp/advertiser/qualification/list",
                data: {
                    filter: {
                        orgID: this.advID
                    }
                }
            }).then(res => {
                this.list = res.data;
            });
        },
        saveQualification() {
            var tempArr = this.list,
                quaList = this.quaList,
                reg = /^https?:\/\//,
                value,
                id = this.advID;
            for (var i = 0; i < tempArr.length; i++) {
                value = tempArr[i];
                if (value.url == "" && value.isNecessary) {
                    if (value.isString) {
                        this.$message.error(value.name + "未输入");
                    } else {
                        this.$message.error(value.name + "未上传");
                    }
                    return;
                }
                if (value.name == "公司网址" && value.url != "") {
                    if (!reg.test(value.url))
                        return this.$message.error("公司网址格式不正确！");
                }
                // 设置广告主id
                value.id = id;
            }
            for (var i = 0; i < quaList.length; i++) {
                value = quaList[i];
                if (!value.name) {
                    return this.$message.error("请输入资质名称！");
                }
                if (!value.url) {
                    return this.$message.error("请上传" + value.name + "的图片！");
                }
                tempArr.push({
                    id: id,
                    name: value.name,
                    url: value.url,
                    md5: value.md5
                });
            }
            this.$ajax({
                url: "/dsp/advertiser/qualification/adds",
                data: {
                    data: tempArr
                },
                load:true
            }).then((res) =>{
                this.edit = false;
                this.getList();
                this.$message.success("保存成功");
            });
        },
        fileUpload() {

            var _this = this;
            fileUpload({
                btnID: 'fileButton',
                BeforeUpload: function (up, file,cb) {
                    var reader = new FileReader();
                    reader.onload = function() {
                        _this.current.md5 = hex_md5(reader.result)
                        cb && cb();
                    }
                    reader.readAsBinaryString(file.nFile)
                },
                funcUrl: '2',
                FileUploaded:function(info, index){
                    _this.current.url = info.url;
                },
            })
        }
    },
    props: {
        canEdit: {
            type: Boolean,
            default: true
        },
        advID: String
    }
};
</script>
<style lang="less">
.qua-page {
    .el-input {
        width: 254px;
    }
    .form {
        padding: 40px;
    }
    .dsp_button {
        margin-right: 20px;
    }
    .btn-group {
        padding: 30px 40px;
        border-top: 1px solid #dcdcdc;
        button {
            width: 160px;
            padding: 15px;
        }
    }
    .delImg{
        // display: block;
        // width: 100%;
        height: 34px;
        background: rgba(255, 255, 255, 0.75);
        text-align: center;
        line-height: 34px;
        color: #FF7B80;
        font-size: 22px;
    }
}
</style>
