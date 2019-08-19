<template>
    <div class="dsp_edit">
        <div v-show="showEdit">
            <span><slot></slot></span>
            <i v-show="showEditIcon" class="edit_icon el-icon-edit-outline pl8" @click.stop="editInfo"></i>
        </div>
        <div class="edit_input" v-show="!showEdit">
            <mSelect id="dsp_edit" style="width: 135px;" :title.sync="selectTitle" :list="selectList" :idVal.sync="selectId" @change="editSelect" size="middle"></mSelect>
            <i class="edit_icon el-icon-circle-check confirm pl8" @click.stop="confirm"></i>
            <i class="edit_icon el-icon-circle-close close" @click.stop="closeEdit"></i>
        </div>
    </div>
</template>
<script>
import mSelect from "@/common/components/select"
export default {
    data(){
        return{
            selectTitle: this.data,
            selectList: [
                { id: "1", value: "正企类广告主" },
                { id: "2", value: "效果类广告主" },
            ],
            selectId: this.data=='正企类广告主'?'1':'2'
        }
    },
    components: {
        mSelect
    },
    props:{
        data: String|Number|Object,
        showEdit: Boolean,
        showEditIcon: String|Boolean,
    },
    watch:{
        showEdit(val){
            if(!val){
                this.selectTitle = this.data
                this.selectId = this.data=='正企类广告主'?'1':'2'
            }
        }
    },
    methods:{
        editSelect(val) {
            this.selectId = val.id
        },
        editInfo(){
            this.$emit('update:showEdit',false)
        },
        confirm(){
            this.$emit('change',this.selectId);
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
        // #dsp_edit{
        //     .m-select-wrap{
        //         .m-select{
        //             .middle{
        //                 font-size: 12px;
        //             }
        //         }   
        //     } 
        // }
    }
}
</style>


