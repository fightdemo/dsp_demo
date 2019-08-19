<template>
    <span class="caret-box" @click="changeSort">
        <i class="el-icon-caret-top" :ref="'caretTop'+sortType"></i>
        <i class="el-icon-caret-bottom" :ref="'caretBottom'+sortType"></i>
    </span>
</template>
<script>
export default {
    data() {
        return {
            forwardSort: true,  //正序排列
        }
    },
    props:{
        sortType: {
            type: String,
            default: ''
        },
        curType: {
            type: String,
            default: ''
        }
    },
    watch: {
        curType(val) {
            if(val != this.sortType) {
                this.$refs['caretTop'+this.sortType].style.color = "#ccc";
                this.$refs['caretBottom'+this.sortType].style.color = "#ccc";
            }
        }
    },
    methods: {
        changeSort(){
            this.toggleLight()
            this.$emit( 'changeSort', this.forwardSort)
        },
        toggleLight(){
            this.forwardSort = !this.forwardSort;
            if(this.forwardSort){               
                this.$refs['caretTop'+this.sortType].style.color = "#ccc";
                this.$refs['caretBottom'+this.sortType].style.color = "#000";
            }else{
                this.$refs['caretTop'+this.sortType].style.color = "#000";
                this.$refs['caretBottom'+this.sortType].style.color = "#ccc";
            }
            
        }
    },
    mounted(){
        if(this.$refs['caretTop'+this.curType]) {
            if(this.forwardSort){               
                this.$refs['caretTop'+this.curType].style.color = "#ccc";
                this.$refs['caretBottom'+this.curType].style.color = "#000";
            }else{
                this.$refs['caretTop'+this.curType].style.color = "#000";
                this.$refs['caretBottom'+this.curType].style.color = "#ccc";
            }
        }
        
        
    }
}
</script>
<style lang="less">
.caret-box{
    display: inline-flex;
    flex-direction: column;
    vertical-align: 4px;
    i {
        color: #ccc;
    }
    // .top{
    //     color: #000;
    // }
    // .bottom {
    //     color: #000;
    // }
    i:nth-child(2){
        margin-top: -5px;
    }
}
.noActive{
    color: #ccc
}
</style>
