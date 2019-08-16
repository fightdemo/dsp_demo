<template>
    <div class="switch-m">
        <el-switch
            v-model="val"
            active-color="#aabbfd"
            inactive-color="#a7a5a6"
            @change="change"
            style="width:37px;height: 16px;"      
        >
            <slot></slot>
        </el-switch>
    </div>  
</template>

<script>
export default {
    data() {
        return {
            val: this.isCheck,
        }
    },
    props: {
        isCheck:  {
            type: Boolean,
            default: false
        },
        state: {
            type: String|Boolean,
            default: ''
        }
    },
    mounted() {
    },
    watch: {
        isCheck(val) {
            this.val = val
        },
        state(val) {
            if(typeof(val) == 'boolean'){
                this.val = val
            }
        }
    },
    methods: {      
        change(val) {
            this.$emit('change', this.val)
        }
    }
}
</script>

<style lang="less">
.switch-m{
    display: inline-block;
    .el-switch{
        .el-switch__core{
            height: 16px;
        }
        .el-switch__core::after{
            width: 20px;
            height: 20px;
            background-color: #efefef;
            top: -3px;
            margin-left: -2px;
        }
    }
    .is-checked{
        .el-switch__core::after{
            background-color: #5677fc;
            margin-left: -19px;
        }
    }
}
</style>
