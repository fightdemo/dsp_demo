import { floatScroll } from "@/common/js/utils";
var mixin = {
    data() {
        return {
            tableShow: false,
        }
    },
    computed: {
        silderFlag() {
            return this.$store.state.common.silderFlag
        }
    },
    watch: {
        silderFlag() {
            // $('.table-box').css('marginLeft', '0px');
            // $(".float-thead").css({left:'0px'});
            // $('.h-bar').css('left', '0px');
            this.init()
        }
    },
    methods: {
        //表格
        init() {
            $('.table-box').css('marginLeft', '0px');
            $(".float-thead").css({left:'0px'});
            $('.h-bar').css('left', '0px');
            this.floatThead($("#tableInfo thead"),$("#float-thead"));
            // this.floatBody($("#tableInfo thead"),$("#float-body"))
            floatScroll($("#tableWrap"),function(left){
                $(".float-thead").css({left:left});
                
            })
            $("html,body").scrollTop(0)
        },
        floatThead($thead,$float) {
            if(!$thead) return;
            var $floatTh = $float.find("th");
            var top = $thead.offset().top - 70;
            $float.css($.extend({},{width:$thead.width(),height:$thead.height()},{position:'absolute','z-index':"1",margin:"0",top:0}))
            // $float.css($.extend({},{width:'100%',height:$thead.height()},{position:'absolute','z-index':"1",margin:"0",top:0}))
            // 设置宽度
            $thead.find("tr > th").each(function(i,v){
                if($floatTh[i]){
                    $floatTh[i].style.width = v.offsetWidth+"px";
                    $floatTh[i].style.height = v.offsetHidth+"px";
                }
            })
            
            $thead.css({visibility: 'hidden'})
            $float.show();

            var oldTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.onscroll = function() {
                top = $thead.offset().top - 70;
                var newTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
                // 判断是否为横向滚动
                if(oldTop == newTop) return;
                oldTop = newTop;
                if(top < oldTop) {
                    $float.css({top:oldTop - top})
                    // $('#float-thead2').css({top:oldTop - top}) 
                } else {
                    $float.css({top:0})
                    // $('#float-thead2').css({top:0}) 
                }
            }
            // 移动滚动条 触发onscroll事件
            document.documentElement.scrollTop++;
            document.body.scrollTop++;
        },
        floatBody($body,$float) {
            if(!$body) return;
            var $floatTh = $float.find("th");
            $body.find("tr > th").each(function(i,v){
                if($floatTh[i]){
                    $floatTh[i].style.width = v.offsetWidth+"px";
                }
            })                
        } 
    }
}

export {mixin}