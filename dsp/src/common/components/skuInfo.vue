<template>
    <div class="sku-info">
        <div class="content-title">{{sku.name}}</div>
        <ul class="res-info cl">
            <li>
                <p>资源平台：{{sku.platform}}</p>
                <div v-show="type == 'buy'">
                    <p
                        v-if="sku.skuType == 'pdb'"
                    >保价保量单价：{{sku.sellPrice|number(2)}} 元/{{sku.chargeType=='cpm'?'千次曝光':'点击'}}</p>
                    <p
                        v-if="sku.skuType == 'pd'"
                    >保价不保量单价：{{sku.sellPrice|number(2)}} 元/{{sku.chargeType=='cpm'?'千次曝光':'点击'}}</p>
                </div>
                <div v-show="type == 'modify'">
                    <p
                        v-if="sku.skuType == 'pdb'"
                    >保价保量单价：{{sku.price|number(2)}} 元/{{sku.chargeType=='cpm'?'千次曝光':'点击'}}</p>
                    <p
                        v-if="sku.skuType == 'pd'"
                    >保价不保量单价：{{sku.price|number(2)}} 元/{{sku.chargeType=='cpm'?'千次曝光':'点击'}}</p>
                </div>
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
    </div>
</template>
<script>
export default {
    props: {
        sku: Object,
        type: String,
    }
}
</script>
<style lang="less">
.sku-info {
    
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
}
</style>
