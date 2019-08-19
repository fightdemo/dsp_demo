<template>
    <el-checkbox :label="label" :class="type" @change="change" v-model="val">
        <slot></slot>
    </el-checkbox>
</template>

<script>
export default {
    data() {
        return {
            val: this.isCheck
        }
    },
    props: {
        type: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        isCheck: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
    },
    watch: {
        isCheck(val) {
            this.val = val;
        }
    },
    methods: {
        change() {
            this.$emit('change', this.val)
            this.$emit('update:isCheck', this.val)
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
