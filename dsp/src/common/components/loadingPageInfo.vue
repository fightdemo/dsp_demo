<template>
    <el-dialog title="落地页宏替换" :visible.sync="dialogVisible" width="700px" :append-to-body="true">
        <div class="lp-info-box">
            <div class="info-content">
                <div class="info-title">页面嵌入监测代码后，需要对落地页添加宏后填写至素材落地页地址中以便监测生效；
                    <br>会遇到如下两种情况：
                </div>
                <h3>
                    <span>1</span>当落地页地址中存在"?"，如`http://www.a.com/?a=b&c=d....x=y` 添加如下字符串至末尾
                </h3>
                <p>&adhub_IMEI=__IMEI__&adhub_IMEI_MD5=__IMEI_MD5__&adhub_ANDROIDID=__ANDROIDID__&adhub_ANDROIDID_MD5=__ANDROIDID_MD5__&adhub_IDFA=__IDFA__&adhub_IDFA_MD5=__IDFA_MD5__</p>
                <p class="info-font">最终结果为：</p>
                <p>http://www.a.com/?a=b&c=d....x=y&adhub_IMEI=__IMEI__&adhub_IMEI_MD5=__IMEI_MD5__&adhub_ANDROIDID=__ANDROIDID__&adhub_ANDROIDID_MD5=__ANDROIDID_MD5__&adhub_IDFA=__IDFA__&adhub_IDFA_MD5=__IDFA_MD5__</p>
                <h3>
                    <span>2</span>当落地页地址不存在"?"时，比如`http://www.a.com/1/2/3`，添加如下字符串至末尾
                </h3>
                <p>?adhub_IMEI=__IMEI__&adhub_IMEI_MD5=__IMEI_MD5__&adhub_ANDROIDID=__ANDROIDID__&adhub_ANDROIDID_MD5=__ANDROIDID_MD5__&adhub_IDFA=__IDFA__&adhub_IDFA_MD5=__IDFA_MD5__</p>
                <p class="info-font">最终结果为：</p>
                <p>http://www.a.com/1/2/3?adhub_IMEI=__IMEI__&adhub_IMEI_MD5=__IMEI_MD5__&adhub_ANDROIDID=__ANDROIDID__&adhub_ANDROIDID_MD5=__ANDROIDID_MD5__&adhub_IDFA=__IDFA__&adhub_IDFA_MD5=__IDFA_MD5__</p>
            </div>
            <div class="btn-group">
                <dsp-button type="danger" @click="close()">关闭</dsp-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            dialogVisible: this.visible,
        }
    },
    watch: {
        visible(val) {
            this.dialogVisible = val;
        },
        dialogVisible(val) {
            this.$emit("update:visible",val)
        }
    },
    methods: {
        close() {
            this.dialogVisible = false;
            this.$emit("update:visible",false)
        },        
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style lang="less">
.lp-info-box {
    width: 670px;
    word-break: break-all;
    font-size: 12px;
    text-align: left;
    .info-content {
        padding: 30px;
        padding-top: 0;
        p {
            line-height: 18px;
        }
        .info-title {
            font-size: 14px;
        }
        h3 {
            font-size: 12px;
            margin-top: 20px;
            font-weight: bold;
            span {
                font-size: 20px;
                margin-right: 10px;
            }
        }
        .info-font {
            font-size: 12px;
            font-weight: bold;
        }
    }
    .btn-group {
        width: 100%;
        border-top: 1px solid #ccc;
        text-align: center;
        button {
            width: 100px;
            margin: 28px auto 0;
            display: block;
        }
    }
}
</style>
