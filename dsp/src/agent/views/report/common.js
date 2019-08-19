// 报表公共内容
import {
    floatScroll
} from "@/common/js/utils"; 

export default {
    computed: {
      silderFlag() {
        return this.$store.state.common.silderFlag
      }
    },
    created() {

    },
    watch: {
        silderFlag() {
            this.init()
        }
    },
    methods: {  
        //表格
        init() {
            $('.table-box').css('marginLeft', '0px');
            $(".float-thead").css({left:'0px'});
            $('.h-bar').css('left', '0px');
            this.floatThead($("#tableInfo thead"),$("#float-thead"),$("#float-thead2"));
            // this.floatBody($("#tableInfo thead"),$("#float-body"))
            floatScroll($("#tableWrap"),function(left){
                $(".float-thead").css({left:left});
                
            })
            $("html,body").scrollTop(0)
        },
        floatThead($thead,$float,$float2) {
            if(!$thead) return;
            var $floatTh = $float.find("th");
            // var $floatTh2 = $float2.find("th");
            var top = $thead.offset().top - 70;
            $float.css($.extend({},{width:$thead.width(),height:$thead.height()},{position:'absolute','z-index':"1",margin:"0",top:0}))
            // 设置宽度
            $thead.find("tr > th").each(function(i,v){
                if($floatTh[i]){
                    $floatTh[i].style.width = v.offsetWidth+"px";
                }
                if($floatTh2[i]){
                    $floatTh2[i].style.width = v.offsetWidth+"px";
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
                    $('#float-thead2').css({top:oldTop - top}) 
                } else {
                    $float.css({top:0})
                    $('#float-thead2').css({top:0}) 
                }
            }
            // 移动滚动条 触发onscroll事件
            document.documentElement.scrollTop++;
            document.body.scrollTop++;
        },
        floatBody($body,$float) {
            if(!$body) return;
            var $floatTh = $float.find("th");
            var $floatTr = $float.find("tbody tr");
            $body.find("tr > th").each(function(i,v){
                if($floatTh[i]){
                    $floatTh[i].style.width = v.offsetWidth+"px";
                }
            })            
            $('#tableInfo tbody').find("tr").each(function(i,v){
                if($floatTr[i]){
                    $floatTr[i].style.height = v.offsetHeight+"px";
                }
            })                
        } 
    },
    data: function () {
      return {
        tableShow: false,
        sort: ['cTime, 1']
      }
    }
  }
  