<template>
    <div class="content-page">
        <router-link id="linkTool" class="linkTool" v-if="peopleManage.to" :to="peopleManage.to" target="_blank">
        </router-link>
        <li class="page-content">
            <router-link class="linkTool" v-if="peopleManage.to" :to="peopleManage.to" target="_blank">
                <div class="imgBFC" :style="{'background':peopleManage.color}">
                    <img :src="peopleManage.srcUrl" alt="">
                </div>
                <div class="toolIntro">
                    <h3>{{peopleManage.name}}</h3>
                    <p>{{peopleManage.introdution}}</p>
                </div>
            </router-link>
        </li>
    </div>
</template>
<script>
export default {
    data() {
        return {
            peopleManage: {
                name: 'DMP数据管理平台',
                // href: './dmp.html#/audience'
                to: {name:'dmp'},
                color: 'rgb(107, 157, 255)',
                introdution: '用于人群库的管理及人群数据的管理和报表展示，并将人群应用到广告推广中。',
            },
        }
    },
    mounted() {
        this.goDmp()
    },
    methods: {
        goDmp() {
            var link = document.getElementById("linkTool");
            link.click()
        }
    }
}
</script>
<style lang="less">
.content-page{
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
    .page-content:hover{
        border: 1px solid rgba(150, 213, 79, 1);
    }
}
</style>
