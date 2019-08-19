<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "App",
    mounted() {
        this.judgePlatform();
    },
    methods: {
        judgePlatform(){
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                document.getElementById("app").style.minWidth = '1100px';
            }
        }
    }
};
</script>

<style lang="less">
#app{
    // min-width: 1100px;
}
</style>
