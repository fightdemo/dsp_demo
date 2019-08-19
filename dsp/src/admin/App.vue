<template>
  <div id="app">
    <Nav :navList='navList' :userInfo='nameInfo'></Nav>
    <div class="component_con">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Nav from "@/common/components/Nav";
import navList from "./router/navList";
export default {
  name: 'App',
  data(){
    return{
      navList: navList,
      nameInfo:{}
    }
  },
  mounted(){
    this.getuserInfo();
    this.judgePlatform();
  },
  methods:{
    getuserInfo(){
      this.$ajax({
        url: '/dsp/UserInfo',
        data:{
          'type': "admin"
        },
        load: true
      }).then(res=>{
        this.nameInfo = res.data;
      })
    },
    judgePlatform(){
      if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          document.getElementById("app").style.minWidth = '1100px';
      }
    }
  },
  components:{
    'Nav':Nav
  }
}
</script>

<style lang='less'>
#app{
  background: #fff;
  // min-width: 1100px;
  .component_con{
    // overflow: hidden;
    width: 100%;
    height: 100%;
    padding-bottom: 85px;
  }
}


</style>
