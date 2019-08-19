<template>
    <div class="m-radio-wrap">
        <span class="m-radio-list" v-for="(item,index) in list" :key="index" :class="size">
            <el-radio v-model="val" :label="item[keyName1]" :class="className" :defaultVal="defaultVal" :disabled="isDisabled" @change="change">{{item[keyName2]}}</el-radio>
            <slot v-if="index == 1 || index == 5"></slot>
        </span>    
    </div>        
</template>

<script>
/**传入list [{label:"1", name: "名字"}]
 * keyName1默认为label
 * keyName2默认为name
 * defaultVal默认选中  defaultVal="1"则keyName1为1的这一项默认选中
 *  */ 

export default {
    data() {
        return {
            val: this.defaultVal || ''
        }
    },
    props: {
        list: {
            type: Array,
            default: () => ['1']
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        className: {
            type: String,
            default: 'm-radio'
        },
        keyName1: {
            type: String,
            default: 'label'
        },
        keyName2: {
            type: String,
            default: 'name'
        },
        defaultVal: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: ''
        }
    },
    watch: {
        defaultVal(val) {
            this.val = val;
        }
    },
    mounted() {
        this.$emit('update:value', this.val)
    },
    methods: {
        change(val) {
            this.$emit('change', this.val)
            this.$emit('update:value', this.val)
        }
    }
}
</script>

<style lang="less">
.m-radio-wrap{
    display: inline-block;
    .m-radio-list{
        display: inline-block;
        .el-radio__inner{
            width: 20px;
            height: 20px;
            background: #fff;
        }
        .is-checked{
            .el-radio__inner{
                width: 20px;
                height: 20px;
                background: #fff;
                border-width: 2px;
            }
            .el-radio__inner::after{
                width: 10px;
                height: 10px;
                background-color: #409EFF
            }
        }
    }
    .small{
        margin-right: 16px;
    }
    .small:last-child,.big:last-child{
        margin-right: 0;
    }
    .big{
        margin-right: 50px;
    }
    
}
</style>
