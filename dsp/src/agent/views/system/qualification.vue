<template>
    <div class="qua-page">
        <div class="page-title">
            资质信息
            <dsp-button @click="$router.go(-1)">返回</dsp-button>
        </div>
        <qualification :advID="$route.params.advID"></qualification>
    </div>
</template>
<script>
import qualification from "adv@/components/qualification"
export default {
    components: {
        qualification
    }
}
</script>
<style lang="less">
.qua-page {
    .page-title {
        .dsp_button {
            float: none;
        }
    }
}
</style>
