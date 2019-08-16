<template>
    <qualification :canEdit="!!permission.act[73]" :advID="$route.params.advID"></qualification>
</template>
<script>
import qualification from "adv@/components/qualification";
export default {
    components: {
        qualification
    }
};
</script>
<style lang="less">
</style>
