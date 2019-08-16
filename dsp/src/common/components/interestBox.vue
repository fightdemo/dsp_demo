<template>
    <div id="city" class="select-box cl">
        <!-- 已选择 -->
        <div class="spa-ui" v-show="selected.length > 0">
            <div class="m-has-selected with-count buss-circle">
                <span class="tt">已选标签:
                </span>
                <div class="itarea">
                    <div>
                        <div class="it spa-ui">
                            <ul class="m-data-tags cl">
                                <li v-for="(item,index) in selected" :key="index" >{{item.name}}<i class="icon del el-icon-close" @click="handleClear(item,index)"><i class=""></i></i></li>
                                <li class="m-data-tags-del" @click="clearAll"><a href="javascript:;">清空</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 搜索 -->
        <!-- <div class="searchline">
            <i class="icon ico-search-m"><i class="el-icon-search"></i></i>
            <input type="text" placeholder="搜索国家、省、市、区、商圈" value="">
            <span class="more-details" @click="pack_up=!pack_up">
                <span class="c-link" data-type="tree" v-if="pack_up">收起列表</span>
                <span class="c-link" data-type="tree" v-else>从列表中选择</span>
            </span>
        </div> -->
        <div class="left-box">
            <div v-for="(list, index) in lists" class="select-content" :key="index">
                <ul class="select-list">
                    <li v-for="(item,i) in list.child" :key="i" :class="{active: item == current[index]}">
                        <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checked" @change="handleCheck(item)"></el-checkbox>
                        <span v-if="item.child && item.child.length > 0" @click="selectList(item,index)">
                            {{item.name}}
                            <i class="el-icon-minus" v-if="item == current[index]"></i>
                            <i class="el-icon-plus" v-else></i>
                        </span>
                        <span v-if="!item.child || item.child.length == 0">
                            {{item.name}}                            
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>

</template>
<script>
export default {
    data() {
        return {
            isIndeterminate: false,
            lists: null,
            current: [],
            selected: [],
        };
    },
    created() {        
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
    props: {
        list: {
            type: Array,
            default() {
                return () => [];
            },
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
        }
    },
    watch:{
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
        },
        // selected:{
        //     handler(val,oldVal){
        //         // console.log(this.selected)
        //         var data = []
        //         val.forEach((item,index)=>{
        //             data.push(item.name)
        //             this.$emit('update:loactionvalue',data)
        //         })         
        //     },
        // }
    },
    methods: {
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
            this.halfSelected(item);
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
        change() {
            var ID = [];
            this.selected.forEach(item => {
                ID.push(item[this.idName])
            })
            var string = ID.join(",")
            this.$emit('update:string', string)
            this.$emit('change', {'checkList': string})
        }
   
    }
};
</script>

<style lang="less" scoped>
ul {
    padding: 0;
    margin: 0;
    list-style: none;
}

.select-box {
    width: 100%;
    background: #f5f9fc;
    .searchline{
        width: 100%;
        height: 52px;
        position: relative;
        .icon{
            width: 17px;
            height: 17px;
            position: absolute;
            left: 0;
            top: 15px; 
            display: inline-block;
            font-size: 20px;
            line-height: 0;
            i{
                height: 17px;
                width: 17px;
                position: absolute;
                left: 0;
                display: inline-block;
            }
        }
        input{
            height: 52px;
            line-height: 52px;
            box-sizing: border-box;
            border: none;
            background-color: inherit;
            width: 100%;
            font-size: 17px;
            padding-left: 27px;
            padding-right: 170px;
            vertical-align: middle;
            outline: 0;
        }
        .more-details{
            z-index: 99;
            height: 52px;
            line-height: 52px;
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
            span{
                padding: 0 10px;
                font-size: 14px;
            }
            .c-link{
                color:#008fe4!important;
            }
        }
    }
    .left-box {
        width: 100%;
        background-color: #fff;
        border: 1px solid #dee4f5;
        border-radius: 2px;
        display: flex;
        float: left;
        flex-flow: row wrap;
        margin-right: 40px;
        .select-content {
            flex-grow: 1;
            border-right: 1px solid #dee4f5;
        }
        .select-content:last-child {
            border-right: none;
        }
    }
    .selected-content {
        width: 240px;
        background-color: #fff;
        border: 1px solid #dee4f5;
        border-radius: 2px;
        float: left;
    }
    .select-title {
        border-bottom: 1px solid #dee4f5;
        background-color: #fafbfe;
        color: #333;
        font-size: 14px;
        padding: 0 12px;
        height: 34px;
        line-height: 34px;
        vertical-align: middle;
        .selected-clear {
            color: #598fe6;
            float: right;
            cursor: pointer;
            height: 34px;
            line-height: 34px;
            vertical-align: middle;
        }
    }
    .select-list {
        height: 390px;
        // height: auto;
        overflow-y: auto;
        width: 100%;
        li {
            padding: 0 12px;
            height: 36px;
            line-height: 36px;
            cursor: pointer;
            &:hover {
                background: #e4f5ff;
            }
            &.active {
                background: #e4f5ff;
                // color: #598fe6;
            }
            &.disabled {
                pointer-events: none;
                cursor: default;
                opacity: 0.3;
            }
            .el-checkbox {
                margin-bottom: 0px;
                margin-right: 10px;
            }
            .el-icon-plus,.el-icon-minus {
                float: right;
                margin-top: 11px;
                font-weight: bold;
            }
            > span {
                display: inline-block;
                width: calc(~"100% - 29px");
            }
        }
    }
    .selected-list {
        height: 250px;
        overflow-y: auto;
        width: 100%;
        li {
            background: #f8f8f8;
            margin: 8px 12px 0;
            padding: 0 6px;
            height: 28px;
            line-height: 28px;
            font-size: 14px;
            color: #333;
            .el-icon-close {
                float: right;
                margin-top: 7px;
                margin-right: 5px;
                cursor: pointer;
            }
        }
    }
}
.m-has-selected{
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
}
.tt{
    position: absolute;
    top: 12px;
    left: 10px;
    color: #888;
    font-size: 14px;
    line-height: normal;
}
.itarea{
    overflow-x: hidden;
    transition: height .2s ease-in-out;
    overflow: inherit;
    max-height: 202px;
    overflow-y: auto;
}
.it{
    padding-left: 55px;
    width: 100%;
    position: relative;
    box-sizing: border-box;
    em{
        line-height: 1;
        top: 20px;
        font-weight: 700;
        position: absolute;
        font-size: 14px;
        left: 0;
    }
}
.m-data-tags{
    margin-bottom: 10px;
}
.m-data-tags{
    li{
        float: left;
        margin-right: 5px;
        border: 1px solid #dfe1e7;
        border-radius: 20px;
        // background: #f0f3f6;
        background: #fff;
        height: 24px;
        line-height: 24px;
        padding-left: 12px;
        padding-right: 8px;
        margin-top: 10px;
        font-size: 14px;
        transition: padding .2s ease-in-out;
        &:hover{
            background: #e1e7f1;
            i{
                opacity: 1;
            }
        }
        i{
            margin-left: 15px;
            opacity: 0;
            cursor: pointer;
            width: 12px;
            transition: opacity .2s;
            .el-icon-close{
                font-size: 18px;
            }
        }       
    }
    li:last-child{
        padding: 0;
        border: none;
        background: 0;
        margin-left: 5px;
        line-height: 24px;
        a{
            color: #008fe4;
        }
    }
}

</style>
