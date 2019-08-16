<template>
    <div class="chart-box" :class="{off:off}">
        <div v-show="!off">
            <slot></slot>
        </div>
        <span class="chart-box-slider" @click="off = !off"></span>
    </div>
</template>
<script>
export default {
    data() {
        return {
            off: false
        }
    },
    props: {
        defaultOpen: {
            type: Boolean,
            default: false
        },
    },
    mounted(){
        if(this.defaultOpen){
            this.off = true;
        }
    }
}
</script>
<style lang="less">
.chart-box {
    .chart-box-slider {
        width: 51px;
        height: 26px;
        display: block;
        margin: 14px auto 0;
        cursor: pointer;
        background: url("~adv@/assets/img/chart-silder.jpg") no-repeat center;
    }
}
.chart-box.off {
    .chart-box-slider {
        transform: rotate(180deg);
        margin-bottom: 20px;
    }
}
</style>

