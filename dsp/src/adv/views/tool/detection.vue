<template>
    <div>
        <NavTool name="落地页检测工具" :userInfo="userInfo"></NavTool>
        <div class="content">
            <h3>页面质量检测工具介绍</h3>
            <p>“页面质量检测工具”会帮您检测指定地址中页面在不同网络环境中的可访问性，并给出访问性积分与改善建议。</p>
            <p>高分值表示该页面用户访问时流畅度体验度更佳，可以带来更高的转化率。较低分值时，您可以根据页面给出的改善建议，优化您的页面以便提高分值</p>
        </div>
    </div>
</template>
<script>
import NavTool from "@/common/components/NavTool";
export default {
    components: {
        NavTool
    },
    computed: {
        userInfo() {
            return this.$store.state.common.userInfo;
        }
    },
}
</script>
<style lang="less">

</style>
