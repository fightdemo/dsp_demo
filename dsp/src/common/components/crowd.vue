<template>
    <div class="crowd">
        <div class="industry-pkg-box">
            <ul class="industry-pkg-list cl">
                <li v-for="(item,index) in list" :key="index" @click="check(item,index)">
                    <div class="radio-box" v-if="list.length != 0">
                        <m-Radio :list="[{id:item[keyName]+'',name:''}]" :keyName1="'id'" :defaultVal="defaultVal"></m-Radio>
                        <!-- <el-radio class="m-radio" v-model="val" :label="item[keyName]+''"></el-radio> -->
                    </div>
                    <div class="app-list cl" :class="{'checked': defaultVal == item[keyName]}" v-if="list.length != 0">
                        <div class="name-box">
                            <img :src="item.icon" alt=""><br/>
                            <span class="">{{item[valueName]}}</span>
                        </div>
                        <div class="app-box cl">
                            <span style="display:inline-block;line-height:20px;">{{item.description}}</span>
                        </div>
                        <span class="label-icon" :class="{'icon-star': item.tag == '新秀包', 'icon-fire': item.tag == '热销包', 'icon-crown': item.tag == '明星包'}"></span>
                    </div>
                </li>
                <li v-if="list.length == 0">
                    <div style="text-align: center; padding: 20px 0px;">
                        <span style="font-size: 14px; color: #bfbfbf;">暂无人群包</span>
                    </div>
                </li>
            </ul>
        </div>        
    </div>    
</template>

<script>
import mRadio from '@/common/components/radio'
export default {
    components: {
        mRadio: mRadio
    },
    data() {
        return {
            i: '',
            radioList: [],
            defaultVal: this.default
        }
    },
    props: {
        list: Array,
        keyName: {
            type: String,
            default: 'id'
        },
        valueName: {
            type: String,
            default: 'name'
        },
        appInfo: {
            type: String,
            default: 'appInfo'
        },
        appName: {
            type: String,
            default: 'appName'
        },
        scrName: {
            type: String,
            default: 'appIcon'
        },
        default: {
            type: String,
            default: ''
        }
    },
    mounted() {
        var list = [];
        this.list.forEach(item => {
            list.push(
                {id: item[this.keyName], name: ''}
            )
        });
        this.radioList = list;
        var string;
        this.list.forEach(item => {
            if(item[this.keyName] == this.defaultVal) {
                string = item.spaceInList
            }
        })
        this.$emit('change', string)
        this.$emit('update:string', this.defaultVal)
    },
    watch: {
        // default(val) {
        //     this.defaultVal = val;
        // },
    },
    methods: {
        check(val,index) {
            var string;
            this.i = index;
            this.defaultVal = val[this.keyName] + '';
            this.list.forEach(item => {
                if(item[this.keyName] == val[this.keyName]) {
                    string = item.spaceInList
                }
            })
            this.$emit('update:string',val[this.keyName] + '')
            this.$emit('change', string)
        }
    }
}
</script>

<style lang="less" scoped>
.crowd{
    .industry-pkg-box{
        width: 800px;
        max-height: 500px;
        padding: 20px 0;
        border-top: 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;
        overflow-x: hidden;
        overflow-y: auto;
        .industry-pkg-list{
            width: 100%;
            height: 100%;
            li{
                width: 100%;
                height: 106px;
                margin-bottom: 10px;
                .radio-box{
                    float: left;
                    width: 5%;
                    height: 100%;
                    line-height: 106px;
                    padding-left: 10px;
                }
                .app-list{
                    width: 48%;
                    border: 1px solid #ccc;
                    height: 100%;
                    float: left;
                    position: relative;
                    &:hover{
                        border-color: #3e9cfa;
                        .name-box{
                            border-color: #3e9cfa;
                        }
                    }
                    .name-box{
                        float: left;
                        width: 32%;
                        height: 100%;
                        padding-top: 29px;
                        text-align: center;
                        border-right: 1px solid #ccc;
                    }
                    .app-box{
                        width: 68%;
                        height: 100%;
                        padding: 0 25px;
                        float: left;
                        overflow-y: hidden;
                        overflow-x: auto;
                        display: flex;
                        align-items: center;
                    }
                    .label-icon{
                        position: absolute;
                        width: 58px;
                        height: 16px;
                        left: 5px;
                        top: 0;
                    }
                    .icon-fire{
                        background: url('../../common/img/images/icon-fire.png') no-repeat center;
                    }
                    .icon-star{
                        background: url('../../common/img/images/icon-star.png') no-repeat center;
                    }
                    .icon-crown{
                        background: url('../../common/img/images/icon-crown.png') no-repeat center;
                    }
                }
                .checked{
                    border-color: #3e9cfa;
                    .name-box{
                        border-color: #3e9cfa;
                    }
                }
            }
        }
    }
}
@media screen and (max-width: 1400px) {
    .crowd{
        .industry-pkg-box{
            width: 700px;
        }
    }
} 
</style>
