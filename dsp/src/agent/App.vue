<template>
    <div id="app">
        <Nav :navList="navList" :balance="balance" :userInfo="userInfo"></Nav>
        <router-view></router-view>
    </div>
</template>

<script>
import Nav from "@/common/components/Nav";
import navList from "./router/navList";

export default {
    name: "App",
    components: {
        Nav
    },
    computed: {
        balance() {
            return this.$store.state.balance.balance;
        },
        userInfo() {
            return this.$store.state.common.userInfo;
        },
        permission() {
            return this.$store.state.common.permission;
        }
    },
    created() {
      
    },
    mounted () {
      this.judgePlatform();
    },
    data() {
        return {
            navList: navList
        };
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
  .finance-list {
    padding: 20px;
    width: 100%;
    display: flex;
    li {
      width: 300px;
      height: 80px;
      padding: 15px 20px;
      margin-right: 20px;
      background: #fff;
      color: #596679;
      .finance-title {
        font-size: 18px;
        background-size: 20px 20px;
        i {
          width: 20px;
          height: 20px;
          margin-right: 10px;
          display: inline-block;
          vertical-align: middle;
          background: url(./assets/img/icon_price_02.png) no-repeat center;
        }
      }
      .finance-number {
        font-size: 24px;
      }
    }
    li:nth-child(2) .finance-title i {
      background: url(./assets/img/icon_price_01.png)
    }
    li:nth-child(3) .finance-title i {
      background: url(./assets/img/icon_price_03.png)
    }
  }
</style>
