<template>
    <div id="dsp_tab">
        <ul>
            <li v-for="(item,index) in tabList" :key="index">
                <router-link :to="item.to" active-class="active">{{ item.name }}</router-link>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        tabList: Array
    }
};
</script>
<style lang="less" scoped>
#dsp_tab {
    width: 100%;
    height: 83px;
    box-shadow: 0px 2px 12px 2px rgba(220, 220, 220, 1);
    border-radius: 8px;
    ul {
        width: 100%;
        height: 100%;
        overflow: auto;
        li {
            float: left;
            height: 83px;
            line-height: 83px;
            width: 170px;
            position: relative;
            text-align: center;
            a {
                font-family: SourceHanSansSC;
                font-weight: 700;
                font-size: 16px;
                color: #8c8c8c;
                font-style: normal;
                letter-spacing: 0px;
                line-height: 24px;
                text-decoration: none;
            }
        }
        .active {
            color: #32a7ff;
        }
        li::after {
            position: absolute;
            content: "";
            width: 1px;
            height: 22px;
            background-color: #a8d5ee;
            top: 50%;
            margin-top: -11px;
            right: 0;
        }
        li:last-child::after {
            display: none;
        }
    }
}
</style>


