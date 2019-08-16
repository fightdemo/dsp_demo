<template>
    <div class="oem-page">
        <button ref="upload" id="upload" style="display:none"></button>
        <div class="page-title">OEM 设置</div>
        <div class="content">
            <div class="form">
                <el-form label-width="140px" v-show="!edit">
                    <el-form-item label="启用自有域名：">{{oem.url}}</el-form-item>
                    <el-form-item label="登录界面LOGO：">
                        <imgButton :url="oem.loginLogo"></imgButton>
                    </el-form-item>
                    <el-form-item label="导航栏LOGO：">
                        <imgButton :url="oem.staticLogo"></imgButton>
                    </el-form-item>
                    <el-form-item label="web页面Logo：">
                        <imgButton :url="oem.iconUrl"></imgButton>
                    </el-form-item>
                    <el-form-item label="标题信息：">{{oem.title}}</el-form-item>
                    <el-form-item label="版权信息：">{{oem.copyright}}</el-form-item>
                    <el-form-item label="广告角标logo：">
                        <imgButton :url="oem.adLogo"></imgButton>
                    </el-form-item>
                    <el-form-item label="角标展开logo：">
                        <imgButton :url="oem.adLogoExt"></imgButton>
                    </el-form-item>
                    <el-form-item label="角标访问地址：">{{oem.adLogoUrl}}</el-form-item>
                    <el-form-item label="文字角标：">{{oem.adLabel}}</el-form-item>
                </el-form>
                <el-form label-width="140px" v-show="edit">
                    <el-form-item label="启用自有域名：">
                        <el-input v-model="editOem.url"></el-input>
                    </el-form-item>
                    <el-form-item label="登录界面LOGO：">
                        <form-img
                            :url.sync="editOem.loginLogo"
                            @upload="upImg({attr:'loginLogo',width:300,height:100,size:100})"
                        ></form-img>
                    </el-form-item>
                    <el-form-item label="导航栏LOGO：">
                        <form-img
                            :url.sync="editOem.staticLogo"
                            @upload="upImg({attr:'staticLogo',width:130,height:40,size:50})"
                        ></form-img>
                    </el-form-item>
                    <el-form-item label="web页面Logo：">
                        <form-img
                            :url.sync="editOem.iconUrl"
                            @upload="upImg({attr:'iconUrl',width:16,height:16,size:20})"
                        ></form-img>
                    </el-form-item>
                    <el-form-item label="标题信息：">
                        <el-input v-model="editOem.title"></el-input>
                    </el-form-item>
                    <el-form-item label="版权信息：">
                        <el-input v-model="editOem.copyright"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span slot="label">
                            广告角标logo：<tips>展示在投放的广告上的表示广告来源的图片</tips>
                        </span>
                        <form-img
                            :url.sync="editOem.adLogo"
                            @upload="upImg({attr:'adLogo',width:12,height:12,size:5})"
                        ></form-img>
                    </el-form-item>
                    <el-form-item>
                        <span slot="label">
                            角标展开logo：<tips>展示在投放的广告上的表示广告来源的完整图片</tips>
                        </span>
                        <form-img
                            :url.sync="editOem.adLogoExt"
                            @upload="upImg({attr:'adLogoExt',width:54,height:12,size:8})"
                        ></form-img>
                    </el-form-item>
                    <el-form-item>
                        <span slot="label">
                            角标访问地址：<tips>点击角标后跳转的网址</tips>
                        </span>
                        <el-input v-model="editOem.adLogoUrl"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <span slot="label">
                            文字角标：<tips>展示在投放的广告上的表示广告来源的文字</tips>
                        </span>
                        <el-input v-model="editOem.adLabel"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="btn-group">
                <dsp-button v-show="!edit" type="primary" @click="edit = !edit">编辑信息</dsp-button>
                <dsp-button v-show="edit" @click="edit = !edit">取消</dsp-button>
                <dsp-button v-show="edit" type="success" @click="modify">完成编辑</dsp-button>
            </div>
        </div>
    </div>
</template>
<script>
import fileUpload from "@/common/js/fileUpload";
import imgButton from "@/common/components/imgButton";
import formImg from "@/common/components/formImg";
import tips from "@/common/components/tips";

export default {
    components: {
        formImg,
        tips,
        imgButton
    },
    data() {
        return {
            edit: false,
            current: {},
            editOem: {}
        };
    },
    computed: {
        oem() {
            return this.$store.state.common.oem;
        }
    },
    mounted() {
        this.uploadInit();
        this.editOem = JSON.parse(JSON.stringify(this.oem));
    },
    methods: {
        upImg(obj) {
            this.current = obj;
            this.$refs.upload.click();
        },
        modify() {
            var oem = this.editOem;

            oem.url = (oem.url || "")
                .replace(/http(s)?:\/\//, "")
                .split("/")[0];
            if (!oem.url) return this.$message.error("请输入自有域名");

            oem.hostname = oem.url;
            oem.sdkLogo = oem.staticLogo;

            this.$ajax({
                url: "/dsp/user/oem/update",
                load: true,
                data: oem
            }).then(() => {
                this.$message.success("修改成功");
                this.edit = false;

                // OEM信息
                return this.$ajax({
                    url: "/dsp/user/oem/query",
                    method: "post",
                    data: {
                        hostname: location.hostname
                    }
                });
            }).then(res => {
                return;
                var data = res;
                this.oem = {
                    url: "", //自有域名
                    background:
                        data.background ||
                        "http://res1.hubcloud.com.cn/dsp/clientInfo/2018/4/10/1523329438394.png", // 登陆页面背景图片
                    loginLogo:
                        data.loginLogo || "./images/login_logo.png", //登陆页面Logo地址
                    staticLogo:
                        data.staticLogo || "./images/logo.png", //导航栏Logo地址
                    sdkLogo: data.sdkLogo || "", //SDK Logo地址
                    iconUrl: data.iconUrl || "", //角标图片地址
                    title: data.title || "投放端", //所有oem文字信息
                    copyright: data.copyright || "", //版权信息
                    adLogo: data.adLogo || "",
                    adLogoExt: data.adLogoExt || "",
                    adLogoUrl: data.adLogoUrl || "",
                    adLabel: data.adLabel || ""
                };

                localStorage.oem = JSON.stringify(this.oem);
            });
        },
        uploadInit() {
            var _this = this
            // 上传文件按钮
            fileUpload({
                btnID: "upload",
                funcUrl: "1",
                FileUploaded: function(info) {
                    _this.editOem[_this.current.attr] = info.url;
                },
                BeforeUpload: function(up, file, next) {
                    var reg = /.png$/i,
                        nFile = file.nFile,
                        image = new Image(),
                        size = _this.current.size,
                        width = _this.current.width,
                        height = _this.current.height;

                    // 判断文件类型
                    if (!reg.test(file.name)) {
                        up.removeFile(file);
                        return _this.$message.error("格式错误，请上传png格式。");
                    }

                    // 判断文件大小
                    if (nFile.size >= size * 1024) {
                        up.removeFile(file);
                        return _this.$message.error("文件不得大于" + size + "K");
                    }

                    if (width && height) {
                        //加载图片获取图片真实宽度和高度
                        image.onload = function() {
                            // 判断图片比例
                            if (
                                image.width != width ||
                                image.height != height
                            ) {
                                up.removeFile(file);
                                _this.$message.error(
                                    "图片的尺寸不是" +
                                        width +
                                        "x" +
                                        height +
                                        "，请重新上传"
                                );
                            } else {
                                next();
                            }
                        };
                    } else {
                        next();
                    }

                    image.src = window.URL.createObjectURL(nFile);
                }
            });
        }
    }
};
</script>
<style lang="less">
.oem-page {
    .form {
        padding: 40px;
        .el-input {
            width: 254px;
        }
    }
    .btn-group {
        padding: 30px 40px;
        border-top: 1px solid #dcdcdc;
        button {
            width: 160px;
            padding: 15px;
            margin-right: 20px;
        }
    }
}
</style>
