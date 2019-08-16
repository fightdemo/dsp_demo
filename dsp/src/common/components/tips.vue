<template>
    <el-tooltip effect="dark" :content="content" placement="top" class="tips-box">
        <div v-if="!content" class="tips-content" slot="content">
            <slot></slot>
        </div>
        <i class="el-icon-question"></i>
    </el-tooltip>
</template>
<script>
export default {
    props:["content"]
};
</script>
<style lang="less">
.tips-box {
    cursor: pointer;
    .tips-content {
        text-align: center;
    }
}
</style>
