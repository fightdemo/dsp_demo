<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="#">首页 <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">代理商管理</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="finance" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            财务管理
          </a>
          <div class="dropdown-menu dropdown-toggle" aria-labelledby="finance">
            <a class="dropdown-item" href="#">财务记录</a>
            <a class="dropdown-item" href="#">财务信息</a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="report" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            报表
          </a>
          <div class="dropdown-menu dropdown-toggle" aria-labelledby="report">
            <a class="dropdown-item" href="#">代理商报表</a>
            <a class="dropdown-item" href="#">广告公司报表</a>
            <a class="dropdown-item" href="#">广告主报表</a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="diagnose" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">诊断</a>
          <div class="dropdown-menu dropdown-toggle" aria-labelledby="diagnose">
            <a class="dropdown-item" href="#">诊断账户</a>
            <a class="dropdown-item" href="#">诊断活动</a>
            <a class="dropdown-item" href="#">诊断订单</a>
            <a class="dropdown-item" href="#">诊断订单定向</a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="tool" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">工具</a>
          <div class="dropdown-menu dropdown-toggle" aria-labelledby="tool">
            <a class="dropdown-item" href="#">OEM设置</a>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="delivery" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">投放完成率评估</a>
          <div class="dropdown-menu dropdown-toggle" aria-labelledby="delivery">
            <a class="dropdown-item" href="#">投放完成报表</a>
            <a class="dropdown-item" href="#">投放完成工具</a>
          </div>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
  </nav>
</template>

<script>



export default {
    name: "App",
    data() {
        return {
    
        };
    },
    mounted() {

    },
    methods: {

    }
};
</script>

<style lang="less">

</style>

