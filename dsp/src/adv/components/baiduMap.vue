<template>
  <div class="baidu-map" style="padding-top:50px;">
      <!-- <search @search="search" placeholder="搜索地点..."></search>s -->
      <baidu-map v-bind:style="mapStyle" class="bm-view" ak="gXWSdw891u3IO5dCIqWLjLIabHVZKTNT"
      :center="center" 
      :zoom="zoom" 
      :scroll-wheel-zoom="true" 
      :enableMapClick="false"
      @ready="handle"
      @moving="syncCenterAndZoom" 
      @moveend="syncCenterAndZoom" 
      @zoomend="syncCenterAndZoom">
        <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
        <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
        <bm-marker v-if="dianshow" :position="{lng: center.lng, lat: center.lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        <bm-circle :center="center" fillColor="#57BC46" strokeColor="#23C317" :radius="radius" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" @lineupdate="updateCirclePath" :editing="false"></bm-circle>
        </bm-marker>

        <div class="infoBox" id="infoBox" ref="infoBox" v-show="showInfoWindow">
          <img @click="closeInfoWindow" style="position: absolute; top: 2px; right: 5px;" src="../assets/img//infowindow_close.png" alt="">
          <p class="infoTitle">{{addressTitle}}</p>
          <p class="infoContent">{{infoWindow.contents}}</p>
          <el-slider v-model="rangeValue" :step="0.5" :max="25" :min="0.5"></el-slider>
          <p class="infoRange">{{rangeValue+'km'}}</p>
          <button @click="makeSelect" class="selectBtn">确定</button>
          <div class="infoBoxLast">
            <img src="../assets/img/infowin_pin.png" alt="">
          </div>
        </div>
      </baidu-map>
  </div>  
</template>
<script>
  import {BaiduMap, BmControl, BmView, BmAutoComplete, BmLocalSearch, BmMarker} from 'vue-baidu-map'
  import Search from '@/common/components/search.vue'
  export default {
    components: {
      BaiduMap,
      BmControl,
      BmView,
      BmAutoComplete,
      BmLocalSearch,
      BmMarker,
      Search
    },
    data: function () {
      return {
        showMapComponent: this.value,
        keyword: '',
        mapStyle: {
          width: '100%',
          height: this.mapHeight + 'px'
        },
        center: {lng: 116.404, lat: 39.915},
        zoom: 15,
        radius: 0,
        infoWindow: {
          show: false,
          contents: ''
        },
        address: "",
        addressTitle: "",
        rangeValue: 0.5,
        showInfoWindow: false,
        dianshow: false,
        BMap: {}, //地址解析时使用
        map: {},  //地址解析时使用
      }
    },
    watch: {
      value: function (currentValue) {
        this.showMapComponent = currentValue
        if (currentValue) {
          this.keyword = ''
        }
      },
      rangeValue(val){
        this.radius = val*1000;
      }
    },
    props: {
      value: Boolean,
      mapHeight: {
        type: Number,
        default: 500
      },
      lbsPosition: Object|Array
    },
    mounted() {
    },
    methods: {
      //搜索事件
      search(val) {
        this.getPonit(val)
      },
      formatTooltip(val) {
        return val / 100;
      },
      //地址解析
      getPonit(val) {
        var that = this;
        // 创建地址解析器实例
        var myGeo = new BMap.Geocoder();
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(val, function(point){
          if (point) {
            that.getAddress(that.BMap, that.map, point)
          }else{
            alert("您选择地址没有解析到结果!");
          }
        }, "中国");
      },
      //逆地址解析
      getAddress(BMap, map, point) {
        var geoc = new BMap.Geocoder(),
        vm = this; 
        if( !point ){
          map.addEventListener("click", function(e){ 
            vm.showInfoWindow = true;
            vm.dianshow = true;
            var pt = e.point;
            vm.center = pt;
            geoc.getLocation(pt, function(rs) {
              var address = rs.address,
              title;
              if(rs.surroundingPois.length) {
                title = rs.surroundingPois[0].title 
              }else {
                title = address;
              } 
              vm.center = {lng: pt.lng, lat: pt.lat} //获取经纬度
              vm.addressTitle = title; //获取title
              vm.infoWindow.contents = address; //获取地址
            });   
            vm.radius = 500;
            vm.rangeValue = 0.5;
          });
        }else{
          vm.showInfoWindow = true;
          vm.dianshow = true;
          geoc.getLocation(point, function(rs) {
              var address = rs.address,
              title;
              if(rs.surroundingPois.length) {
                title = rs.surroundingPois[0].title 
              }else {
                title = address;
              } 
              vm.center = {lng: point.lng, lat: point.lat} //获取经纬度
              vm.addressTitle = title; //获取title
              vm.infoWindow.contents = address; //获取地址
          }); 
          vm.radius = 500;
          vm.rangeValue = 0.5;
        }
      },
      //信息框关闭事件
      closeInfoWindow() {
        this.radius = 0;
        this.showInfoWindow = false;
      },
      //选择按钮事件
      makeSelect() {
        var position = []
        position.push( this.center.lat, this.center.lng, this.radius/1000 )
        this.$emit('getPosAndRadius', position )
        this.$message.success("已确定位置");
      },
      //更新中心点和半径
      updateCirclePath(e){
        this.center = e.target.getCenter()
        this.radius = e.target.getRadius()
      },
      /***
       * 地图点击事件。
       */
      handle(e) {
        this.radius = 0;
        this.showInfoWindow = false;
        this.BMap = e.BMap;
        this.map = e.map;
        this.getAddress(e.BMap,e.map)
        this.center.lng = e.map.BC.lng
        this.center.lat = e.map.BC.lat
        this.getPosition()
      },
      //回填地理位置
      getPosition() {
        if( this.lbsPosition.length ){
          var point = {};
          point.lat = Number(this.lbsPosition[0].pos.split(',')[0])
          point.lng = Number(this.lbsPosition[0].pos.split(',')[1])
          point.radius = Number(this.lbsPosition[0].radius)
          var myGeo  = new BMap.Geocoder(),
          vm = this;
          vm.showInfoWindow = true;
          vm.dianshow = true;
          myGeo.getLocation(new BMap.Point(point.lng, point.lat), function(rs){      
              if (rs){      
                var address = rs.address,
                title;
                if(rs.surroundingPois.length) {
                  title = rs.surroundingPois[0].title 
                }else {
                  title = address;
                } 
                vm.center = {lng: point.lng, lat: point.lat} //获取经纬度
                vm.addressTitle = title; //获取title
                vm.infoWindow.contents = address; //获取地址 
              }      
          });
          vm.radius = point.radius*1000;
          vm.rangeValue = point.radius;
        }
      },
      syncCenterAndZoom (e) {
        const {lng, lat} = e.target.getCenter()
        this.center.lng = lng
        this.center.lat = lat
        this.zoom = e.target.getZoom()
      }
    }
  }
</script>
 
<style lang="less">
.baidu-map{
  width: 80%;
  position: relative;
}
.BMap_shadow,.BMap_pop{
    display: none;
  }
.selectBtn{
  width: 50px;
  position: absolute;
  right: 10px;
  bottom: 5px;
  background: #1BA3F4;
  line-height: 30px;
  color: #fff;
  border: 0;
}
.block{
  width: 200px!important;
  margin: 0 auto;
}
.infoBox{
  width: 250px;
  height: 160px;
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%,-125%,0);
  border: 1px solid #ccc;
  padding-top: 20px;
}
.infoTitle{
  text-align: left;
  text-indent: 20px;
  margin-bottom: 5px;
  font-size: 18px;
  font-weight: 600;
}
.infoContent{
  text-align: left;
  text-indent: 20px;
  font-size: 12px;
  margin: 0;
  padding: 0;
  margin-top: 10px;
}
.infoRange{
  margin: 0;
  font-size: 14px;
  text-align: center;
}
.infoBoxLast{
  background: #fff;
  position: absolute;
  top: 160px;
  left: 115px;
}
.infoBoxLast img{
  position: absolute;
  border: 0;
  padding: 0;
  margin: 0;
  top: -1px;
  left: 0px;
  user-select: none;
  width: 51px;
  height: 44px;
  min-width: 51px;
  max-width: 51px;
  min-height: 44px;
  max-height: 44px;
  overflow: hidden;
}
.el-slider{
  width: 220px;
  margin: 0 auto;
}
/* .serachinput{
  width: 300px;
  box-sizing: border-box;
  padding: 9px;
  border: 1px solid #dddee1;
  line-height: 20px;
  font-size: 16px;
  height: 38px;
  color: #333;
  position: relative;
  border-radius: 4px;
  -webkit-box-shadow: #666 0px 0px 10px;
  -moz-box-shadow: #666 0px 0px 10px;
  box-shadow: #666 0px 0px 10px;
} */
</style>