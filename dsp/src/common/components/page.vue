<template>
    <div class="pagination-wrap">
        <div class="pagination cl">
            <span class="l">
                <button class="btn btn-quickprev-disabled" v-if="nPage.currentPage == 1"></button>                
                <button class="btn btn-quickprev"  @click="quickprev" v-else></button>                
                <button class="btn btn-prev-disabled" v-if="nPage.currentPage == 1"></button>
                <button class="btn btn-prev" v-else @click="prev"></button>
            </span>

            <ul class="pager cl">
                <li :class="{ 'active': nPage.currentPage == 1 }"
                    v-if="totalPages > 0"
                    @click="changeCurrentPage(1)"
                    class="number">1
                </li>
                <li class="number" v-if="showPrevMore">...</li>
                <li v-for="pager in pagers"
                    :key="pager"
                    :class="{ 'active': nPage.currentPage == pager }"
                    @click="changeCurrentPage(pager)"
                    class="number">{{ pager }}
                </li>
                <li class="number" v-if="showNextMore">...</li>
                <li :class="{ 'active': nPage.currentPage == totalPages }"
                    class="number"
                    @click="changeCurrentPage(totalPages)"
                    v-if="totalPages > 1">{{ totalPages }}
                </li>
            </ul>

            <span class="r">
                <button class="btn btn-next" @click="next" v-if="nPage.currentPage < totalPages"></button>
                <button class="btn btn-next-disabled" v-if="nPage.currentPage == totalPages"></button>
                <button class="btn btn-quicknext" @click="quicknext" v-if="nPage.currentPage < totalPages"></button>
                <button class="btn btn-quicknext-disabled" v-if="nPage.currentPage == totalPages"></button>
                <select name="" id="" class="pagination_sizes" @change="changeSizes" v-model="sizes">
                    <option :value="item" v-for="item in pageSizes" :key="item">展示{{item}}条数据/每页</option>
                </select>
            </span>
            
        </div>
    </div>
</template>

<script>
/**
 * pageSizes下拉展示条数列表
 * page对象包含：当前页，当前页条数，总条数
 * pagerCount自定义超过Number条显示省略号
 */
export default {
    data() {
        return {
            nPage: this.page,
            sizes: this.pageSizes[0],
            showPrevMore: false,
            showNextMore: false,
        }
    },
    props: {
        pageSizes: {
            type: Array,
            default: () => ["20", "50", "100"]
        },
        page: {
            type: Object,
            default: () => {
                return {
                    currentPage: 1,
                    size: 20,
                    total: 0
                };
            }
        },
        pagerCount: {
            type: Number,
            validator(value) {
                return (value | 0) === value && value > 4 && value < 22 && (value % 2) === 1;
            },
            default: 5
        },
    },
    computed: {
        totalPages() {
            return Math.ceil(this.page.total / this.page.size) || 1;
        },
       
        pagers() {
            const pagerCount = this.pagerCount;
            const halfPagerCount = (pagerCount - 1) / 2;

            const currentPage = Number(this.nPage.currentPage);
            const pageCount = Number(this.totalPages);

            let showPrevMore = false;
            let showNextMore = false;

            if (pageCount > pagerCount) {
                if (currentPage > pagerCount - halfPagerCount) {
                    showPrevMore = true;
                }

                if (currentPage < pageCount - halfPagerCount) {
                    showNextMore = true;
                }
            }

            const array = [];

            if (showPrevMore && !showNextMore) {
                const startPage = pageCount - (pagerCount - 2);
                for (let i = startPage; i < pageCount; i++) {
                    array.push(i);
                }
            } else if (!showPrevMore && showNextMore) {
                for (let i = 2; i < pagerCount; i++) {
                    array.push(i);
                }
            } else if (showPrevMore && showNextMore) {
                const offset = Math.floor(pagerCount / 2) - 1;
                for (let i = currentPage - offset ; i <= currentPage + offset; i++) {
                    array.push(i);
                }
            } else {
                for (let i = 2; i < pageCount; i++) {
                    array.push(i);
                }
            }

            this.showPrevMore = showPrevMore;
            this.showNextMore = showNextMore;

            return array;
        }
  
    },
    mounted() {
        
    },
    methods: {
        prev() {
            if(this.nPage.currentPage > 1) {
                this.nPage.currentPage--;
                this.change()
            }
        },
        next() {
            if(this.nPage.currentPage < this.totalPages) {
                this.nPage.currentPage++;
                this.change()
            }
        },
        quickprev() {
            if(this.nPage.currentPage == 1) return;
            this.nPage.currentPage = 1;
            this.change()
        },
        quicknext() {
            if(this.nPage.currentPage == this.totalPages) return;
            this.nPage.currentPage = this.totalPages;
            this.change()
        },
        changeCurrentPage(currentPage) {
            this.nPage.currentPage = currentPage;
            this.change()
        },
        changeSizes() {
            this.nPage.currentPage = 1;
            this.nPage.size = Number(this.sizes);
            this.change()
        },
        change() {
            this.$emit("update:page", this.nPage);
            this.$emit("change", this.nPage);
        },
    }
}
</script>

<style lang="less">
.pagination-wrap{
    width: 100%;
    padding: 20px;
    text-align: center;
    .pagination{
        .l,.r{
            height: 36px;
            line-height: 36px;
        }
        .l{
            float: left;
        }
        .r{
            float: right;
        }
        .pager{
            margin: 0 auto;
            display: inline-block;
            height: 36px;
            line-height: 36px;
            .number{
                float: left;
                // width: 20px;
                height: 36px;
                margin-left: 14px;
                font-size: 18px;
                cursor: pointer;
                &:hover{
                    color: #6da7ff;
                }
            }
            .active{
                color: #6da7ff;
                font-weight: bold;
            }
        }
        .btn{
            width: 36px;
            height: 36px;
            border: none;
            padding: 0;
            outline: 0;
            vertical-align: middle;
            margin-left: 14px;
            cursor: pointer;            
        }
        .btn-quickprev{
            background: url('../../common/img/images/icon_05.png') no-repeat;
        }
        .btn-prev{
            background: url('../../common/img/images/icon_06.png') no-repeat;
        }
        .btn-next{
            background: url('../../common/img/images/icon_07.png') no-repeat;
        }
        .btn-quicknext{
            background: url('../../common/img/images/icon_08.png') no-repeat;
        }
        .btn-quickprev-disabled{
            background: url('../../common/img/images/icon_01.png') no-repeat;
            cursor: default;
        }
        .btn-prev-disabled{
            background: url('../../common/img/images/icon_02.png') no-repeat;
            cursor: default;
        }
        .btn-next-disabled{
            background: url('../../common/img/images/icon_03.png') no-repeat;
            cursor: default;
        }
        .btn-quicknext-disabled{
            background: url('../../common/img/images/icon_04.png') no-repeat;
            cursor: default;
        }
        .btn{
            background-size: cover;
        }
        .pagination_sizes{
            width: 167px;
            height: 35px;
            border-radius: 4px;
            margin-left: 14px;
            color: #8691CA;
            background: #e4f5ff;
            border: none;
            padding-left: 10px;
        }
    }
}
</style>
