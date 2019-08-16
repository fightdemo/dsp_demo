<template>
    <el-input class="search-box" :placeholder="placeholder" clearable v-model="value" @change="search" :size="size">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
    </el-input>
</template>
<script>
export default {
    data() {
        return {
            value: ""
        };
    },
    props: {
        placeholder: {
            type: String,
            default: "请输入搜索内容"
        },
        size: {
            type: String,
            default: 'medium'
        },
        defaultVal: {
            type: String,
            default: ''
        }
    },
    watch: {
        defaultVal(val) {
            this.value = val;
        }
    },
    methods: {
        search() {
            this.$emit("search", this.value);
        }
    }
};
</script>
<style lang="less">
.search-box {
    width: 220px;
    vertical-align: middle;
    .el-icon-search {
        cursor: pointer;
    }
    .el-input__inner {
        color: #8691CA;
        border: 1px solid #A8D5EE;
        //box-shadow: inset 0 0px 15px rgba(0, 0, 0, 0.06);
    }
    .el-input--medium .el-input__inner {
        height: 38px;
    }
}
@media screen and (max-width: 1720px){
    .search-box{
        width: 190px;
    }
}
</style>