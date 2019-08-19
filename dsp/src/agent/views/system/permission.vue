<template>
    <div class="permission-page">
        <div class="page-title">权限信息</div>
        <div class="content">
            <div class="form">
                <el-form label-width="80px">
                    <el-form-item label="角色类型">{{$route.params.type=="agency"?'员工':'广告主'}}角色</el-form-item>
                    <el-form-item label="角色名称">
                        <el-input v-model="role.name"></el-input>
                    </el-form-item>
                    <el-form-item label="角色备注">
                        <el-input v-model="role.description"></el-input>
                    </el-form-item>
                    <el-form-item label="权限">
                        <tree
                            :list="list"
                            :showTitle="true"
                            valueName="name"
                            @change="changePer"
                            :expanded="false"
                            :defaultCheck="defaultCheck"
                            :defaultProps="{children:'sub',label:'name'}"
                        ></tree>
                    </el-form-item>
                </el-form>
            </div>
            <div class="btn-group">
                <dsp-button type="primary" @click="addPer">确定</dsp-button>
                <dsp-button @click="$router.go(-1)">取消</dsp-button>
            </div>
        </div>
    </div>
</template>
<script>
import tree from "@/common/components/tree";

export default {
    components: {
        tree
    },
    data() {
        return {
            list: [],
            defaultCheck: [],
            role: {},
            powerArr:[],
            filter: {
                type: this.$route.params.type
            }
        };
    },
    created() {
        this.role.roleType = this.$route.params.type=="agency" ? '0' : '1'
        this.getPerList().then(this.getRole);
    },
    methods: {
        getPerList() {
            return this.$ajax({
                url: "/dsp/pri/action",
                data: this.filter
            }).then(res => {
                // 处理权限树
                var arr = [
                    {
                        id: "0",
                        actionID: "0",
                        pId: "0",
                        name: "查看权限",
                        sub: []
                    },
                    {
                        id: "-1",
                        actionID: "-1",
                        pId: "-1",
                        name: "操作权限",
                        sub: []
                    }
                ];
                arr[0].sub = res.data.view;
                arr[1].sub = res.data.act;
                this.setTitle(arr)
                this.list = arr;
            });
        },
        getRole() {
            var id = this.$route.params.id;
            if (!id) return;
            this.$ajax({
                url: "/dsp/pri/role",
                load: true,
                data: {
                    id: id
                }
            }).then(res => {
                this.role = res.data;

                return this.$ajax({
                    url: "/dsp/pri/role/action",
                    load: true,
                    data: {
                        id: id
                    }
                })
            }).then(res => {
                this.defaultCheck = res.data.act.concat(res.data.view);
                var list = this.list;
                list.forEach(item => {
                    this.check(item)
                })                
            });
        },
        check(parent) {
            var parent = parent.sub,
                sub;
            if(!parent || parent == null) return;
            parent.forEach(item => {
                if(this.defaultCheck.indexOf(item.actionID) > -1) {
                    // console.log(item)
                    this.checkAgain(item)    
                }
            })           
        },
        //如果父节点下的子节点没有全部选中，则不会传入父节点id到tree组件中
        checkAgain(parent) {
            var arr = [],
                parent = parent.sub,
                parentArr = [], //父节点id数组
                cancelArr = []; //要删除的父节点id数组
            if(!parent || parent == null) return;
            parent.forEach(item => {
                arr.push(item.actionID)
                if(this.defaultCheck.indexOf(item.actionID) > -1) {
                    parentArr.push(item.actionID)
                }
            })  
            // console.log(arr,parentArr,cancelArr) 
            if(arr.length != parentArr.length) {
                cancelArr.push(parent[0].parentID)
            }
            //删除子集没全选的父节点id
            cancelArr.forEach(item => {
                var index = this.defaultCheck.indexOf(item);
                if(index > -1) {
                    this.defaultCheck.splice(index, 1);
                }
            })
            // console.log(this.defaultCheck)
        },
        addPer() {
            var powerArr = this.powerArr;
            if (!this.role.name) return this.$message.error("请输入角色名称");
            if (powerArr.length == 0) return this.$message.error("请分配权限");
            // 删除手动添加的两个父节点id
            this.deleteArr(powerArr,"0")
            this.deleteArr(powerArr,"-1")

            this.$confirm(
                "查看权限与操作权限请搭配使用；功能仅设置操作权限没有查看权限时，无法看到该功能无法被操作，请注意！",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                }
            ).then(() => {
                return this.$ajax({
                    url: "/dsp/pri/role/"+(this.$route.params.id ? "modify" : "add"),
                    load: true,
                    data: {
                        data: this.role
                    }
                })
            }).then(res => {
                // 给角色分配权限
                return this.$ajax({
                    url: "/dsp/pri/role/action/add",
                    load: true,
                    data: {
                        data: {
                            id: res.data,
                            actionID: powerArr
                        }
                    }
                })
            }).then(() => {
                this.$message.success("操作成功");
                this.$router.go(-1);
            });
        },
        setTitle(arr,parent) {
            arr.forEach(item=>{
                var subTitle;
                if(parent) {
                    subTitle = item.title = parent.title + '/' + item.name;
                    item.parent = parent;
                } else {
                    subTitle = item.title = item.name;
                }
                if(item.sub && item.sub instanceof Array) this.setTitle(item.sub,item)
            })
        },
        changePer(list) {           
            var arr = [];
            list = list || [];
            list.forEach(item => {
                arr.push(item.actionID);
            })
            //将父节点id也传入数组
            list.forEach(item => {
                if(item.parentID && !(arr.indexOf(item.parentID) > -1)) {
                    arr.push(item.parentID)
                }
            })
            this.powerArr = arr;
        },
        deleteArr(arr,number) {
            var index = arr.indexOf(number);
            if(index != -1) {
                arr.splice(index,1)
            }
        }
    }
};
</script>
<style lang="less">
.permission-page {
    .form {
        padding: 40px;
        .el-input {
            width: 254px;
        }
        .l-input .el-input {
            width: 100%;
        }
        .r-list li {
            line-height: 1;
        }
    }
    .btn-group {
        padding: 30px 40px;
        border-top: 1px solid #DCDCDC;
        button {
            width: 160px;
            padding: 15px;
            margin-right: 20px;
        }
    }
}
</style>
