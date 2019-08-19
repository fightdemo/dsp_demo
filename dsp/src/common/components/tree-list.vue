<template>
    <div class="custom-box cl">
        <div v-if="title" style="margin-bottom:20px;margin-top:20px;">
            <span style="font-weight:blod">媒体：</span>
            <m-Radio :value.sync="radio" :list="radioList" :defaultVal="radio" :size="'small'" @change="directChange"></m-Radio>
        </div>
        <div class="left fl">
            <div class="cus-title">
            可选项目
            </div>
            <div class="select-box">
                <ul class="select-list cl" v-for="(list, index) in lists" :style="{width: 100/lists.length+'%'}" :key="index">                    
                    <li v-for="(item, i) in list[subName]" 
                        :class="{active: item == current[index],
                                last: item[subName] && item[subName].length == 0 }" 
                        :data-id="item.id" 
                        @click="selectList(item,index)" 
                        :key="i">
                        <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checked" @change="handleCheck(item)"></el-checkbox>
                        <template v-if="item[subName] && item[subName].length > 0">
                            <span>
                                {{item[nameKey]}}
                            </span>
                            <!-- <i class="el-icon-arrow-right"></i> -->
                        </template>
                        <span :data-id="item.id" class="select-sub" v-if="!item[subName] || item[subName].length == 0" @click="item.checked = !item.checked;handleCheck(item)">
                            {{item[nameKey]}}
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="middle fl">
            <el-button class="btn-blue" @click="handleAll">全部添加</el-button>
        </div>
        <div class="right fl">
            <ul class="right-list cl">
                <li class="selected-item" v-for="(item,index) in selected" :key="index">
                {{item.name}}
                <span @click="handleClear(item,index)"></span>
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
            isIndeterminate: false,
            lists: null,
            current: [],
            selected: [],
            radio: this.defaultRadio,
            direct: this.defaultRadio,
        }
    },
    props: {
        title: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array|Object,
            default: () => []
        },
        radioList: {
            type: Array,
            default: () => []
        },
        valueKey: {
            type: String,
            default: 'locationID'
        },
        nameKey: {
            type: String,
            default: 'name'
        },
        value: {
            type: String,
            default: ""
        },
        subName: {
            type: String,
            default: ""
        },
        idName: {
            type: String,
            default: ""
        },
        defaultRadio:{
            type: String,
            default: ""
        },
    },
    mounted() {
        var obj = {
            checked: false
            // subLocation: JSON.parse(JSON.stringify(this.list))
        };
        obj[this.subName] = JSON.parse(JSON.stringify(this.list))
        this.initList(obj);
        this.lists = [obj];
        // 获取勾选状态
        this.selected = this.getSelected(this.lists[0]);
    },
    watch: {
        list(newVal) {
            var obj = {
                checked: false
                // subLocation: JSON.parse(JSON.stringify(newVal))
            };
            obj[this.subName] = JSON.parse(JSON.stringify(newVal))
            this.initList(obj);            
            this.lists = [obj];
            // 获取勾选状态
            this.selected = this.getSelected(this.lists[0]);
        }
    },
    methods: {
        directChange(val) {
            this.direct = val
            this.clearAll();           
        },
        selectList(item, index) {
            // 设置当前选中项
            this.$set(this.current, index, item);
            // 设置选中项的子集列表
            if(item[this.subName] === null) return
            if(item[this.subName].length > 0 ) {
                this.$set(this.lists, index + 1, item);
            }
            // 清空之后所有内容
            this.lists.splice(index + 2);
        },
        handleCheck(item) {
            item.isIndeterminate = false;
            // 同步子集选中状态
            this.setSubChecked(item);

            // 同步父级选中状态
            if (item.checked) {
                // 如果同级全部勾选，则父级勾选
                this.confirmParent(item);
            } else {
                // 取消所有父级选中状态
                this.cancelParent(item);
                this.setParentChecked(item)
            }
            this.halfSelected(item)
            // 获取勾选状态
            this.selected = this.getSelected(this.lists[0]);

            this.change()
            // this.$emit(
            //     "update:value",
            //     this.selected.map(s => s[this.nameKey]).join("^")
            // );
        },
        handleClear(item) {
            item.checked = false;
            this.handleCheck(item);
            // this.selected.splice(index,1)
        },
        handleAll() {
            this.lists.forEach(item => {
                item.checked = true;
                this.handleCheck(item);
            });
        },
        clearAll() {
            this.selected.forEach(item => {
                item.checked = false;
                this.handleCheck(item);
            });
            this.selected = [];
        },
        initList(parent) {           
            var valueArr = this.value.split(",");          
            if(parent[this.subName] === null) return;
            parent[this.subName].forEach(item => {
                // 是否被选中
                item.checked = valueArr.indexOf(item[this.valueKey]) != -1;
                item.isIndeterminate = false;
                // 保存父级指针
                item.parent = parent;
                 
                if (item[this.subName] instanceof Array) this.initList(item);                
                if(item.checked) {                    
                    this.setSubChecked(item);
                    this.cancelParent(item)
                    this.halfSelected(item)
                }
            });
        },

        setSubChecked(item) {
            var checked = item.checked,
                arr = item[this.subName];
            if (!arr || !arr.length) return;
            arr.forEach(item => {
                item.checked = checked;
                // this.confirmParent(item)
                item.isIndeterminate = false;
                this.setSubChecked(item);
            });
            
        },
        confirmParent(item) {
            var parent = item.parent,
                checked = true,
                arr;
            if (!parent) return;

            arr = parent[this.subName];
            for (var i = 0; i < arr.length; i++) {
                if (!arr[i].checked) {
                    checked = false;
                    break;
                }
            }
            if (checked) {
                parent.checked = checked;
                // parent.isIndeterminate = false;
                this.confirmParent(parent);
            }else{
                // parent.isIndeterminate = true;
            }
        },
        //联动父级，子级，判断是否半选状态
        halfSelected(item) {
            var parent = item.parent,
                checked = false, // 当前级别是否有选中的节点
                allChecked = true,// 当前级别是否全选
                arr;
            if(!parent) return;
            arr = parent[this.subName];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].checked) {
                    checked = true;
                    break;
                }               
            }
            for (var i = 0; i < arr.length; i++) {
                if (!arr[i].checked) {
                    allChecked = false;
                    break;
                }               
            }
            // 当前级别有选中的节点
            if(checked) { 
                // 且当前级别是全选，则取消半选状态，若不是全选则加上半选状态
                parent.isIndeterminate = !allChecked;              
            }else {
                // 且当前级别是否有半选状态，有则父级加上半选状态，否则取消父级半选状态
                parent.isIndeterminate = item.isIndeterminate;
            }
            // console.log('当前级别是否有选中的节点'+checked,'当前级别是否全选'+allChecked, '当前节点选中状态'+item.checked,'父级isIndeterminate'+parent.isIndeterminate,parent)
            this.halfSelected(parent)
        },
        cancelParent(item) {           
            var parent = item.parent;
            if (!parent) return;
            parent.checked = false;           
            this.cancelParent(parent);
            this.confirmParent(item)
        },
        setParentChecked(item) {
            var parent = item.parent;
            for(var i = 0; i < parent[this.subName].length; i++) {
                if(parent[this.subName][i].checked) {
                    i = parent[this.subName].length;
                    // item.parent.isIndeterminate = true;
                    break;
                }else {
                    // item.parent.isIndeterminate = false;
                }
            }
        },
        getSelected(parent) {
            // var parent = this.lists[0],
            var selected = [];
            if(parent[this.subName] === null) return;
            parent[this.subName].forEach(item => {
                if (item.checked) {
                    selected.push(item);
                } else if (item[this.subName] instanceof Array) {
                    selected = selected.concat(this.getSelected(item));
                }
            });
            return selected;
        },
        // 根据id选中内容（上级组件使用）
        check(id) {
            this.foreach(this.lists,item => item.id == id)
        },
        // 遍历树，cb返回true即停止遍历
        foreach(arr,cb) {
            for(var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if(cb(item)) {
                    item.checked = !item.checked;
                    this.handleCheck(item);
                    return
                };
                if(item[this.subName] && item[this.subName] instanceof Array) this.foreach(item[this.subName],cb)
            }
        },
        // change() {
        //     var ID = [];
        //     console.log(this.selected)
        //     this.selected.forEach(item => {
        //         ID.push(item[this.idName])
        //     })
        //     var string = ID.join(",")
        //     this.$emit('update:string', string)
        //     this.$emit('change', {'checkList': string, 'direct': this.direct})
        // },
         change() {
            var ID = [];
            this.selected.forEach(item => {
                ID.push(item[this.idName])
                this.getlocationID(item,ID)
            })
            var string = ID.join(",")
            this.$emit('update:string', string)
            this.$emit('change', {'checkList': string, 'direct': this.direct})
        },
        getlocationID(parent,ID) {
            var parent = parent[this.subName];
            if (!parent) return;
            parent.forEach(item => {
                ID.push(item[this.idName])
                this.getlocationID(item,ID)
            })
        }
    }
}
</script>

<style lang="less">
.custom-box{
    .left{
        min-width: 700px;
        height: 430px;
        border: 1px solid #E1E5EC;
        border-radius: 2px;
        overflow: hidden;
        color: #0e1e45;
        .cus-title{
            height: 38px;
            line-height: 38px;
            text-indent: 10px;
            background: #f5f9fc;
            color: #0e1e45;
            width: 100%;
            border-bottom: 1px solid #E1E5EC;
            position: relative;
        }
        .select-box{
            width: 100%;
            height: 392px;
            overflow: auto;
            position: relative;
            .select-list{
                float: left;
                li{
                    height: 38px;
                    line-height: 38px;
                    border-bottom: 1px solid #E1E5EC;
                    padding-left: 20px;
                    cursor: pointer;
                }
                .active{
                    background-color: #fff;
                    border-left: 2px solid #009DD0;
                }
                .last{
                    border-left: 1px solid #E1E5EC;
                }
            }
        }
    }
    .middle{
        width: 120px;
        height: 430px;
        position: relative;
        .btn-blue{
            position: absolute;
            left: 10px;
            top: 50%;
            margin-top: -17px;
            background-color: #32A7FF;
            color: #fff;
        }
    }
    .right{
        width: 400px;
        height: 430px;
        border: 1px solid #E1E5EC;
        padding-top: 20px;
        overflow-y: auto;
        .right-list{
            .selected-item{
                padding: 0px 20px;
                padding-left: 12px;
                float: left;
                position: relative;
                font-size: 14px;
                color: #499dd2;
                background: #d9ecf5;
                margin: 0 0px 10px 10px;
                line-height: 30px;
                span{
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    right: 5px;
                    top: 50%;
                    margin-top: -5px;
                    cursor: pointer;
                    background: url('../img/images/icon_remove.png') no-repeat;
                }
            }
        }
    }
    .fl{
        float: left;
    }
    @media screen and (max-width: 1720px) {
        .left{
            min-width: 390px;
        }
        .middle{
            width: 90px;
            .btn-blue{
                width: 100%;
                padding: 0;
                text-align: center;
                line-height: 40px;
            }
        }
        .right {
            width: 200px;
            margin-left: 20px;
        }
    }
}
</style>
