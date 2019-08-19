<template>
    <div class="tree-box cl">
        <div class="l">
            <div class="l-check filter">
                <!-- <el-checkbox v-model="checkAll" @change="handleCheckAll">全选</el-checkbox> -->
                <el-checkbox-group v-if="!onlyAll" v-model="checkedAdType" @change="handleCheckeOne">
                    <el-checkbox v-for="ad in adTypeList" :label="ad.id" :key="ad.id">{{ad.name}}</el-checkbox>
                </el-checkbox-group>                        
            </div>
            <div class="l-input filter">
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
                    @check="getChecked"
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
            checkedAdType: [],
            checkAll: false,
            treeList: [],
            adType: [],
            oldChecked: [],
        }
    },
    props: {
        onlyAll: {
            type: Boolean,
            default: false
        },
        adTypeList: {
            type: Array,
            default: () => [
                {id: "1", name: '横幅'},
                {id: "2", name: '开屏'},
                {id: "3", name: '插屏'},
                {id: "5", name: '原生'}
            ]
        },
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
            this.$nextTick(this.initList)
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
        /**
         * 处理一下列数据，生成treeList为ID容器,adType为广告位分类之后的容器
         * @private
         * @return {array,object} 处理过后的列数据配置
         */
        initList() {
            var treeList = [], 
                adType = {
                    banner: [],
                    coopen: [],
                    screen: [],
                    native: []
                };
            this.list.forEach(item => {
                if(item.child) {
                    treeList.push(item.id)
                    item.child.forEach(ad => {
                        if(ad.type == '1') {
                            adType.banner.push(ad)
                        }
                        if(ad.type == '2') {
                            adType.coopen.push(ad)
                        }
                        if(ad.type == '3') {
                            adType.screen.push(ad)
                        }
                        if(ad.type == '5') {
                            adType.native.push(ad)
                        }
                    })
                }
            })
            this.treeList = treeList;
            this.adType = adType;
            
        },

        //全选
        handleCheckAll(val) {
            var list = [];
            this.adTypeList.forEach(item => {
                list.push(item.id)
            })
            this.checkedAdType = val ? list : [];

            val ? this.$refs.tree.setCheckedNodes(this.list) 
                : this.$refs.tree.setCheckedNodes([]);
              
        },

        //单选
        handleCheckeOne(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.adTypeList.length;
           
            var list = [];
            list = this.setCheckedArr(value);
            this.$refs.tree.setCheckedNodes(list)
        },
        
        /**
         * 1  banner 2  开屏3  插屏 4  视屏贴片5  原生6  激励视频
         */
        getChecked() {
            var checked = this.$refs.tree.getCheckedNodes(),
                checkList = [],list = [];
                
            //选中的节点
            checked.forEach(item => {
                if(!item.child) {
                    checkList.push(item)
                }
            })
            if(this.onlyAll) {
                this.checkAll = checkList.length === this.treeList.length;
            }
           
            //同一类型全选中时，checkbox为true，否则为false
            list = this.setCheckedAdType(checkList);
            this.checkedAdType = this.setFinalList(list);

        },

        /**
         * @return {object} 选中的列数据
         */
        setCheckedAdType(value) {
            var checked = value,
                adType = {
                    banner: [],
                    coopen: [],
                    screen: [],
                    native: []
                };
            checked.forEach(item => {
                if(item.type == '1') {
                    adType.banner.push(item);              
                }
                if(item.type == '2') {
                    adType.coopen.push(item);
                }
                if(item.type == '3') {
                    adType.screen.push(item);
                }
                if(item.type == '5') {
                    adType.native.push(item);
                }
            })
            return adType;
        },

        /**
         * @return {array} 选中的列数据
         */
        setCheckedArr(value) {
            var checked = value, list = [];   
            checked.forEach(type => {
                if(type == '1') {
                    list = list.concat(this.adType.banner);                    
                }
                if(type == '2') {
                    list = list.concat(this.adType.coopen)
                }
                if(type == '3') {
                    list = list.concat(this.adType.screen)
                }
                if(type == '5') {
                    list = list.concat(this.adType.native)
                }
            })
            
            return list;
        },

        /**
         * @return {array} checkbox选中的值
         */
        setFinalList(list) {
            if(this.adType instanceof Array) return;
            var List = list,
                finalList = [],
                adTypeChange = {
                    "banner": "1",
                    "coopen": "2",
                    "screen": "3",
                    "native": "5"
                };
            for(var k in List) {
                if(List[k].length == this.adType[k].length && List[k].length != 0) {
                    var value = adTypeChange[k]
                    finalList.push(value)
                }
            }
            return finalList;
        },

        filterNode(value, data) {
            if (!value) return true;
            return data[this.defaultProps.label].indexOf(value) !== -1;
        },

        addChecked(arr) {
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
                    
                    //回填checkbox
                    if(checkedArray.length) {
                        var list = this.setCheckedAdType(checkedArray)
                        this.checkedAdType = this.setFinalList(list)
                    }
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
            this.getChecked()
            this.send()
        },

        search() {
            this.$refs.tree.filter(this.filterText);
        },

        empty() {
            this.$refs.tree.setCheckedKeys([])
            this.checkAll = false;
            this.getChecked()
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
                array.push(item.id)
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
        .filter{
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
        .l-input {
            background: #fafafa;
        }
        .l-check {
            padding: 0 8px;
            line-height: 50px;
            .el-checkbox {
                // margin-right: 9px;
                .el-checkbox__label {
                    padding-left: 5px;
                }
            }
            .el-checkbox-group {
                display: flex;
                justify-content: center;
            }
        }
        .l-tree{
            height: 370px;
            max-height: 370px;
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
