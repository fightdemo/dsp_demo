<template>
    <div>
        <dsp-button
            v-if="url"
            :data-src="url"
            @click="$imageViewer"
            type="primary"
            plain
            size="mini"
            round
        >查看</dsp-button>
        <span v-if="!url" style="color: #19bc98 !important">暂未上传</span>
    </div>
</template>
<script>
import dspButton from "@/common/components/dspButton"
export default {
    components: {
        dspButton
    },
    props: {
        url: String
    }
}
</script>
<style lang="less">

</style>
