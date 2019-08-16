<template>
    <div>dmp</div>
</template>
<script>
export default {
    data() {
        return {}
    },
    created() {
        this.loginDmp();
    },
    methods: {
        // 登陆dmp系统，并跳转至dmp界面
        loginDmp() {
            this.$ajax({
                url: '/dsp/dmp/login',
                data: {},
                load: true,
            }).then((res) => {
                window.location.href = res.data.url;
                // window.open(res.data.url)
            })
        }
    }
}
</script>
<style lang="less">

</style>
