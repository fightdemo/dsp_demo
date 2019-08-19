<template>
    <div>
        <dsp-tab :tabList="tabList" class="content"></dsp-tab>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tabList: this.PAGE['system.role'],
        };
    },
};
</script>
<style lang="less">
</style>
