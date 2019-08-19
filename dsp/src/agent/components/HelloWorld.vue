<template>
  <div class="hello">
    <dsp-button type="success" msg='查看落地页修改用例' round size='medium'></dsp-button>
    <dsp-button type="primary" msg='创建检测站点' iconImg='el-icon-search' size='os'></dsp-button><br>
    <dsp-button type="purple" msg='创建ID人群' iconImg='el-icon-search' size='os'></dsp-button><br>
    <dsp-button type="danger" msg='退出' iconImg='el-icon-search' size='medium'></dsp-button><br>
    <dsp-button type="default" msg='下载报表' size='small'></dsp-button><br>
    <dsp-button type="default" msg='取消' size='medium'></dsp-button><br>
    <dsp-button type="success" msg='完成编辑'></dsp-button><br>
    <dsp-button type="edit" msg='测试按钮' round></dsp-button><br>
    <dsp-button type="warning" msg='诊断' round size='mini'></dsp-button><br>
    <dsp-button type="edit" msg='编辑' round size='mini'></dsp-button><br>
    <dsp-button type="warning" msg='诊断' plain round size='mini'></dsp-button><br>
    <dsp-button type="warning" msg='查看落地页' plain round size='mini'></dsp-button><br>
    <dsp-button type="edit" msg='编辑' plain round size='mini'></dsp-button><br>
    <dsp-button type="danger" msg='删除' plain round size='mini'></dsp-button><br>
    <dsp-button type="default" msg='工作日' round size='sm'></dsp-button><br>
    <dsp-button type="info" msg='上 午' round size='sm'></dsp-button><br><br>
    
    <div class="Page">
      <p class="page-title">财务管理</p>
    </div><br><br>
    <div class="table">
      <table class="table-box">
        <thead>
          <tr >
            <td>活动ID</td>
            <td>订单名称</td>
            <td>活动名称</td>
            <td>曝光量</td>
            <td>点击量</td>
            <td>点击率</td>
            <td>到达量</td>
            <td>到达率</td>
            <td>转化量</td>
            <td>转化率</td>
            <td>活动花费（元）</td>
            <td>CPM（元）</td>
            <td>CPC（元）</td>
            <td>CPE（元）</td>
            <td>CPA（元）</td>
          </tr>
        </thead>
        <tbody>
          <tr class="total">
            <td colspan="3">总计</td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
          </tr>
          <tr>
            <td>0001</td>
            <td>这是一个订单的名称</td>
            <td>这是一个活动名称</td>
            <td>00,000,000</td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
          </tr>
          <tr>
            <td>0001</td>
            <td>这是一个订单的名称</td>
            <td>
              <dsp-edit :value.sync="message" @change='confirmEdit'></dsp-edit>
            </td>
            <td>
              <span>00,000,000</span>
            </td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
          </tr>
          <tr>
            <td>0001</td>
            <td>这是一个订单的名称</td>
            <td>
              <dsp-edit :value.sync='message2'></dsp-edit>
            </td>
            <td>
              <span>00,000,000</span>
            </td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000</td>
            <td>00.00%</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
            <td>00,000,000.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import dspButton from '@/components/dspButton'
import dspEdit from '@/components/dspEdit'
export default {
  name: 'HelloWorld',
  data () {
    return {
       message:'testest',
       message2:'这是测试数据'
    }
  },
  methods:{
    confirmEdit(val){
     console.log("--------------");
     console.log(val);

    }
  },
  components:{
    'dspButton':dspButton,
    'dspEdit':dspEdit
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.hello{
  overflow: hidden;
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.Page{
  width: 95%;
  margin: auto;
}



</style>
