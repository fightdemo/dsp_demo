<template></template>
<script>
export default {
    created() {
        var id = this.$route.params.advID;
        this.$ajax({
            url: "/dsp/agency/chargeAdv",
            data: {
                advertiserID: id
            },
            load: true
        }).then(res => {
            // 存下adv的token
            localStorage["advToken" + id] = res.data;
            // 存下当前代理商id
            localStorage["advOrgID" + id] = this.$route.params.agentID;
            window.open(
                "./adv.html#/1/" + id + "/index",
                "_self"
            );
        });
    }
};
</script>
