<template>
    <div class="mediaConfig">
        <div class="publish-source">
            <div class="filter-box">
                <el-button @click="checkAll">全选</el-button>
                <el-button @click="Invert">反选</el-button>
                <el-button @click="clearAll">全部清空</el-button>
                <span class="input-wrap">
                    <el-input v-model="val" placeholder="请输入媒体名称" @keyup.enter.native="search">
                        <i class="el-icon-search icon" slot="suffix" @click="search"></i>
                    </el-input>                    
                </span>
            </div>
            <div class="content-box">
                <div class="ul cl">
                     <label :for="'check'+index"  v-for="(item,index) in nList" :key="index">            
                        <div class="li" :class="[ checkList.indexOf(item[nameValue]) > -1 ? 'checked' : 'noChecked']">                       
                            <input class="checkbox-input" type="checkbox" v-model="checkList" :value="item[nameValue]" :id="'check'+index"/>
                            <div class="ps-pic">
                                <img :src="item[url]" :alt="item[nameValue]" class="icon">
                            </div>
                            <div class="ps-text">{{item[nameValue]}}</div>                           
                        </div>   
                    </label>             
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
export default {
    data() {
        return {
            nList: [],
            checkList: [],
            val: '',
        }
    },
    props: ['list','url','nameValue','idName','backList'],
    watch: {
        list() {
            this.nList = this.list;
            this.getSelected()
        },
        checkList() {
            // console.log(this.checkList)
            var array = [],
                array2 = [],
                array3 = [];
            this.checkList.forEach(item => {
                array.push(item[this.idName])
            })         
            this.list.forEach(item => {
                if(this.checkList.indexOf(item[this.nameValue]) > -1) {
                    array2.push(item[this.idName])
                    if(item.dspSpaceID) {
                        array3.push(item.dspSpaceID)
                    }
                }
            })  
            var string1 = array2.join(",")
            var string2 = array3.join(",")
            var string = {
                adxAppID: string1,
                dspSpaceID: string2
            }
            this.$emit('update:value', string1)
            this.$emit('change', string)
        },
        backList() {
            this.getSelected()
        }
    },
    mounted() {
        this.nList = this.list;
        this.getSelected()
    },
    methods: {
        search() {
            var newList = [];
            if(this.val === '') {
                this.nList = this.list;
            }else {
                this.list.forEach((item) => {
                    if(item[this.nameValue].indexOf(this.val) > -1) {
                        newList.push(item)
                    }
                })
                this.nList = newList;
            }           
        },

        checkAll() {
            this.checkList = this.getAll();
            this.send()
        },
        checkOne() {

            this.send()
        },
        Invert() {            
            var list = this.getAll(),
                nlist = [];
            for(var i = 0; i < list.length; i++) {
                if(!(this.checkList.indexOf(list[i]) > -1)) {
                    nlist.push(list[i])
                }
            }
            this.checkList = nlist;
            this.send()
        },

        clearAll() {
            this.checkList = [];
            this.send()
        },

        getAll() {
            var list = [];
            this.list.forEach(item => {
                list.push(item[this.nameValue])
            });
            return list;
        },
        getSelected() {
            if(this.backList) {
               this.list.forEach(item => {
                    if(this.backList.indexOf(item[this.idName]) > -1){
                        this.checkList.push(item[this.nameValue])
                    }
                }) 
            }
            
        },
        send() {
            var array = [],
                array2 = [];
            this.checkList.forEach(item => {
                array.push(item[this.idName])
            })         
            this.list.forEach(item => {
                if(this.checkList.indexOf(item[this.nameValue]) > -1) {
                    array2.push(item[this.idName])
                }
            })   
            var string = array2.join(",")
            this.$emit('update:value', string)
        }
    }
}
</script>

<style lang="less">
.mediaConfig{
    width: 750px;
    .publish-source{
        width: 100%;
        overflow: hidden;
        .filter-box{
            margin-top: 20px;
            margin-bottom: 20px;
            .input-wrap{
                display: inline-block;
                .el-input__suffix{
                    top: 11px;
                    right: 11px;
                    cursor: pointer;
                }
            }
        }
        .content-box{
            position: relative;
            margin: 0 auto 20px;
            border-radius: 5px;
            background-color: #fafafa;
            .ul{
                width: 740px;
                max-height: 360px;
                overflow-y: auto;
                .li{
                    width: 170px;
                    height: 88px;
                    position: relative;
                    margin-left: 5px;
                    margin-bottom: 5px;
                    padding: 8px 9px 0 30px;
                    float: left;
                    cursor: pointer;       
                    background: url('../img/images/icon_check_false_new.png') no-repeat;             
                    img{
                        vertical-align: middle;
                        width: 100%;
                        height: 42px;
                        // display: inline-block;
                    }
                    .ps-pic{
                        width: 100%;
                        border-bottom: 1px solid #e8e6e4;
                        text-align: center;                        
                        .icon{
                            width: 34px;
                            height: 34px;
                            margin-bottom: 8px;
                        }
                    }
                    .ps-text{
                        width: 100%;
                        line-height: 30px;
                        text-align: center;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    
                    .checkbox-input{
                        position: absolute;
                        clip: rect(0, 0, 0, 0);
                    }
                }
                .noChecked{                    
                    &:hover{
                        background: url('../img/images/icon_check_hover_new.png') no-repeat;
                    }
                }
                .checked{
                    background: url('../img/images/icon_check_true_new.png') no-repeat;
                }
               
            }
        }
    }
}
</style>
