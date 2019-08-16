<template>
    <div class="preview-box">
        <div class="preview-cover" @click="showImg()" :style="{backgroundImage:`url(${imgs[0].src})`}">
            <div class="preview-mask">
                <i class="icon fa fa-search-plus"></i>
                <p>{{imgs.length}}张</p>
            </div>
        </div>
        <vuePreview class="vue-preview" :slides="imgs" ref="preview"></vuePreview>
    </div>
</template>
<script>
// vuePreview组件需要现在app.js内注册
export default {
    components: {
    },
    props: {
        imgs: Array
    },
    methods: {
        showImg() {
            this.$refs.preview.$el.getElementsByTagName("img")[0].click();
        }
    }
}
</script>
<style lang="less">
.preview-box {
    width: 150px;
    height: 150px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    .preview-cover {
        width: 150px;
        height: 150px;
        background-position: center;
        background-size: contain;
        background-color: #505050;
        background-repeat: no-repeat;
        .preview-mask {
            width: 150px;
            height: 150px;
            font-size: 22px;
            text-align: center;
            position: absolute;
            top: 0;
            left: 0;
            color: #fff;
            display: none;
            background-color: rgba(0,0,0,.3);
            .icon {
                margin-top: 60px;
                margin-bottom: 38px;
            }
            p {
                font-size: 12px;
            }
        }
        &:hover {
            .preview-mask {
                display: block;
            }
        }
    }
}
    
</style>
