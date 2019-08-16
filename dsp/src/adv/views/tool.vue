<template>
    <div class="tool-body">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    mounted() {
        if(this.$route.name == 'tool.audiences') {
            document.body.style.padding = '0px';
        }else {
            document.body.style.paddingLeft = '90px 20px 60px 290px';
        }
    }
}
</script>
<style lang="less">
    .tool-body {
        padding: 20px;
        padding-top: 90px;
    }
</style>
