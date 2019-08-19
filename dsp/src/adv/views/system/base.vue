<template>
    <baseInfo :canEdit="!!permission.act[71]" :id="$route.params.advID"></baseInfo>
</template>
<script>
import baseInfo from "adv@/components/base";
export default {
    components: {
        baseInfo
    },
};
</script>
<style lang="less">
</style>
