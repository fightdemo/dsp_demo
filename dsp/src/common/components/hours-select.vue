<template>
    <div class="hours-select">
        <div class="btn-box">
            <el-button class="time-btn weekend">周末</el-button>
            <el-button class="time-btn workday">工作日</el-button>
            <el-button class="time-btn am">上午</el-button>
            <el-button class="time-btn pm">下午</el-button>
        </div>
        <div class="hour-box">
            <table class="hour-table">
                <thead>
                    <tr class="hour hour-section">
                        <th>选择时段</th>
                        <th colspan="4" th-index="1">
                            <label class="checkBox"><input type="checkbox"></label>
                            <span class="timeR">00:00 - 03:59</span>    
                        </th>
                        <th colspan="4" th-index="5">
                            <label class="checkBox"><input type="checkbox"></label>
                            <span class="timeR">04:00 - 07:59</span>    
                        </th>
                        <th colspan="4" th-index="9">
                            <label class="checkBox"><input type="checkbox"></label>
                            <span class="timeR">08:00 - 11:59</span>    
                        </th>
                        <th colspan="4" th-index="13">
                            <label class="checkBox"><input type="checkbox"></label>
                            <span class="timeR">12:00 - 15:59</span>    
                        </th>
                        <th colspan="4" th-index="17">
                            <label class="checkBox"><input type="checkbox"></label>
                            <span class="timeR">16:00 - 19:59</span>    
                        </th>
                        <th colspan="4" th-index="21">
                            <label class="checkBox"><input type="checkbox"></label>
                            <span class="timeR">20:00 - 23:59</span>    
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="hour one-hour">
                        <td>小时选择</td>
                        <td v-for="i in 24" :key="i">
                            <label class="checkBox">
                                <input class="hour-input" type="checkbox">
                            </label>
                        </td>
                    </tr>
                    <tr class="hour main" v-for="(m,n) in week" :key="n">
                        <td class="week" :attr-index="n">
                            <label class="checkBox">
                                <input type="checkbox" class="week-input">
                            </label>
                            {{m.weekName}}
                        </td>
                        <td class="time" v-for="(v,k) in m.time" :key="k" :tr-index="n" :value="v">
                            <label class="checkBox">
                                <input type="checkbox">
                            </label>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>    
</template>

<script>


export default {
    data() {
        return {
            week: [
                {"weekName": "周一","time": ["100","101","102","103","104","105","106","107","108","109","110","111","112","113","114","115","116","117","118","119","120","121","122","123"]},
                {"weekName": "周二","time": ["200","201","202","203","204","205","206","207","208","209","210","211","212","213","214","215","216","217","218","219","220","221","222","223"]},
                {"weekName": "周三","time": ["300","301","302","303","304","305","306","307","308","309","310","311","312","313","314","315","316","317","318","319","320","321","322","323"]},
                {"weekName": "周四","time": ["400","401","402","403","404","405","406","407","408","409","410","411","412","413","414","415","416","417","418","419","420","421","422","423"]},
                {"weekName": "周五","time": ["500","501","502","503","504","505","506","507","508","509","510","511","512","513","514","515","516","517","518","519","520","521","522","523"]},
                {"weekName": "周六","time": ["600","601","602","603","604","605","606","607","608","609","610","611","612","613","614","615","616","617","618","619","620","621","622","623"]},
                {"weekName": "周日","time": ["700","701","702","703","704","705","706","707","708","709","710","711","712","713","714","715","716","717","718","719","720","721","722","723"]}
            ],
            newX: [],
            newY: [],
            arrX: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
            arrY: [0,1,2,3,4,5,6],
            weekendFlag: false,
            workdayFlag: false,
            amFlag: false,
            pmFlag: false
        }
    },
    mounted() {
        var vThis = this;
        $(function() {
            //周末
            $('.weekend').click(function() {
                vThis.weekendFlag = !vThis.weekendFlag;
                vThis.weekendFlag ? $(this).addClass('active') : $(this).removeClass('active')
                $('.main').eq(5).children('.time').children().children().prop("checked", vThis.weekendFlag);
                $('.main').eq(6).children('.time').children().children().prop("checked", vThis.weekendFlag);
                vThis.check()
            });
            //工作日
            $('.workday').click(function() {
                vThis.workdayFlag = !vThis.workdayFlag
                vThis.workdayFlag ? $(this).addClass('active') : $(this).removeClass('active')
                for(var i=0;i<5;i++) {
                    $('.main').eq(i).children('.time').children().children().prop("checked", vThis.workdayFlag);
                }
                vThis.check()
            });   
            //上午 
            $('.am').click(function() {
                vThis.amFlag = !vThis.amFlag
                vThis.amFlag ? $(this).addClass('active') : $(this).removeClass('active')
                for(var i = 1; i < 13; i++) {
                    $('.main').find('td:eq('+i+')').children().children().prop("checked", vThis.amFlag);
                    $('.one-hour td').eq(i).children().children().prop("checked", vThis.amFlag)
                }
                vThis.check()
            });  
            //下午  
            $('.pm').click(function() {
                vThis.pmFlag = !vThis.pmFlag
                vThis.pmFlag ? $(this).addClass('active') : $(this).removeClass('active')
                for(var i = 13; i < 25; i++) {
                    $('.main').find('td:eq('+i+')').children().children().prop("checked", vThis.pmFlag);
                    $('.one-hour td').eq(i).children().children().prop("checked", vThis.pmFlag)
                }
                vThis.check()
            });    
            // 纵向时段
            $('.hour-section th').click(function(e) {
                var e = e || event;
                if(e.target.tagName.toUpperCase() == 'INPUT') {
                    var flag = $(this).children().children().prop("checked");
                    var index = Number($(this).attr('th-index')),
                        maxIndex = index + 4;
                    for(var i = index; i < maxIndex; i++) {
                        $('.main').find('td:eq('+i+')').children().children().prop("checked", flag);
                        $('.one-hour td').eq(i).children().children().prop("checked", flag)
                    }
                    vThis.check()
                }                
            })
            // 纵向小时
            $('.one-hour td').click(function(e) {
                var e = e || event;
                if(e.target.tagName.toUpperCase() == 'INPUT') {
                    var flag = $(this).children().children().prop("checked");            
                    $('.main').find('td:eq('+$(this).index()+')').children().children().prop("checked", flag);
                    vThis.check()
                }
            })
            // 横向周
            $('.week').click(function(e) {
                var e = e || event;
                if(e.target.tagName.toUpperCase() == 'INPUT') {
                    var flag = $(this).children().children().prop("checked");
                    $('.main').eq($(this).attr('attr-index')).children('.time').children().children().prop("checked", flag);
                    vThis.check()
                }
            })
            // 时间点
            $('.time').click(function() {
                vThis.check()
            })  
        })
    },
    props: ["backList"],
    watch: {
        backList(val) {
            this.$nextTick(this.addChecked)
        }
    },
    methods: {
        getChecked() {
            var time = []
            for(var i=0;i<$('.time').length;i++) {
                if($('.time').eq(i).children().children().prop("checked")) {
                    time.push($('.time').eq(i).attr('value'))
                }
            }    
            var string = time.length == 0 ? "" : time.join(",")
            this.$emit('update:value', string)
            this.$emit('change', string); 
        },
        addChecked() {
            // console.log(this.backList)
            for(var i=0;i<$('.time').length;i++) {
                // console.log(this.backList.indexOf($('.main').find('.time').eq(i).attr('value')) > -1)
                if(this.backList.indexOf($('.main').find('.time').eq(i).attr('value')) > -1){
                    // console.log($('.time').eq(i))
                    $('.time').eq(i).children().children().prop("checked",true)
                }
            }
            this.check()
        },
        check() {
            var x = [],
                y = [];
            $('.time input').each(function (item) {
                if($(this).prop("checked") == false) {
                    x.push(item%24+1);
                    y.push(Math.floor(item/24))
                }
            })
            var setX = new Set(x);
            this.newX = Array.from(setX);
            var setY = new Set(y);
            this.newY = Array.from(setY);
            //周末
            for(var m=5;m<7;m++) {   
                for(var n=0;n<24;n++) {
                    if(!$('.main').eq(m).children('.time').children().children().eq(n).prop("checked")) {
                        $('.weekend').removeClass('active')
                        this.weekendFlag = false;
                        m = 7;
                        n = 24;
                    }else {
                        this.weekendFlag = true;
                        $('.weekend').addClass('active')
                    }  
                }                
            }
            //工作日
            for(var m=0;m<5;m++) {
                for(var n=0;n<24;n++) {
                    if(!$('.main').eq(m).children('.time').children().children().eq(n).prop("checked")) {
                        $('.workday').removeClass('active')
                        this.workdayFlag = false;
                        m = 5;
                        n = 24;
                    }else {
                        this.workdayFlag = true;
                        $('.workday').addClass('active')
                    }
                }
            }
            //上午
            for(var m=1;m<13;m++) {
                for(var n=0;n<7;n++) {
                    if(!$('.main').eq(n).children().eq(m).children().children().prop("checked")) {
                        $('.am').removeClass('active')
                        this.amFlag = false;
                        n = 7;
                        m = 13;
                    }else {
                        this.amFlag = true;
                        $('.am').addClass('active')
                    }
                }
            }
            //下午
            for(var m=13;m<25;m++) {
                for(var n=0;n<7;n++) {
                    if(!$('.main').eq(n).children().eq(m).children().children().prop("checked")) {
                        $('.pm').removeClass('active')
                        this.pmFlag = false;
                        n = 7;
                        m = 25;
                    }else {
                        this.pmFlag = true;
                        $('.pm').addClass('active')
                    }
                }
            }
            this.arrX.forEach(element => {
                if(this.newX.indexOf(element) > -1 ) {
                    $('.one-hour td').eq(element).children().children().prop("checked", false)
                }else {
                    $('.one-hour td').eq(element).children().children().prop("checked", true)
                }
            });
            this.arrY.forEach(element => {
                if(this.newY.indexOf(element) > -1 ) {
                    $('.week').eq(element).children().children().prop("checked", false)
                }else {
                    $('.week').eq(element).children().children().prop("checked", true)
                }
            });
            //时段
            for(let i=1;i<5;i++) {
                if(!$('.one-hour td').eq(i).children().children().prop("checked")) {
                    $('.hour-section th').eq(1).children().children().prop("checked", false)
                    i = 5;
                }else {
                    $('.hour-section th').eq(1).children().children().prop("checked", true)
                }
            }
            for(let i=5;i<9;i++) {
                if(!$('.one-hour td').eq(i).children().children().prop("checked")) {
                    $('.hour-section th').eq(2).children().children().prop("checked", false)
                    i = 9;
                }else {
                    $('.hour-section th').eq(2).children().children().prop("checked", true)
                }
            }
            for(let i=9;i<13;i++) {
                if(!$('.one-hour td').eq(i).children().children().prop("checked")) {
                    $('.hour-section th').eq(3).children().children().prop("checked", false)
                    i = 13;
                }else {
                    $('.hour-section th').eq(3).children().children().prop("checked", true)
                }
            }
            for(let i=13;i<17;i++) {
                if(!$('.one-hour td').eq(i).children().children().prop("checked")) {
                    $('.hour-section th').eq(4).children().children().prop("checked", false)
                    i = 17;
                }else {
                    $('.hour-section th').eq(4).children().children().prop("checked", true)
                }
            }
            for(let i=17;i<21;i++) {
                if(!$('.one-hour td').eq(i).children().children().prop("checked")) {
                    $('.hour-section th').eq(5).children().children().prop("checked", false)
                    i = 21;
                }else {
                    $('.hour-section th').eq(5).children().children().prop("checked", true)
                }
            }
            for(let i=21;i<25;i++) {
                if(!$('.one-hour td').eq(i).children().children().prop("checked")) {
                    $('.hour-section th').eq(6).children().children().prop("checked", false)
                    i = 25;
                }else {
                    $('.hour-section th').eq(6).children().children().prop("checked", true)
                }
            }
            this.getChecked()       
        }
    }
}
</script>

<style lang="less">
.hours-select{
    width: 740px;
    background: #fafafa;
    .btn-box{
        height: 50px;
        background: #E4F5FF;
        line-height: 50px;
        .time-btn{
            width: 100px;
            height: 26px;
            border-radius: 20px;
            padding: 5px 32px;
            margin-left: 10px;
            font-size: 12px;
        }
        .active{
            background: #6B9DFF;
            color: #fff;
        }
        .time-btn:first-child{
            margin-left: 20px;
        }
    }
    .hour-box{
        width: 740px;
        padding: 0 20px;        
        text-align: left;
        .hour-table{
            width: 100%;
            height: 407px;
            input[type='checkbox']{
                width: 15px;
                height: 15px;
                background-color: #fff;
                -webkit-appearance:none;
                border: 1px solid #c9c9c9;
                border-radius: 2px;
                outline: none;
            }
            .checkBox{
                vertical-align: -7px;
                position: relative;
            }
            .checkBox input[type=checkbox]:checked{
                background: #6B9DFF;                
            }
            .checkBox input[type=checkbox]::after{
                box-sizing: content-box;
                content: "";
                border: 1px solid #fff;
                border-left: 0;
                border-top: 0;
                height: 7px;
                left: 10px;
                position: absolute;
                top: -3px;
                transform: rotate(45deg) scaleY(0);
                width: 3px;
                transition: transform .15s ease-in .05s;
                transform-origin: center;
                transform: rotate(45deg) scaleY(1);
            }
            .hour-section,.one-hour{
                height: 60px;
                th{
                    font-weight: normal;
                }
                .timeR{
                        font-size: 12px;
                        font-weight: normal;
                    }
                .hour-label-wrap{
                    display: inline-flex;
                    justify-content: space-between;
                }                
            }
            .main{
                .week{
                    margin-left: 6px;
                }
            }
            .hour{
                .el-checkbox-group{
                    .el-checkbox{
                        margin-right: 0;
                    }
                }
            }
        }
        
        
    }
}
</style>
