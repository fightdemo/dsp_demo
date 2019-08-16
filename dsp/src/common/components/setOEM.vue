<template>
    <div id="oem">
        <button id="fileButton" ref="fileButton" style="display:none" :before-close="handleClose"></button>
        <el-dialog title="OEM信息" :visible.sync="dialogVisible" width="600px">
            <el-form label-width="150px">
                <el-form-item label="启用自由域名：" v-for="(item,index) in admainList" :key="index">
                    <el-input
                        class="ml40 w245"
                        v-model="item.url"
                        placeholder="ads.hubcloud.com.cn"
                    ></el-input>
                    <span class="addIcon ml20" @click="addDomain"></span>
                    <span v-show="admainList.length != 1" class="el-icon-close delBtn" @click="delDomain(index)"></span>
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        登陆界面LOGO：<tips>图片尺寸为300x100，png格式，文件大小不超过100K</tips>
                    </template>
                    <form-img
                        :url.sync="oemInfo.loginLogo"
                        @upload="uploadImg({attr:'loginLogo',width:300,height:100,size:100})"
                    ></form-img>
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        导航栏LOGO：<tips>图片尺寸为172x34，png格式，文件大小不超过50K</tips>
                    </template>
                    <form-img
                        :url.sync="oemInfo.staticLogo"
                        @upload="uploadImg({attr:'staticLogo',width:130,height:40,size:50})"
                    ></form-img>
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        登陆页背景图：<tips>图片尺寸为1920x1080，文件大小不超过300K</tips>
                    </template>
                    <form-img
                        :url.sync="oemInfo.background"
                        @upload="uploadImg({attr:'background',width:1920,height:1080,size:500,fileType:'all'})"
                    ></form-img>
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        web页面Logo：<tips>图片尺寸为16x16或者32x32，png格式，文件大小不超过20K</tips>
                    </template>
                    <form-img
                        :url.sync="oemInfo.iconUrl"
                        @upload="uploadImg({attr:'iconUrl',width:[16,32],height:[16,32],size:20})"
                    ></form-img>
                </el-form-item>
                <el-form-item label="版权信息：">
                    <el-input class="ml40" v-model="oemInfo.copyright"></el-input>
                </el-form-item>
                <el-form-item label="网页标题：">
                    <el-input class="ml40" v-model="oemInfo.title"></el-input>
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        广告角标Logo：<tips>图片尺寸为12x12，png格式，文件大小不超过5K</tips>
                    </template>
                    <form-img
                        :url.sync="oemInfo.adLogo"
                        @upload="uploadImg({attr:'adLogo',width:12,height:12,size:5})"
                    ></form-img>
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        角标展开logo：<tips>图片尺寸为54x12，png格式，文件大小不超过8K</tips>
                    </template>
                    <form-img
                        :url.sync="oemInfo.adLogoExt"
                        @upload="uploadImg({attr:'adLogoExt',width:54,height:12,size:8})"
                    ></form-img>
                </el-form-item>
                <el-form-item label="角标访问地址：">
                    <el-input class="ml40" v-model="oemInfo.adLogoUrl"></el-input>
                </el-form-item>
                <el-form-item label="文字角标：">
                    <el-input class="ml40" v-model="oemInfo.adLabel"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="canelOEM">取 消</el-button>
                <el-button type="primary" @click="confirmOEM">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import dspButton from "@/common/components/dspButton";
import tips from "@/common/components/tips";
import fileUpload from "@/common/js/fileUpload";
import formImg from "@/common/components/formImg";

export default {
    data() {
        return {
            admainList: [],
            imgObj: {},
            oemInfo: {},
            dialogVisible: this.oemShow
        };
    },
    watch: {
        dialogVisible(val) {
            this.$emit("update:oemShow", val);
        },
        oemShow(val) {
            this.dialogVisible = val;
        },
        oem(val) {
            var oemInfo = val[0];
            this.admainList = [];
            this.oemInfo = {
                    background: oemInfo.background || "", // 登陆页面背景图片
                    loginLogo: oemInfo.loginLogo || "", //登陆页面Logo地址
                    staticLogo: oemInfo.staticLogo || "", //导航栏Logo地址
                    sdkLogo: oemInfo.sdkLogo || "", //SDK Logo地址
                    iconUrl: oemInfo.iconUrl || "", //角标图片地址
                    title: oemInfo.title || "", //所有oem文字信息
                    copyright: oemInfo.copyright || "", //版权信息
                    adLogo: oemInfo.adLogo || "",
                    adLogoExt: oemInfo.adLogoExt || "",
                    adLogoUrl: oemInfo.adLogoUrl || "",
                    adLabel: oemInfo.adLabel || ""
                };
            val.forEach(item => {
                this.admainList.push({url:item.url})
            })
        }
    },
    props: {
        oem: Array,
        oemShow: Boolean,
        oemID: String
    },
    mounted() {
        this.fileUpload();
    },
    methods: {
        handleClose() {
            this.oemInfo = []
        },
        canelOEM() {
            this.dialogVisible = false;
        },
        cloneObj(obj) {
            var newObj = {};
            if (obj instanceof Array) {
                newObj = [];
            }
            for (var key in obj) {
                var val = obj[key];
                newObj[key] = typeof val === "object" ? cloneObj(val) : val;
            }
            return newObj;
        },
        confirmOEM() {
            var arr = [];
            this.admainList.forEach((v, i) => {
                if (v.url) {
                    var obj = this.cloneObj(this.oemInfo);
                    obj.url = v.url;
                    obj.orgID = this.oemID;
                    arr.push(obj);
                }
            });
            this.$ajax({
                url: "/dsp/user/oem/update",
                data: {
                    data: {
                        orgID: this.oemID,
                        oemInfos: arr
                    }
                },
                load: true
            }).then(res => {
                this.$message.success("提交成功");
                this.dialogVisible = false;
            });
        },
        addDomain() {
            this.admainList.push({ url: "" });
        },
        delDomain(index) {
            this.admainList.splice(index, 1);
        },
        uploadImg(item) {
            this.imgObj = item;
            this.$refs.fileButton.click();
        },
        fileUpload() {
            var _this = this;
            fileUpload({
                btnID: "fileButton",
                funcUrl: "1",
                BeforeUpload: function(up, file, next) {
                    var nFile = file.nFile,
                        image = new Image(),
                        size = _this.imgObj.size,
                        width = _this.imgObj.width,
                        height = _this.imgObj.height;

                    // 判断文件类型
                    if (_this.imgObj.fileType != "all") {
                        if (!/.png$/i.test(file.name)) {
                            up.removeFile(file);
                            return _this.$message.error(
                                "格式错误，请上传png格式。"
                            );
                        }
                    }

                    // 判断文件大小
                    if (nFile.size >= size * 1024) {
                        up.removeFile(file);
                        return _this.$message.error("文件不得大于" + size + "K");
                    }

                    if (width && height) {
                        //加载图片获取图片真实宽度和高度
                        image.onload = function() {
                            // 多种尺寸
                            if (typeof width == "object") {
                                var flag = false;
                                for (var i = 0; i < width.length; i++) {
                                    // 判断图片比例
                                    if (
                                        image.width == width[i] &&
                                        image.height == height[i]
                                    ) {
                                        flag = true;
                                        break;
                                    }
                                }
                                if (flag) {
                                    next();
                                } else {
                                    up.removeFile(file);
                                    _this.$message.error(
                                        "图片的尺寸不规范，请重新上传！"
                                    );
                                }
                            } else {
                                // 单种尺寸
                                // 判断图片比例
                                if(_this.imgObj.attr == "staticLogo") {
                                    if((image.width == 130 &&
                                        image.height == 40) ||
                                        (image.width == 172 &&
                                        image.height == 34)) {
                                        next();
                                    }else {
                                        up.removeFile(file);
                                        return _this.$message.error(
                                            "图片的尺寸不是" +
                                                width +
                                                "x" +
                                                height +
                                                "，请重新上传！"
                                        );
                                    }
                                }else {
                                    if (
                                        image.width != width ||
                                        image.height != height
                                    ) {
                                        up.removeFile(file);
                                        return _this.$message.error(
                                            "图片的尺寸不是" +
                                                width +
                                                "x" +
                                                height +
                                                "，请重新上传！"
                                        );
                                    } else {
                                        next();
                                    }
                                } 
                                // if (
                                //     image.width != width ||
                                //     image.height != height
                                // ) {
                                //     up.removeFile(file);
                                //     return _this.$message.error(
                                //         "图片的尺寸不是" +
                                //             width +
                                //             "x" +
                                //             height +
                                //             "，请重新上传！"
                                //     );
                                // } else {
                                //     next();
                                // }                               
                            }
                        };
                    } else {
                        next();
                    }
                    image.src = window.URL.createObjectURL(nFile);
                },
                FileUploaded: function(info) {
                    _this.oemInfo[_this.imgObj.attr] = info.url;
                }
            });
        }
    },
    components: {
        dspButton,
        tips,
        formImg
    }
};
</script>
<style lang="less">
#oem {
    .w245 {
        width: 245px;
    }
    .w80 {
        width: 80px;
    }
    .addIcon {
        display: inline-block;
        width: 26px;
        height: 26px;
        background: url("../../admin/assets/icon_add.png") no-repeat;
        background-size: cover;
        vertical-align: middle;
        cursor: pointer;
    }
    .delBtn {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: url("../../admin/assets/icon-close2.png") no-repeat;
        background-size: cover;
        cursor: pointer;
        margin-left: 10px;
    }
}
</style>


