<template>
    <div class="form-img-box">
        <div v-show="url">
            <dsp-button type="success" size="mini" @click="upload">替换物料</dsp-button>
            <div class="formImg" :style="{backgroundImage: `url(${url})`}">
                <div class="mask">
                    <div class="enlarge el-icon-zoom-in" :data-src="url" @click="$imageViewer"></div>
                    <div class="delImg el-icon-circle-close" @click="removeUrl"></div>
                </div>
            </div>
        </div>
        <div v-show="!url">
            <dsp-button type="primary" size="mini" @click="upload">上传物料</dsp-button>
        </div>
    </div>
</template>
<script>
import dspButton from "@/common/components/dspButton";
export default {
    components: {
        dspButton
    },
    data() {
        return {};
    },
    methods: {
        upload() {
            this.$emit("upload");
        },
        removeUrl() {
            this.$emti("update:url", "");
        }
    },
    props: {
        url: String
    }
};
</script>
<style lang="less" scoped>
.form-img-box {
    .dsp_button {
        margin-left: 40px;
    }
    .formImg {
        margin-left: 20px;
    }
}

</style>
