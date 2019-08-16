<template>
    <div>
        <dsp-tab :tabList="tabList" class="content"></dsp-tab>
        <router-view />
    </div>
</template>
<script>
export default {
    data() {
        return {
            tabList: this.PAGE['report.media']
        }
    }
}
</script>
<style lang="less">

</style>
