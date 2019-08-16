
<template>
    <ul class="target-list content" :class="{samll:list.length <= 6}">
        <li v-for="item in list" :key="item.name" :class="{empty:!item.name}">
            <div class="target-top cl">
                <div class="icon-box">
                    <p></p>
                    <p></p>
                    <p></p>
                </div>
                <div class="font-box">
                    <p>{{item.name}}</p>
                    <p v-if="!item.isRate">{{data[item.t]|number(item.single?0:'2')}}</p>
                    <p v-if="item.isRate">{{data[item.t] * 100|number(2)}}%</p>
                </div>
            </div>
            <div class="target-bottom cl">
                <div v-if="item.yT" class="target-y">
                    <p>昨日{{hideName?'':item.name}}</p>
                    <p v-if="!item.isRate">{{data[item.yT]|number(item.single?0:'2')}}</p>
                    <p v-if="item.isRate">{{data[item.yT] * 100|number(2)}}%</p>
                </div>
                <div v-if="item.ybT" class="target-yb">
                    <p>前日{{hideName?'':item.name}}</p>
                    <p v-if="!item.isRate">{{data[item.ybT]|number(item.single?0:'2')}}</p>
                    <p v-if="item.isRate">{{data[item.ybT] * 100|number(2)}}%</p>
                </div>
            </div>
        </li>
    </ul>
</template>
<script>
import {number} from "@/common/js/filter"

export default {
    filters: {
        number
    },
    props: {
        data: Object,
        list: {
            type: Array,
            default() {
                return []
            }
        },
        hideName: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.initList();
    },
    watch: {
        list() {
            this.initList();
        }
    },
    methods: {
        initList() {
            var list = this.list || [];
            // 指标一行为6个  不足6的倍数时  补充空对象
            while(list.length % 6 != 0) {
                list.push({});
            }
        }
    }
}
</script>
<style lang="less">

.target-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 60px;
    padding-top: 50px;
    padding-bottom: 30px;
    li {
        width: 16%;
        margin-bottom: 20px;
        .target-top {
            .icon-box {
                width: 80px;
                height: 40px;
                float: left;
                margin-top: 8px;
                p {
                    float: left;
                    width: 10px;
                    border-radius: 6px;
                    margin-right: 5px;
                    background-color: rgba(63, 81, 181, 1);
                }
                p:nth-child(1) {
                    height: 40px;
                }
                p:nth-child(2) {
                    margin-top: 15px;
                    height: 25px;
                }
                p:nth-child(3) {
                    height: 27px;
                    margin-top: 13px;
                    margin-right: 0;
                }
            }
            .font-box {
                width: 140px;
                float: left;
                font-family: SourceHanSansSC;
                font-weight: 700;
                font-size: 18px;
                color: rgba(63, 81, 181, 1);
                font-style: normal;
                letter-spacing: 0px;
                line-height: 27px;
                text-decoration: none;
            }
        }
        .target-bottom {
            margin-top: 8px;
            font-family: SourceHanSansSC;
            font-weight: 400;
            font-size: 12px;
            color: rgb(16, 16, 16);
            font-style: normal;
            letter-spacing: 0px;
            line-height: 18px;
            text-decoration: none;
            .target-y {
                width: 80px;
            }
            .target-y,
            .target-yb {
                float: left;
            }
        }
    }
    li.empty {
        visibility: hidden;
    }
    li:nth-child(2) {
        .target-top {
            .icon-box p {
                background-color: rgba(36, 198, 35, 1);
            }
            .font-box {
                color: rgba(36, 198, 35, 1);
            }
        }
    }
    li:nth-child(3) {
        .target-top {
            .icon-box p {
                background-color: rgba(242, 162, 43, 1);
            }
            .font-box {
                color: rgba(242, 162, 43, 1);
            }
        }
    }
    li:nth-child(4) {
        .target-top {
            .icon-box p {
                background-color: rgb(41, 159, 247);
            }
            .font-box {
                color: rgb(41, 159, 247);
            }
        }
    }
    li:nth-child(5) {
        .target-top {
            .icon-box p {
                background-color: rgba(255, 94, 131, 1);
            }
            .font-box {
                color: rgba(255, 94, 131, 1);
            }
        }
    }
    li:nth-child(6) {
        .target-top {
            .icon-box p {
                background-color: rgba(238, 215, 60, 1);
            }
            .font-box {
                color: rgba(238, 215, 60, 1);
            }
        }
    }
    li:nth-child(7) {
        .target-top {
            .icon-box p {
                background-color: #f3ad33;
            }
            .font-box {
                color: #f3ad33;
            }
        }
    }
    li:nth-child(8) {
        .target-top {
            .icon-box p {
                background-color: #ff7256;
            }
            .font-box {
                color: #ff7256;
            }
        }
    }
    li:nth-child(9) {
        .target-top {
            .icon-box p {
                background-color: #49b0f2;
            }
            .font-box {
                color: #49b0f2;
            }
        }
    }
    li:nth-child(10) {
        .target-top {
            .icon-box p {
                background-color: #f174b4;
            }
            .font-box {
                color: #f174b4;
            }
        }
    }

}
.target-list.samll {
    li {
        width: auto;
        // .target-top .icon-box,
        // .target-bottom .target-y {
        //     max-width: 80px;
        //     min-width: 70px;
        //     width: auto;
        // }
        
    }
}
</style>
