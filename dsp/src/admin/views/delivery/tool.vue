<template>
    <div id="admin_delivery_tool">
        <div class="box">
            <div class="filter cl">
                <div class="fl">
                    <Select-Search-Check title="全部广告公司（多选）" :checkedID="backList1" :removeList="removeAgency" :list="agencylist" :array.sync="filterID" valueName="name" checkAllTitle1="全部广告公司（多选）" @change="getCompanyChildren($event,'2')"></Select-Search-Check>
                </div>
                <div class="fl">
                    <Select-Search-Check title="全部广告主（多选）" :checkedID="backList2" :removeList="removeAdv" checkAllTitle1="全部广告主（多选）" :list="advList" :array.sync="filterID" valueName="name" checkAllTitle2="全部活跃广告主" @change="getCompanyChildren($event,'3')"></Select-Search-Check>
                </div>
                <div class="fl">
                    <Select-Search-Check title="全部活动（多选）" :checkedID="backList3" :removeList="removeActivity" checkAllTitle1="全部活动（多选）" :list="activityList" :array.sync="filterID" valueName="name" checkAllTitle2="全部活跃活动" @change="getCompanyChildren($event,'4')"></Select-Search-Check>
                </div>
                <div class="fl">
                    <Select-Search-Check title="全部订单（多选）" :checkedID="backList4" :removeList="removeOrder" checkAllTitle1="全部订单（多选）" :list="orderList" :array.sync="filterID" valueName="name" checkAllTitle2="全部活跃订单" @change="getCompanyChildren($event,'5')"></Select-Search-Check>
                </div>
                <div class="fl">
                    <search class="ml20" placeholder="订单" @search="searchInput" :defaultVal="searchVal"></search>
                </div>
                <div class="fr">
                <div>
                    <el-button type="primary" style="width:110px;height:40px;padding:0" @click="search">查询</el-button>
                    <el-button type="default" style="width:54px;height:40px;padding:0" @click="clearAll">重置</el-button>
                </div>
                </div>
            </div>
            
        </div>
        <div class="filter-content">
            <div class="agency" v-if="agencyCheckedList.length">
                <span class="tit">广告公司</span>
                <span class="tit-symbol">:</span>
                <ul class="select-content cl">
                    <li v-for="(v,k) in agencyCheckedList" :key="k">
                        <span class="name" v-if="v.id == ''">{{v.name}}</span>
                        <span class="name" v-else>ID&nbsp;:&nbsp;{{v.id}}&nbsp;&nbsp;名称&nbsp;:&nbsp;{{v.name}}</span>
                        <span class="close-icon">
                            <i class="remove-icon" @click="remove('2',v,k)">&times;</i>
                        </span>
                    </li>
                </ul>
            </div>
            <div class="adv" v-if="advCheckedList.length">
                <span class="tit">广告主</span>
                <span class="tit-symbol">:</span>
                <ul class="select-content cl">
                    <li v-for="(v,k) in advCheckedList" :key="k">
                        <span class="name" v-if="v.id == ''">{{v.name}}</span>
                        <span class="name" v-else>ID&nbsp;:&nbsp;{{v.id}}&nbsp;&nbsp;名称&nbsp;:&nbsp;{{v.name}}</span>
                        <span class="close-icon">
                            <i class="remove-icon" @click="remove('3',v,k)">&times;</i>
                        </span>
                    </li>
                </ul>
            </div>
            <div class="activity" v-if="activityCheckedList.length">
                <span class="tit">活动</span>
                <span class="tit-symbol">:</span>
                <ul class="select-content cl">
                    <li v-for="(v,k) in activityCheckedList" :key="k">
                        <span class="name" v-if="v.id == ''">{{v.name}}</span>
                        <span class="name" v-else>ID&nbsp;:&nbsp;{{v.id}}&nbsp;&nbsp;名称&nbsp;:&nbsp;{{v.name}}</span>
                        <span class="close-icon">
                            <i class="remove-icon" @click="remove('4',v,k)">&times;</i>
                        </span>
                    </li>
                </ul>
            </div>
            <div class="order" v-if="orderCheckedList.length">
                <span class="tit">订单</span>
                <span class="tit-symbol">:</span>
                <ul class="select-content cl">
                    <li v-for="(v,k) in orderCheckedList" :key="k">
                        <span class="name" v-if="v.id == ''">{{v.name}}</span>
                        <span class="name" v-else>ID&nbsp;:&nbsp;{{v.id}}&nbsp;&nbsp;名称&nbsp;:&nbsp;{{v.name}}</span>
                        <span class="close-icon">
                            <i class="remove-icon" @click="remove('5',v,k)">&times;</i>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="table content mt20">
            <div class="table-top cl">
                <div class="table-filter">
                    <label>订单状态：</label>
                    <Select title="正常" :list="ordStateList" @change="selectState"></Select>
                </div>
            </div>     
            <div id="scrollWrap" style="overflow:hidden;">
                <div id="tableWrap" style="overflow-x:scroll;"> 
                    <table class="table-box" id='tableInfo' style="width:100%;">
                        <thead>
                            <tr>
                                <th class="table-tit">订单ID</th>
                                <th class="table-tit">订单状态</th>
                                <th class="table-tit">订单名称</th>
                                <th class="table-tit">所属广告主</th>
                                <th class="table-tit">所属广告公司</th>
                                <th class="table-tit">
                                    <span class="tool-table-tit">订单预算(元)</span>
                                    
                                </th>
                                <th class="table-tit">
                                    <span class="tool-table-tit">订单消费(元)</span>
                                    
                                </th>
                                <th class="table-tit">
                                    <span class="tool-table-tit">订单投放完成率</span>
                                   
                                </th>
                                <th class="table-tit">
                                    <span class="tool-table-tit">订单消费进度</span>
                                </th>
                                <th class="table-tit">活动预算(元)</th>
                                <th class="table-tit">活动消费(元)</th>
                                <th class="table-tit">活动投放完成率</th>
                                <th class="table-tit">活动消费进度</th>
                                <th class="table-tit">广告主预算(元)</th>
                                <th class="table-tit">广告主消费(元)</th>
                                <th class="table-tit">广告主投放完成率</th>
                                <th class="table-tit">广告主消费进度</th>
                                <th class="table-tit" text-align="center">
                                    <span class="time-wrap">
                                        <span class="t">剩余可投放时间</span>
                                        <span class="b">（活动剩余时间&订单剩余时间）</span>
                                    </span>
                                </th>
                                <th class="table-tit" text-align="center">
                                    <span class="time-wrap">
                                        <span class="t">设定的投放时间段</span>
                                        <span class="b">（活动时间&订单时间）</span>
                                    </span>
                                </th>
                                <th class="table-tit">订单详情</th>   
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(v,k) in tableList" :key="k" style="height:75px">
                                <td text-align="center">{{v.ordID}}</td>
                                <td text-align="center">{{orderStateList[v.ordState]}}</td>
                                <td text-align="center">
                                    <button @click="orderInfo(v)" style="background: inherit;border: none;color:#337ab7; cursor:pointer;">{{v.ordName}}</button>
                                </td>
                                <td text-align="center">{{v.advName}}</td>
                                <td text-align="center">{{v.comName}}</td>
                                <td text-align="center">{{v.ordBudget|number(2)}}</td>
                                <td text-align="center">{{v.ordSpend|number(2)}}</td>
                                <td text-align="center">{{Number((v.ordFinishRate*100).toFixed(0))}}%</td>
                                <td text-align="center">
                                    <div>
                                        <div class="progress">
                                            <el-progress :text-inside="true" :show-text="false" :stroke-width="18" :percentage="Number((v.ordSpendRate*100).toFixed(0))>100?100:Number((v.ordSpendRate*100).toFixed(0))"></el-progress>
                                        </div>
                                        <span>{{Number((v.ordSpendRate*100).toFixed(0))}}%</span>
                                    </div>
                                </td>
                                <td text-align="center">{{v.actBudget|number(0)}}</td>
                                <td text-align="center">{{v.actSpend|number(0)}}</td>
                                <td text-align="center">{{Number((v.actFinishRate*100).toFixed(0))}}%</td>
                                <td text-align="center">
                                    <div>
                                        <div class="progress">
                                            <el-progress :text-inside="true" :show-text="false" :stroke-width="18" :percentage="Number((v.actSpendRate*100).toFixed(0))>100?100:Number((v.actSpendRate*100).toFixed(0))"></el-progress>
                                        </div>
                                        <span>{{Number((v.actSpendRate*100).toFixed(0))}}%</span>
                                    </div>
                                </td>
                                <td text-align="center">{{v.advBudget|number(2)}}</td>
                                <td text-align="center">{{v.advSpend|number(2)}}</td>
                                <td text-align="center">{{Number((v.advFinishRate*100).toFixed(0))}}%</td>
                                <td text-align="center">
                                    <div>
                                        <div class="progress"> 
                                            <el-progress :text-inside="true" :show-text="false" :stroke-width="18" :percentage="Number((v.advSpendRate*100).toFixed(0))>100?100:Number((v.advSpendRate*100).toFixed(0))"></el-progress>                                          
                                        </div>
                                        <span>{{Number((v.advSpendRate*100).toFixed(0))}}%</span>
                                    </div>
                                </td>
                                <td text-align="center">
                                    <span class="actLeft" style="display:block;">活动剩余时间：{{v.actLeftTime}}</span>
                                    <span class="ordLeft" style="display:block;">订单剩余时间：{{v.ordLeftTime}}</span>
                                </td>
                                <td text-align="center">
                                    <span class="actTime" style="display:block;">活动时间：{{v.actTimeSlot}}</span>
                                    <span class="ordTime" style="display:block;">订单时间：{{v.ordTimeSlot}}</span>
                                </td>
                                <td text-align="center">
                                    <span class="check-detail" @click="orderRecord(v.ordID,v.actID,v.ordType)">查看详情</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table-box float-thead" id="float-thead" v-if="tableList.length || tableShow" ref="floatThead">
                        <thead>
                            <tr>
                                <th class="table-tit">订单ID</th>
                                <th class="table-tit">订单状态</th>
                                <th class="table-tit">订单名称</th>
                                <th class="table-tit">所属广告主</th>
                                <th class="table-tit">所属广告公司</th>
                                <th class="table-tit">
                                    <span class="tool-table-tit">订单预算(元)</span>
                                    
                                </th>
                                <th class="table-tit">
                                    <span class="tool-table-tit">订单消费(元)</span>
                                    
                                </th>
                                <th class="table-tit">
                                    <span class="tool-table-tit">订单投放完成率</span>
                                   
                                </th>
                                <th class="table-tit">
                                    <span class="tool-table-tit">订单消费进度</span>
                                </th>
                                <th class="table-tit">活动预算(元)</th>
                                <th class="table-tit">活动消费(元)</th>
                                <th class="table-tit">活动投放完成率</th>
                                <th class="table-tit">活动消费进度</th>
                                <th class="table-tit">广告主预算(元)</th>
                                <th class="table-tit">广告主消费(元)</th>
                                <th class="table-tit">广告主投放完成率</th>
                                <th class="table-tit">广告主消费进度</th>
                                <th class="table-tit" text-align="center">
                                    <span class="time-wrap">
                                        <span class="t">剩余可投放时间</span>
                                        <span class="b">（活动剩余时间&订单剩余时间）</span>
                                    </span>
                                </th>
                                <th class="table-tit" text-align="center">
                                    <span class="time-wrap">
                                        <span class="t">设定的投放时间段</span>
                                        <span class="b">（活动时间&订单时间）</span>
                                    </span>
                                </th>
                                <th class="table-tit">订单详情</th>   
                            </tr>
                        </thead>
                    </table>
                </div>
                
            </div>  
            <div class="scroll-wrap">
                <div class="h-bar"></div>
            </div>
            <page id="pageToolbar" :page="pageObj" @change="getList"></page>
        </div>
        

        <!-- 弹层 -->
        <el-dialog width="95%" :visible.sync="dialogVisible" :fullscreen="false" id="info-dialog">
            <ul class="orderinfo-list cl">
                <li>
                    <div class="t">
                        <p>
                            <span>订单ID:</span>
                            <span>{{info.ordID}}</span>
                        </p>
                        <p>
                            <span>订单名称:</span>
                            <span>{{info.ordName}}</span>
                        </p>
                    </div>
                    <div class="b">
                        <p>
                            <span>订单预算(元):</span>
                            <span>{{info.ordBudget|number(2)}}</span>
                        </p>
                        <p>
                            <span>订单消费(元):</span>
                            <span>{{info.ordSpend|number(2)}}</span>
                        </p>
                    </div>
                </li>
                <li>
                    <div class="t">
                        <p>
                            <span>活动ID:</span>
                            <span>{{info.actID}}</span>
                        </p>
                        <p>
                            <span>活动名称:</span>
                            <span>{{info.actName}}</span>
                        </p>
                    </div>
                    <div class="b">
                        <p>
                            <span>活动预算(元):</span>
                            <span>{{info.actBudget|number(2)}}</span>
                        </p>
                        <p>
                            <span>活动消费(元):</span>
                            <span>{{info.actSpend|number(2)}}</span>
                        </p>
                    </div>
                </li>
                <li>
                    <div class="t">
                        <p>
                            <span>广告主ID:</span>
                            <span>{{info.advID}}</span>
                        </p>
                        <p>
                            <span>广告主名称:</span>
                            <span>{{info.advName}}</span>
                        </p>
                    </div>
                    <div class="b">
                        <p>
                            <span>广告主余额(元):</span>
                            <span>{{info.advBudget|number(2)}}</span>
                        </p>
                        <p>
                            <span>广告主消费(元):</span>
                            <span>{{info.advSpend|number(2)}}</span>
                        </p>
                    </div>
                </li>
            </ul>
            <ul class="orderinfo-content-tab cl">
                <li v-for="(v,k) in list" @click="getInfo(k)" :key="k"><span :class="{'active': listIndex===k}">{{v.name}}</span></li>
            </ul>
            <!-- 订单流量漏斗 -->
            <div class="order-flow cl" v-show="listIndex == 0">
                <div class="l">
                    <ul>
                        <li>
                            <div class="order-flow-list">
                                <span class="order-flow-list-tit">请求阶段</span>
                                <div class="flow-content cl">
                                    <div class="content-l"></div>
                                    <div class="content-m content-all">
                                        <p class="cl">
                                            <span class="order-l order-l-e">符合订单定向的请求数量：</span>
                                            <span class="order-r order-r-e">
                                                <span class="num">-</span>
                                            </span>
                                        </p>
                                        <p class="cl">
                                            <span class="order-l order-l-e">反作弊后的请求数量：</span>
                                            <span class="order-r order-r-e">
                                                <span class="num">-</span>
                                            </span>
                                        </p>
                                        <p class="cl">
                                            <span class="order-l order-l-e">满足所有匹配条件的请求数量：</span>
                                            <span class="order-r order-r-e">
                                                <span class="num">-</span>
                                            </span>
                                        </p>
                                    </div>
                                    <div class="content-r"></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="order-flow-list">
                                <span class="order-flow-list-tit">DSP竞价阶段</span>
                                <div class="flow-content content2 cl">
                                    <div class="content-l"></div>
                                    <div class="content-m2 content-all"></div>
                                    <div class="content-position-m2">
                                        <p class="cl">
                                                <span class="order-l">DSP接收到的请求数量：</span>
                                                <span class="order-r cl">
                                                    <span class="num num-special" style="float:left" v-if="filterData.dspBid == 0">000,000,000</span>
                                                    <span class="num num-special" style="float:left" v-if="filterData.dspBid !== 0">{{filterData.dspBid|number}}</span>
                                                    <span style="float: right">
                                                        <span class="num">-</span>
                                                        <i class="glyphicon el-icon-warning question-icon" :class="{'active': iconIndex == 1}"
                                                            @mouseover="hover(1,'DSP接收到的请求数量')" @mouseout="qIndex=0"></i>
                                                        <span class="line" :style="style[1]"></span>
                                                    </span>
                                                </span>
                                            </p>
                                            <p class="cl">
                                                <span class="order-l">参与竞价的数量：</span>
                                                <span class="order-r cl">
                                                    <span class="num" style="float:left" v-if="filterData.dspCandidate == 0">000,000,000</span>
                                                    <span class="num" style="float:left" v-if="filterData.dspCandidate !== 0">{{filterData.dspCandidate|number}}</span>
                                                    <span style="float: right">
                                                        <span class="num">过滤比例{{filterData.dspCandidateRate*100|number}}%</span>
                                                        <i class="glyphicon el-icon-warning question-icon" :class="{'active': iconIndex == 2}"
                                                            @mouseover="hover(2,'参与出价的数量')" @mouseout="qIndex=0"></i>
                                                        <span class="line" :style="style[2]"></span>
                                                    </span>
                                                </span>
                                            </p>
                                            <p class="cl">
                                                <span class="order-l">竞价胜出的数量：</span>
                                                <span class="order-r cl">
                                                    <span class="num" style="float:left" v-if="filterData.dspWin == 0">000,000,000</span>
                                                    <span class="num" style="float:left" v-if="filterData.dspWin !== 0">{{filterData.dspWin|number}}</span>
                                                    <span style="float: right">
                                                        <span class="num">过滤比例{{filterData.dspWinRate*100|number}}%</span>
                                                        <i class="glyphicon el-icon-warning question-icon" :class="{'active': iconIndex == 3}"
                                                            @mouseover="hover(3,'竞价胜出的数量')" @mouseout="qIndex=0"></i>
                                                        <span class="line" :style="style[3]"></span>
                                                    </span>
                                                </span>
                                            </p>
                                    </div>
                                    <div class="content-r"></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="order-flow-list">
                                <span class="order-flow-list-tit">ADX竞价阶段</span>
                                <div class="flow-content content3 cl">
                                    <div class="content-l"></div>
                                    <div class="content-m3 content-all"></div>
                                    <div class="content-position-m3">
                                        <p class="cl special-p">
                                            <span class="order-l">ADX接收到的广告数量：</span>
                                            <span class="order-r cl">
                                                <span class="num num-special" style="float:left" v-if="filterData.adxBid == 0">000,000,000</span>
                                                <span class="num num-special" style="float:left" v-if="filterData.adxBid !== 0">{{filterData.adxBid|number}}</span>
                                                <span style="float:right">
                                                    <span class="num">差值{{filterData.adxBidRate*100|number}}%</span>
                                                    <i class="glyphicon el-icon-warning question-icon" :class="{'active': iconIndex == 4}"
                                                        @mouseover="hover(4,'ADX接收到的广告数量')" @mouseout="qIndex=0"></i>
                                                    <span class="line" :style="style[4]"></span>
                                                </span>
                                            </span>
                                        </p>
                                        <p class="cl special-p">
                                            <span class="order-l">参与竞价的广告数量：</span>
                                            <span class="order-r cl">
                                                <span class="num" style="float:left" v-if="filterData.adxCandidate == 0">000,000,000</span>
                                                <span class="num" style="float:left" v-if="filterData.adxCandidate !== 0">{{filterData.adxCandidate|number}}</span>
                                                <span style="float:right">
                                                    <span class="num">过滤比例{{filterData.adxCandidateRate*100|number}}%</span>
                                                    <i class="glyphicon el-icon-warning question-icon" :class="{'active': iconIndex == 5}"
                                                        @mouseover="hover(5,'参与出价的数量')" @mouseout="qIndex=0"></i>
                                                    <span class="line" :style="style[5]"></span>
                                                </span>
                                            </span>
                                        </p>
                                        <p class="cl special-p">
                                            <span class="order-l">竞价胜出的广告数量：</span>
                                            <span class="order-r cl">
                                                <span class="num" style="float:left" v-if="filterData.adxWin == 0">000,000,000</span>
                                                <span class="num" style="float:left" v-if="filterData.adxWin !== 0">{{filterData.adxWin|number}}</span>
                                                <span style="float:right">
                                                    <span class="num" v-if="filterData.adxWinRate !== 0">过滤比例{{filterData.adxWinRate*100|number}}%</span>
                                                    <span class="num" v-if="filterData.adxWinRate == 0">过滤比例0%</span>
                                                    <i class="glyphicon el-icon-warning question-icon" :class="{'active': iconIndex == 6}"
                                                        @mouseover="hover(6,'竞价胜出的数量')" @mouseout="qIndex=0"></i>
                                                    <span class="line" :style="style[6]"></span>
                                                </span>
                                            </span>
                                        </p>
                                    </div>
                                    <div class="content-r"></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="order-flow-list">
                                <span class="order-flow-list-tit">填充阶段</span>
                                <div class="flow-content content4 cl">
                                    <div class="content-l"></div>
                                    <div class="content-m4 content-all">
                                        <p class="cl">
                                            <span class="order-l order-l-fill">填充数量：</span>
                                            <span class="order-r order-r-fill">
                                                <span class="num">-</span>
                                            </span>
                                        </p>
                                    </div>
                                    <div class="content-r"></div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="order-flow-list">
                                <span class="order-flow-list-tit">曝光阶段</span>
                                <div class="flow-content content5 cl">
                                    <div class="content-l"></div>
                                    <div class="content-m5 content-all"></div>
                                    <div class="content-position-m5">
                                        <p class="cl special">
                                            <span class="order-l">曝光数量：</span>
                                            <span class="order-r cl">
                                                <span class="num" v-if="filterData.view == 0">000,000,000</span>
                                                <span class="num" v-if="filterData.view !== 0">{{filterData.view|number}}</span>
                                                <span style="float:right">
                                                    <span class="num" v-if="!filterData.viewRate">差值0%</span>
                                                    <span class="num" v-if="filterData.viewRate">差值{{filterData.viewRate*100|number}}%</span>
                                                    <i class="glyphicon el-icon-warning question-icon" :class="{'active': iconIndex == 7}"
                                                        @mouseover="hover(7,'曝光数量')" @mouseout="qIndex=0"></i>
                                                    <span class="line" :style="style[7]"></span>
                                                </span>
                                            </span>
                                        </p>
                                    </div>
                                    <div class="content-r"></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="r question-content" v-show="errIndex==1">
                    <div class="content-title">
                        <span class="one">过滤数量</span>
                        <span class="two">(所有过滤策略并行生效,数字应为错误最大值)</span>
                        <span class="three">:</span>
                        <span class="four" v-show="iconIndex==1">{{filterData.dspBid|number}}</span>
                        <span class="four" v-show="iconIndex==2">{{filterData.dspCandidateDecrease|number}}</span>
                        <span class="four" v-show="iconIndex==3">{{filterData.dspWinDecrease|number}}</span>
                        <span class="four" v-show="iconIndex==4">{{filterData.adxBidDecrease|number}}</span>
                        <span class="four" v-show="iconIndex==5">{{filterData.adxCandidateDecrease|number}}</span>
                        <span class="four" v-show="iconIndex==6">{{filterData.adxWinDecrease|number}}</span>
                        <span class="four" v-show="iconIndex==7">{{filterData.viewDecrease|number}}</span>
                        <el-button class="btn btn-default" @click="dialogVisible2=true">错误代码详解</el-button>
                    </div>
                    <div class="content-title view-title" v-if="title =='曝光数量'">
                        <span class="two">如曝光数量与填充数量差异较大，通常时媒体在获取广告返回后存在问题，需要联系媒体进行沟通。</span>
                    </div>
                    <ul>
                        <li v-for="(v,k) in errList" :key="k">
                            <p class="err cl">
                                <span class="err-l" v-if="v.Code">{{v.Code}}</span>
                                <span class="err-l" v-if="v.ID">创意ID-{{v.ID}}</span>
                                <span class="err-r">{{v.Num|number}}</span>
                            </p>
                        </li>
                    </ul>
                    <div class="content-btn" v-if="iconIndex != 1 && iconIndex != 4 && iconIndex != 7">
                        <el-button class="btn btn-info btn-title" @click="getDetail">查看素材错误详情</el-button>
                    </div>
                </div>
                <div class="r-second" v-show="errIndex==2">
                    <div class="r-second-header">
                        <el-button class="btn btn-default" @click="errIndex=1"><i class="glyphicon el-icon-arrow-left"></i></el-button>
                        <span class="tit" v-if="title !='曝光数量'">创意ID：{{creativeID}}</span>
                        <span class="tit" v-if="title =='曝光数量'">曝光数量：{{filterData.view|number}}</span>
                        <m-Select class="s" v-if="title !='曝光数量'" :title="creativetitle" :list="creativeList" valueName="name" @change="selectCreative"></m-Select>
                        <el-button v-if="title =='曝光数量'" class="btn btn-default view-btn"
                            @click="dialogVisible2=true">错误代码详解</el-button>
                    </div>
                    <div class="content-title" v-if="title !='曝光数量'">
                        <span class="one">{{title}}</span>
                        <span class="two">(所有过滤策略并行生效,数字应为错误最大值)</span>
                        <span class="three">:</span>
                        <span class="four" v-show="iconIndex==1">{{filterData.dspBid|number}}</span>
                        <span class="four" v-show="iconIndex==2">{{filterData.dspCandidate|number}}</span>
                        <span class="four" v-show="iconIndex==3">{{filterData.dspWin|number}}</span>
                        <span class="four" v-show="iconIndex==4">{{filterData.adxBid|number}}</span>
                        <span class="four" v-show="iconIndex==5">{{filterData.adxCandidate|number}}</span>
                        <span class="four" v-show="iconIndex==6">{{filterData.adxWin|number}}</span>
                        <span class="four" v-show="iconIndex==7">{{filterData.view|number}}</span>
                        <el-button class="btn btn-default" @click="dialogVisible2=true">错误代码详解</el-button>
                    </div>
                    <div class="content-title" v-if="title =='曝光数量'">
                        <span class="two">如曝光数量与填充数量差异较大，通常时媒体在获取广告返回后存在问题，需要联系媒体进行沟通。</span>
                    </div>             
                    <ul>
                        <li v-for="(v,k) in errDetailList" :key="k">
                            <p class="err cl">
                                <span class="err-l">{{v.Code}}</span>
                                <span class="err-r">{{v.Num|number}}</span>
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 订单24小时趋势 -->
            <div class="order-trend" v-if="listIndex == 1">
                <div class="checkbox-wrap">
                    <label for="checkbox">
                        <input @click="hiddenBudget(!isCheck)" v-model="isCheck" type="checkbox" class="no-budget-checkbox" id="checkbox">
                        <span class="no-budget">不展示预算</span>
                    </label>
                </div>
                <div class="chart" ref="echarts"></div>
            </div>                    
            <!-- 订单详情 -->
            <div class="order-detail" v-if="listIndex == 2">
                <div class="order-record-button-wrap">
                    <el-button class="btn btn-info" @click="orderRecord(info.ordID,info.actID,info.ordType)">订单记录查询</el-button>
                </div>
            </div>
            <!-- 订单变更记录 -->
            <div class="order-record" v-show="listIndex == 3">
                <div class="order-record-button-wrap">
                    <el-button class="btn btn-info" @click="changeRecord(info.ordID)">查看订单变更记录</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 错误代码详解弹层 -->
        <el-dialog id="err-dialog" width="630px" title="错误代码详解" :visible.sync="dialogVisible2">           
            <div class="err-c-wrap">
                <div class="err-c">
                    <h4>1.DSP竞价阶段</h4>
                    <p class="err-t">1.1 参与出价的数量：</p>
                    <p>理论数值应该和请求阶段的“满足所有匹配条件的请求数量”相同。</p>
                    <p class="err-t">1.2 进入候选的数量：</p>
                    <p>· dsp_filter （DSP被过滤掉的）：所有过滤策略并行生效。</p>
                    <p>· dsp_filter_111（DSP投放标记为不可投）：控量生效，导致不可进行投放；</p>
                    <p>· dsp_filter_112（DSP投放速率过大）：投放速率不符合现有预算（预算不足）导致不可投放；</p>
                    <p>· dsp_filter_113（订单单日频次过大）：创意所属的订单设置的天频次到达上限，导致不可投放；</p>
                    <p>· dsp_filter_114（订单小时频次过大）：创意所属的订单设置的小时频次到达上限，导致不可投放；</p>
                    <p>· dsp_filter_115（活动单日频次过大）：创意所属的活动所属活动设置的天频次到达上限，导致不可投放；</p>
                    <p>· dsp_filter_116（活动小时频次过大）：创意所属的活动所属活动设置的小时频次到达上限，导致不可投放；</p>
                    <p>· dsp_filter_117（cpm低于底价）：创意所属的订单设置的cpm出价低于底价，导致不可投放；</p>
                    <p>· dsp_filter_118（匹配不到代理商ID）：创意所属的订单所属的广告公司无此合约，导致不可投放；</p>
                    <p>· dsp_filter_120（OCPM低于底价）：创意所属的订单设置的ocpm出价低于底价，导致不可投放；</p>
                    <p>· dsp_filter_121（IAB黑名单过滤）：创意被行业屏蔽，导致不可投放。</p>
                    <p class="err-t">1.3 竞价胜出的数量：</p>
                    <p>· dsp_lose(DSP失败)：DSP失败 = DSP合约失败 +DSP竞价失败；</p>
                    <p>· dsp_lose_pd（DSP合约失败）：DSP合约失败 = 合约队列中随机分配到自己失败 +合约队列中随机没有分配到自己失败；</p>
                    <p>· dsp_lose_pd_first_price （合约队列中随机分配到自己失败）：出现此问题，导致不可投放，属于程序错误；</p>
                    <p>· dsp_lose_pd_not_first_price（合约队列中随机没有分配到自己失败）：合约随机请求没有分配到该素材，导致不可投放；</p>
                    <p>· dsp_lose_bid（DSP竞价失败）：DSP竞价失败 = 竞价队列中DSP价格是第一名失败 +DSP竞价队列中价格不是第一名失败；</p>
                    <p>· dsp_lose_bid_first_price（竞价队列中DSP价格是第一名失败）：创意因合约优先级更高，导致的不可投放；</p>
                    <p>· dsp_lose_bid_not_first_price（DSP竞价队列中价格不是第一名失败）：创意竞价中未能胜出，导致的不可投放。</p>
                </div>
                <div class="err-c">
                    <h4>2.ADX竞价阶段</h4>
                    <p class="err-t">2.1 参与出价的数量：</p>
                    <p>理论数值应该和DSP竞价阶段的“竞价胜出数量”相同。</p>
                    <p class="err-t">2.2 进入候选的数量：</p>
                    <p>· adx_filter（ADX被过滤掉的）：所有过滤策略并行生效；</p>
                    <p>· adx_filter_211（原templateID 无效）：技术接口返回的ID对应有问题，导致的不可投放；</p>
                    <p>· adx_filter_212（合约无效）：合约交易，返回的创意无法识别，导致的不可投放；</p>
                    <p>· adx_filter_213（创意无效）：竞价交易，返回的创意无法识别，导致的不可投放；</p>
                    <p>· adx_filter_214（创意未审核通过）：创意审核未通过，导致的不可投放。</p>
                    <p class="err-t">2.3 竞价胜出的数量：</p>
                    <p>· adx_lose（ADX失败）：所有过滤策略并行生效；</p>
                    <p>· adx_lose_pd（ADX合约失败）：ADX合约失败=合约队列中随机分配到自己失败+合约队列中随机分配到自己失败；</p>
                    <p>· adx_lose_pd_first_price （合约队列中随机分配到自己失败）：出现此问题，导致不可投放，属于程序错误；</p>
                    <p>· adx_lose_pd_not_first_price（合约队列中随机没有分配到自己失败）：合约随机请求没有分配到该素材，导致不可投放；</p>
                    <p>· adx_lose_bid（ADX竞价失败）：ADX竞价失败=竞价队列中ADX价格是第一名失败+ADX竞价队列中价格不是第一名失败；</p>
                    <p>· adx_lose_bid_first_price（竞价队列中ADX价格是第一名失败）：创意因合约优先级更高，导致的不可投放；</p>
                    <p>· adx_lose_bid_not_first_price（ADX竞价队列中价格不是第一名失败）：创意竞价中未能胜出，导致的不可投放。</p>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import SelectSearchCheck from '@/common/components/select-search-check'
import Select from '@/common/components/select'
import {floatScroll,fiveMultiple,timeToMillion } from '@/common/js/utils'
import { number } from '@/common/js/filter'
import echarts from 'echarts'
import {mixin} from "saas@/views/common.js"
export default {
    mixins: [mixin],
    components:{
        SelectSearchCheck,
        Select,
    },
    data(){
        return{
            tableList: [],
            pageObj:{
                currentPage: 1,
                size: 20,
                total: 0
            },
            ordStateList: [
                {id:'10', value:'正常'},
                {id:'20', value:'暂停'},
                {id:'30', value:'归档'},
                {id:'40', value:'删除'},
                {id:'50', value:'行投放'}
            ],
            searchBarFixed:false,
            tableShow: false,  
            filterID: [], //
            agencylist: [], 
            advList: [],
            activityList: [],
            orderList: [],
            agencyCheckedList: [],
            advCheckedList: [],
            activityCheckedList: [],
            orderCheckedList: [],
            checkList: [],
            backList1: [],
            backList2: [],
            backList3: [],
            backList4: [],
            unitType: "",
            checkedID: [],
            removeAgency: {},
            removeAdv: {},    
            removeActivity: {}, 
            removeOrder: {},
            index: '4',
            sortValue: ["ordSpend,1"],
            ordState: '10',
            dialogVisible: false,
            dialogVisible2: false,
            info: {},
            list: [
                {id:'1',name:'订单流量漏斗'},
                {id:'2',name:'订单24小时趋势'},
                {id:'3',name:'订单详情'},
                {id:'4',name:'订单变更记录'}
            ],
            listIndex: 0,
            iconIndex: 1,
            qIndex: 1,
            errIndex: 1,
            title: '参与出价的数量',
            style: [],
            filterData: {},
            dspBidList: [],
            dspCandidateList: [],
            dspWinList: [],
            adxBidList: [],
            adxCandidateList: [],
            adxWinList: [],
            viewList: [],
            errList: [],
            errDetailList: [],
            creativeID: '',
            isCheck: false,
            chartOpt: {},
            creative: [],
            creativeList: [],
            creativetitle: "",
            agencyValue: "",
            orderStateList: {
                "10": "正常",
                "20": "暂停",
                "30": "归档",
                "40": "删除",
                "50": "行投放"
            },
            searchVal: "",
            final: {}
        }
    },        
    mounted(){
        this.getList();
        this.getCompany();
    },
    computed: {
        silderFlag() {
            return this.$store.state.common.silderFlag
        }
    },
    watch: {
        silderFlag() {
            this.init()
        }
    },
    methods:{
        searchInput(val) {
            if(val){
                this.unitType = '5'
                this.checkedID = [val]
            }else{
                this.unitType = ''
                this.checkedID = []
            }
            
            this.getList()
        },
        //获取广告公司
        getCompany() {
            this.$ajax({
                url: '/dsp/rpt/budget/spend/query/company',
                data: {},
                load: true
            }).then(res => {
                this.agencylist = res.data;
            })
        },
        //下一级
        getCompanyChildren($event,unitType) {
            // console.log($event.id,unitType)
            this.final[unitType] = $event.id;
            // console.log(this.final)
            // this.checkedID = $event.id;
            if($event.id == "active") return;
            var data = {
                filter: {
                    unitType: unitType,
                    id: this.filterID
                }
            }
            // 是否是全选
            let isAll = $event.isAll;
            // 数组是否为空
            let isEmpty = $event.checkList.length != 0
            // 最后一级(订单)没有联动
            if(unitType != '5') {
                this.$ajax({
                    url: '/dsp/rpt/budget/spend/query/children',
                    data: data,
                    load: true
                }).then(res => {

                    switch (unitType) {
                        // 广告公司 联动广告主
                        case '2':
                            this.refresh('2')
                            this.advList = res.data || [];                            
                            if(isEmpty) {
                                if(isAll) {
                                    this.agencyCheckedList = [{id:'',name:'全部广告公司（多选）',checked:true}]
                                }else {
                                    this.agencyCheckedList = $event.checkList;
                                }
                            }else {
                                if(!isAll) {
                                    this.agencyCheckedList = [];
                                }
                            }
                            break;
                        // 广告主 联动活动
                        case '3':
                            this.refresh('3')
                            this.activityList = res.data || [];
                            if(isEmpty) {
                                if(isAll) {
                                    this.advCheckedList = [{id:'',name:'全部广告主（多选）',checked:true}]
                                }else {
                                    this.advCheckedList = $event.checkList;
                                }
                            }else {
                                if(!isAll) {
                                    this.advCheckedList = [];
                                }
                            }                           
                            // this.advCheckedList = $event;
                            break;
                        // 活动 联动订单    
                        case '4':
                            this.refresh('4')
                            this.orderList = res.data || [];
                            if(isEmpty) {
                                if(isAll) {
                                    this.activityCheckedList = [{id:'',name:'全部活动（多选）',checked:true}]
                                }else {
                                    this.activityCheckedList = $event.checkList;
                                }
                            }else {
                                if(!isAll) {
                                    this.activityCheckedList = [];
                                }
                            }                         
                            // this.activityCheckedList = $event;
                            break;
                
                        default:
                            break;
                    }
                })
            }else {
                if(isEmpty) {
                    if(isAll) {
                        this.orderCheckedList = [{id:'',name:'全部订单（多选）',checked:true}]
                    }else {
                        this.orderCheckedList = $event.checkList;
                    }
                }
                // this.orderCheckedList = $event;
            }
        },
        // 重置
        refresh(val) {
            switch (val) {
                case '2':
                    this.advCheckedList = [];
                    this.activityCheckedList = [];
                    this.orderCheckedList = [];
                    this.backList2 = [];
                    this.backList3 = [];
                    this.backList4 = [];
                    break;
                case '3':
                    this.activityCheckedList = [];
                    this.orderCheckedList = [];
                    this.backList3 = [];
                    this.backList4 = [];
                    break;
                case '4':
                    this.orderCheckedList = [];
                    this.backList4 = [];
                    break;
            
                default:
                    break;
            }
        },
        //删除
        remove(type,v,k) {
            // console.log(type, v, k)
            if(!v.id) {
                this.final[type] = [];              
            }
            switch (type) {
                case '2':
                    this.agencyCheckedList.splice(k, 1);
                    this.removeAgency = v;
                    // 删除下一级
                    this.refresh('2')
                    break;
                case '3':
                    this.advCheckedList.splice(k, 1);
                    this.removeAdv = v;
                    // 删除下一级
                    this.refresh('3')
                    break;
                case '4':
                    this.activityCheckedList.splice(k, 1);
                    this.removeActivity = v;
                    // 删除下一级
                    this.refresh('4')
                    break;
                case '5':
                    this.orderCheckedList.splice(k, 1);
                    this.removeOrder = v;
                    break;
            
                default:
                    break;
            }
        },
        removeChild(list,v) {
            var arr = [];
            list.forEach(item => {
                if(item.parentID != v.id) {
                    arr.push(item)
                }
            })
            return arr;
        },
        getList(){
            var data = {
                filter: {
                    unitType: this.unitType || "",
                    id: this.checkedID || [],
                    ordState: this.ordState
                },
                sort: this.sortValue,
                page: this.pageObj.currentPage + "",
                size: this.pageObj.size + ""
            }
            this.$ajax({
                url: '/dsp/rpt/budget/spend/order/list',
                data: data,
                load: true
            }).then(res=>{
                this.tableList = res.data.data.list;
                this.pageObj.total = res.data.total;
                this.pageObj.currentPage = res.data.page;

                this.tableList.forEach(function(v){

                    if(Number(v.ordLeftTime) < 0) {
                        v.ordLeftTime = '已超'
                    }else{
                        v.ordLeftTime = timeToMillion(v.ordLeftTime)
                    }
                    if(Number(v.actLeftTime) < 0) {
                        v.actLeftTime = '已超'
                    }else{
                        v.actLeftTime = timeToMillion(v.actLeftTime)
                    }
                    if(v.actEndTime == '0'){
                        v.actTimeSlot = '无限期'
                    }else{
                        v.actTimeSlot = v.actStartTime +'~'+ v.actEndTime
                    }
                    if(v.ordEndTime == '0'){
                        v.ordTimeSlot = '无限期'
                    }else{
                        v.ordTimeSlot = v.ordStartTime +'~'+ v.ordEndTime
                    }

                })  

                this.$nextTick(this.init)
                this.tableShow = true;
            })
        },
        //查询
        search() {
            this.pageObj.currentPage = 1;
            var list = [                          
                this.agencyCheckedList.length,   //对应unitType:2
                this.advCheckedList.length,      //unitType:3
                this.activityCheckedList.length, //unitType:4
                this.orderCheckedList.length     //unitType:5
            ];        
            var obj = {
                'agency': this.agencyCheckedList,
                'adv': this.advCheckedList,
                'activity': this.activityCheckedList,
                'order': this.orderCheckedList,
            };
            var final = {};
            for(let k in obj) {
                this[k + 'CheckedList'].forEach(item => {
                    final.type = item.type;
                    final.name = item.name;
                })
            }

            this.checkList = list;
            var i = this.checkList.indexOf(0);
            // console.log(this.checkList,i)
            var array = [];
            switch (i) {
                // 表示无空数组 则以最后一级 订单为准
                case -1:
                    this.unitType = '5'
                    break;
                case 0:
                    this.unitType = ''
                    break;
                // 以第一级 广告公司为准      
                case 1:
                    this.unitType = '2'
                    break;
                // 以第二级 广告主为准    
                case 2:
                    this.unitType = '3'
                    break;
                // 以第三级 活动为准
                case 3:
                    this.unitType = '4'
                    break;            
                default:
                    break;
            }
            if(final.type == 'active') {
                switch (final.name) {
                    case '全部活跃广告主':
                        this.unitType = '3'
                        break;
                    case '全部活跃活动':
                        this.unitType = '4'
                        break;
                    case '全部活跃订单':
                        this.unitType = '5'
                        break;
                
                    default:
                        break;
                }
            }else {
                switch (final.name) {
                    case '全部广告公司（多选）':
                        this.unitType = '2'
                        break;
                    case '全部广告主（多选）':
                        this.unitType = '3'
                        break;
                    case '全部活动（多选）':
                        this.unitType = '4'
                        break;
                    case '全部订单（多选）':
                        this.unitType = '5'
                        break;
                
                    default:
                        break;
                }
            }
            this.checkedID = this.final[this.unitType]
            this.getList()
        },
        //重置
        clearAll() {
            // this.tableShow = false;
            this.agencyCheckedList = [];
            this.advCheckedList = [];
            this.activityCheckedList = [];
            this.orderCheckedList = [];
            this.backList1 = [];
            this.backList2 = [];
            this.backList3 = [];
            this.backList4 = [];
            this.unitType = '';
            this.checkedID = [];
            this.searchVal = "";
            this.getList()
        },
        selectState(val) {
            this.ordState = val.id;
            this.getList()
        },
        orderInfo(v) {
            var v = JSON.stringify(v)
            this.info = JSON.parse(v); 
            this.dialogVisible = true;           
            setTimeout(() => {
                this.getInfo()
            },100)            
        },
        getInfo(k) {
            if(this.listIndex === k){
                return;
            }else{
                if(k !== undefined){
                    this.listIndex = k;
                }
                if(this.listIndex == 1){
                    this.getChart();
                    return;
                };
                if(this.listIndex == 0){
                    this.getFunnel();                   
                    return;                    
                };
            }
        },
        //漏斗图
        getFunnel() {
            var data = {
                filter: {
                    id: this.info.ordID
                }
            }
            this.$ajax({
                url: '/dsp/rpt/budget/spend/chart/funnel',
                data: data,
                load: true
            }).then(res => {
                this.creative = res.data.creative;
                this.creativeID = res.data.creative[0];
                this.filterData = res.data;          
                this.dspBidList = res.data.dspBidList;
                this.dspCandidateList = res.data.dspCandidateList;
                this.dspWinList = res.data.dspWinList;
                this.adxBidList = res.data.adxBidList;
                this.adxCandidateList = res.data.adxCandidateList;
                this.adxWinList = res.data.adxWinList;
                this.viewList = res.data.viewList;
                this.errList = res.data.dspBidList;

                if(this.creative.length) {
                    this.creative.forEach((v, k) => {
                        this.$set(this.creative, k, {})
                        this.$set(this.creative[k], 'id', v)
                        this.$set(this.creative[k], 'name', '创意ID：' + v)
                    })
                }else {
                    this.$set(this.creative, 0, {})
                    this.$set(this.creative[0], 'id', '')
                    this.$set(this.creative[0], 'name', '无数据')
                }
                this.creativeList = this.creative;                
                this.creativetitle = this.creativeList[0].name;

                this.Switch('dspCandidateList', 'Code')
                this.Switch('dspWinList', 'Code')
                this.Switch('adxCandidateList', 'Code')
                this.Switch('adxWinList', 'Code')

                this.iconIndex = 1;

                var style = $('.question-content').offset().left - $('.question-icon').eq(0).offset().left;
                this.style = []
                this.style[1] = {
                    width: (style - 14) + 'px',
                    height: '2px',
                    position: 'absolute',
                    right: -(style -14) + 'px',
                    top: '12px',
                    background: '#918778'
                };
            })
        },
        selectCreative(item) {
            if(this.creativeID == item.id || item.id == '') return;
            this.creativeID = item.id;            
            this.getDetail()
        },
        getDetail() {
            var unitType = '',
                creativeID = '',
                data = {
                    filter:{}
                };
            this.errIndex = 2;
            if(this.creativeList[0]) {
                switch (this.iconIndex) {
                    case 1:
                        creativeID = this.adxBidList[0].ID;
                        break;
                    case 2:
                        unitType = 'dspCandidate';
                        creativeID = this.creativeList[0].id;
                        break;
                    case 3:
                        unitType = 'dspWin';
                        creativeID = this.creativeList[0].id;
                        break;
                    case 4:
                        creativeID = this.dspBidList[0].ID;
                        break;
                    case 5:
                        unitType = 'adxCandidate';
                        creativeID = this.creativeList[0].id;
                        break;
                    case 6:
                        unitType = 'adxWin';
                        creativeID = this.creativeList[0].id;
                        break; 
                    case 7:
                        creativeID = this.viewList[0].ID;
                        break;           
                    default:
                        break;
                }
            }           
            if(!(this.iconIndex == 1 || this.iconIndex == 4 || this.iconIndex == 7)) {
                data.filter.unitType = unitType;
            }
            data.filter.id = this.creativeID || creativeID
            this.$ajax({
                url: '/dsp/rpt/budget/spend/chart/funnel/detail',                
                data: data,
                load: true               
            }).then(res => {
                this.errDetailList = res.data;
                if(this.errDetailList.length) {
                    this.Switch('errDetailList', 'Code');
                }
            })
        },
        hover(index, title) {
            if(this.errIndex == 1) {
                this.title = title;
                this.iconIndex = index;
                this.qIndex = index;
                this.problemShow = true;
                var style = $('.question-content').offset().left - $('.question-icon').eq(index-1).offset().left
                this.style = [];
                var value = {
                    width: (style - 14) + 'px',
                    height: '2px',
                    position: 'absolute',
                    right: -(style -14) + 'px',
                    top: '12px',
                    background: '#918778'
                };
                this.$set(this.style, index, value)
                // this.style[index] = {
                //     width: (style - 14) + 'px',
                //     height: '2px',
                //     position: 'absolute',
                //     right: -(style -14) + 'px',
                //     top: '10px',
                //     background: '#918778'
                // };
                switch (index) {
                    case 1:
                        this.errList = this.dspBidList;
                        break;
                    case 2:
                        this.errList = this.dspCandidateList;
                        break;
                    case 3:
                        this.errList = this.dspWinList;
                        break;
                    case 4:
                        this.errList = this.adxBidList;
                        break;    
                    case 5:
                        this.errList = this.adxCandidateList;
                        break;
                    case 6:
                        this.errList = this.adxWinList;
                        break;
                    case 7:
                        this.errList = this.viewList;
                        break;    
                    default:
                        break;
                }
            }
        },
        hiddenBudget(boolean) {
            this.getChart(boolean)       
        },
        //图表
        getChart(boolean){
            var data = {
                filter: {
                    id: this.info.ordID
                }
            }
            this.$ajax({
                url: '/dsp/rpt/budget/spend/chart/trend',
                data: data,
                load: true                               
            }).then(res => {
                var chartDate = {
                    ts: [],
                    budget: [],
                    forecast: [],
                    spend: []
                };
                res.data.sort(function(a, b){
                    return Number(a.ts.split(" ")[1] - Number(b.ts.split(" ")[1]))
                })
                if(res.data.length) {
                    res.data.forEach(function(v){
                        chartDate.ts.push(v.ts.split(" ")[1] + ":00");
                        chartDate.budget.push(v.budget+"");
                        chartDate.forecast.push(v.forecast+"");
                        chartDate.spend.push(v.spend+"");
                    })
                } else {
                    chartDate.ts = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
                    chartDate.budget = ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'];
                    chartDate.forecast = ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'];
                    chartDate.spend = ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'];
                }
                var title1,data1;
                if(boolean) {
                    title1 = '';
                    data1 = [];
                }else {
                    title1 = '订单预算';
                    data1 = chartDate.budget;
                }
                this.chartOpt = {
                    title1: title1,
                    title2:'订单累计消费',
                    title3:'预估小时消耗',
                    data1: data1,
                    data2: chartDate.spend,
                    data3: chartDate.forecast,
                    xAxis: chartDate.ts
                }
                this.setChart(this.chartOpt)
            })           
        },
        setChart(option){
            // console.log(echarts)
            var chart = echarts.init(this.$refs.echarts);
            var y1 = {},y2 = {},y3 = {},y4 = {};

            y1.data = option.data1;
            y1.min = 0;
            y1.max = fiveMultiple(Math.max.apply(0,y1.data));
            y1.min = y1.min == y1.max ? 0 : y1.min;
            y1.interval = Number(((y1.max - y1.min) / 5).toFixed(3));

            y2.data = option.data2;
            y2.min = 0;
            y2.max = fiveMultiple(Math.max.apply(0,y2.data));
            y2.min = y2.min == y2.max ? 0 : y2.min;
            y2.interval = Number(((y2.max - y2.min) / 5).toFixed(3)); 

            y3.data = option.data3;
            y3.min = 0;
            y3.max = fiveMultiple(Math.max.apply(0,y3.data));
            y3.min = y3.min == y3.max ? 0 : y3.min;
            y3.interval = Number(((y3.max - y3.min) / 5).toFixed(3));
            
            y4.data = [y1.max, y2.max, y3.max];
            y4.min = 0;
            y4.max = fiveMultiple(Math.max.apply(0,y4.data));
            y4.min = y4.min == y4.max ? 0 : y4.min;
            y4.interval = Number(((y4.max - y4.min) / 5).toFixed(3));

            var option = {
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    icon:'circle',
                    left: 'left',
                    data:['订单预算','订单累计消费','预估小时消耗'],
                    color: ['#3caeec','#8bc34a','#ff9800']
                },
                grid: {
                    left: '2%',
                    right: '2%',
                    bottom: '0',
                    containLabel: true,
                    x:0,
                    y:40,
                    x2:0,
                    y2:0
                },
                xAxis: [
                    {
                        type: 'category',
                        data: option.xAxis,
                        boundaryGap: false,                                                
                        // axisPointer: {
                        //     type: 'shadow'
                        // }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        // name: option.title1,
                        min: y4.min,
                        max: y4.max,
                        interval: y4.interval,
                        splitLine: {
                            show: false
                        }, 
                    }                
                ],
                series: [
                    {
                        name: option.title1,
                        type:'line',
                        color: ["#3caeec"],
                        data: y1.data
                    },
                    {
                        name: option.title2,
                        type: 'line',
                        color: ['#8bc34a'],
                        // yAxisIndex: 1,
                        data: y2.data
                    },
                    {
                        name: option.title3,
                        type: 'line',
                        color: ['#ff9800'],
                        // yAxisIndex: 1,
                        data: y3.data
                    }
                ]
            };
            chart.setOption(option);

            //自适应
            // window.onresize = function(){
            //     chart.resize()
            // }   
        },     
        Switch(arrList, code) {
            this[arrList].forEach(function(v){
                switch (v[code]) {
                    case 'dsp_filter_111':
                        v[code] = '错误-111 (DSP投放标记为不可投) :'
                        break;
                    case 'dsp_filter_112':
                        v[code] = '错误-112 (DSP投放速率过大) :'
                        break;
                    case 'dsp_filter_113':
                        v[code] = '错误-113 (订单单日频次过大) :'
                        break;
                    case 'dsp_filter_114':
                        v[code] = '错误-114 (订单小时频次过大) :'
                        break;
                    case 'dsp_filter_115':
                        v[code] = '错误-115 (活动单日频次过大) :'
                        break;
                    case 'dsp_filter_116':
                        v[code] = '错误-116 (活动小时频次过大) :'
                        break;  
                    case 'dsp_filter_117':
                        v[code] = '错误-117 (cpm低于底价) :'
                        break;
                    case 'dsp_filter_118':
                        v[code] = '错误-118 (匹配不到代理商ID) :'
                        break;                 
                    case 'dsp_filter_120':
                        v[code] = '错误-120 (OCPM低于底价) :'
                        break; 
                    case 'dsp_filter_121':
                        v[code] = '错误-121 (IAB黑名单过滤) :'
                        break;                          
                    case 'dsp_lose':
                        v[code] = '错误-dsp_lose (DSP失败) :'
                        break;
                    case 'dsp_lose_pd':
                        v[code] = '错误-dsp_lose_pd (DSP合约失败) :'
                        break;
                    case 'dsp_lose_pd_first_price':
                        v[code] = '错误-dsp_lose_pd_first_price (合约队列中随机分配到自己失败) :'
                        break; 
                    case 'dsp_lose_pd_not_first_price':
                        v[code] = '错误-dsp_lose_pd_not_first_price (合约队列中随机没有分配到自己失败) :'
                        break;
                    case 'dsp_lose_bid':
                        v[code] = '错误-dsp_lose_bid (DSP竞价失败) :'
                        break; 
                    case 'dsp_lose_bid_first_price':
                        v[code] = '错误-dsp_lose_bid_first_price (竞价队列中DSP价格是第一名失败) :'
                        break; 
                    case 'dsp_lose_bid_not_first_price':
                        v[code] = '错误-dsp_lose_bid_not_first_price (DSP竞价队列中价格不是第一名失败) :'
                        break;  
                    case 'adx_filter':
                        v[code] = '错误-adx_filter (ADX被过滤掉的) :'
                        break;
                    case 'adx_filter_211':
                        v[code] = '错误-211 (原templateID 无效) :'
                        break;
                    case 'adx_filter_212':
                        v[code] = '错误-212 (合约无效) :'
                        break;
                    case 'adx_filter_213':
                        v[code] = '错误-213 (创意无效) :'
                        break;
                    case 'adx_filter_214':
                        v[code] = '错误-214 (创意未审核通过) :'
                        break;
                    case 'adx_lose':
                        v[code] = '错误-adx_lose (ADX失败) :'
                        break;
                    case 'adx_lose_pd':
                        v[code] = '错误-adx_lose_pd (ADX合约失败) :'
                        break;
                    case 'adx_lose_pd_first_price':
                        v[code] = '错误-adx_lose_pd_first_price (合约队列中随机分配到自己失败) :'
                        break;
                    case 'adx_lose_pd_not_first_price':
                        v[code] = '错误-adx_lose_pd_not_first_price (合约队列中随机没有分配到自己失败) :'
                        break;
                    case 'adx_lose_bid':
                        v[code] = '错误-adx_lose_bid (ADX竞价失败) :'
                        break;
                    case 'adx_lose_bid_first_price':
                        v[code] = '错误-adx_lose_bid_first_price (竞价队列中ADX价格是第一名失败) :'
                        break;
                    case 'adx_lose_bid_not_first_price':
                        v[code] = '错误-adx_lose_bid_not_first_price (ADX竞价队列中价格不是第一名失败) :'
                        break;                      
                    default:
                        break;
                }
            })
        },
        Sort(sortValue, index) {
            if(this.tableList.length){
                this.index = index;
                this.sortValue = [sortValue];              
                this.getList();
            }            
        },
        orderRecord(ordID,activeId,oType) {
            var oType = oType == 'rtb' ? '1' : '2';
            var url = window.location.href.replace('delivery/tool','delivery/orderDetail?oType='+oType+'&orderId='+ordID+'&activeId='+activeId)      
            window.open(url,'_blank');
        },

        changeRecord(ordID) {
            var url = window.location.href.replace('delivery/tool','diag/historyO?ID='+ordID)      
            window.open(url,'_blank');
        },


        //表格
        init() {
            $('.table-box').css('marginLeft', '0px');
            $(".float-thead").css({left:'0px'});
            $('.h-bar').css('left', '0px');
            this.floatThead($("#tableInfo thead"),$("#float-thead"));
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
            // 设置宽度
            $thead.find("tr > th").each(function(i,v){
                if($floatTh[i]){
                    $floatTh[i].style.width = v.offsetWidth+"px";
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
                } else {
                    $float.css({top:0})
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
</script>
<style lang="less">
#admin_delivery_tool{
    .box{
        border: 1px solid #bbb;
        padding: 23px;
        .filter{
            .fl{
                float: left;
                margin-left: 10px;
            }
            .fl:first-child{
                margin-left: 0;
            }
            .fr{
                float: right;
            }
        }
              
    } 
    .filter-content{
        padding: 20px;
        border: 1px solid #BBBBBB;
        margin-bottom: 10px; 
        border-top: none;
        .agency,.adv,.activity,.order{
            display: flex;
            font-size: 14px;
            color: #0e1e45;
            .tit{
                width: 65px;
                display: inline-block;
                text-align: justify;
                text-align-last: justify; 
                margin-right: 2px;    
                line-height: 29px;                      
            }
            .tit-symbol{
                line-height: 29px;  
            }
            .select-content{
                width: calc(~'100% - 65px');
                margin-left: 10px;
                li{
                    float: left;
                    // width: 158px;
                    padding: 5px;
                    font-size: 12px;
                    border: 1px solid #BBBBBB;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    background: #fff; 
                    .name{
                        float: left;
                        line-height: 24px;
                    }
                    .close-icon{
                        margin-left: 40px;
                        height: 24px;
                        line-height: 24px;
                        font-size: 24px;
                        float: right;
                        cursor: pointer;
                    }
                    .remove-icon{
                        opacity: 0.5;
                        &:hover{
                            opacity: 1;
                        }
                    }
                }
            }
        }    
    } 
    .table{
        .slider-box{
            border: 1px solid #bbb;
            position: relative;          
            .slider-content{
                .table-box{
                    width: 100%;
                    border-spacing: 0;
                    border-collapse: collapse;
                    th{
                        height: 75px;
                    }
                }
                #float-thead{
                    background: #fff;
                    display: table;
                    max-width: none;
                    th{
                        padding: 0;
                        border-bottom: 1px solid #BBBBBB;
                    }
                }
                #table-orderInfo,#float-thead{           
                    th{
                        padding: 0;
                        height: 75px;
                        vertical-align: middle;
                        text-align: center;    
                        font-weight: 400;
                        font-size: 14px;
                        color: rgb(16, 16, 16);            
                        .tool-table-tit{
                            vertical-align: middle;
                        }
                        .query-icon{
                            vertical-align: middle;
                        }
                        .icon-wrap{
                            display: inline-flex;
                            flex-flow: column;
                            vertical-align: middle;
                            .icon{
                                font-size: 10px;
                                cursor: pointer;
                                color: #ccc;
                            }
                            .active{
                                color: orange;
                            }
                        }
                        .bottom-tip{
                            text-align: right;
                            height: 28px;
                            line-height: 28px;
                        }
                        .time-wrap{
                            display: inline-flex;
                            flex-flow: column;
                            vertical-align: middle;
                            .t,.b{
                                line-height: 1;
                            }
                        }
                    }
                    td{
                        vertical-align: middle;
                        text-align: center;
                        border-bottom: 1px solid #BBBBBB;
                    }
                }
            }
        } 
    }
    .el-dialog__wrapper{
        .el-dialog{      
            .orderinfo-list{       
                display: flex; 
                li{  
                    width: 33%;          
                    margin-right: 10px;
                    float: left;
                    padding: 10px 20px;
                    border: 1px solid #BBBBBB;
                    .t{ 
                        padding-bottom: 10px;
                        border-bottom: 1px solid #BBBBBB;
                        p{
                            line-height: 24px;
                        }
                    }
                    .b{
                        padding-top: 10px;
                        p{
                            line-height: 24px;
                        } 
                    }
                }
                li:last-child{
                    margin-right: 0;
                }
            } 
            .orderinfo-content-tab{
                margin-top: 20px;
                border: 1px solid #BBBBBB;
                li{
                    float: left;
                    font-size: 14px;
                    text-align: center;
                    padding: 15px 0;
                    cursor: pointer;
                    span{
                        padding: 0 40px;
                        border-right: 1px solid #BBBBBB;
                    }
                    .active{
                        color: #337ab7;
                        font-weight: bold;
                    }
                }
                li:last-child{
                    span{
                        border-right: none;
                    }
                }
            } 
            .order-record,.order-detail{
                .order-record-button-wrap{
                    text-align: center;
                    padding: 50px 0;
                    border: 1px solid #BBBBBB;
                    background: #f4f4f4;
                    .btn{
                        padding: 12px 72px;
                        background-color: #5bc0de;
                        border-color: #46b8da;
                        color: #fff;
                    }
                }
            }
            .order-trend,.order-flow{
                padding: 20px;
                border: 1px solid #BBBBBB;
                border-top: none;
                position: relative;
                .checkbox-wrap{
                    position: absolute;
                    right: 20px;
                    top: 20px;
                    z-index: 9999;
                    label{
                        cursor: pointer;
                        .no-budget-checkbox{
                            cursor: pointer;
                            margin:0 5px 0 0;
                            width: 16px;
                            height: 16px;
                        }
                        .no-budget{
                            vertical-align: top;
                        }
                    }
                }
                .chart{
                    height: 400px;
                }
            } 
            .order-flow{
                position: relative;
                .l{
                    float: left;
                    margin-left: 20px;
                    ul{
                        position: relative;
                        li{
                            border-bottom: 1px solid #BBBBBB; 
                            .order-flow-list{
                                height: 92px;
                                .order-flow-list-tit{
                                    float: left;
                                    font-size: 16px;
                                    line-height: 92px;
                                    height: 92px;
                                    margin-right: 20px;
                                }
                                .flow-content{
                                    display: inline-block;
                                    position: relative;
                                    .content-l{
                                        float: left;
                                        width: 0;
                                        height: 0;
                                        border-top: 46px solid transparent;
                                        border-right: 17px solid transparent;
                                        border-bottom: 46px solid #fff;
                                        border-left: 17px solid #fff;
                                        position: absolute;
                                        left: 0;
                                    }
                                    .content-all,.content-position-m2,.content-position-m3,.content-position-m5{
                                        display: flex;
                                        justify-content: center;
                                        flex-flow: column;
                                        p{     
                                            text-align: center;  
                                            margin: 0 auto;
                                            margin-left: 0;
                                            margin-right: 0;                           
                                            span{
                                                font-size: 14px;
                                                color: #3d454d;
                                                line-height: 26px;                                        
                                            } 
                                            .order-l{
                                                float: left;
                                            }
                                            .order-r{
                                                float: right;
                                                position: relative;
                                                width: 200px;
                                                .num{
                                                    margin-right: 4px;
                                                }
                                                .num-special{
                                                    margin-right: 32px;
                                                }
                                                .active{
                                                    color: #b5b09e;
                                                    cursor: pointer;
                                                }
                                            } 
                                            .order-l-e{
                                                margin-left: 50px;
                                            }                     
                                            .order-r-e{
                                                margin-right: 40px;
                                                width: 150px;
                                            }            
                                            .order-l-fill,.order-r-fill{
                                                float: none;
                                            }
                                        }
                                        .special{
                                            margin-left: -40px;
                                            margin-right: -40px; 
                                            .order-r{
                                                width: 175px;
                                            }
                                        }
                                        .special-p{
                                            margin-left: -30px;
                                            margin-right: -30px; 
                                        }
                                    }
                                    .content-m{
                                        float: left;
                                        width: 438px;
                                        height: 92px;
                                        background: linear-gradient(#f0f5ff,#c2d5fc);
                                    }
                                    
                                    .content-m2{
                                        float: left;
                                        width: 370px;
                                        height: 92px;
                                        background: linear-gradient(#e9f0ff,#c8d9fc);
                                    }
                                    .content-position-m2{
                                        position: absolute;
                                        width: 370px;
                                        height: 92px;
                                        z-index: 1;
                                    }
                                    .content-m3{
                                        float: left;
                                        width: 302px;
                                        height: 92px;
                                        background: linear-gradient(#dde8ff,#bdd1fc);
                                    }
                                    .content-position-m3{
                                        position: absolute;
                                        width: 302px;
                                        height: 92px;
                                        z-index: 1;
                                    }
                                    .content-special{
                                        position: absolute;
                                    }
                                    .content-m4{
                                        float: left;
                                        width: 234px;
                                        height: 92px;
                                        background: linear-gradient(#d1dfff,#b2cafc);
                                    }
                                    .content-m5{
                                        float: left;
                                        width: 166px;
                                        height: 92px;
                                        background: linear-gradient(#c5d8ff,#abc6fc);
                                    }
                                    .content-position-m5{
                                        position: absolute;
                                        width: 166px;
                                        height: 92px;
                                        z-index: 1;
                                    }
                                    .content-r{
                                        float: left;
                                        width: 0;
                                        height: 0;
                                        border-top: 46px solid transparent;
                                        border-right: 17px solid #fff;
                                        border-bottom: 46px solid #fff;
                                        border-left: 17px solid transparent;
                                        position: absolute;
                                        right: 0;
                                    }
                                }
                                .content2{
                                    position: absolute;
                                    left: 118px;
                                }
                                .content3{
                                    position: absolute;
                                    left: 152px;
                                }
                                .content4{
                                    position: absolute;
                                    left: 186px
                                }
                                .content5{
                                    position: absolute;
                                    left: 220px
                                }
                            }
                        }
                    }
                }
                .r,.r-second{
                    overflow: auto;
                    width: calc(~'100% - 618px');
                    height: 515px;
                    border: 1px solid #BBBBBB;  
                    float: right;
                    background: #fffbed;
                    padding: 0 20px;
                    .content-title{                            
                        height: 56px;
                        line-height: 54px;
                        border-bottom: 2px solid #BBBBBB;
                        .one{
                            font-size: 14px;
                            font-weight: bold;
                        }
                        .three{
                            font-size: 18px;
                        }
                        .four{
                            margin-left: 15px;
                        }
                        .btn{
                            float: right;
                            height: 26px;
                            line-height: 26px;
                            padding: 0 10px;
                            margin-top: 15px;
                            font-size: 12px;
                        }
                    }
                    .view-title{
                        line-height: 32px;
                        height: auto;
                    }
                    ul{
                        li{
                            .err{
                                line-height: 36px;
                                border-bottom: 1px dashed #BBBBBB;
                                height: 36px;
                                .err-l{
                                    float: left;
                                }
                                .err-r{
                                    float: right;
                                }
                            }
                        }
                    }
                    .content-btn{
                        text-align: center;
                        margin-top: 20px;
                        .btn-title{
                            color: #fff;
                            padding-left: 50px; 
                            padding-right: 50px; 
                            background-color: #5bc0de;
                            border-color: #46b8da;
                        }
                    }
                    .r-second-header{
                        height: 56px;
                        line-height: 54px;
                        border-bottom: 2px solid #BBBBBB;
                        .s{
                            float: right;
                            margin-top: 6px;
                            .m-select{
                                .m-select-inner{
                                    position: absolute;
                                }
                                .m-select-suffix{
                                    top: -6px;
                                }
                            }
                        }
                        .btn{
                            height: 26px;
                            line-height: 26px;
                            padding: 0 10px; 
                        }
                        .view-btn{
                            margin-top: 15px;
                            float: right;
                        }
                        .tit{
                            color: #000;
                            font-weight: 600;
                            margin-left: 15px;
                        }
                    }
                }
            }
            .err-d{
                font-size: 14px;
                height: 36px;
                line-height: 36px;
                border-bottom: 1px solid #BBBBBB;
                padding: 0 15px;
            }
            .err-c-wrap{
                width: 100%;
                max-height: 460px;
                padding-bottom: 20px;
                overflow: auto;
                .err-c{
                    padding: 0 15px;
                    h4{
                        padding: 5px 0;
                        margin-top: 10px;
                        font-weight: 700;
                    }
                    p{
                        line-height: 24px;
                        font-size: 12px;
                    }
                    .err-t{
                        font-weight: 600;
                    }
                }
            }
        }        
    } 
    .check-detail{
        color: #337ab7;
        cursor: pointer;
        &:hover{
            color: #23527c;
        }
    }
}
#err-dialog{
    .el-dialog__header{
        border-bottom: 1px solid #BBBBBB;
    }  
    .el-dialog__body{
        padding: 0;
    }
}
@media screen and (max-width: 1720px) {
    .filter .fl{
        width: 155px;
        margin-left: 5px;
    }
    .fl:nth-child(0){
        margin-left: 0;
    }
    .select-check-search-wrap .select-check-search{
        width: 155px!important;
    }
}
</style>