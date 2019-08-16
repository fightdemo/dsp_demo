<template>
    <div class="toolBox">
        <div class="page-title">
            工具箱
        </div>
        <ul class="cl page-box">
            <li v-for="( item, index ) in navToolList" :key="index" class="page-content">
                <router-link class="linkTool" v-if="item.to" :to="item.to" target="_blank">
                    <div class="imgBFC" :style="{'background':item.color}">
                        <img :src="item.srcUrl" alt="">
                    </div>
                    <div class="toolIntro">
                        <h3>{{item.name}}</h3>
                        <p>{{item.introdution}}</p>
                    </div>
                </router-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data() {
        return {
            navToolList: [{}
            //     {
            //     name: '监测管理',
            //     to: {name:'tool.audiences'},
            //     color: 'rgb(150, 213, 79)',
            //     introdution: '用于落地页嵌入监测代码，并将后续监测效果回收至平台报表。',
            // },{
            //     name: 'DMP数据管理平台',
            //     // href: './dmp.html#/audience'
            //     to: {name:'dmp'},
            //     color: 'rgb(107, 157, 255)',
            //     introdution: '用于人群库的管理及人群数据的管理和报表展示，并将人群应用到广告推广中。',
            // },
            // {
            //     name: '落地页在线制作',
            //     href: 'http://www.baidu.com'
            // },{
            //     name: '线索管理平台',
            //     href: 'http://www.baidu.com'
            // },{
            //     name: '商品管理平台',
            //     href: 'http://www.baidu.com'
            // },{
            //     name: '落地页检测',
            //     to: {name:'tool.detection'}
            // }
            ],
            hasDepot: false,
        }
    },
    created () {
        var navListArr = this.navToolList;
        for( var i = 0 ; i < navListArr.length ; i++ ){
            navListArr[i].srcUrl = require('../assets/img/v2_pnmr'+i+'.png'); 
        }
        this.navToolList = navListArr;
        // console.log(this.permission)
    },
    mounted(){
        this.getDepot()
    },
    methods: {
        getDepot() {
            this.$ajax({
                url: '/dsp/sys/parameter/query',
                data: {
                    "filter":{"feature":"dsp.feature.device.depot.allow"},
                }
            }).then( res => {
                var list = [];
                //DMP数据管理权限
                this.hasDepot = res.data[0].value == 1 && this.permission.act['132'];
                if(this.hasDepot) {
                    list.push({
                        name: 'DMP数据管理平台',
                        to: {name:'dmp'},
                        color: 'rgb(107, 157, 255)',
                        introdution: '用于人群库的管理及人群数据的管理和报表展示，并将人群应用到广告推广中。',
                    })
                }
                //监测权限
                if(this.permission.act['69']) {
                    list.push({
                        name: '监测管理',
                        to: {name:'tool.audiences'},
                        color: 'rgb(150, 213, 79)',
                        introdution: '用于落地页嵌入监测代码，并将后续监测效果回收至平台报表。',
                    })
                }
                this.navToolList = list;
            })
        },               
    }
}
</script>
<style lang="less" scoped>
.toolBox{
    .page-box{
        display: flex;
        .page-content{
            width: 525px;
            height: 160px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0px 2px 12px 2px rgba(183, 183, 183, 1);
            // border: 1px solid rgba(150, 213, 79, 1);
            margin-left: 20px;
            background: #fff;
            .linkTool{
                display: flex;
                color: #000;
                .imgBFC{
                    width: 120px;
                    height: 120px;
                    line-height: 120px;
                    border-radius: 8px;
                    margin-left: 20px;
                    margin-top: 20px;
                    text-align: center;
                    box-shadow: 0px 0px 0px 0px rgba(220, 220, 220, 1);
                    img{
                        width: 60px;
                        height: 60px;
                        margin-top: 30px;
                    }
                }
                .toolIntro{
                    width: 308px;
                    margin-left: 40px;
                    margin-top: 36px;
                    text-align: left;
                    h3{
                        font-size: 16px;
                    }
                    p{
                        margin-top: 16px;
                        line-height: 22px;
                        font-size: 14px;
                    }
                }
            }   
            
        }
    }
    .page-content:hover{
        border: 1px solid rgba(150, 213, 79, 1);
    }
    .page-box li:nth-child(1){
        margin-left: 0;
    }
}

</style>
