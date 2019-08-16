<template>
    <div class="throng-table">
        <div class="head cl">
            <div class="l">                
                <el-checkbox-group v-model="typeList" @change="change">
                    <el-checkbox label="IDFA" :disabled="IDFAdisabled"></el-checkbox>
                    <el-checkbox label="IMEI" :disabled="IMEIdisabled"></el-checkbox>
                    <el-checkbox label="MAC" :disabled="MACdisabled"></el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="r cl">
                <span class="input-wrap">
                    <el-input placeholder="输入名称或ID" v-model="val">
                        <i class="el-icon-search icon" slot="suffix" @click="search"></i>
                    </el-input>
                </span>
                <el-button class="btn-reset" @click="reset">重置</el-button>
            </div>
        </div>
        <div class="throng-content">
            <table class="content-table" style="width:100%">
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>状态</th>
                        <th>名称</th>
                        <th>类型</th>
                        <th>ID数量</th>
                        <th>创建时间</th>
                        <th>备注</th>
                    </tr>
                </thead>
                <tbody  v-if="ntableList.length > 0">
                    <tr v-for="(item,index) in ntableList" :key="index">
                        <td>
                            <el-checkbox :disabled="item.online != '30'" v-model="item.checked" @change="checked(item,index)"></el-checkbox>
                        </td>
                        <td>{{item.id}}</td>
                        <td>{{onlineEnum[item.online]}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.depotType}}</td>
                        <td>{{item.number}}</td>
                        <td>{{item.cTime}}</td>
                        <td>{{item.desc}}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="8" align="center" style="height:260px;">
                            暂时没有人群可供投放，请先进入“投放管理-人群管理”中创建或上线人群
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import mCheckbox from '@/common/components/checkBox'
export default {
    components: {
        mCheckbox: mCheckbox
    },
    data() {
        return {
            ntableList: [],
            checkList: [],
            val: '',
            filterList: [],
            typeList: [],
            IDFAdisabled: false,
            IMEIdisabled: false,
            MACdisabled: false
        }
    },
    props: ['tableList','onlineEnum','defaultCheck'],
    mounted() {
        this.ntableList = this.tableList;
        this.ntableList.forEach(item => {
            this.$set(item, 'checked', false);
        })
        this.select(this.defaultCheck)
        this.isCheckAll()
    },
    watch: {
        tableList( newVal ,oldVal){
            this.ntableList = newVal;
            this.isCheckAll()
        },
        defaultCheck(val) {
            this.select(val)
        }
    },
    methods: {
        //判断快捷选项能否选择
        isCheckAll() {
            var IDFA = [],
                IMEI= [],
                MAC = [],
                list = [{'IDFA':[]}, {'IMEI':[]}, {'MAC':[]}];
            this.ntableList.forEach(item => {
                if(item.depotType == 'IDFA') {
                    IDFA.push(item)
                }
                if(item.depotType == 'IMEI') {
                    IMEI.push(item)
                }
                if(item.depotType == 'MAC') {
                    MAC.push(item)
                }
            })

            this.isDisabled(IDFA,'IDFA')
            this.isDisabled(IMEI,'IMEI')
            this.isDisabled(MAC,'MAC')        
        },
        //全不为30或无数据时 disabled生效
        isDisabled(val,attr) {
            if(val.length) {
                for(var i=0;i<val.length;i++) {
                    if(val[i].online == '30') {
                        this[attr+'disabled'] = false;
                        i = val.length;
                        break;
                    }else {
                        this[attr+'disabled'] = true;
                    }
                }               
            }else {
                this[attr+'disabled'] = true;
            }
        },
        select(val) {           
            var array = val.split(",");
            this.tableList.forEach(item => {
                //改人群id状态为30时才能被选中
                if(array.indexOf(item.id) > -1){
                    if(item.online == '30') {
                        this.$set(item, 'checked', true);
                        this.checkList.push(item)
                    }
                }
            })
            this.send()
        },
        change() {
            this.checkList = []
            var checkList = [];
            this.tableList.forEach(element => {
                if(this.typeList.indexOf(element.depotType) > -1 && element.online == '30') {
                    element.checked = true;
                    checkList.push(element)
                }else {
                    element.checked = false;
                }
            });
            checkList.forEach(item => {
                this.checkList.push(item.id)
            });
            this.send()
        },
        checked(item,index) {
            var checkList = [];
            if(item.checked) {
                this.checkList.push(item.id)
            }else {
                var index = this.checkList.indexOf(item.id)
                this.checkList.splice(index, 1)
            }
            this.ntableList.forEach(item => {
                if(this.checkList.indexOf(item.id) > -1) {
                    checkList.push(item)
                }
            })
            // console.log(checkList)
            this.send()
        },
        search() {
            var filterList = [];
            if(this.val === '') {                
                this.ntableList = this.tableList;
            }else {
                this.tableList.forEach(item => {
                    if(item.name.indexOf(this.val) > -1 || item.id.indexOf(this.val) > -1) {
                        filterList.push(item)
                    }
                })
                this.ntableList = filterList;
            }
        },
        reset() {
            this.val = '';
            this.typeList = [];
            this.ntableList = this.tableList;
            this.ntableList.forEach(item => {
                item.checked = false;
            })
            this.send()
        },
        send() {
            var ID = [],string;
            this.checkList.forEach(item => {
                if(item instanceof Object) {
                    ID.push(item.id)
                }else {
                    ID.push(item)
                }
            })
            string = ID.join(",");
            this.$emit('update:string', string);
            this.$emit('change', this.checkList)        
        }
    }
}
</script>

<style lang="less">
.throng-table{
    width: 100%;
    .head{
        width: 100%;
        height: 50px;
        background: #E4F5FF;
        padding: 0 20px;
        .l{
            float: left;
            margin-top: 14px;
        }
        .r{
            float: right;
            margin-top: 8px;
            .input-wrap{
                display: inline-block;
                width: 240px;
                height: 35px;
                .el-input__inner{
                    height: 35px;
                    line-height: 35px;
                }
                .el-input__suffix{
                    line-height: 35px;
                    right: 10px;
                    cursor: pointer;
                }
            }
            .btn-reset{
                width: 100px;
                background-color: #32A7FF;
                color: #fff;
                height: 35px;
                padding: 0;
                line-height: 35px;
            }
        }
    }
    .throng-content{
        width: 100%;
        padding: 0 20px;
        max-height: 400px;
        overflow: auto;
        .content-table{
            th{
                height: 50px;
                font-weight: normal;
                text-align: left;
            }
            td{
                height: 50px;
            }
        }
    }
}
</style>
