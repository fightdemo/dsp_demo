<template>
    <div></div>
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
                // 返回的url    
                let resUrl = res.data.url;
                // oemUrl
                let oemUrl = window.location.host;
                // 创建url实例
                let url = new URL(resUrl); 
                // 将返回的url域名替换为oem中的域名
                let finalUrl = resUrl.replace(url.hostname, oemUrl)
                window.location.href = finalUrl;
            })
        }
    }
}
</script>
<style lang="less">

</style>
