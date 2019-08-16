<template>
    <div class="resDetail-page page">
        <div class="page-title">合约资源详情</div>
        <div class="content bs main">
            <div class="content-title">{{sku.name}}</div>
            <ul class="res-info cl">
                <li>
                    <p>资源平台：{{sku.platform}}</p>
                    <p
                        v-if="sku.skuType == 'pdb'"
                    >保价保量单价：{{sku.price|number(2)}} 元/{{sku.chargeType=='cpm'?'千次曝光':'点击'}}</p>
                    <p
                        v-if="sku.skuType == 'pd'"
                    >保价不保量单价：{{sku.price|number(2)}} 元/{{sku.chargeType=='cpm'?'千次曝光':'点击'}}</p>
                </li>
                <li>
                    <p>售卖类型：{{sku.chargeType}}</p>
                    <p>资源天量：{{sku.amount}} {{sku.chargeType == 'cpm'?'千次曝光':'点击'}}/每天</p>
                </li>
                <li>
                    <p>时&nbsp;间&nbsp;段：{{sku.date[0].startDate}}-{{sku.date[0].endDate}}；共计{{sku.totalDay}}天</p>
                </li>
            </ul>

            <ul class="space-list cl">
                <li v-for="(space,index) in sku.spacesDetail" :key="index">
                    <div class="space-title">广告位名称：{{space.spaceName}}</div>
                    <div class="app-name">
                        App名称：
                        <span
                            class="app-cover"
                            :style="{'background-image': `url(${space.appIcon})`}"
                        ></span>
                        {{space.appName}}
                    </div>
                    <div
                        class="space-cover"
                        :style="{'background-image': `url(${space.examplePic})`}"
                    ></div>
                </li>
            </ul>
            <div>

            </div>
        </div>
        <div class="content bs main">
            <div class="content-title">
                修改价格
            </div>
            <el-form ref="form" label-width="150px">
                <el-form-item label="卖出价格">
                    <el-input v-model="sku.sellPrice"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="content bs main cl group-btn">
            <dsp-button class="btn-blue fr" type="primary" @click="buy">确认</dsp-button>
            <dsp-button class="btn-white fr" @click="$router.go(-1)">返回</dsp-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            sku: {
                id: "",
                adxID: "",
                chargeType: "",
                platform: "",
                spacesDetail: [],
                appDetail: null,
                totalDay: "",
                executeState: "",
                name: "",
                adxDealID: "",
                price: "",
                amount: "",
                skuType: "",
                owner: "",
                enable: "",
                parentID: "",
                cUID: "",
                date: [{startDate:'',endDate:''}],
                spaceInfo: null
            }
        };
    },
    created() {
        this.getInfo();
    },
    methods: {
        getInfo() {
            var data = {
                skuID: this.$route.params.id
            };
            this.$ajax({
                url: "/dsp/sku",
                data: data,
                load: true
            }).then(res => {
                // 获得列表
                this.sku = res.data;
                //上一级售价
                this.price = res.data.price;
            });
        },
        buy() {
            var sku = this.sku;
            if(!(Number(sku.sellPrice) >= Number(this.price))) {
                this.$message.error("价格低于原价，请修改！")
                return;
            }            
            this.$ajax({
                url: '/dsp/sku/modify',
                load: true,
                data: {
                    data: {
                        id: sku.id,
                        sellPrice: sku.sellPrice,
                        enable: 'Y'
                    }
                }
            }).then(res => {
                this.$message.success("操作成功");
                this.$router.go(-1)
            })
        }
    }
};
</script>
<style lang="less">
.resDetail-page {
    padding-bottom: 40px;
    .content {
        overflow: hidden !important;
    }
    .content-title {
        font-size: 14px;
        padding: 0 20px;
        font-weight: bold;
        line-height: 56px;
        border-bottom: 1px solid #cccccc;
    }
    .res-info {
        margin: 40px;
        li {
            float: left;
            margin-right: 40px;
            p {
                width: 226px;
                border-right: 1px solid #e6e6e6;
            }
            p:first-child {
                margin-bottom: 20px;
            }
        }
        li:last-child {
            p {
                width: auto;
                border-right: none;
            }
        }
    }
    .space-list {
        li {
            float: left;
            width: 300px;
            border: 1px solid #e6e6e6;
            border-left: none;
            .space-title {
                height: 60px;
                line-height: 60px;
                padding-left: 20px;
                color: #595959;
                background-color: #fafafa;
                border-bottom: 1px solid #e6e6e6;
            }
            .app-name {
                padding-left: 20px;
                color: #595959;
                margin: 20px 0;
                .app-cover {
                    width: 28px;
                    height: 28px;
                    margin: 0 5px;
                    display: inline-block;
                    vertical-align: middle;
                    background-size: 100% 100%;
                    background-position: center;
                }
            }
            .space-cover {
                width: 240px;
                height: 430px;
                margin: 0 auto 25px;
                background-color: #d9d9d9;
                background-size: cover;
                background-position: center;
            }
        }
        li:first-child {
            border-left: 1px solid #e6e6e6;
        }
    }
    .btn-blue button {
        width: 240px;
        height: 40px;
        margin-left: 10px;
    }
    .btn-white button {
        width: 120px;
        height: 40px;
    }
    .group-btn {
        padding: 20px;
    }
    .el-form {
        width: 450px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
}
</style>
