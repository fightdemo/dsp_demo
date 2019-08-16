<template>
    <div class="m-select-wrap" :size="size" :disabled="disabled" :type="type">
        <div class="m-select" @click.stop="open">
            <input class="m-select-inner" v-model="val" type="text" readonly="readonly" autocomplete="off" :disabled="disabled" :placeholder="title" :class="size">
            <span class="m-select-suffix">
                <i class="m-select-icon el-icon-caret-bottom" :class="size"></i>
            </span>
        </div>
        <!-- <el-collapse-transition> -->
        <div class="scrollbar" v-show="visible">
            <div class="select-dropdown" @scroll="handleScroll" ref="wrap" @mouseover="scrollbarShow=true" @mouseleave="scrollbarShow=false">
                <ul class="select-dropdown-list">                   
                    <li class="select-dropdown-item" v-for="(item, index) in list" :key="index" :title="item[valueName]" @click.stop="select(item)" :class="{'active': id == item[keyName]}">{{item[valueName]}}</li>                    
                </ul>
            </div>
            <div class="scrollbar-bar is-horizontal" style="display:none;">
                <div class="scrollbar-thumb" style="transform: translateX(0%);"></div>
            </div>
            <div class="scrollbar-bar is-vertical" v-if="scrollbarShow">
                <div class="scrollbar-thumb" :style="transform"></div>
            </div>
        </div>
        <!-- </el-collapse-transition>     -->
    </div>
</template>

<script>
/**
 * 传入list [{id:"1",value:"例子"}]
 * keyName默认为id  valueName默认为value 与list中的键对应
 * title初始化时显示的内容
 */
import Vue from 'vue' 
export default {
    data() {
        return {
            visible: false,
            val: '',
            id: this.idVal,
            transform: '',
            scrollbarShow: false,
            sizeHeight: "",
            sizeWidth: "",
            moveX: 0,
            moveY: 0,
        }
    },
    watch: {
        title(val) {
            this.val = val;
        },
        idVal(val) {
            this.id = val;
            this.$emit('update:idVal', val)
        }
    },
    props: {
        list: {
            type: Array|Object,
            default: () => []
        },
        idVal: {
            type: String,
            default: 'ID'
        },
        keyName: {
            type: String,
            default: 'id'
        },
        valueName: {
            type: String,
            default: 'value'
        },
        title: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: 'big'
        },
        type: {
            type: String,
            default: ''
        }  
    },
    computed: {
        wrap() {
            return this.$refs.wrap;
        }
    },
    mounted() {      
        if(!window.globalEvent) {
            window.globalEvent = new Vue();
        }
        if(this.title) {
            this.val = this.title;
        }

        globalEvent.$on("rootClick",() => {
            this.visible = false;
            if(this.$refs.wrap) {
                this.$refs.wrap.scrollTop = '0px';
            }
        })
        this.$emit('update:id', this.id)
        document.addEventListener('click', this.globalFun)
    },
    destroyed() {
        document.removeEventListener('click', this.globalFun)
    },
    methods: {
        globalFun() {
            globalEvent.$emit("rootClick")
        },
        open(e) {         
            if(this.disabled) return;                        
            if(this.visible == false) {
                globalEvent.$emit("rootClick")
            }
            this.visible = !this.visible;

            // if(this.list.length * 40 > 274) {
            //     this.scrollbarShow = true;
            // }
            this.$nextTick(this.update)
            // this.transform = `transform: translateY(0%); height: ${this.sizeHeight}`;

        },
        select(val) {          
            this.visible = !this.visible;   
            if(this.id == val[this.keyName]) return;       
            this.val = val[this.valueName];
            this.id = val[this.keyName]

            this.$emit('update:id', this.id)
            this.$emit('update:value', this.val)
            this.$emit('update:title', this.val)
            this.$emit('change', val)
        },
        handleScroll() {
            const wrap = this.wrap;

            this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
            this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
            
            this.transform = `transform: translateY(${ this.moveY }%);height: ${this.sizeHeight}`;

        },
        update() {
            let heightPercentage, widthPercentage;
            const wrap = this.wrap;
            if (!wrap) return;

            heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
            // widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

            this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';
            // this.sizeWidth = (widthPercentage < 100) ? (widthPercentage + '%') : '';

            this.transform = `transform: translateY(0%); height: ${this.sizeHeight}`;
        }
    }
}
</script>

<style lang="less">
.m-select-wrap{
    width: 254px;
    height: 40px;
    line-height: normal;
    border: 1px solid #fff;
    background-color: rgba(228, 245, 255, 1);
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    .m-select{
        width: 100%;
        height: 100%;   
        position: relative;     
        .m-select-inner{
            display: inline-block;
            width: 100%;
            height: 100%;
            padding-right: 30px;
            padding-left: 15px;
            font-size: 12px;
            line-height: 40px;
            color: rgba(134, 145, 202, 1);
            text-align: left;
            border: none;
            background-color: inherit;
            cursor: pointer;
        }
        .m-select-inner[disabled = 'disabled'] {
            cursor: not-allowed;
        }
        .middle{
            font-size: 14px;
            color: rgba(16, 16, 16, 1);
        }
        .m-select-suffix{
            position: absolute;
            top: 0;
            right: 5px;
            height: 100%;
            .m-select-icon{
                width: 25px;
                height: 100%;
                line-height: 40px;
            }
            .middle{
                line-height: 30px;
            }
        }
    }
    .scrollbar{
        min-width: 100%;
        width: 100%;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        overflow: hidden;
        position: absolute;
        z-index: 2019;
        .select-dropdown{
            overflow-y: auto;
            height: 100%;
            max-height: 274px;
            // margin-bottom: -17px;
            margin-right: -17px;    
            // width: 100%;      
            .select-dropdown-list{
                // padding: 6px 0;               
                .select-dropdown-item{
                    font-size: 14px;
                    padding: 0 15px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: #606266;
                    height: 34px;
                    line-height: 34px;
                    cursor: pointer;
                    text-align: left;                    
                    &:hover{
                        background: #eee;
                    }
                }
                .active{
                    color: #6da7ff;
                }
            }
        }
        // .select-dropdown::-webkit-scrollbar {  
        //     width: 6px;  
        //     height: 26px;
        // } 
        // .select-dropdown::-webkit-scrollbar-thumb {  
        //     border-radius: 10px;  
        //     -webkit-box-shadow: inset 0 0 6px rgba(144,147,153,.3);  
        //     background-color: rgba(144,147,153,.3); 
        // }  
        .scrollbar-bar{
            position: absolute;
            right: 2px;
            bottom: 2px;
            z-index: 1;
            border-radius: 4px;
            opacity: 1;
            transition: opacity 120ms ease-out;
            .scrollbar-thumb{
                position: relative;
                display: block;
                width: 100%;
                // height: 61%;
                cursor: pointer;
                border-radius: inherit;
                background-color: rgba(144,147,153,.3);
                -webkit-transition: .3s background-color;
                transition: .3s background-color;
            }
        }       
        .is-horizontal{
            height: 6px;
            left: 2px;
        }
        .is-vertical{
            width: 6px;
            top: 2px;
        }
    }
}

div.m-select-wrap[size = 'bigmore']{
    width: 464px;
}
div.m-select-wrap[size = 'big']{
    width: 254px;
}
div.m-select-wrap[size = 'small']{
    width: 80px;
}
div.m-select-wrap[size = 'mid']{
    width: 150px;
}
div.m-select-wrap[disabled = 'disabled']{
    cursor: not-allowed;
    background-color: #eee;
}
div.m-select-wrap[size = 'middle']{
    width: 150px;
    height: 30px;
    background-color: #fff;
    border: 1px solid rgba(187, 187, 187, 1);
    border-radius: 4px;
    display: inline-block;
}
@media screen and (max-width: 1720px){
    div.m-select-wrap[size = 'bigmore']{
        width: 400px;
    }
    div.m-select-wrap[size = 'big']{
        width: 200px;
    }
    div.m-select-wrap[size = 'small']{
        width: 70px;
    }
    div.m-select-wrap[size = 'mid']{
        width: 140px;
    }
    div.m-select-wrap[size = 'middle']{
        width: 140px;
    }
}
</style>
