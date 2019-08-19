<template>
    <div class="m-input" :class="size">
        <el-input :placeholder="placeholder" v-model="val" :maxlength="maxlength" :disabled="disabled"></el-input>
    </div>
</template>

<script>
export default {
    data() {
        return {
            val: this.name
        }
    },
    props: ['placeholder', 'size','maxlength', 'disabled','name'],
    mounted() {
        // console.log(this.name)
    },
    watch: {
        disabled(val) {
            if(val) {
                this.val = ''
            }
        },
        name(val) {
            this.val = val
        },
        val() {
            this.$emit('change', this.val)
            this.$emit('update:value', this.val)
        }
    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
.m-input{
    width: 100%;
}
.big{
    width: 464px;
}
.middle{
    width: 254px;
}
.small{
    width: 164px;
}
</style>
