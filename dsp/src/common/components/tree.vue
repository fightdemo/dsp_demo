<template>
    <div class="tree-box cl">
        <div class="l">
            <div class="l-input">
                <el-input
                    class="input"
                    :placeholder="placeholder"
                    @keyup.enter.native="search"
                    v-model="filterText">
                    <i class="el-icon-search icon" slot="suffix" @click="search"></i>
                </el-input>                
            </div>
            <div class="l-tree">
                <el-tree
                    :data="list"
                    ref="tree"
                    show-checkbox
                    :node-key="keyName"
                    :default-checked-keys="defaultCheck"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    :render-content="renderContent"
                >
                </el-tree>
            </div>
        </div>
        <el-button class="m" @click="addChecked">添加</el-button> 
        <div class="r">
            <div class="r-radio">
                <m-Radio :value.sync="radio" :list="radioList" :defaultVal="radio" :size="'small'" @change="change"></m-Radio>
                <el-button class="r-refresh" @click="refresh">重置</el-button> 
            </div>
            <div class="r-list">
                <ul>
                    <li v-for="(item,index) in checkList" :key="index">{{showTitle?item.title:item[valueName]}}
                        <i class="icon-close" @click="remove(item,index)"></i>
                    </li>
                </ul>
            </div>
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
            filterText: '',
            checkList: [],
            radio: this.defaultRadio,
            direct: this.defaultRadio,
        }
    },
    props: {
        placeholder: {
            type: String,
            default: '输入名称或ID'
        },
        keyName: {
            type: String,
            default: 'id'
        },
        valueName: {
            type: String,
            default: 'label'
        },
        list: {
            type: Array,
            default: () => []
        },
        radioList: {
            type: Array,
            default: () => []
        },
        defaultRadio: {
            type: String,
            default: "1"
        },
        defaultCheck: {
            type: Array,
            default: () => []
        },
        defaultProps: {
            default: () => {
                return  {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        showTitle: {
            type: Boolean,
            default: false
        },
        expanded: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        list() {
            if(this.showTitle) {
                this.setTitle(this.list)
            }
            this.$nextTick(this.addChecked)  //监听list回填选择节点并实现添加到界面渲染
        },
        defaultCheck(val) {
            this.$nextTick(this.addChecked)
            if(!val.length) {
                this.refresh()
            }
        }
    },
    mounted() {
        this.$nextTick(this.addChecked)
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data[this.defaultProps.label].indexOf(value) !== -1;
        },

        addChecked() {
            //获取选中节点需要在tree组件渲染完成之后才能获取，但不知如何监听tree组件是否渲染完成，目前解决办法延迟1s获取选中节点，此方法回存在问题，待解决
            // setTimeout(() => {
                var checked = this.$refs.tree.getCheckedNodes(),
                    checkedArray = [];   
                if(this.showTitle) {
                    // 不显示被勾选的子集
                    checked.forEach( (item,index,arr) => {
                        // 过滤被勾选的子集
                        if(arr.indexOf(item.parent) == -1) {
                            checkedArray.push(item)
                        }
                    })
                } else {
                    checked.find((item) => {
                        if(!(item[this.defaultProps.children])) {
                            checkedArray.push(item)
                        }
                    })
                }   
                if(!checkedArray.length) return;
                this.checkList = checkedArray;
                this.send()
            // },1000)            
        },

        change(val) {
            this.checkList = [];
            this.direct = val
            this.empty()            
        },

        refresh() {
            this.checkList = [];
            this.empty()            
        },

        remove(item, index) {
            this.$refs.tree.setChecked(item, false, true)
            this.checkList.splice(index, 1)
            this.send()
        },

        search() {
            this.$refs.tree.filter(this.filterText);
        },

        empty() {
            this.$refs.tree.setCheckedKeys([])
            this.send()
        },
        setTitle(arr,parent) {
            arr.forEach(item=>{
                var subTitle;
                if(parent) {
                    subTitle = item.title = parent.title + '/' + item.name;
                    item.parent = parent;
                } else {
                    subTitle = item.title = item.name;
                }
                if(item.sub && item.sub instanceof Array) this.setTitle(item.sub,item)
            })
        },

        send() {
            var array = [];
            this.checkList.forEach((item) => {
                array.push(item[this.keyName])
            })
            var string = array.join(",")
            this.$emit('update:string', string)
            if(this.showTitle) {
                this.$emit("change",this.$refs.tree.getCheckedNodes())
            } else {
                this.$emit('change', {'checkList':string,'direct':this.direct})
            }
        },
        renderContent(h, { node, data, store }) {
            return (
            <span title={node.label} style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                <span>
                    <span style="width:200px;text-overflow:ellipsis;display:inline-block;">{node.label}</span>
                </span>            
            </span>);
        }
    },
}
</script>

<style lang="less">
.tree-box{
    width: 700px;
    .l{
        float: left;
        width: 300px;
        .l-input{
            padding: 8px;
            background: #E4F5FF;
            height: 50px;
            .input{
                height: 35px;
                .el-input__inner{
                    height: 100%;
                }
                .el-input__suffix{
                    line-height: 35px;
                    right: 11px;
                    cursor: pointer;
                }
            }
        }
        .l-tree{
            height: 420px;
            max-height: 420px;
            background: #fafafa;
            position: relative;
            overflow-y: auto;
            .el-tree{
                background: inherit;               
            }
        }
    }
    .m{
        float: left;
        width: 60px;
        height: 40px;
        background: #32a7ff;
        margin-top: 215px;
        margin-left: 20px;
        margin-right: 20px;
        padding: 0;
        color: #fff;
    }
    .r{
        float: right;
        width: 300px;
        height: 470px;        
        .r-radio{
            padding: 0 11px;
            height: 50px;
            line-height: 50px;
            text-align: left;
            background: #E4F5FF;
            .r-refresh{
                width: 67px;
                height: 35px;
                padding: 0;
                color: #fff;
                background: #32a7ff;
                float: right;
                margin-top: 8px;
            }
        }
        .r-list{
            background: #fafafa;
            height: 420px;
            padding: 10px;
            overflow-y: auto;
            ul{
                li{
                    margin-bottom: 10px;
                    background: #fff;
                    padding: 11px;
                    text-align: left;
                    .icon-close{
                        cursor: pointer;
                        float: right;
                        margin-top: -3px;
                        display: inline-block;
                        width: 22px;
                        height: 22px;
                        background: url('../img/images/icon-close.png') no-repeat center;
                    }
                }
            }
        }
    }
}
.show-ellipsis {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
