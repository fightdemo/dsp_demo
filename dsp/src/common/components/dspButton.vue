<template>
    <div class="dsp_button" @click="click">
        <el-button :type="type" :plain='plain' :round='round' :size='size'>
            <slot></slot>
        </el-button> 
    </div>   
</template>
<script>
export default {
    data(){
        return{
            // msg:this.msg

        }
    },
    props:{
        type: String,
        plain:{
            type: Boolean,
            default: false
        },
        round:{
            type: Boolean,
            default: false
        },
        msg: String,
        size: String,
        iconImg:String
    },
    methods:{
        click(e){
            this.$emit('click',e)
        }

    }
    
}
</script>
<style lang="less" scoped>
.dsp_button{
    display: inline-block;
    vertical-align: middle;
    .el-button {
        padding: 11px 20px;
    }
    .el-button{
        font-size: 14px;
    }
    
    .el-button--default{
         border: 1px solid rgba(168,213,238,1);
        color: rgba(134,145,202,1);

    }
    .el-button--success{
        color: #fff;
        background: #97CE57;
        border-color: #97CE57;
    }
    .el-button--primary{
        color: #fff;
        background: #32A7FF;
        border-color: #32A7FF;
    }
    .el-button--primary.is-plain{
        color: rgba(134, 145, 202, 1);
        background: rgba(228, 245, 255,1);
        border: none;
    }
    .el-button--primary.is-plain:hover{
        background: rgba(rgb(134, 145, 202,1));
        color:#fff;

    }
    .el-button--purple{
        color: #fff;
        background: #D56CEE;
        border-color: #D56CEE;
    }
    .el-button--warning{
        color: rgba(179, 169, 80, 1);
        background: rgba(255, 246, 188,1);
        // border-color: #DFCE76;
    }
    .el-button--warning.is-plain{
        color: #DABA50;
        background: #FFF6BC;
        border: none;
    }
    .el-button--danger{
        color: #fff;
        background: #FD5A60;
        border-color: #FD5A60;
    }
    .el-button--danger.is-plain{
        color: rgb(255, 115, 120);
        background: rgba(rgb(255, 204, 206,1));
        border: none;
    }
     .el-button--edit{
        color: #fff;
        background: #8691CA;
        border-color: #8691CA;
    }
    .el-button--info{
        color: #fff;
        background: #6B9DFF;
        border-color: #6B9DFF;
    }
    .el-button--os{
        width: 212px;
        height: 45px;
    }
    .el-button--mim{
        width: 92px;
        height: 42px;
    }
     .el-button--sm{
          width: 108px;
        height: 28px;
        padding: 0;
       
    }
     .el-button--mini, .el-button--mini.is-round{
         padding: 7px 13px;
     }    
}
@media screen and (max-width: 1720px) {
    // .dsp_button{
    //     display: block;
    //     margin-top: 5px;        
    // }
    // .dsp_button:nth-child(0){
    //     margin: 0;
    // }
    .btn-order{
        width: 250px;
    }
}
</style>


