<template>
    <div class="creative-box">
        <div class="mask"></div>
        <div class="creative-main">
            <div class="creative-main-head"></div>
            <div class="form-box form">
                <div class="form-group">
                    <label>创意名字：</label>
                    <el-input></el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less">
.creative-box{
    .mask{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        position: fixed;
        top: 0;
        left: 0;
    }
    .creative-main{
        width: 700px;
        height: 100%;
        background-color: #fff;
        position: fixed;
        top: 0;
        right: 0;
    }
}
</style>
