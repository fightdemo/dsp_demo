<template>
    <div id="app">
        <div class="tool-page">
            <!--过滤栏-->
            <div class="filter-box">
                <div class="form-group">
                    <label>身份名称：</label>
                    <el-input class="form-control" v-model="token"></el-input>
                </div>
                <div class="form-group">
                    <label>日期：</label>
                    <selectData @select="selectData"></selectData>
                </div>
                <dspbutton class="btn btn-info" type="info" @click="getList">查询</dspbutton>
            </div>
            <!--表格-->
            <div class="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>姓名</th>
                            <th>电话</th>
                            <th>邮箱</th>
                            <th>qq</th>
                            <th>公司名</th>
                            <th>备注</th>
                            <th>创建时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list" :key="item.id">
                            <td>{{item.id}}</td>
                            <td>{{item.userName}}</td>
                            <td>{{item.phone}}</td>
                            <td>{{item.email}}</td>
                            <td>{{item.qq}}</td>
                            <td>{{item.company}}</td>
                            <td>{{item.comment}}</td>
                            <td>{{item.cTime}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import {
  getQueryString,getNowFormatDate
} from '@/common/js/utils'
import dspbutton from '@/common/components/dspButton'
import selectData from '@/common/components/select-data'
export default {
    name: "App",
    components: {
        dspbutton,
        selectData
    },
    data() {
        return {
            sTime: getNowFormatDate() + ' 00:00:00',
            eTime: getNowFormatDate() + ' 23:59:59',
            list: [],
            token: ''
        };
    },
    mounted() {
    },
    methods: {
        selectData(val) {
            this.sTime = val.start + " 00:00:00";
            this.eTime = val.end + " 23:59:59";
        },
        getList() {
            var data = {
                sTime : this.sTime,
                eTime : this.eTime
            };
            var token = this.token;
            data.token = token;
            if(!token) return this.$message.error("请输入身份信息！")
            if(!data.sTime || !data.eTime) return this.$message.error("请选择事件！")
            this.$ajax({
                url: 'http://ads.hubcloud.com.cn/p/2018/registe/list',
                load: true,
                data: data
            }).then(res => {               
                this.list = res.data;
            })
        }
    }
};
</script>

<style lang="less">
.tool-page{
    padding: 0 3% 40px;
    margin-top: 20px;
    .form-group {
        display: inline-block;
        width: auto;
        padding-left: 65px;
        min-height: 50px;
        line-height: 30px;
        position: relative;
        .form-control{
            width: 190px;
        }
    }
    .form-group:first-child{
        padding-left: 0;
    }
    .form-group label {
        width: 65px;
        display: inline-block;
        max-width: 100%;
        margin-bottom: 5px;
        font-weight: 700;
    }    
    .filter-box {
        margin-top: 20px;
        margin-bottom: 20px;

    }
    .filter-box .btn-info {
        margin-left: 20px;
    }
    .table-box {
        table {
            width: 100%;
            text-align: center;
            font-size: 14px;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 14px;
            background: #fff;
            border: 1px solid #e0e5eb;
            tbody {
                tr:hover {
                    background: rgb(204, 235, 255);
                }
            }
            th {
                height: 50px;
                text-align: center;
                border-bottom: 1px solid #e0e5eb;
                font-weight: normal;
                position: relative;
                background: #fafafa;
                color: #0e1e45;
                font-size: 14px;
            }
            td {
                padding: 12px 5px;
                border-bottom: 1px solid #e0e5eb;
                /* border-width: 0 0 1px 0; */
                text-align: center;
                position: relative;
                color: #0e1e45;
                font-size: 12px;
                border-collapse: collapse;
                word-break: break-all;
            }
            .table-td {
                padding: 0;
                th,td {
                    width: 33.3%;
                    background-color: #E4EFF5;
                }
            }
        }
    }
}

</style>

