<template>
    <div class="m-select-wrap" :size="size" :disabled="disabled" :type="type">
        <div class="m-select" @click.stop="open">
            <input class="m-select-inner" v-model="val" type="text" readonly="readonly" autocomplete="off" :placeholder="title" :class="size">
            <span class="m-select-suffix">
                <i class="m-select-icon el-icon-caret-bottom" :class="size"></i>
            </span>
        </div>
        <div class="scrollbar" v-show="visible">
            <div class="select-dropdown" @scroll="handleScroll" ref="wrap">
                <ul class="select-dropdown-list">
                    <li class="select-search" @click.stop="visible=true">
                        <el-input v-model="name"></el-input>
                    </li>
                    <li class="select-dropdown-item" v-for="(item, index) in nlist" :key="index" @click.stop="checkone($event,item)" :class="{'active': id == item[keyName]}">
                        <span @click.stop><el-checkbox v-model="item.checked" :disabled="item.disabled"></el-checkbox></span> 
                        {{item[valueName]}}   
                    </li>     
                    <li class="select-ok">
                        <el-button @click="affirm">确认</el-button>    
                    </li>               
                </ul>
            </div>
            <div class="scrollbar-bar is-horizontal" style="display:none;">
                <div class="scrollbar-thumb" style="transform: translateX(0%);"></div>
            </div>
            <div class="scrollbar-bar is-vertical" v-if="scrollbarShow">
                <div class="scrollbar-thumb" :style="transform"></div>
            </div>            
        </div>
        <ul class="filter-content cl">
            <li class="item" v-for="(v, k) in checkList" :key="k">
                {{v[valueName]}}
                <i class="icon-close" @click="remove(v,k)"></i>
            </li>
        </ul>
    </div>
</template>

<script>
import Vue from 'vue' 
export default {
    data() {
        return {
            nlist: [],
            checkList: [],
            name: '',
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
        checkedID(val) {
            this.backFill()
        },
        name() {
            this.search()
        },
        list(val) {
            this.nlist = val; 
            this.backFill();
            // this.nlist.forEach(item => {
            //     this.$set(item, 'checked', false);
            //     this.$set(item, 'disabled', false);
            // });          
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
        },
        checkedID: {
            type: Array|String,
            default: []
        }  
    },
    computed: {
        wrap() {
            return this.$refs.wrap;
        }
    },
    mounted() {      
        this.nlist = this.list;
        this.nlist.forEach(item => {
            this.$set(item, 'checked', false);
            this.$set(item, 'disabled', false);
        });
        this.backFill()
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
        open() {           
            if(this.disabled) return;                        
            if(this.visible == false) {
                globalEvent.$emit("rootClick")
            }
            this.visible = !this.visible;

            this.$nextTick(this.update)

        },
        checkone($event,item) {
            item.checked = !item.checked;          
        },
        select(val) {            
            // this.visible = !this.visible;   
            // if(this.id == val[this.keyName]) return;       
            // this.val = val[this.valueName];
            // val.checked = !val.checked;            
        },
        affirm() {
            var checkList = [];
            this.nlist.forEach(item => {
                if(item.checked) {
                    checkList.push(item)
                }
            })
            this.checkList = checkList;
            this.send()
        },
        search() {
            var checkList = [];
            this.nlist = this.list;
            if(this.name != '' && this.name.length > 0) {
                this.nlist.forEach(item => {
                    if(item[this.valueName].indexOf(this.name) > -1) {
                        checkList.push(item)
                    }
                })
                this.nlist = checkList;
            }else {
                this.nlist = this.list;
            }
        },
        remove(v,k) {
            this.checkList.splice(k, 1);
            this.nlist.forEach(item => {
                if(item[this.keyName] == v[this.keyName]) {
                    item.checked = false;
                }
            })
            this.send()
        },
        backFill() {
            this.checkList = [];
            this.nlist.forEach(item => {
                this.$set(item,'checked',false)
                if(this.checkedID.indexOf(item.id) > -1) {                    
                    this.$set(item,'checked',true)
                    this.checkList.push(item)
                }
            })
            this.send()
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
        },
        send() {
            var id = [];
            this.checkList.forEach(item => {
                id.push(item[this.keyName])
            })
            var string = id.length == 0 ? "" : id.join(",")
            this.$emit('update:string', string)
            this.$emit('change', this.checkList)
        }
    }
}
</script>

<style lang="less">
.m-select-wrap{
    width: 254px;
    height: 40px;
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
            .select-dropdown-list{
                padding: 6px 0;
                .select-search{
                    padding: 0 30px 0 10px;
                    width: 100%;
                    margin-bottom: 10px;
                }
                .select-ok{
                    width: 100%;
                    padding: 0 17px 0 0;
                    margin-bottom: -6px;
                    margin-top: 10px;
                    .el-button{
                        width: 100%;
                        color: #fff;
                        background-color: #32A7FF;
                    }
                }
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
    .filter-content{
        background: #fafafa;
        padding: 10px 10px 0 10px;
        .item{
            margin-bottom: 10px;
            background: #fff;
            padding: 0 10px;
            height: 40px;
            line-height: 40px;
            float: left;
            background: #fff;
            .icon-close{
                margin-left: 20px;
                cursor: pointer;
                float: right;
                margin-top: 9px;
                width: 22px;
                height: 22px;
                background: url('../img/images/icon-close.png') no-repeat center;
            }
        }
    }
}
div[size = 'bigmore']{
    width: 464px;
}
div[size = 'big']{
    width: 254px;
}
div[size = 'small']{
    width: 80px;
}
div[size = 'mid']{
    width: 150px;
}
div[disabled = 'disabled']{
    cursor: not-allowed;
    background-color: #eee;
}
div[size = 'middle']{
    width: 150px;
    height: 30px;
    background-color: #fff;
    border: 1px solid rgba(187, 187, 187, 1);
    border-radius: 4px;
    display: inline-block;
}
</style>
