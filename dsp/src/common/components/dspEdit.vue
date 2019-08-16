<template>
    <div class="dsp_edit">
        <div v-show="showEdit">
            <span><slot></slot></span>
            <i v-show="showEditIcon" class="edit_icon el-icon-edit-outline pl8" @click.stop="editInfo"></i>
        </div>
        <div class="edit_input" v-show="!showEdit">
            <input type="text" v-model="inputData">
            <i class="edit_icon el-icon-circle-check confirm pl8" @click.stop="confirm"></i>
            <i class="edit_icon el-icon-circle-close close" @click.stop="closeEdit"></i>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // isShow: this.show,
            inputData: this.data,
            // changeMsg: this.info
        }
    },
    props:{
        data: String|Number|Object,
        showEdit: Boolean,
        showEditIcon: String|Boolean,
    },
    methods:{
        editInfo(){
            this.$emit('update:showEdit',false)
        },
        confirm(){
            this.$emit('change',this.inputData);
            // this.isShow = true;
        },
        closeEdit(){//关闭按钮，如果点击关闭则保留原始的数据
            this.$emit('update:showEdit',true)
        }
    }
    
}
</script>
<style lang="less" scoped>
.dsp_edit{
    // white-space: nowrap;
    .pl8{ padding-left: 8px;}
    .edit_icon{
        display: inline;
        font-size: 16px;
        cursor: pointer;
        color: #32A7FF;
    }
    .edit_icon.confirm{color: #32A7FF;}
    .edit_icon.close{color: #FF868A;}
    .edit_input{
        input{
          border: none;
          border-radius: 4px;
          border: 1px solid rgba(168,213,238,1);
          font-size: 12px;
          font-family: 'Roboto';
          color: #444;
          padding: 4px 8px;
        }
    }
}
</style>


