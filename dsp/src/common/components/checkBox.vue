<template>
     <el-checkbox-group v-model="checkList" @change="change">
        <el-checkbox :class="className" :label="item[keyName]" v-for="(item,index) in list" :key="index">{{item[valueName]}}</el-checkbox>
    </el-checkbox-group>
</template>

<script>
export default {
    data() {
        return {
            checkList: this.defaultVal || []
        }
    },
    props: {
        className: String,
        list: {
            type: Array|Object,
            default: () => []
        },
        defaultVal: {
            type: Array|String,
            default: () => []
        },
        keyName: {
            type: String,
            default: 'time'
        },
        valueName: {
            type: String,
            default: 'name'
        }
    },
    watch: {
        checkList() {
            // console.log(this.checkList)
        }
    },
    mounted() {
       
    },
    methods: {
        change() {
            var string = this.checkList.join(',')
            this.$emit('update:value', string)
            this.$emit('change', this.checkList)
        }
    }
}
</script>

<style lang="less">
.square-check{
    margin: 0;
    display: inline-block;
    .el-checkbox__inner{
        width: 14px;
        height: 14px;
    }
    .el-checkbox__inner::after{
        width: 3px;
        height: 7px;
        left: 4px;
        top: 1px;
    }
}
.circle-check{
    margin: 0;
    display: inline-block;
    .el-checkbox__inner{
        width: 22px;
        height: 22px;
        border-radius: 50%;
    }
    .el-checkbox__inner::after{
        width: 5px;
        height: 10px;
        left: 7px;
        top: 3px;
    }
}
</style>
