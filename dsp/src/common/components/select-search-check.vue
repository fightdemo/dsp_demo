<template>
    <div class="select-check-search-wrap">
        <div class="select-check-search" :size="size" :disabled="disabled" :type="type">
            <div class="m-select" @click.stop="open">
                <input class="m-select-inner" v-model="val" type="text" readonly="readonly" autocomplete="off" :placeholder="title" :class="size">
                <span class="m-select-suffix">
                    <i class="m-select-icon el-icon-caret-bottom" :class="size"></i>
                </span>
            </div>
            <div class="scrollbar" v-show="visible">
                <div class="select-dropdown" ref="wrap" @scroll="handleScroll" @mouseover="scrollbarShow=true" @mouseleave="scrollbarShow=false">
                    <ul class="select-dropdown-list top">
                        <li class="select-search" @click.stop="visible=true">
                            <el-input v-model="name" placeholder="搜索名称或ID"></el-input>
                        </li>
                    </ul>
                    <ul class="select-dropdown-list">                    
                        <li class="select-dropdown-item" v-if="checkAllTitle1" @click.stop="checkedAll">
                            <el-checkbox v-model="checkAll" @change="checkedAll" ></el-checkbox>
                            {{checkAllTitle1}}
                        </li>
                        <li class="select-dropdown-item" v-if="checkAllTitle2" @click.stop="handleActive">
                            <el-checkbox v-model="isActive" @change="handleActive"></el-checkbox>
                            {{checkAllTitle2}}
                        </li>
                        <li class="select-dropdown-item" v-for="(item, index) in nlist" :key="index" @click.stop="select(item)" :title="item[valueName]">
                            <el-checkbox v-model="item.checked" @change="select(item)"></el-checkbox> 
                            ID:{{item[keyName]}}&nbsp;&nbsp;
                            名称:{{item[valueName]}}   
                        </li>                                      
                    </ul>
                    <div class="scrollbar-bar is-horizontal" style="display:none;">
                        <div class="scrollbar-thumb" style="transform: translateX(0%);"></div>
                    </div>
                    <div class="scrollbar-bar is-vertical" v-show="scrollbarShow">
                        <div class="scrollbar-thumb" :style="transform"></div>
                    </div>
                    <ul class="select-dropdown-list bottom">
                        <li class="select-ok">
                            <el-button @click="affirm">确认</el-button>    
                        </li> 
                    </ul>
                </div>
            </div>        
        </div>
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
            isAll: false,
            checkAll: false,
            isActive: false,
            isIndeterminate: false,  
            scrollbarShow: false,
            transform: '',
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
            this.nlist.forEach(item => {
                this.$set(item, 'checked', false);
            });
        },
        removeList(val) {
            this.remove(val)
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
            default: () => []
        },
        checkAllTitle1: {
            type: String,
            default: ''
        }, 
        checkAllTitle2: {
            type: String,
            default: ''
        },
        removeList: {
            type: Array|Object,
            default: () => {}
        },
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
                this.name = "";
                globalEvent.$emit("rootClick")
            }
            this.visible = !this.visible;

            this.$nextTick(this.update)
        },
        // 选择所有的
        checkedAll() {
            this.isAll = true;
            this.checkAll = !this.checkAll;
            this.isActive = false;           
            this.nlist.forEach(item => {
                this.$set(item, 'checked', this.checkAll);
            })
        },
        // 选择活跃的
        handleActive() {
            this.isActive = !this.isActive;
            this.checkAll = false;
            this.nlist.forEach(item => {
                this.$set(item, 'checked', false);
            });
        },
        select(val) {   
            this.isAll = false;      
            this.isActive = false;   
            val.checked = !val.checked;

            for(var i = 0; i < this.list.length; i ++) {
                if(this.list[i].checked == false) {
                    this.checkAll = false;
                    i = this.list.length;
                    break;
                }else {
                    this.checkAll = true;
                }
            }         
        },

        // 确认
        affirm() {
            this.getCheckList()
            this.send()
        },

        getCheckList() {
            var checkList = [],
                checked = true;
            this.list.forEach(item => {
                if(!item.checked) {
                    checked = false;
                }
            })
            if(!this.isActive) {
                // 如果是所有的
                this.nlist.forEach(item => {
                    if(item.checked) {
                        checkList.push(item)
                    }
                }) 
                this.isAll = checked;
                if(this.isAll && !this.list.length) {
                    checkList = [{id:"", name:""}]
                }
            }else {
                // 如果是活跃的
                checkList = [{id:"",name: this.checkAllTitle2, type: "active"}]
                this.isAll = false;
            }
            this.checkList = checkList;
        },
        search() {
            var checkList = [];
            this.nlist = this.list;
            if(this.name != '' && this.name.length > 0) {
                this.nlist.forEach(item => {
                    if(item[this.valueName].indexOf(this.name) > -1 || item[this.keyName].indexOf(this.name) > -1 ) {
                        checkList.push(item)
                    }
                })
                this.nlist = checkList;
            }else {
                this.nlist = this.list;
            }
        },
        remove(val) {

            if(val[this.keyName] != '') {
                this.nlist.forEach(item => {
                    if(item[this.keyName] == val[this.keyName]) {
                        item.checked = false;
                    }                
                })
            }else {                
                this.nlist.forEach(item => {
                    // item.checked = false;    
                    this.$set(item,'checked',false);         
                })
                
                this.isActive = false;
            }
            this.checkAll = false;
            this.send()
        },
        backFill() {
            this.nlist.forEach(item => {
                // if(this.checkedID.indexOf(item[this.keyName]) > -1) {
                //     item.checked = false;
                // }
                item.checked = false;
           
            })
            this.isActive = false;
            this.checkAll = false;
        },
        send() {
            var id = [];
            this.checkList.forEach(item => {
                if(item.checked && item[this.keyName]){
                    id.push(item[this.keyName])
                }
            })
            this.getCheckList()
            var obj = {
                checkList: this.checkList,
                isAll: this.isAll,
                id: id
            }
            this.$emit('update:array', id)
            this.$emit('change', obj)
            // console.log(obj)
        },
        stop() {
            return false;
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

            this.sizeHeight = (heightPercentage < 100) ? (heightPercentage + '%') : '';

            this.transform = `transform: translateY(0%); height: ${this.sizeHeight}`;
        }
    }
}
</script>

<style lang="less">
.select-check-search-wrap{
    .select-check-search{
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
            width: auto;
            min-width: 100%;
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            background-color: #fff;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            overflow: hidden;
            position: absolute;
            z-index: 8;
            .select-dropdown{
                overflow-y: auto;
                height: 100%;
                max-height: 234px;
                // margin-bottom: -17px;
                margin-top: 52px;
                margin-bottom: 40px;
                margin-right: -17px;            
                .select-dropdown-list{
                    
                    .select-search{
                        padding: 0 10px 0 10px;
                        width: 100%;
                        margin-bottom: 10px;
                    }
                    .select-ok{
                        width: 100%;
                        // padding: 0 17px 0 0;
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
                .top{
                    padding: 6px 0;
                    position: absolute;
                    top: 0;
                    left: 0px;
                    width: 100%;
                    background: #fff;
                    z-index: 2;
                    .select-search{
                        margin-bottom: 0;
                    }
                }
                .bottom{
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                }
            }
            .select-dropdown::-webkit-scrollbar {  
                width: 6px;  
                height: 26px;
            } 
            .select-dropdown::-webkit-scrollbar-thumb {  
                border-radius: 10px;  
                -webkit-box-shadow: inset 0 0 6px rgba(144,147,153,.3);  
                background-color: rgba(144,147,153,.3); 
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
