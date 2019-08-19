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
            tabList: [
                {name:'基本信息',to:{name:'system.base'}},
                {name:'资质信息',to:{name:'system.qualification'}},
            ]
        }
    }
}
</script>
<style lang="less">

</style>
