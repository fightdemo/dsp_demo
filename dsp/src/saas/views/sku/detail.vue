<template>
    <div class="resDetail-page page">
        <div class="page-title">合约资源详情</div>
        <skuInfo :sku="sku" :type="$route.params.type" class="content bs main"></skuInfo>
        <div v-show="$route.params.type == 'modify'" class="content bs main">
            <div class="content-title">修改价格</div>
            <el-form ref="form" label-width="150px">
                <el-form-item label="卖出价格">
                    <el-input v-model="skuSellPrice"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="content bs main cl group-btn">
            <span v-show="$route.params.type == 'buy'">填写售出价格（元）<el-input v-model="skuSellPrice" style="width: 300px"></el-input></span>
            <dsp-button
                v-show="$route.params.type == 'modify'"
                class="btn-blue fr"
                type="primary"
                @click="modify"
            >确认</dsp-button>
            <dsp-button
                v-show="$route.params.type == 'buy'"
                class="btn-blue fr"
                type="primary"
                @click="buy"
            >确认购买</dsp-button>
            <dsp-button class="btn-white fr" @click="$router.go(-1)">返回</dsp-button>
        </div>
    </div>
</template>
<script>
import skuInfo from "@/common/components/skuInfo";
export default {
    components: {
        skuInfo
    },
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
                date: [{ startDate: "", endDate: "" }],
                spaceInfo: null
            },
            skuSellPrice: '0.00',
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
                // url: "/dsp/sku/sell",
                url: "/dsp/sku",
                data: data,
                load: true
            }).then(res => {
                // 获得列表
                this.sku = res.data;
                this.skuSellPrice = res.data.sellPrice;
            });
        },

        buy() {
            var sku = this.sku;
            if( Number(sku.sellPrice) > Number(this.skuSellPrice) ){ 
                this.$message.error("价格低于原价，请修改！");
                return
            }
            this.$ajax({
                url: "/dsp/sku/buy",
                load: true,
                data: {
                    data: [
                        {
                            id: sku.id,
                            setSellPrice: this.skuSellPrice
                        }
                    ]
                }
            }).then(res => {
                this.$message.success("操作成功");
                this.$router.go(-1);
            });
        },
        modify() {
            var sku = this.sku;
            if( Number(sku.sellPrice) > Number(this.skuSellPrice) ){ 
                this.$message.error("价格低于原价，请修改！");
                return
            }
            this.$ajax({
                url: "/dsp/sku/modify",
                load: true,
                data: {
                    data: {
                        id: sku.id,
                        sellPrice: this.skuSellPrice,
                        enable: 'Y'
                    }
                }
            }).then(res => {
                this.$message.success("操作成功");
                this.$router.go(-1);
            });
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
