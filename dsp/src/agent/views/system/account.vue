<template>
    <div>
        <div class="page-title">
            基本信息
        </div>
        <baseInfo :canEdit="!!permission.act[22]" :id="$route.params.agentID"></baseInfo>
    </div>
</template>
<script>
import baseInfo from "adv@/components/base"
export default {
    components: {
        baseInfo
    }
}
</script>
<style lang="less">
</style>
