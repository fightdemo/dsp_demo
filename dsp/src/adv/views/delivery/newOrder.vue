<template>
    <div class="new-order">
        <p class="page-title">{{edit ? '编辑订单': '添加订单'}}</p>
        <div class="order-content">
            <div style="background:#FFF;padding:30px;">
                <!-- 基本信息 -->
                <p class="title">
                    <i class="circle"></i>基本信息
                </p>
                <div class="form-box form">
                    <div class="form-group">
                        <label class="name">活动名称（必填）：</label>
                        <span class="el-wrap info">
                            <m-Select :disabled="edit" :idVal.sync="data.activityID" :list="activityList" keyName="activityID" valueName="name" :size="'bigmore'" :title="title" @change="selectActivity"></m-Select>
                        </span>
                    </div>
                    <div class="form-group">
                        <label class="name">订单名称（必填）：</label>
                        <span class="el-wrap info">
                            <m-Input placeholder="输入订单名称" size="big" :value.sync="data.name" :name="data.name" maxlength="30"></m-Input>                        
                        </span>
                        <span>{{data.name.length}}/30</span>
                    </div>
                    <div class="form-group">
                        <label class="name">出价类型（必填）：</label>
                        <!-- <span class="el-wrap info">
                            <m-Radio :isDisabled="edit" :value.sync="data.chargeMode" :list="chargeModeList" :size="'big'" :defaultVal="data.chargeMode"></m-Radio>
                        </span> -->
                        <span class="el-wrap info">
                            <m-Radio :isDisabled="edit" :value.sync="data.chargeMode" :list="[{'label': 'cpm', 'name': 'CPM'}]" :size="'big'" :defaultVal="data.chargeMode"></m-Radio>
                            <m-Radio v-if="hasCPC != 0 && orderType != 'deal'" :isDisabled="edit" :value.sync="data.chargeMode" :list="[{'label': 'cpc', 'name': 'CPC'}]" :size="'big'" :defaultVal="data.chargeMode" style="margin-left:50px;"></m-Radio>
                        </span>
                    </div>
                    <div class="form-group">
                        <label class="name">后续行为（必填）：</label>
                        <span class="el-wrap info">
                            <m-Radio :isDisabled="edit" :value.sync="data.interactionType" :list="interactionTypeList" :size="'big'" :defaultVal="data.interactionType"></m-Radio>
                        </span>
                    </div>
                    <div class="form-group" v-if="orderType=='deal'">
                        <label class="name">资源类型（必填）：</label>
                        <span class="el-wrap info">
                            <m-Radio :isDisabled="edit" :value.sync="data.type" :list="[{'label': 'pdb', 'name': 'PDB'},{'label': 'pd', 'name': 'PD'}]" :size="'big'" :defaultVal="data.type"></m-Radio>
                        </span>
                    </div>
                </div>
                <!-- 预算设置 -->
                <p class="title" v-if="orderType=='bid'">
                    <i class="circle"></i>预算设置
                </p>
                <div class="form-box form" v-if="orderType=='bid'">
                    <div class="form-group">
                        <label class="name">订单总预算（必填）：</label>
                        <span class="el-wrap">
                            <m-Input :value.sync="data.orderBudget" :name="data.orderBudget" placeholder="输入预算上限" size="middle" :disabled="limitBudget"></m-Input>
                            <m-Check type="circle-check" label="无预算限制" style="margin-left:11px;" :isCheck.sync="limitBudget"></m-Check>
                        </span>
                    </div>
                    <div class="form-group">
                        <label class="name">投放速率（必填）：</label>
                        <span class="el-wrap set">
                            <m-Radio :value.sync="data.controlMode" :list="controlModeList" :size="'big'" :defaultVal="data.controlMode"></m-Radio>
                        </span>
                        <span class="el-wrap set" v-if="data.controlMode =='0' ">
                            <m-Select :id.sync="data.speedUp" :list="speedUpList" :idVal="data.speedUp" :title="data.speedUp == '0' ? '匀速' : '加速'" style="float:left;" size="small"></m-Select>
                            <m-Input @change="Check($event,'投放速率')" :value.sync="data.limitPrice" :name="data.limitPrice" placeholder="输入金额..." size="small" style="float:left;margin-left:10px;"></m-Input><span class="word" style="margin:0 10px;">元</span>
                            <m-Select :id.sync="data.speedUnit" :list="speedUnitList" :idVal="data.speedUnit" :title="data.speedUnit == 'day' ? '天' : '小时'" style="float:left;" size="small"></m-Select>
                        </span>
                        <span class="el-wrap set" v-if="data.controlMode =='1' ">                       
                            <m-Input @change="Check($event,'投放速率')" :value.sync="data.limitView" :name="data.limitView" placeholder="" size="small" style="float:left;margin-left:10px;"></m-Input><span class="word" style="margin:0 10px;">千次/</span>
                            <m-Select :id.sync="data.speedUnit" :list="speedUnitList" :idVal="data.speedUnit" :title="data.speedUnit == 'day' ? '天' : '小时'" style="float:left;" size="small"></m-Select>
                        </span>
                    </div>
                    <div class="form-group">
                        <label class="name">频次限制（必填）：</label>
                        <span class="el-wrap set">
                            <m-Radio :value.sync="frequencyType" :list="frequencyList" :size="'big'" :defaultVal="frequencyType"></m-Radio>
                        </span>
                        <span class="el-wrap set" v-if="frequencyType == '1'">
                            <span class="word">对单用户展示</span>
                            <m-Input @change="Check($event,'展示量')" :value.sync="data.frequencyLimit" :name="data.frequencyLimit" placeholder="" size="small" style="float:left;margin-left:10px;"></m-Input><span class="word" style="margin:0 10px;">次广告</span>
                            <m-Select :id.sync="data.frequencyUnit" :list="speedUnitList" :idVal="data.frequencyUnit" :title="data.frequencyUnit == 'day' ? '天' : '小时'" style="float:left;" size="small"></m-Select>
                        </span>
                    </div>
                </div>
                <p class="title">
                    <i class="circle"></i>时间设置
                </p>
                <div class="form-box form">
                    <div class="form-group">
                        <label class="name">时间订单（必填）：</label>
                        <span class="el-wrap">
                            <el-date-picker 
                                v-model="data.startTime" 
                                :disabled="edit"
                                value-format="yyyy-MM-dd"        
                                type="date" 
                                placeholder="选择日期时间">
                            </el-date-picker>                            
                            <span class="separator" style="margin:0 11px;">至</span>
                            <el-date-picker 
                                v-model="endTime"                               
                                type="date"     
                                value-format="yyyy-MM-dd"                      
                                placeholder="选择日期时间"
                                @change="daySelect"
                                :disabled="dayLimit"
                            ></el-date-picker>
                            <m-Check type="circle-check" :isCheck.sync="dayLimit" label="不设置结束时间" style="margin-left:11px;"></m-Check>
                            <m-Check type="circle-check" :isCheck.sync="hoursLimit" label="不设置小时投放" style="margin-left:11px;"></m-Check>
                        </span>
                        <span class="el-wrap" style="margin-top:20px" v-show="!hoursLimit">
                            <hour-Select :value.sync="data.direct.deliverTimeIn" :backList="deliverTimeCheck"></hour-Select>
                        </span>
                    </div>
                </div> 
                <p class="title">
                    <i class="circle"></i>操作系统选择
                </p>  
                <div class="form-box form">
                    <div class="form-group">
                        <label class="name">操作系统（必填）：</label>
                        <span class="el-wrap" v-if="interactionType == '2'">
                            <span class="el-wrap set">
                                <m-Radio :value.sync="platform" :list="platformList2" :size="'big'" :defaultVal="platform" @change="changePlatform"></m-Radio>
                            </span>
                        </span>
                        <span class="el-wrap" v-if="interactionType == '4'">
                            <span class="el-wrap set">
                                <m-Check type="circle-check" :isCheck.sync="IOSCheck" label="IOS"></m-Check>
                                <m-Check type="circle-check" :isCheck.sync="AndroidCheck" label="Android" style="margin-left:50px;"></m-Check>
                            </span>
                        </span>
                    </div>
                    <div class="form-group" v-if="orderType=='bid'">
                        <label class="name">操作系统版本（必填）：</label>
                        <span class="el-wrap">
                            <span class="el-wrap set">
                                <m-Radio :value.sync="osVersion" :list="osVersionlist" :size="'big'" :defaultVal="osVersion"></m-Radio>
                            </span>
                        </span>
                        <span class="el-wrap" v-if="osVersion == 'custom'">
                            <Tree @change="isdirect($event,'osVersion')" :list="osVersionList" valueName="name" :defaultProps="{children:'sub',label:'name'}" :string.sync="directInfo.osVersion" :defaultCheck="osVersionCheck" :radioList="radioList" :defaultRadio="osvRadio"></Tree>
                        </span>
                    </div>
                </div>
                <p class="title" v-if="orderType == 'bid' && userInfo.adverType == '1' && data.chargeMode == 'cpm'">
                    <i class="circle"></i>流量来源
                </p>  
                <div class="form-box form" v-if="orderType == 'bid' && userInfo.adverType == '1' && data.chargeMode == 'cpm'">
                    <div class="form-group">
                        <label class="name">媒体选择（必填）：</label>
                        <span class="el-wrap sp" id="sp" style="position:relative;">
                            <span class="el-wrap set">
                                <m-Radio :value.sync="flowSource" :list="flowSourceList" :size="'big'" :defaultVal="flowSource" @change="selectApp"></m-Radio>
                            </span>                           
                        </span>
                        <span class="el-wrap" v-if="flowSource == '1'" key="all"></span>
                        <div>
                            <div class="custom" v-if="flowSource != '1'">
                                <m-Radio :value.sync="custom" :defaultVal="custom" :list="customList" :size="'big'" @change="handelCustom"></m-Radio>
                            </div>
                            <div v-if="flowSource == '2' && custom == '2'" key="siftApp">
                                <TreeCheck @change="isdirect($event,'spaceID')" 
                                    :string.sync="directInfo.spaceID" 
                                    :list="mediaTypeList"
                                    :defaultProps="{children:'child',label:'name'}" 
                                    valueName="name" 
                                    keyName = "ID"
                                    :radioList="radioList" 
                                    :defaultRadio="spaceRadio"
                                    :defaultCheck="spaceCheck['10']"
                                ></TreeCheck>
                            </div>
                            <div v-if="flowSource == '3' && custom == '2'" key="recommendApp">
                                <TreeCheck @change="isdirect($event,'spaceID')" 
                                    :string.sync="directInfo.spaceID" 
                                    :list="mediaTypeList" 
                                    :defaultProps="{children:'child',label:'name'}" 
                                    valueName="name" 
                                    keyName = "ID"
                                    :radioList="radioList" 
                                    :defaultRadio="spaceRadio"
                                    :defaultCheck="spaceCheck['11']"
                                ></TreeCheck>
                            </div> 
                            <div v-if="flowSource == '4' && custom == '2'" key="IncentiveVideo">
                                <TreeCheck :onlyAll="true" 
                                    @change="isdirect($event,'spaceID')" 
                                    :string.sync="directInfo.spaceID" 
                                    :list="mediaTypeList" 
                                    :defaultProps="{children:'child',label:'name'}" 
                                    valueName="name" 
                                    keyName = "ID"
                                    :radioList="radioList" 
                                    :defaultRadio="spaceRadio"
                                    :defaultCheck="spaceCheck['12']"
                                ></TreeCheck>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="title" v-if="orderType=='bid'">
                    <i class="circle"></i>地域定向
                </p>  
                <div class="form-box form" v-if="orderType=='bid'">
                    <div class="form-group">
                        <label class="name">选择地域（必填）：</label>
                        <span class="el-wrap">
                            <span class="el-wrap set">
                                <m-Radio :value.sync="locationType" :list="area" :size="'big'" :defaultVal="locationType"></m-Radio>
                            </span>
                        </span>

                        <span class="el-wrap" v-if="locationType == '1'" key="locationID">
                            <Tree-List :string.sync="cityID" :list="areaList" :value="cityID" subName="subLocation" idName="locationID"></Tree-List>
                        </span>
                        <span class="el-wrap" v-if="locationType == '2'" key="cityID">
                            <Tree-List :string.sync="locationID" :list="areaList" :value="locationID" subName="subLocation" idName="locationID"></Tree-List>
                        </span>    
                        <span class="el-wrap" v-if="locationType == '3'" key="location">
                            <baiduMap v-if="locationType == '3'" :lbsPosition="data.direct.lbsPosition" @getPosAndRadius='getPosRadius'></baiduMap>
                        </span>
                    </div>
                </div>
                <p class="title">
                    <i class="circle"></i>监测设置
                </p>  
                <div class="form-box form">
                    <div class="form-group">
                        <label class="name">选择监测站点：</label>
                        <span class="el-wrap">
                            <m-Select size="bigmore" :list="monitorList" :title="monitorSiteTitle" :idVal="data.monitorSite" valueName="name" @change="selectSite"></m-Select>
                        </span>
                    </div>
                    <div class="form-group" v-if="convertList.length > 0 || (data.monitorConvert != '0' && data.monitorConvert)">
                        <label class="name">选择转化点：</label>
                        <span class="el-wrap">
                            <m-Select-Check :string.sync="data.monitorConvert" :checkedID="monitorConvertID" size="bigmore" :list="convertList" title="多选转化点（最多三个）" valueName="name"></m-Select-Check>
                        </span>
                    </div>
                </div>
            </div>
            <el-collapse-transition>
                <div style="background:#FAFAFA;padding:30px;" v-show="hideSet && orderType=='bid'">                   
                    <p class="title" v-if="userInfo.advertiserID != '17197'">
                        <i class="circle"></i>兴趣标签
                    </p>
                    <div class="form-box form" v-if="userInfo.advertiserID != '17197'">
                        <div class="form-group">
                            <label class="name">选择兴趣标签（必填）：</label>
                            <span class="el-wrap">
                                <span class="el-wrap set">
                                    <m-Radio :value.sync="intersetType" :list="interest" :size="'big'" :defaultVal="defaultInterset"></m-Radio>
                                </span>
                            </span>
                            <span class="el-wrap interest-wrap" v-if="intersetType == '1'" key="interest">
                                <Interest v-if="hideSet" :value="data.direct.interestID" :string.sync="data.direct.interestID" :list="interestList" subName="child" idName="id" valueKey="id" nameKey="name"></Interest>
                            </span>                           
                        </div>
                    </div>
                    <p class="title">
                        <i class="circle"></i>人群库
                    </p>  
                    <div class="form-box form">
                        <div class="form-group">
                            <label class="name">选择人群库（必填）：</label>
                            <span class="el-wrap">
                                <span class="el-wrap set">
                                    <m-Radio :value.sync="personType" :list="throng" :size="'big'" :defaultVal="defaultPersonType"></m-Radio>
                                </span>
                            </span>
                            <span class="el-wrap throng-table-wrap" v-if="personType == '1'" key="advAudiences">
                                <ad-audiences v-if="hideSet" :tableList="advAudiencesList" :onlineEnum="onlineEnum" :string.sync="data.direct.depotIDs" :defaultCheck="defaultdepotIDs"></ad-audiences>
                            </span>
                            <span class="el-wrap throng-table-wrap" v-if="personType == '2'" key="crowdLibrary">
                                <throng-table v-if="hideSet" :tableList="crowdLibraryList" :onlineEnum="onlineEnum" :string.sync="data.direct.depotIDs" :defaultCheck="defaultdepotIDs"></throng-table>
                            </span>
                        </div>
                    </div>
                    <p class="title">
                        <i class="circle"></i>人群属性
                    </p>  
                    <div class="form-box form">
                        <div class="form-group">
                            <label class="name">性别（必填）：</label>
                            <span class="el-wrap">
                                <span class="el-wrap set">
                                    <m-Radio :value.sync="gender" :list="list" size="big" :defaultVal="gender"></m-Radio>
                                </span>
                            </span>
                            <span class="el-wrap sex" v-if="gender != 'all'">
                                <span class="el-wrap set">
                                    <m-Radio :value.sync="data.direct.genderIn" :list="sex2" size="big" :defaultVal="data.direct.genderIn ? data.direct.genderIn :'m' "></m-Radio>
                                </span>
                            </span>
                        </div>
                        <div class="form-group">
                            <label class="name">年龄（必填）：</label>
                            <span class="el-wrap">
                                <span class="el-wrap set">
                                    <m-Radio :value.sync="age" :list="list" size="big" :defaultVal="age"></m-Radio>
                                </span>
                            </span>
                            <span class="el-wrap age" v-if="age != 'all'">
                                <span class="el-wrap set">
                                    <m-checkbox :value.sync="data.direct.ageIn" keyName="label" :list="age2" :defaultVal="ageInString"></m-checkbox>
                                </span>
                            </span>
                        </div>
                        <div class="form-group">
                            <label class="name">收入水平（必填）：</label>
                            <span class="el-wrap">
                                <span class="el-wrap set">
                                    <m-Radio :value.sync="earning" :list="list" size="big" :defaultVal="earning"></m-Radio>
                                </span>
                            </span>
                            <span class="el-wrap income" v-if="earning != 'all'">
                                <span class="el-wrap set">
                                    <m-checkbox :value.sync="data.direct.earningIn" keyName="label" :list="custom2" :defaultVal="earningInString"></m-checkbox>
                                </span>
                            </span>
                        </div>                       
                    </div>
                    <p class="title" v-if="hasIP == 1">
                        <i class="circle"></i>IP
                    </p>
                    <div class="form-box form" v-if="hasIP == 1">
                        <div class="form-group">
                            <label class="name">IP定向：</label>
                            <span class="el-wrap">
                                <span class="el-wrap textarea">
                                    <el-input
                                        type="textarea"
                                        rows="5"
                                        placeholder="请输需要定向的ip,多个用','分割"
                                        resize="vertical"
                                        size="small"
                                        v-model="data.direct.ip">
                                    </el-input>
                                </span>
                            </span>                        
                        </div>
                    </div>
                    <p class="title">
                        <i class="circle"></i>用户设备选择
                    </p>  
                    <div class="form-box form">
                        <div class="form-group">
                            <label class="name">设备品牌（必填）：</label>
                            <span class="el-wrap">
                                <span class="el-wrap set">
                                    <m-Radio :value.sync="phoneBrand" :list="list" size="big" :defaultVal="phoneBrand"></m-Radio>
                                </span>
                            </span>
                            <span class="el-wrap" v-if="phoneBrand != 'all'">
                                <Tree @change="isdirect($event,'phoneBrand')" :string.sync="directInfo.phoneBrand" :list="telphoneList" valueName="alias" :defaultProps="{children:'sub',label:'alias'}" :defaultCheck="phoneBrandCheck" :radioList="radioList" :defaultRadio="phoneBrandRadio"></Tree>
                            </span>
                        </div>
                        <div class="form-group">
                            <label class="name">设备价格（必填）：</label>
                            <span class="el-wrap">
                                <span class="el-wrap set">
                                    <m-Radio :value.sync="devicePriceVal" :list="list" size="big" :defaultVal="devicePriceVal"></m-Radio>
                                </span>
                            </span>
                            <span class="el-wrap Eprice" v-if="devicePriceVal != 'all'">
                                <span class="el-wrap set">
                                    <m-checkbox :value.sync="data.direct.devicePrice" keyName="label" :list="devicePriceList2" :defaultVal="devicePriceString"></m-checkbox>
                                </span>
                            </span>
                        </div>
                    </div>
                    <p class="title">
                        <i class="circle"></i>上网场景
                    </p>  
                    <div class="form-box form">
                        <div class="form-group">
                            <label class="name">联网方式（必填）：</label>
                            <span class="el-wrap">
                                <span class="el-wrap set">
                                    <m-Radio :value.sync="net" :list="list" size="big" :defaultVal="net"></m-Radio>
                                </span>
                            </span>
                            <span class="el-wrap network" v-if="net != 'all'">
                                <span class="el-wrap set">
                                    <m-checkbox :value.sync="data.direct.net" keyName="label" :list="netList" :defaultVal="netString"></m-checkbox>
                                </span>
                            </span>
                        </div>
                        <div class="form-group">
                            <label class="name">运营商（必填）：</label>
                            <span class="el-wrap">
                                <span class="el-wrap set">
                                    <m-Radio :value.sync="ISP" :list="list" size="big" :defaultVal="ISP"></m-Radio>
                                </span>
                            </span>
                            <span class="el-wrap operator" v-if="ISP != 'all'">
                                <span class="el-wrap set">
                                    <m-checkbox :value.sync="data.direct.ISP" keyName="label" :list="ISPList" :defaultVal="ISPString"></m-checkbox>
                                </span>
                            </span>
                        </div>
                    </div>              
                </div>
            </el-collapse-transition>
            <div class="hide-set" @click="hideSet = !hideSet" v-if="orderType=='bid'">
                <span v-if="hideSet">隐藏高级设置</span>
                <span v-else>显示高级设置</span>
                <i class="icon" :class="{'active': hideSet}"></i>
            </div>
            <div style="background:#FFF;padding:30px;">
                <p class="title" v-if="orderType=='deal'">
                    <i class="circle"></i>选取合约资源
                </p>  
                <div class="form-box form" v-if="orderType=='deal' && dealPageType=='list'">
                    <div>
                        <select-Data @select="selectData" :all="true"></select-Data>                       
                    </div>
                    <div class="content cl" style="margin-top:20px;" ref="waterfallwrap">
                        <div class="content-title">
                            <label class="name">合约资源：</label>
                            <search class="content-title-filter" @search="search"></search>
                        </div>
                        <ul class="grid cl" v-for="(v, index) in newWaterfallData" :key="index" style="float:left;">
                            <li v-for="(item, index) in v" :key="index" class="grid-item" style="position:relative;">
                                <span @click="selectSku(item)" :class="{'icon_select': item.isSelect}"></span>
                                <div :class="{'border-select': item.isSelect}" class="grid-top">
                                    <h3 class="res-title"><span class="icon-os" :class="'icon-' + item.platform " style="vertical-align:middle;"></span>{{item.name}}</h3>
                                    <ul class="app-cover-list">
                                        <li v-if="(item.appDetail.length <= 4) || (item.appDetail.length > 4 && i < 3)">
                                            <ul>
                                                <li v-for="(app, i) in item.appDetail"
                                                    :key="i"                                            
                                                    :style="{'background-image':'url('+app.iconUrl+')'}">
                                                </li>
                                            </ul>
                                        </li>
                                        <li v-if="item.appDetail.length > 4">
                                            <a href="javascript:;">查看更多</a>
                                            <div class="app-more">
                                                <div v-for="(app, index) in item.appDetail" :key="index"  class="app-more-info">
                                                    <div class="app-more-cover" :style="{'background-image':'url('+app.iconUrl+')'}"></div>
                                                    <p class="app-more-name">{{app.name}}</p>
                                                    <p class="app-more-introduce">{{app.appType}}</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    <p class="app-name"><span v-for="(app,i) in item.appDetail" :key="i">{{i==0?"":"，"}}{{app.appName}}</span></p>
                                    <div class="line"></div>
                                    <div class="app-info">
                                        <p class="info-name">资源类型：</p>
                                        <p class="info-contant">{{item.chargeType|uppercase}}资源</p>
                                    </div>
                                    <div class="app-info">
                                        <p class="info-name">时间段(共计{{item.totalDay}}天)：</p>
                                        <p class="info-contant"><span v-if="item.date">{{item.date[0].startDate}}</span>—<span v-if="item.date">{{item.date[0].endDate}}</span></p>
                                    </div>
                                    <div class="app-info">
                                        <p class="info-name">单价：</p>
                                        <p class="info-contant" v-if="item.skuType == 'pdb'">保价保量：{{item.sellPrice}} 元/千次曝光</p>
                                        <p class="info-contant" v-if="item.skuType == 'pd'">保价不保量：{{item.sellPrice}} 元/千次曝光</p>
                                    </div>
                                    <div class="app-info">
                                        <p class="info-name">量级：</p>
                                        <p class="info-contant" v-if="item.chargeType == 'cpm'">{{item.amount}} 千次曝光/每天</p>
                                        <p class="info-contant" v-if="item.chargeType == 'cpc'">{{item.amount}} 千次点击/每天</p>
                                    </div>
                                    <div class="app-info last">
                                        <p class="info-name">广告位：</p>
                                        <p class="info-contant" v-for="(space, index) in item.spaceInfo" :key="index">{{space.appName}}-{{space.adxSpaceName}}</p>
                                    </div>
                                    <el-button class="btn-detail btn-white" @click="dealDetail(item.id, item.price)">查看资源详情</el-button>
                                </div>
                                <el-button class="btn-blue" @click="selectSku(item)">
                                    {{item.isSelect ? "此合约资源已被选中":"选择此合约资源"}}
                                </el-button>
                            </li>
                        </ul>
                        <div class="more-load" v-show="loadMoreDeal" @click="dealListMore()">
                            加载更多合约资源...
                        </div>
                    </div>
                </div>
                <div class="form-box form" v-if="orderType=='deal' && dealPageType=='detail'">
                    <div class="detail-page">
                        <div class="content bs main">
                            <div class="content-title" style="position: relative;">
                                <dspButton class="btn-back" @click="dealPageType = 'list'">返回</dspButton>
                                {{sku.name}}
                            </div>
                            <ul class="res-info cl">
                                <li>
                                    <p>资源平台：<span v-if="sku.platform">{{sku.platform|uppercase}}</span></p>
                                    <p v-if="sku.skuType == 'pdb'">保价保量单价：{{sku.sellPrice|number(2)}} 元/{{sku.chargeType=='cpm'?'千次曝光':'点击'}}</p>
                                    <p v-if="sku.skuType == 'pd'">保价不保量单价：{{sku.sellPrice|number(2)}}  元/{{sku.chargeType=='cpm'?'千次曝光':'点击'}}</p>
                                </li>
                                <li>
                                    <p>售卖类型：<span v-if="sku.chargeType">{{sku.chargeType|uppercase}}</span></p>
                                    <p>资源天量：{{sku.amount}} {{sku.chargeType == 'cpm'?'千次曝光':'点击'}}/每天</p>
                                </li>
                                <li>
                                    <p>时&nbsp;间&nbsp;段：<span v-if="sku.date">{{sku.date[0].startDate}}</span>-<span v-if="sku.date">{{sku.date[0].endDate}}</span>；共计{{sku.totalDay}}天</p>
                                </li>
                            </ul>

                            <ul class="space-list cl">
                                <li v-for="(space, index) in sku.spacesDetail" :key="index">
                                    <div class="space-title">广告位名称：{{space.spaceName}}</div>
                                    <div class="app-name">App名称：<span class="app-cover" :style="{'background-image':'url('+space.appIcon+')'}"></span>{{space.spaceName}}</div>
                                    <div class="space-cover" :style="{'background-image':'url('+ space.examplePic +')'}"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div style="background:#FFF;padding:30px;">
                <p class="title">
                    <i class="circle"></i>上传素材<span style="font-size:12px;">（点击已选模板上传素材）</span>
                </p>                
                <div style="position:relative;" class="tempBox" :class="{'off': !tempShow}">
                    <div class="form-box form material"  v-show="tempShow">
                        <!-- 模板列表 -->
                        <div class="form-group" v-if="tableScreen.length">
                            <label class="name">已选 插屏</label>
                            <span class="el-wrap info cl">
                                <div class="banner pic" v-for="(v,k) in tableScreen" :key="k" @click="selectTemplate(v,'3')" :title="v.name" :class="[v.active?'template-select':'']">
                                    <span style="display:  inline-block;height: 48px;">
                                        <span class="template-name">{{v.name}}</span>
                                        <i v-if="!v.active" class="icon"></i>
                                        <i v-if="v.active" class="selected"></i>
                                    </span>
                                    <i v-if="v.active" class="add" style="float:right;"></i>
                                </div>                                
                            </span>
                        </div>
                        <div class="form-group" v-if="banner.length">
                            <label class="name" >已选 banner</label>
                            <span class="el-wrap info cl">
                                <div class="banner pic" v-for="(v,k) in banner" :key="k" @click="selectTemplate(v,'1')" :title="v.name" :class="[v.active?'template-select':'']">
                                    <span style="display:  inline-block;height: 48px;">
                                        <span class="template-name">{{v.name}}</span>
                                        <i v-if="!v.active" class="icon"></i>
                                        <i v-if="v.active" class="selected"></i>
                                    </span>
                                    <i v-if="v.active" class="add" style="float:right;"></i>
                                </div>
                            </span>
                        </div>
                        <div class="form-group" v-if="coopen.length">
                            <label class="name">已选 开屏</label>
                            <span class="el-wrap info cl">
                                <div class="banner pic" v-for="(v,k) in coopen" :key="k" @click="selectTemplate(v,'2')" :title="v.name" :class="[v.active?'template-select':'']">
                                    <span style="display:  inline-block;height: 48px;">
                                        <span class="template-name">{{v.name}}</span>
                                        <i v-if="!v.active" class="icon"></i>
                                        <i v-if="v.active" class="selected"></i>
                                    </span>
                                    <i v-if="v.active" class="add" style="float:right;"></i>
                                </div>
                            </span>
                        </div>
                        <div class="form-group" v-if="native.length">
                            <label class="name">已选 原生</label>
                            <span class="el-wrap info cl">
                                <div class="banner pic" v-for="(v,k) in native" :key="k" @click="selectTemplate(v,'5')" :title="v.name" :class="[v.active?'template-select':'']">
                                    <span style="display:  inline-block;height: 48px;">
                                        <span class="template-name">{{v.name}}</span>
                                        <i v-if="!v.active" class="icon"></i>
                                        <i v-if="v.active" class="selected"></i>
                                    </span>
                                    <i v-if="v.active" class="add" style="float:right;"></i>
                                </div>
                            </span>
                        </div>
                        <div class="form-group" v-if="videoFilm.length">
                            <label class="name">已选 视频贴膜</label>
                            <span class="el-wrap info cl">
                                <div class="banner pic" v-for="(v,k) in videoFilm" :key="k" @click="selectTemplate(v,'4')" :title="v.name" :class="[v.active?'template-select':'']">
                                    <span style="display:  inline-block;height: 48px;">
                                        <span class="template-name">{{v.name}}</span>
                                        <i v-if="!v.active" class="icon"></i>
                                        <i v-if="v.active" class="selected"></i>
                                    </span>
                                    <i v-if="v.active" class="add" style="float:right;"></i>
                                </div>
                            </span>
                        </div>
                        <div class="form-group" v-if="incentiveVideo.length">
                            <label class="name">已选 激励视频</label>
                            <span class="el-wrap info cl">
                                <div class="banner pic" v-for="(v,k) in incentiveVideo" :key="k" @click="selectTemplate(v,'6')" :title="v.name" :class="[v.active?'template-select':'']">
                                    <span style="display:  inline-block;height: 48px;">
                                        <span class="template-name">{{v.name}}</span>
                                        <i v-if="!v.active" class="icon"></i>
                                        <i v-if="v.active" class="selected"></i>
                                    </span>
                                    <i v-if="v.active" class="add" style="float:right;"></i>
                                </div>
                            </span>
                        </div>
                    </div>  
                    <span class="template-slider" @click="tempShow=!tempShow"></span>
                </div>               
                <!-- 素材展示 -->            
                <div class="material-table table content">
                    <table class="table-box">
                        <thead>
                            <tr>
                                <th>素材预览</th>
                                <th>素材信息</th>
                                <th>素材内容</th>
                                <th v-if="interactionType == '2'">推广APP信息</th>
                                <th>监测地址</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(mItem,i) in creativeList" :key="i">
                                <!-- {{imgs[i]}} -->
                                <td>                                    
                                    <div style="display:flex;align-items:center;">                                        
                                        <el-tooltip v-if="nohas.indexOf(mItem.templateID) > -1" class="item" effect="light" placement="right">
                                            <div slot="content">此素材与模板不匹配</div>
                                            <span class="el-icon-warning" style="color:#FD5A60;float:left;margin-right:5px;"></span>
                                        </el-tooltip>  
                                        <div class="material-cover" v-if="mItem.hasVideo">
                                            <video :src="mItem.video" style="width:100%;height:100%;"></video>
                                            <div class="material-cover-mask" @click="showVideo(mItem.video)"></div>
                                        </div>                              
                                        <preview
                                            v-if="imgs[i].length"
                                            :imgs="imgs[i]"
                                        ></preview>
                                    </div>
                                </td>
                                <td>
                                    <p>素材ID：{{mItem.id}}</p><br>
                                    <p>素材名称：{{mItem.name}}</p><br>
                                    <p>广告位类型：{{mItem.adType | adTypes}}</p><br>
                                    <p>后续行为：{{mItem.interactionType | interactionTypes}}</p>
                                </td>
                                <td>
                                    <p v-if="img.image" v-for="(img,index) in mItem.material" :key="index">
                                        <span>{{`图片${index+1}(${img.image.width}x${img.image.height})`}}：{{img.image.url|imgName}}</span>
                                        <span></span><br><br>
                                    </p>
                                    <p v-if="img.video" v-for="(img,index) in mItem.material" :key="index">
                                        <span>视频：</span>
                                        <span>{{img.video.url}}</span><br><br>
                                    </p>
                                    <p v-if="img.text" v-for="(img,index) in mItem.material" :key="index">
                                        <span>{{`文字${index+1}`}}：</span>
                                        <span>{{img.text.content}}</span><br><br>
                                    </p>
                                    <p v-if="img.data" v-for="(img,index) in mItem.material"  :key="index">
                                        <span>{{dataType[img.data.type]}}：</span>
                                        <span>{{img.data.content}}</span><br><br>
                                    </p>
                                    <p>
                                       落地页：{{mItem.landingUrl}}
                                    </p>
                                </td>
                                <td v-if="interactionType == '2' && mItem.advApp">
                                    <p>App名称：{{mItem.advApp.name}}</p><br>
                                    <p>App icon：<img :src="mItem.advApp.iconURL" style="width: 20px;vertical-align:middle;"></p><br>

                                    <!-- <span v-if="data.platform == 'ios'">APPStore URL： {{mItem.advApp.marketUrl}}<br><br></span>

                                    <span v-if="data.platform == 'android'">APK包名： {{mItem.advApp.packageName}}<br><br></span>
                                    <span v-if="data.platform == 'android'">下载URL： {{mItem.advApp.downloadUrl}}<br><br></span> -->
                                    <p v-if="mItem.advApp.marketUrl">APPStore URL：{{mItem.advApp.marketUrl}}</p><br v-if="mItem.advApp.marketUrl">

                                    <p v-if="mItem.advApp.packageName">APK包名： {{mItem.advApp.packageName}}</p><br v-if="mItem.advApp.packageName">
                                    <p v-if="mItem.advApp.downloadUrl">下载URL： {{mItem.advApp.downloadUrl}}</p><br v-if="mItem.advApp.downloadUrl">
                                    <p>版本：{{mItem.advApp.version}}</p><br>
                                    <p>APP描述：{{mItem.advApp.description}}</p>
                                </td>
                                <td>
                                    <p>点击监测：{{(mItem.clickUrls||[]).join(',')}}</p><br>
                                    <p>曝光监测：{{(mItem.viewUrls||[]).join(',')}}</p>
                                </td>
                                <td style="padding-right:25px;">
                                    <dsp-Button type="primary" @click="creativeEdit(mItem, i)" :class="{'disabled': mItem.auditState == '2'}">编辑</dsp-Button>
                                    <dsp-Button type="danger" @click="deleteCreative(mItem,mItem.id, i)">删除</dsp-Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="title" v-if="data.type == 'rtb'">
                    <i class="circle"></i>出价设置
                </p> 
                <div class="form-box form">
                    <div class="form-group" v-if="data.type == 'rtb'">
                        <label class="name">订单出价（必填）：</label>
                        <span class="el-wrap">
                            <span class="el-wrap set">
                                <m-Input @change="Check($event,'出价')" :value.sync="data.bidPrice" :name="data.bidPrice" placeholder="输入金额" size="middle"></m-Input><span class="price">元</span>
                                <m-Check v-if="data.chargeMode == 'cpm'" type="circle-check" label="启用自动优化" :isCheck="data.isOptimized == '1'" @change="isOptimizedFn"></m-Check>
                                <el-tooltip v-if="data.chargeMode == 'cpm'" class="item" effect="light" placement="right">
                                    <div slot="content">启用此功能后，系统将自动优化您<br/>的出价；来帮助您尽量多的获取更<br/>多符合订单条件的流量。</div>
                                    <i class="icon"></i>
                                </el-tooltip>
                            </span>
                        </span>                        
                    </div>
                    <!-- <div class="form-group" v-if="accountType != '0' && isDirect != '1'">
                        <label class="name">利润设置：</label>
                        <span class="el-wrap">
                            <span class="el-wrap set">
                                <m-Radio :value.sync="profit" :list="[{'label':'0', 'name':'否'},{'label':'1', 'name':'是'}]" size="small" :defaultVal="profit"></m-Radio>      
                                <m-Input :disabled="profit == '0'" @change="Check($event,'利润')" :value.sync="data.profit" :name="data.profit" placeholder="" size="middle" style="margin-left:16px;"></m-Input><span class="price">%</span>                                                              
                            </span>
                        </span>                        
                    </div> -->
                </div>                
            </div>
            <div class="bottom">
                <el-button class="btn-cancel" @click="$router.push({name:'delivery.order'})">取消</el-button>
                <el-button v-if="edit" class="btn-ok" @click="createOrder(true)">完成编辑</el-button>
                <el-button v-if="!edit" class="btn-ok" @click="createOrder(false)">完成创建</el-button>
            </div>
        </div>
        <!-- 上传素材 -->
        <div class="creative-box" v-if="show">
            <div class="mask"></div>
            <div class="creative-main">
                <div class="creative-main-head">上传素材</div>
                <div class="form-box form">
                    <div class="form-group">
                        <label class="name">素材名称（必填）：</label>
                        <span class="el-wrap info">
                            <m-Input placeholder="素材名称" :value.sync="creativeData.name" :name="creativeData.name" size="big" maxlength="30"></m-Input>                        
                        </span>
                    </div>
                    <div class="form-group" v-if="modelList.length != 0 && (data.interactionType == '2' || data.interactionType == '4' || orderType == 'deal')">
                        <label class="name">落地页地址（必填）：</label>
                        <span class="el-wrap info">
                            <m-Input :value.sync="landing" :name="landing" placeholder="落地页地址" size="big"></m-Input>                        
                        </span>
                        <span class="el-wrap info">
                            <div>如设置了到达转化监测，请注意修改落地页地址<a style="margin-left: 10px;text-decoration: underline;" href="javascript:;" @click="visible=true">查看用例</a></div>
                        </span>
                    </div>
                    <div class="form-group" v-if="modelList.length != 0">
                        <label class="name">曝光监测：</label>
                        <span class="el-wrap info">
                            <m-Input :value.sync="viewUrls" :name="viewUrls" placeholder="曝光监测" size="big"></m-Input>                        
                        </span>
                    </div>
                    <div class="form-group" v-if="modelList.length != 0 && (data.interactionType == '2' || data.interactionType == '4' || orderType == 'deal')">
                        <label class="name">点击监测：</label>
                        <span class="el-wrap info">
                            <m-Input :value.sync="clickUrls" :name="clickUrls" placeholder="点击监测" size="big" ></m-Input>                        
                        </span>
                    </div>
                    <div id="container" style="display: none;">
                        <button id="btnImgUpload">上传</button>
                    </div>    
                    <div class="video_temp_box" style="display: none;">
                        <video class="video_temp" controls></video>
                    </div>   
                    <!-- {{currModel.material}}         -->
                    <div v-for="(m,n) in currModel.material" :key="n">
                        <!--图标-->
                        <div class="form-group" v-if="m.image && m.materialType == '1'">
                            <div>
                                <!-- 文案从 上传图标 改为 上传图片 -->
                                <label class="name">上传图片（必填）：</label>
                                <span class="el-wrap info">
                                    <!-- <input type="file" id="inpImgUpload" style="display:none;" ref="file" accept="image/*"/> -->
                                    <el-button class="btn-upload" ref="btnUpload" @click="upload(m.image, 'icon')">{{m.image.url? "替换物料" :"上传素材"}}</el-button> 
                                    <el-tooltip class="item" effect="light" placement="right">
                                        <div slot="content">图片尺寸{{m.image.width+"x"+m.image.height}}像素，<br/>图片大小{{m.image.size/1024}}k以内。</div>
                                        <i class="icon"></i>
                                    </el-tooltip>                                                 
                                </span>                                
                                <span class="el-wrap info upload" v-show="m.image.url && m.image.url != ''">
                                    <div class="image-wrap">
                                        <img :src="m.image.url" alt="">   
                                    </div>
                                    <i class="icon" v-if="m.image.url" @click="delPic(n, 'image')"></i>                  
                                </span>
                            </div>
                        </div>
                        <!--图片-->
                        <div class="form-group" v-if="m.image && m.materialType == '2'">
                            <div>
                                <label class="name">上传图片（必填）：</label>
                                <span class="el-wrap info">
                                    <!-- <input type="file" id="inpImgUpload" style="display:none;" ref="file" accept="image/*"/> -->
                                    <el-button class="btn-upload" @click="upload(m.image, 'img')" ref="btnUpload">{{m.image.url? "替换物料" :"上传素材"}}</el-button>                                                  
                                </span>
                                <span class="el-wrap info upload" v-show="m.image.url && m.image.url != ''">
                                    <div class="image-wrap">
                                        <img :src="m.image.url" alt="">   
                                    </div>
                                    <i class="icon" v-if="m.image.url" @click="delPic(n, 'image')"></i>                  
                                </span>
                                <el-tooltip class="item" effect="light" placement="right">
                                    <div slot="content">图片尺寸{{m.image.width+"x"+m.image.height}}像素，<br/>图片大小{{m.image.size/1024}}k以内。</div>
                                    <i class="icon"></i>
                                </el-tooltip>
                            </div>
                        </div>
                        <!--视频-->
                        <div class="form-group" v-if="m.video">
                                
                            <label class="name">上传视频（必填）：</label>
                            <span class="el-wrap info">
                                <!-- <input type="file" id="inpImgUpload" style="display:none;" ref="file" accept="image/*"/> -->
                                <el-button class="btn-upload" @click="upload(m.video, 'video')" ref="btnUpload">{{m.video.url? "替换物料" :"上传素材"}}</el-button>  
                                <el-tooltip class="item" effect="light" placement="right">
                                    <div slot="content">视频尺寸{{m.video.width+"x"+m.video.height}}像素，<br/>视频大小{{m.video.size/1024/1024}}mb以内。<br>投放视频广告时长{{m.video.minDuration}}秒-{{m.video.maxDuration}}秒<br>时长会对广告位售卖价格有一定影响。</div>
                                    <i class="icon"></i>
                                </el-tooltip>  
                            </span>
                            <span class="el-wrap info upload" v-show="m.video.url && m.video.url != ''">
                                <div class="image-wrap">
                                    <video :src="m.video.url"></video> 
                                </div>
                                <i class="icon" v-if="m.video.url" @click="delPic(n, 'video')"></i>
                            </span>
                        </div>
                        <!-- data-->
                        <div class="form-group" v-if="m.data">
                            <label class="name">{{dataType[m.data.type]}}：</label>
                            <span class="el-wrap info">
                                <m-Input :maxlength="m.data.length == 0 ? '':m.data.length" :value.sync="m.data.content" :name="m.data.content" placeholder="输入文字..." size="big"></m-Input>    
                            </span> 
                            <i style="margin-top: 12px; color: red; float:right;">字数不超过{{m.data.length == 0 ? '':m.data.length}}个</i>
                        </div>
                        <div class="form-group" v-if="m.text">
                            <label class="name">文本：</label>
                            <span class="el-wrap info">
                                <m-Input :maxlength="m.text.length || EmodelList.material[n].text.length||''" :value.sync="m.text.content" :name="m.text.content" placeholder="输入文字..." size="big"></m-Input>     
                                <!-- <m-Input :maxlength="m.text.length" :value.sync="m.text.content" :name="m.text.content" placeholder="输入文字..." size="big"></m-Input>      -->
                            </span>                            
                            <i style="margin-top: 12px; color: red; float:right;">字数不超过{{m.text.length || EmodelList.material[n].text.length || ''}}个</i>
                            <!-- <i style="margin-top: 12px; color: red; float:right;">字数不超过{{m.text.length}}个</i> -->
                        </div>
                    </div>
                    <!-- APP推广 -->
                    <div v-if="data.interactionType == '2' && appExtension.show">
                        <span class="line"></span>

                        <div v-if="app_num=='more'" class="form-group">
                            <label>选择推广APP：</label>                  
                        </div>
                        <div class="form-group">
                            <label class="name">App名称：</label>
                            <span class="el-wrap info">
                                <m-Input :value.sync="appExtension.data.name" :name="appExtension.data.name" size="big"></m-Input>  
                            </span>
                            <el-tooltip class="item" effect="light" placement="right">
                                <div slot="content">选择已有APP推广时，若信息有修改，<br/>将自动同步至其他素材</div>
                                <i class="icon"></i>
                            </el-tooltip>
                        </div>
                        <div class="form-group">
                            <label class="name">App icon：</label>
                            <span class="el-wrap info">
                                <el-button class="btn-upload" @click="upload({}, 'appIcon')" ref="btnUpload">上传</el-button> 
                            </span>
                            <span class="el-wrap info upload" v-show="appExtension.data.iconURL">
                                <div class="image-wrap">
                                    <img :src="appExtension.data.iconURL" alt="">   
                                </div>                 
                            </span>
                        </div>
                        <div v-if="data.platform == 'ios'"  class="form-group">
                            <label class="name">APPStore URL：</label>
                            <span class="el-wrap info">
                                <m-Input :value.sync="appExtension.data.marketUrl" :name="appExtension.data.marketUrl" size="big"></m-Input>  
                            </span>
                        </div>
                        <div v-if="data.platform == 'android'" class="form-group">
                            <label class="name">APK包名：</label>
                            <span class="el-wrap info">
                                <m-Input :value.sync="appExtension.data.packageName" :name="appExtension.data.packageName" size="big"></m-Input>  
                            </span>
                        </div>
                        <div v-if="data.platform == 'android'" class="form-group">
                            <label class="name">下载URL：</label>
                            <span class="el-wrap info">
                                <m-Input :value.sync="appExtension.data.downloadUrl" :name="appExtension.data.downloadUrl" size="big"></m-Input>  
                            </span>
                        </div>
                        <div class="form-group">
                            <label class="name">版本：</label>
                            <span class="el-wrap info">
                                <m-Input :value.sync="appExtension.data.version" :name="appExtension.data.version" size="big"></m-Input>  
                            </span>
                        </div>
                        <div class="form-group">
                            <label class="name">APP描述：</label>
                            <span class="el-wrap info">
                                <el-input
                                    type="textarea"
                                    rows="5"
                                    placeholder=""
                                    resize="none"
                                    size="small"
                                    v-model="appExtension.data.description">
                                </el-input>
                            </span>                            
                        </div>
                    </div>
                    <div class="extend" @click="elseMaterial = !elseMaterial">展开上传其他物料<i class="icon" :class="{'active': elseMaterial}"></i></div>  
                    <!-- 明星资质 -->
                    <el-collapse-transition>
                        <div class="form-group" v-if="elseMaterial">
                            <label class="name">明星授权：</label>
                            <span class="el-wrap info">
                                <!-- <input type="file" id="inpImgUpload" style="display:none;" ref="file" accept="image/*"/> -->
                                <el-button class="btn-upload" @click="upload({}, 'qua')" ref="btnUpload">上传资质</el-button>  
                                <el-tooltip class="item" effect="light" placement="right">
                                    <div slot="content">如果您的素材中出现了明星的人物形象或明星的名字，<br/>请您提供相关明星的授权资质，以便于进行审核及投放，<br/>避免出现进行无法投放的情况。</div>
                                    <i class="icon"></i>
                                </el-tooltip>                                                
                            </span>
                            <span class="el-wrap info upload" v-for="(qua,index) in currModel.qualifications" :key="index">
                                <div class="image-wrap" v-if="qua.url">
                                    <img :src="qua.url" alt="">   
                                </div>
                                <i class="icon" v-if="qua.url" @click="delPic(index, 'qua')"></i>                  
                            </span>
                        </div>
                    </el-collapse-transition>
                    
                    <!-- 弹层 -->
                    <loading-PageInfo :visible.sync="visible" :append-to-body="true"></loading-PageInfo>
                </div>                
                <div class="bottom">
                    <el-button @click="show=false;elseMaterial=false;" class="btn-cancel">取消</el-button>
                    <el-button @click="addCreative(edit)" class="btn-ok">完成上传</el-button>
                </div>
            </div>
        </div>             
        <!-- 视频预览 -->
        <div class="video-box">
            <video :src="videoSrc" controls></video>
        </div>
        <!-- 视频弹窗 -->
        <el-dialog 
            :visible.sync="dialogVisibleVideo"
            width="600px"
            class="iframe-box"
        >
            <video :src="videoSrc" controls></video>
        </el-dialog>         
    </div>
</template>

<script>
var creativeData = {
    name: "",
    templateID: "",
    interactionType: "",
    material: [{
        seqId: "",
        materialType: "",
        image: {
            width: "",
            height: "",
            type: "",
            url: "",
            size: "",
            md5: "",
            mime: ""
        }
    }],
    landingUrl: "",
    viewUrls: "",
    clickUrls: "",
    adType: "",
    creativeType: "",
    industry: "",
    qualifications: []
};
var buySkuInfo = {
    "adxDealIDs": [],
    "adxIDs": [],
    "adxSpaceIDs": []
};
var isDirect,type,agencyID,id;
import Data from 'adv@/views/delivery/data'
import {
    adTypes,
    interactionTypes,
    dataTypes,
    auditState,
    uppercase
} from "@/common/js/filter";
import Preview from "@/common/components/preview";
import { baseURL2 } from "@/common/js/config";
import { getNowFormatDate } from "@/common/js/utils";
import fileUpload from '@/common/js/fileUpload'
import hourSelect from '@/common/components/hours-select'
import Tree from '@/common/components/tree'
import TreeCheck from '@/common/components/tree-check'
import TreeList from '@/common/components/tree-list'
import Interest from '@/common/components/interestBox'
import ThrongTable from '@/common/components/throng-table'
import AdAudiences from '@/common/components/Ad-audiences'
import mCheckbox from '@/common/components/checkBox'
import Media from '@/common/components/media-component'
import mSelectCheck from '@/common/components/select-check'
import Packet from '@/common/components/packet'
import Crowd from '@/common/components/crowd'
import loadingPageInfo from '@/common/components/loadingPageInfo'
import baiduMap from 'adv@/components/baiduMap'
export default {
    filters: {
        adTypes,
        interactionTypes,
        dataTypes,
        auditState,
        uppercase,
        imgName(val) {
            if(!val) return ""
            var arr = val.split('/');
            return arr[arr.length-1]
        }
    },
    components: {
        hourSelect,
        Tree,
        TreeCheck,
        TreeList,
        Interest,
        ThrongTable,
        AdAudiences,
        mCheckbox, 
        Media, 
        mSelectCheck, 
        Packet, 
        Crowd,
        loadingPageInfo,
        Preview,
        baiduMap
    },
    data() {
        return Object.assign(Data.data(),{
            isOK: false,
            supportsArr: [],
            videoSrc: '',
            dialogVisibleVideo: false,
            screenWidth: document.body.clientWidth, //窗口宽度
            newWaterfallData: '', //实现瀑布流数据
            selectSiteT: 1,     //监测站点变化+1
            platformT: 1,       //操作系统变化+1    
            directInfo:{
                sdkSpace: '',   //sdk私有化
                appType: '',    //媒体类型
                spaceID: '',    //广告位 
                osVersion: '',  //操作系统版本
                phoneBrand: '', //设备品牌
            },
            isDirect: '',    //判断是否直客
            accountType: '', //判断是否是广告主登录
            hasCPC: '',      //显示或者隐藏CPC出价
            hasPrivate: '',  //控制私有流量
            // flowSourceList: [], //流量来源list
            skuList: [],     //合约资源
            skufilter: {        //合约资源过滤条件
                self: "0",
                executeState: "10, 20",
                orderID: this.$route.query.orderId
            },     
            loadMoreDeal: false, //更多合约资源  
            countPage: 0,      //   
            dealPageType: 'list', //展示合约/合约详情 list合约 detail合约详情
            dealPage: 1,       //控制加载 
            sku:{},            //合约详情       
            pageObj: {
                currentPage: 1,
                size: 20,
                total: 0
            },
            tempShow: true,  //是否展示素材模板
            app_num: "one",
            materialList: [],
            creativeList: [],  //素材
            appExtension: {    //app信息
                show:false,
                data: {
                    name: "",
                    iconURL: "",
                    marketUrl: "",
                    packageName: "",
                    downloadUrl: "",
                    version: "",
                    description: ""
                }    
            },
            orderType: "",     //订单类型
            active: [],//      //活动 
            title: "请选择活动",
            monitorSiteTitle: "单选监测站点",
            endTime: "",
            dayLimit: true,
            hoursLimit: true,
            activityList: [],    //活动列表
            activityID: '',      //活动ID
            name: '',            //订单名称
            chargeMode: 'cpm',   //计费方式cpm cpc 
            // interactionType: '1',//后续行为1仅展示，2应用下载，4跳转网页
            limitBudget: true,   //预算限制
            orderBudget: '0',    //0表示无预算
            controlMode: '2',    //速率0花费，1展示，2系统默认   
            speedUp: '',         //是否加速0匀速，1加速
            speedUnit: '',       //加速单位 day/hour
            limitPrice: '',      //加速价格
            limitView: '',       //展示量控制  千次
            frequencyType: '0',  //频次 
            frequencyUnit: '',   //day/hour
            frequency: '',       //
            IOSCheck: true,     //跳转网页时 ios是否选中
            AndroidCheck: true, //跳转网页时 android是否选中
            platform: 'ios',     //操作系统   
            osVersion: 'all',    //操作系统版本 
            osVersionIn: '',     //操作系统版本 
            osVersionoUT: '',    //操作系统版本排除 
            android: [],
            ios: [],
           
            osVersionList: [],   //操作系统版本列
            flowSource: '1',     //流量来源
            locationType: 'all',   //地理位置
            userLocationIn:'',     //
            monitorConvert: '',    //监测转化点
            monitorConvertID: "",  
            cityID: '',            //城市id
            locationID: '',        //省市id
            interestList: [],      //兴趣标签
            crowdLibrary: '1',     //人群库
            crowdLibraryList: [],  //
            advAudiencesList: [],  //广告受众
            gender: 'all',          //性别 
            age: 'all',             //年龄   
            earning: 'all',         //收入水平
            textarea: '',           //ip定向 
            phoneBrand: 'all',      //设备品牌
            telphoneList: [],
            telphoneAndroid: [],
            telphoneIos: [],
            devicePriceVal: 'all',     //设备价格
            net: 'all',             //联网方式
            ISP: 'all',             //运营商
            hideSet: false,       //高级设置
            show: false,         //创意层  
            elseMaterial: false, //其他物料         
            cityList: [],
            locationList: [],  
            landing: "",
            viewUrls: "",
            clickUrls: "",
            creativeData: creativeData,  
            currModel:{},
            industry: '', //行业包
            crowd: '',    //人群包
            spaceID: '',  //广告位id
            notspaceID: '', //
            adxAppID: '', //媒体id
            adxAppType: '', //媒体分类id
            adxNotAppType: '',
            personType: '0', //受众类型
            intersetType: '0', //兴趣标签
            defaultPersonType: '0', //默认受众类型
            defaultInterset: '0', //默认兴趣标签
            data: {
                "id": this.edit ? this.$route.query.orderId : "",
                "orgID": "",
                "advertiserID": this.$route.params.advID,
                "activityID": "",
                "name": "",
                "creativeID": [],
                "orderBudget": "",
                "frequencyLimit": "",
                "frequencyUnit": "day",
                "limitView": "",
                "type": this.$route.query.oType == '1'?'rtb':'pdb',
                "controlMode": "2",
                "speedUnit": "day",
                "limitPrice": "",
                "speedUp": "1",
                "platform": "ios",
                "interactionType": "4",
                "monitorSite": "",
                "monitorConvert": "",
                "startTime": getNowFormatDate(),
                "endTime": "",
                "direct": {
                    "locationType": "0",
                    "phoneBrandIn": "",//手机品牌型号
                    "phoneBrandOut": "",
                    "holiday": "",//0不限，1排除节假日，2只投节假日
                    "deliverTimeIn": "",//投放时间区间
                    "deliverTimeOut": "",
                    "genderIn": "",//性别定向 m男 f女
                    "genderOut": "",
                    "earningIn": "",//收入定向
                    "earningOut": "",
                    "tagIn":"",//自定义标签组合
                    "tagOut":"",
                    "sourceIn":"",//来源定向
                    "sourceOut":"",
                    "sdkSpaceIn": "", //sdk私有化
                    "sdkSpaceOut": "",
                    "ageIn":"",//年龄定向
                    "ageOut":"",
                    "userLocationIn": "",//地理位置
                    "userLocationOut": "",
                    "osVersionIn": "", //系统版本
                    "osVersionOut": "",
                    "ISP": "",//运营商标识1移动，2联通，3电信，4其他
                    "net": "",//联网方式1:wifi，2:2G，3:3G，4:4G，5:5G，6:其他
                    "forbidAdver": "",//被屏蔽的广告主名称
                    "forbidIndustry": "",//屏蔽的行业ID
                    "spaceIDIn": '',//广告位定向
                    "spaceIDOut": "",
                    "devices": "",//设备类型
                    "devicePrice": "",//设备价格区间
                    "optimizeApp": "",//精选媒体
                    "newApp": "",//新进媒体
                    "pkgID": "",//人群包
                    "pkgType": "",//行业包
                    "personType": "0",//1广告受众人群，2人群ID
                    "depotType": "",//MAC IDFA IMEI
                    "depotIDs": "",//受众ID
                    "ip": '',
                    "interestID": "",//兴趣标签id,
                    "lbsPosition": [],//地理位置LBS
                    "mediaType": "0", //流量来源 默认全网优化效果类为13正企类为0
                },
                "profit": "",
                "bidPrice": "",
                "isOptimized": "1",
                "chargeMode": "cpm",
                "SKU": []
            },    
            areaList: [],    //地域位置
            deliverTimeCheck: [],
            osVersionCheck: [],
            phoneBrandCheck: [],
            sdkSpaceCheck: [],
            spaceCheck: {
                "0": [],
                "10": [],
                "11": [],
                "12": []
            },
            beforeSpaceCheck: {
                "0": [],
                "10": [],
                "11": [],
                "12": []
            },
            optimizeAppCheck: [],
            newMediaCheck: [],
            publishConfigCheck: [],
            interestIDCheck: [],  //兴趣标签回填值
            defaultdepotIDs: '',
            ageInString: '',
            earningInString: '',
            phoneBrandInString: '',
            devicePriceString: '',
            netString: '',
            ISPString: '',         
            monitorList: [],       //监测
            convertList: [],       //转化点 
            publishConfig: [],     //全网
            sdkSpaceList: [], //私有化交易
            mediaTypeList: [],     //媒体分类
            mediaConfig: [],        //精选媒体
            spaceTree: [],         //广告位 
            newMediaConfig: [],   //新媒体
            industryPkgList: [], //行业包 
            crowdPkgList: [],    //人群包 
            tableScreen: [],    //插屏
            native: [],         //原生
            coopen: [],         //开屏
            banner: [],         //banner
            videoFilm: [],      //视频贴膜
            incentiveVideo: [], //激励视频
            templateLength: [], //模板列表 
            modelList: [],      //模板列表 
            isEdit: false,      //是否为编辑
            EmodelList: [],     //编辑时模板信息
            creativeID: '',     //编辑时对应的素材id
            templateID: '',     //编辑时对应的模板id
            currModelIndex: '', //编辑时对应的创意索引
            cannot: true,      //创意是否匹配模板
            nohas: [],         //不匹配的创意id 
            hasIP: '',    //ip定向
            cpcMax: '',
            cpmMax: '',
            premiumMax: '', //最大溢价
            bidMax: '', //最大出价
            profit: '', //利润设置
            estimate: '',
            currEstimate: '',
            visible: false,     //弹层
            currUpload: {},     //当前上传信息
            currUploadType: "", //当前上传类型
            imgs: [],
            checkTemplate: [],  //已选择的模板id
            directList: ['appType','sdkSpace','spaceID'],
            osvRadio: "1",
            phoneBrandRadio: "1",
            spaceRadio: "1",
            custom: "1",
            sdkRadio: '1', //定向或排除radio默认值
            appTypeRadio: '1',
            delIndex: '',
        })
    },
    watch: {
        //监听窗口宽度变化调整瀑布流展示列数
        screenWidth(val) {
            this.waterfall()
        },
        platform(newVal,oldVal) {         
            if(newVal == oldVal) return;            
            // this.getPrivatization();  //sdk
            // this.getSpace();          //指定
            // this.getMedia();          //媒体
            // this.getNewMeida();       //新品媒体
            // this.industryList();      //行业 
            // this.crowdList();         //人群  
            this.getMediaList(); 
            this.getskuList()         //sku资源  
            this.data.platform = this.platform;
            if(this.platform == 'ios') {
                this.osVersionList = this.ios;
                this.telphoneList = this.telphoneIos
            }else if(this.platform == 'android') {
                this.osVersionList = this.android;
                this.telphoneList = this.telphoneAndroid
            }else {
                this.telphoneList = [];
                this.osVersionList = this.all;
            }
            this.getTemplate();
        },
        interactionType(newVal,oldVal) {
            if(newVal == oldVal) return;
            // this.creativeList = []
            if(this.edit) return;
            if(newVal == '2') {
                this.platform = 'ios'
            }else if(newVal == '4'){
                if(this.IOSCheck && this.AndroidCheck) {
                    this.platform = 'all';
                }         
            }
            this.getTemplate()
            // this.getPrivatization()
        },
        // flowSource(newVal) {
        //     this.data.direct.pkgID = '';
        //     this.data.direct.pkgType = '0';
        //     // this.data.direct.sdkSpaceIn = '';
        //     // this.data.direct.sdkSpaceOut = '';
        //     // this.data.direct.appTypeIn = '';
        //     // this.data.direct.appTypeOut = '';
        //     // this.data.direct.optimizeApp = '';
        //     // this.data.direct.newApp = '';
        //     // this.data.direct.spaceIDIn = '';
        //     // this.data.direct.spaceIDOut = '';
        //     if(newVal == '1') {
        //         this.adxAppType = '';
        //         this.adxNotAppType = '';
        //         this.spaceID = '';
        //         this.notspaceID = '';
        //         this.adxAppID = '';                
        //         this.getTemplate()
        //     }
        // },
        'data.type'(val) {
            this.skufilter.skuType = val;
            this.getskuList();
        },
        IOSCheck(val) {
            if(val) {
                if(this.AndroidCheck) {
                    this.platform = 'all'
                }else {
                    this.platform = 'ios'
                }
            }else {
                if(this.AndroidCheck) {
                    this.platform = 'android'
                }else {
                    this.platform = 'all'
                }
            }
        },
        AndroidCheck(val) {
            if(val) {
                if(this.IOSCheck) {
                    this.platform = 'all'
                }else {
                    this.platform = 'android'
                }
            }else {
                if(this.IOSCheck) {
                    this.platform = 'ios'
                }else {
                    this.platform = 'all'
                }
            }
        },
        locationType() {            
            if(this.locationType == '1') {
                this.areaList = this.cityList;
            }else if(this.locationType == '2') {
                this.areaList = this.locationList;
            }else if(this.locationType == '3'){

            }else{
                this.locationType = "all"
                this.areaList = "";
            }
            if(this.areaList.length) {
                this.areaList.forEach(item => {
                    item.locationID = item.id
                })
            }; 
            this.data.direct.locationType = this.locationType == 'all' ? '0' : this.locationType;          
        },
        show(val) {
            if(!val) {
                this.clickUrls = '';
                this.viewUrls = '';
                this.landing = '';
                this.creativeData.name = '';
                this.appExtension = {  
                    show:false,
                    data: {
                        name: "",
                        iconURL: "",
                        marketUrl: "",
                        packageName: "",
                        downloadUrl: "",
                        version: "",
                        description: ""
                    }    
                },
                this.creativeData = {
                    name: "",
                    templateID: "",
                    interactionType: "",
                    material: [{
                        seqId: "",
                        materialType: "",
                        image: {
                            width: "",
                            height: "",
                            type: "",
                            url: "",
                            size: "",
                            md5: "",
                            mime: ""
                        }
                    }],
                    landingUrl: "",
                    viewUrls: "",
                    clickUrls: "",
                    adType: "",
                    creativeType: "",
                    industry: "",
                    qualifications: []
                };                
            }else {
                this.$nextTick(this.uploadFn)
            }
        },
        //时间限制
        dayLimit() {
            if(this.dayLimit) {
                this.endTime = "";
                this.data.endTime = "NULL"
            }
        },
        currModel(val) {
            this.currModel = val        
        },
        creativeList(val) {
            this.creativeList = val;
        },
        //监测模板变化
        modelList(val) {
            this.checkModel(val)
        },
        'data.chargeMode'(val) {
            if(val == 'cpc') {
                this.flowSource = "1";
                this.data.direct.mediaType = "0";
                this.data.direct.pkgType = "0";
                this.data.direct.pkgID = "";
                this.data.direct.spaceIDIn = "";
                this.data.direct.spaceIDOut = "";
                this.data.direct.optimizeApp = "";
                this.data.direct.sdkSpaceIn = "";
                this.data.direct.sdkSpaceOut = "";
                this.data.direct.newApp = "";
                this.data.direct.sourceIn = "1";
            }
        }
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                that.screenWidth = window.screenWidth
            })()
        }      

        var parm = window.location.href.match(/\/(\d+)\/(\d+)\//)
        type = parm[1];
        id = parm[2];        
        agencyID = localStorage["advOrgID"+id];
        isDirect = localStorage["agentIsDirect"+agencyID];
        this.accountType = type;
        this.isDirect = isDirect;

        //判断交易类型
        if (this.$route.query.oType == '1') {
            this.orderType = 'bid';
        } else {
            this.orderType = 'deal';
            this.data.SKU = [];
        }

        if(this.$route.query.oType == '2') {
            this.getskuList()
        }    

        if(this.$route.query.activeId != '') {
            var option = {
                activityID: this.$route.query.activeId
            }
            this.selectActivity(option)
        }

        // 判断是否有溢价设置
        if(this.accountType != '0' && this.isDirect != '1') {
            this.getPremiumMax();
        }

        //是否有IP定向
        this.hasIPFn()

        //获取数据
        this.$ajax.all([
            this.getPrivatization(),
            this.getLocation("location"),
            this.getLocation("cityLevel"),
            this.getAdAudiences(),
            this.getOwner(),
            this.getActivity(),
            this.getosVersion(),
            this.getPublish(),
            // this.getSpace(),
            // this.getMedia(),
            // this.getNewMeida(),
            // this.getPublishMeidaType(),
            // this.industryList(),
            // this.crowdList(),
            this.getMonitor(),
            this.getBrand(),            
            this.getPriceMax(),
            this.hasCPCFn(),
            // this.hasPrivateFn(),
            this.getInterset()
        ]).then(this.order)
        if(this.$route.query.orderId != '') {

        }else {
            this.getTemplate();
        }   
        
    },
    computed: {
        edit() {
            return this.$route.query.orderId != ''
        },
        interactionType() {
            return this.data.interactionType
        },
        userInfo() {
            return this.$store.state.common.userInfo;
        },
    },
    methods: {
        //获取lbs地理位置
        getPosRadius(position) {
                var data= [{
                    pos: position[0]+','+position[1],
                    radius: position[2]+""
                }]
            this.$ajax({
                url: '/dsp/order/location/code',
                data: {
                    data: data
                },
                load: true
            }).then( res =>{
                var data = res.data
                if( data && data[0].location ) {
                    var position = [];
                    position.push( data[0].position )
                    this.data.direct.lbsPosition = position;
                    this.data.direct.userLocationIn = data[0].location
                }else{
                    this.$message.error("选择位置失败，请重新选择")
                }
            } )
        },
        changePlatform(val) {
            this.platform = val;
            //清空上一次选择
            // this.sdkSpaceCheck = [];
            // this.spaceCheck = [];
            // this.optimizeAppCheck = [];
            // this.newMediaCheck = [];
            // this.industry = '';
            // this.crowd = '';
            // this.data.direct.appTypeIn = "";
            // this.data.direct.appTypeOut = "";
            // this.data.direct.optimizeApp = "";
            // this.data.direct.newApp = "";
            this.data.direct.spaceIDIn = "";
            this.data.direct.spaceIDOut = "";
            // this.data.direct.sdkSpaceIn = "";
            // this.data.direct.sdkSpaceOut = "";
            this.getTemplate();
        },
        //checkPlatform
        checkPlatform() {
            if(this.interactionType == '4') {
                if(this.IOSCheck && this.AndroidCheck) {
                    this.platform = 'all'
                }else {
                    if(this.IOSCheck) {
                        this.platform = 'ios'
                    }
                    if(this.AndroidCheck) {
                        this.platform = 'android'
                    }
                }
            }
        },
        //定向/排除
        isdirect($event,val) {
            this.checkPlatform()
            if(this.directList.indexOf(val) > -1 ) {
                this.directList.forEach(item => {
                    this.data.direct[item+'In'] = '';
                    this.data.direct[item+'Out'] = '';
                })
            }
            if(val == 'sdkSpace' || val == 'spaceID') {                
                this.adxAppID = "";
                this.adxAppType = "";
                this.adxNotAppType = "";
                //$event.direct == '1'  为定向 2为排除
                if($event.direct == '1') {
                    this.spaceID = $event.checkList
                    this.notspaceID = ""
                }else {
                    this.notspaceID = $event.checkList
                    this.spaceID = ""
                }
                this.getTemplate()
            }
    
            if(val == 'appType') {
                this.adxAppID = "";
                this.spaceID = "";
                this.notspaceID = "";
                if($event.direct == '1') {
                    this.adxAppType = $event.checkList
                    this.adxNotAppType = "";
                }else {
                    this.adxNotAppType = $event.checkList
                    this.adxAppType = "";
                }
                this.getTemplate()
            }
            if($event.direct == '1') {
                this.data.direct[val+'In'] = $event.checkList;
                this.data.direct[val+'Out'] = '';
            }else {
                this.data.direct[val+'In'] = '';
                this.data.direct[val+'Out'] = $event.checkList;
            }

        },
        //获取id并请求模板
        getAppID(val) {
            this.adxAppType = "";
            this.adxNotAppType = "";
            this.notspaceID = "";
            if(val instanceof  Object) {                
                this.adxAppID = val.adxAppID;
                this.spaceID = val.dspSpaceID;
            }else {
                this.spaceID = val;
            }
            this.getTemplate()
        },
        //获取合约资源
        getskuList() {
            this.skufilter.outIn = this.skuIds;
            this.skufilter.chargeType = this.data.chargeMode;
            this.skufilter.platform = this.platform == 'all' ? 'ios,android' : this.platform;
            this.skufilter.skuType = this.data.type;
            this.$ajax({
                url: '/dsp/sku/show/list',
                data: {
                    filter: this.skufilter,
                    page: this.pageObj.currentPage + "",
                    size: this.pageObj.size + "",
                    sort: ["cTime,1"],
                },
                load: true
            }).then(res => {
                if(res.data.data != null) {

                    this.countPage = Math.ceil(res.data.total/10);
                    if (this.countPage > this.dealPage) {
                        this.loadMoreDeal = true;
                    }    

                    var tempArr = res.data.data || [];
                    tempArr.forEach(function(sku){
                        var appInfo = {};
                        var temp = [];
                        sku.appDetail = sku.appDetail || [];
                        sku.appDetail.forEach(function(space){
                            var app = appInfo[space.appID];
                            if(!app) {
                                appInfo[space.appID] = space;
                                temp.push({
                                    appName: space.appName,
                                    iconUrl: space.iconUrl,
                                    appType: space.appType
                                })
                            }
                        })
                        sku.appDetail = temp;
                    })

                    if (this.pageObj.currentPage > 1) {
                        this.skuList = this.skuList.concat(tempArr);
                    } else {
                        this.skuList = tempArr;
                    }

                    this.skuList.forEach(item => {
                        if(item.usedDate) {
                            this.$set(item, 'isSelect', true)
                        }else {
                            this.$set(item, 'isSelect', false)
                        }
                    }) 
                    this.waterfall()
                }
            })
        },
        //选择合约资源
        selectSku (item) {
            // this.$set(this.data, 'SKU', [])
            if (!item.usedDate) {
                item.isSelect = !item.isSelect;
                if (item.isSelect) {                   
                    this.data.SKU.push(item);
                    item.skuIndex = this.data.SKU.length - 1;
                } else {
                    this.data.SKU.splice(item.skuIndex, 1);
                }
                var arr = [];
                if(this.data.SKU.length) {
                    this.data.SKU.forEach(item => {
                        item.spaceInfo.forEach(v => {
                            if(v.spaceID) {
                                arr.push(v.spaceID)
                            }
                        })                    
                    })
                    this.spaceID = arr.join(',')               
                }else {
                    this.spaceID = ''
                }
                this.getTemplate()
            } else {
                this.$message.error("此合约资源无法改变状态。")
            }            
        },
        //加载更多合约资源
        dealListMore () {
            if (this.countPage > this.dealPage) {
                this.dealPage++;
                this.loadMoreDeal = false;
            }
            this.skuList();
        },
        //实现瀑布流
        waterfall() {
            //根据父级宽度来确定显示N列   360为li的宽度
            if(!this.$refs.waterfallwrap) return;
            var length = Math.floor(this.$refs.waterfallwrap.clientWidth/360),
                arr = [];
            length = length > 0 ? length : 1;   
            for(var i = 0; i < length; i++) {
                arr[i] = []
            }
            let [...waterfallData] = this.skuList
            let [...newWaterfallData]= arr 
            //取余，余数为0的加入第一列，以此类推，形成一个新数组
            waterfallData.forEach((v,k) => {
                switch(k % length) {
                    case 0 : newWaterfallData[0].push(v)
                    break
                    case 1: newWaterfallData[1].push(v)
                    break
                    case 2: newWaterfallData[2].push(v)
                    break
                    case 3: newWaterfallData[3].push(v)
                    break
                }
            })
            this.newWaterfallData = newWaterfallData
        },
        //查看合约详情
        dealDetail (id, price) {
            this.dealPageType = "detail";
            this.getInfo(id, price);
        },
        //获取sku详情
        getInfo(id, price){
            var data = {
                'skuID': id
            };
            this.$ajax({
                url: '/dsp/sku',
                data: data,
                load: true
            }).then(res => {
                this.sku = res.data;
                if (price) {
                    this.sku.price = price;
                }                        
            })
        },
        //过滤合约资源，时间
        selectData(val) {
            this.skufilter.startDate = val.start;
            this.skufilter.endDate = val.end;
            this.getskuList()
        },
        //过滤合约资源，名称
        search(val) {
            this.skufilter.name = val;
            this.getskuList()
        },
        //获取订单信息
        order() {
            if(this.$route.query.orderId != '') {
                this.$ajax({
                    url: '/dsp/order',
                    data: {
                        id: this.$route.query.orderId
                    },
                    load: true,
                }).then(res => {
                    this.title = res.data.activeName;//活动名称
                    this.data = res.data;                   

                    if(!this.data.creativeID) {
                        this.data.creativeID = []
                    }
                    //回填预算
                    if(this.data.orderBudget == "" || this.data.orderBudget == "0") {
                        this.limitBudget = true;
                    }else {
                        this.limitBudget = false;
                    }

                    //回填投放速率
                    if((this.data.limitView == "" || this.data.limitView == "0") && (this.data.limitPrice == '' || this.data.limitPrice == '0')) {
                        this.data.controlMode = "2"
                    }
                    
                    //回填频次限制
                    if(this.data.frequencyLimit == '0') {                        
                        this.frequencyType = "0"
                    }else {
                        this.frequencyType = "1"
                    }
                    
                    //回填投放时间
                    if(this.data.endTime == "" || this.data.endTime == "NULL") {
                        this.endTime = ""
                        this.dayLimit = true;
                    }else {
                        this.endTime = this.data.endTime;
                        this.dayLimit = false;
                    }

                    //回填小时投放
                    if(this.data.direct.deliverTimeIn != "") {
                        this.hoursLimit = false;
                        this.deliverTimeCheck = this.data.direct.deliverTimeIn.split(",")
                    }

                    //回填系统                                        
                    if(this.interactionType == '4') {
                        if(this.data.platform == 'all') {
                            this.IOSCheck = true;
                            this.AndroidCheck = true;
                            this.platform = 'all'
                        }else if(this.data.platform == 'ios') {
                            this.IOSCheck = true;
                            this.AndroidCheck = false;
                            this.platform = 'ios'
                        }else if(this.data.platform == 'android') {
                            this.AndroidCheck = true;
                            this.IOSCheck = false;
                            this.platform = 'android'
                        }
                    }else if(this.interactionType == '2') {
                        this.platform = this.data.platform;
                    }
                    //回填操作系统版本
                    if(this.data.direct.osVersionIn == "" && this.data.direct.osVersionOut == "") {
                        this.osVersion = "all"
                    }else {
                        if(this.data.direct.osVersionIn) {
                            this.osVersionCheck = this.data.direct.osVersionIn.split(',')
                            this.osvRadio = "1"
                        }else if(this.data.direct.osVersionOut) {
                            this.osVersionCheck = this.data.direct.osVersionOut.split(',')
                            this.osvRadio = "2"
                        }
                        this.osVersion = "custom"
                    }

                    //回填流量来源
                    var flowSource = this.data.direct.mediaType;
                    if(flowSource == "0") {
                        this.flowSource = "1"
                        this.data.direct.pkgType = "0";
                        this.data.direct.pkgID = "";
                        this.data.direct.spaceIDIn = "";
                        this.data.direct.spaceIDOut = "";
                        this.data.direct.optimizeApp = "";
                        this.data.direct.sdkSpaceIn = "";
                        this.data.direct.sdkSpaceOut = "";
                        this.data.direct.newApp = "";
                        this.data.direct.sourceIn = "1";
                    }else if(flowSource == "10") {
                        this.flowSource = "2"
                    }else if(flowSource == "11") {
                        this.flowSource = "3"
                    }else if(flowSource == "12") {
                        this.flowSource = "4"
                    }
                    if(this.data.direct.spaceIDIn || this.data.direct.spaceIDOut) {
                        this.custom = "2"
                    }else {
                        this.custom = "1"
                    }
                    
                    var spaceCheck = {
                        "0": [],
                        "10": [],
                        "11": [],
                        "12": []
                    }
                    if(this.data.direct.spaceIDIn) {
                        this.directInfo.spaceIDIn = this.data.direct.spaceIDIn;
                        spaceCheck[flowSource] = this.data.direct.spaceIDIn.split(",");
                        this.spaceRadio = "1";
                    }
                    if(this.data.direct.spaceIDOut){
                        this.directInfo.spaceIDOut = this.data.direct.spaceIDOut;
                        spaceCheck[flowSource] = this.data.direct.spaceIDOut.split(",");
                        this.spaceRadio = "2";
                    }
                    this.beforeSpaceCheck = spaceCheck;
                    if(flowSource != "0" && flowSource != "" && this.custom == "2") {
                        this.handelCustom(this.custom).then(res => {
                            this.setSpaceID()
                        })
                    }else {
                        this.handelCustom(this.custom)
                    }                   

                    //设备品牌
                    // this.platform = this.data.platform;
                    if(this.platform == 'ios') {
                        this.osVersionList = this.ios;
                        this.telphoneList = this.telphoneIos
                    }else if(this.platform == 'android') {
                        this.osVersionList = this.android;
                        this.telphoneList = this.telphoneAndroid
                    }else {
                        this.telphoneList = [];
                        this.osVersionList = this.all;
                    }
                    
                    //地理位置   
                    this.locationType = this.data.direct.locationType;                 
                    if(this.locationType == '1') {
                        this.areaList = this.locationList;
                        this.cityID = this.data.direct.userLocationIn
                    }else if(this.locationType == '2') {
                        this.areaList = this.cityList;
                        this.locationID = this.data.direct.userLocationIn
                    }else if(this.locationType == '3'){
                        // console.log(this.data.direct.lbsPosition)
                        // this.data.direct.userLocationIn = this.data.direct.userLocationIn
                    }else {
                        this.locationType = "all"
                        this.areaList = "";
                    }
                    if(this.areaList.length) {
                        this.areaList.forEach(item => {
                            item.locationID = item.id;
                        })
                    };                                                                            
                    //回填监测站点
                    if(this.data.monitorSite != "") {
                        this.monitorList.forEach(item => {
                            if(this.data.monitorSite == item.id) {
                                this.monitorSiteTitle = item.name;
                                this.selectSite({events:item.events,id:item.id}) 
                            }
                        }) 
                        
                    }else {
                        this.monitorSiteTitle = "单选监测站点";
                    }

                    //回填转化点
                    if(this.data.monitorConvert != "") {
                        this.monitorList.forEach(item => {
                            if(this.data.monitorSite == item.id) {
                                this.convertList = item.events;
                            }
                        })                         
                        this.monitorConvertID = this.data.monitorConvert.split(",");
                    }
                    //回填兴趣标签
                    if(this.data.direct.interestID) {
                        this.intersetType = '1'
                        this.defaultInterset = '1';
                    }
                    // this.interestIDCheck = this.data.direct.interestID.split(",");

                    //人群受众
                    this.hideSet = this.data.direct.personType != '0' &&  this.data.direct.personType != '' ? true : false;
                    this.defaultdepotIDs = this.data.direct.depotIDs;
                    if(this.hideSet) {
                        if(this.data.direct.personType) {
                            this.personType = this.data.direct.personType;
                            this.defaultPersonType = this.data.direct.personType;                            
                        }else {
                            this.personType = '0';
                            this.defaultPersonType = '0'
                        }
                    }
                    //回填性别
                    this.gender = this.data.direct.genderIn == "" ? 'all' : 'custom';

                    //回填年龄
                    this.age = this.data.direct.ageIn == "" ? 'all' : 'custom';
                    if(this.age == 'custom') {
                        this.ageInString = this.data.direct.ageIn.split(",")
                    }

                    //回填收入水平    
                    this.earning = this.data.direct.earningIn == "" ? 'all' : 'custom';
                    if(this.earning == 'custom') {
                        this.earningInString = this.data.direct.earningIn.split(",")
                    }

                    //回填设备品牌
                    this.phoneBrand = (this.data.direct.phoneBrandIn == "" && this.data.direct.phoneBrandOut == "") ? 'all' : 'custom';
                    if(this.phoneBrand == 'custom') {
                        this.telphoneList.forEach(item => {
                            this.getID(item) 
                        })                
                    }                

                    //回填设备价格
                    this.devicePriceVal = this.data.direct.devicePrice == "" ? 'all' : 'custom';
                    if(this.devicePriceVal == 'custom') {
                        this.devicePriceString = this.data.direct.devicePrice.split(",")
                    }

                    //回填联网方式  
                    this.net = this.data.direct.net == "" ? 'all' : 'custom';
                    if(this.net == 'custom') {
                        this.netString = this.data.direct.net.split(",")
                    }

                    //回填运营商
                    this.ISP = this.data.direct.ISP == "" ? 'all' : 'custom';
                    if(this.ISP == 'custom') {
                        this.ISPString = this.data.direct.ISP.split(",")
                    }

                    //利润设置
                    this.profit = this.data.profit == "" || this.data.profit == "0" ? '0' : '1';

                    //合约资源  转化为sellPrice  
                    var arr = [];                  
                    if(this.data.SKU) {
                        this.data.SKU.forEach(item => {
                            item.sellPrice = item.price;
                            item.price = "0";                           
                            item.spaceInfo.forEach(v => {
                                if(v.spaceID) {
                                    arr.push(v.spaceID)
                                }                   
                            })
                            this.spaceID = arr.join(',')               
                        })
                    }else {
                        this.spaceID = ''
                    }
                    for(var k in buySkuInfo) {
                        buySkuInfo[k] = []
                    }
                    if(this.$route.query.oType != '1') {
                        for (var i = 0; i < this.data.SKU.length; i++) {
                            buySkuInfo.adxDealIDs.push(this.data.SKU[i].adxDealID);
                            buySkuInfo.adxIDs.push(this.data.SKU[i].adxID);
                            var spaces = this.data.SKU[i].spaceInfo;
                            for (var j = 0; j < spaces.length; j++) {
                                buySkuInfo.adxSpaceIDs.push(spaces[j].spaceID);
                            }
                        }
                    }  
                    this.adxAppID = this.data.directnewApp || this.data.direct.optimizeApp;
                    this.adxAppType = this.data.direct.appTypeIn;
                    this.adxNotAppType = this.data.direct.appTypeOut;
                    if(this.$route.query.oType == '1') {
                        this.spaceID = this.data.direct.sdkSpaceIn || this.data.direct.spaceIDIn || this.data.direct.pkgID;    
                    }            
                    this.notspaceID = this.data.direct.sdkSpaceOut || this.data.direct.spaceIDOut; 
                    //获取创意信息
                    this.getCreativeList()
                    // this.getTemplate()           
                })
            }
        },
        //获取创意信息
        getCreativeList() {
            // if(this.$route.query.orderId != '') {
                this.$ajax({
                    url: "/dsp/order/creative/list",
                    data: {
                        orderID: this.$route.query.orderId
                    },
                    load: true,
                }).then(res => {
                    this.creativeList = res.data;
                    //创意图片
                    var imgs = [];

                    this.creativeList.forEach((item,index) => {
                        this.checkTemplate.push(item.templateID)
                        imgs[index] = [];
                        item.material.forEach((v,i) => {
                            if(v.image) {
                                imgs[index].push({'w':v.image.width,'h':v.image.height,'src':v.image.url})
                            }
                        })
                        this.initItem(item);
                    })
                    this.imgs = imgs;

                    this.setTemplate()

                    for (var i = 0, l = this.creativeList.length; i < l; i++) {
                        this.data.creativeID.push(this.creativeList[i].id);
                    }  
                    
                    return this.checkTemplate
                }).then((v) => {
                    this.getTemplate()
                })
            // }            
        },
        //处理创意信息
        initItem(item) {
            var m = item.material || [];
            item.adxAuditList = {
                pending: [],
                approved: [],
                reject: []
            };
            m.imgs = [];
            m.txts = [];
            for (var i = 0; i < m.length; i++) {
                var v = m[i];
                if (v.image) {
                    item.hasImg = true;
                    var arr = v.image;
                    m.imgs.push({
                        src: v.image.url,
                        w: v.image.width,
                        h: v.image.height
                        // name:
                    });
                    break;
                }
                if (v.text) {
                    m.txts.push(v.text.content)
                    break;
                }
                if (v.video) {
                    item.hasVideo = true;
                    item.video = v.video.url;
                    break;
                }
                if (v.data && v.data.type == "13") {
                    item.hasHtml = true;
                    item.html = v.data.content;
                    break;
                }
            }
        },
        //视频预览
        showVideo(src) {                
            var video = $('.video-box video')[0];
            if(this.videoSrc == src) {
                video.currentTime = 0;
                video.pause();
            } else {
                this.videoSrc = src;
            }
            this.dialogVisibleVideo = true;      
        },
        getID(parent) {
            var list = parent.sub;
            if (!list || !list.length) return;
            list.forEach(item => {
                if(this.data.direct.phoneBrandIn) {
                    if(this.data.direct.phoneBrandIn.indexOf(item.id) > -1) {
                        this.phoneBrandCheck.push(item.id);
                    }
                    this.phoneBrandRadio = "1"
                }else if(this.data.direct.phoneBrandOut) {
                    if(this.data.direct.phoneBrandOut.indexOf(item.id) > -1) {
                        this.phoneBrandCheck.push(item.id);
                    }
                    this.phoneBrandRadio = "2"
                }
                
                this.getID(item);
            })
        },
        //获取活动列表
        getActivity() {
            this.$ajax({
                url: "/dsp/activity/list",
                data: {
                    size: '-1',
                    sort: ["cTime,1"]
                },
                load: true
            }).then(res => {
                this.activityList = res.data.data;
                this.activityList.forEach(item => {
                    if(this.$route.query.activeId == item.activityID) {
                        this.title = item.name;                       
                    }
                })
            });
        },
        //选择活动
        selectActivity(val) {
            this.data.activityID = val.activityID;
            this.$ajax({
                url: "/dsp/activity",
                data: {
                    id: val.activityID
                },
                load: true
            }).then(res => {
                this.active = res.data;
                this.materialList = this.active.materialList = this.active.materialList || [];               
            });
        },
        //结束日期
        daySelect(val) {
            this.data.endTime = val;
        },
        //获取操作系统版本
        getosVersion() {
            this.$ajax({
                url: "/dsp/telphone/osVersion",
                data: {},
                load: true
            }).then(res => {
                this.android = res.data.android;
                this.ios = res.data.ios;
                this.all = [
                    {
                        id: 'ios',
                        name: 'ios',
                        sub: this.ios
                    },
                    {
                        id: 'android',
                        name: 'android',
                        sub: this.android
                    }
                ]
                this.osVersionList = this.all;
            });
        },
        //获取流量来源
        getPublish() {
            this.$ajax({
                url: '/dsp/adx/list',
                data: {
                    "filter": {
                        "state": "10"
                    },
                    "size": "-1",
                    "sort": ["cTime,1"]
                },
                load: true
            }).then(res => {
                var ID = [];
                this.publishConfig = res.data.data;
                this.publishConfig.forEach(item => {
                    ID.push(item.id)
                })
                this.publishConfigCheck = ID
                this.data.direct.sourceIn = ID.join(",")
            })
        },
        //媒体选择
        selectApp(val) {
            // 清空sourceIn
            this.data.direct.sourceIn = ""
            var mediaType;
            this.flowSource = val;
            this.custom = "1";
            switch (val) {
                case '1':
                    mediaType = "0"
                    this.data.direct.sourceIn = "1";
                    break;
                case '2':
                    mediaType = "10"
                    break;
                case '3':
                    mediaType = "11"
                    break;
                case '4':
                    mediaType = "12"
                    break;
            
                default:
                    break;
            }
            this.data.direct.mediaType = mediaType;
            this.spaceID = "";
            this.notspaceID = "";
            this.data.direct.spaceIDIn = "";
            this.data.direct.spaceIDOut = "";
            this.getTemplate()
        },

        //是否自定义广告位 1全选 2自定义
        handelCustom(val) {
            this.custom = val;
            if(val == '1') {
                this.spaceID = "";
                this.notspaceID = "";
                this.data.direct.spaceIDIn = "";
                this.data.direct.spaceIDOut = "";
                this.getTemplate()
            }
            if(val == '2') {
                if(!this.data.direct.spaceIDIn && !this.data.direct.spaceIDOut) {
                    this.modelList = [];
                    this.setTemplate()
                }
                return this.getMediaList();
            }
        },
        //媒体列表
        getMediaList() {
            var mediaType = this.data.direct.mediaType;
            var data = {
                "platform": this.platform == 'all' ? "1,2,3" : this.platform == 'ios' ? '2,3' : '1,3',
                "adxAppID": "",
                "mediaType": mediaType == "13" ? "0" : mediaType
            }
            return this.$ajax({
                url: '/dsp/adx/app/media/list',
                data: {
                    filter: data
                },
                load: true
            }).then(res => {
                var data = res.data;
                data.forEach(item => {
                    if(item.child) {
                        var parentID = item.id;
                        item.ID = parentID;
                        item.child.forEach(v => {
                            v.ID = parentID + v.id;
                        })
                    }
                })
                this.mediaTypeList = data;
            })
        },
        // 处理spaceID 因appID和广告位ID可能相同，将appID与广告位ID拼接作为唯一ID使用，回填时也做相应的转化
        setSpaceID() {
            var spaceCheck = {
                "0": [],
                "10": [],
                "11": [],
                "12": []
            },
            mediaType = this.data.direct.mediaType;
            this.mediaTypeList.forEach(item => {
                if(item.child) {
                    var parentID = item.id;
                    item.child.forEach(v => {
                        if(this.beforeSpaceCheck[mediaType].indexOf(v.id) > -1) {
                            spaceCheck[mediaType].push(parentID + v.id)
                        }
                    })
                }
            })
            this.spaceCheck = spaceCheck;
        },
        //获取私有化交易
        getPrivatization() {
            this.$ajax({
                url: '/dsp/adx/app/privatization',
                data: {
                    filter: {
                        platform: this.platform == 'all' ? "1,2,3" : this.platform == 'ios' ? '2,3' : '1,3',
                        adxAppID: '',
                    }
                },
                load: true
            }).then(res => {
                this.sdkSpaceList = res.data.data
            })
        },
        //获取指定媒体（指定广告位）
        getSpace() {
            // var data = this.platform == 'all' ? {} : {osType: this.platform}
            var data = this.platform == 'all' ? {osType: '1,2,3'} : this.platform == 'ios' ? {osType: '2,3'} : {osType: '1,3'}
            this.$ajax({
                url: '/dsp/space/tree',
                data: data,
                load: true
            }).then(res => {
                this.spaceTree = res.data;
            })
        },
        //获取精选媒体
        getMedia() {
            // var data = this.platform == 'all' 
            //             ? {filter: {optimization: '1'}} 
            //             : {filter: {optimization: '1', platform: this.platform == "ios" ? '2':'1'}}
            var data = this.platform == 'all' 
                        ? {filter: {optimization: '1', platform: '1,2,3'}} 
                        : {filter: {optimization: '1', platform: this.platform == "ios" ? '2,3':'1,3'}}
            this.$ajax({
                url: '/dsp/adx/app/space',
                data: data,
                load: true
            }).then(res => {
                this.mediaConfig = res.data.data;
            })
        },
        //获取新品媒体
        getNewMeida() {
            var data = this.platform == 'all' 
                        ? {filter: {newAppCount: '30', platform: '1,2,3'}} 
                        : {filter: {newAppCount: '30', platform: this.platform == "ios" ? '2,3':'1,3'}}
            this.$ajax({
                url: '/dsp/adx/app/space',
                data: data,
                load: true
            }).then(res => {
                this.newMediaConfig = res.data.data;
            })
        },
        //获取媒体分类
        getPublishMeidaType() {           
            this.$ajax({
                url: '/dsp/adx/app/type',
                data: {},
                load: true
            }).then(res => {
                this.mediaTypeList = res.data;
            })
        },
        //行业包
        industryList() {
            var data = this.platform == 'all' 
                        ? {filter: {os: '1,2,3'},size: '-1'} 
                        : {filter: { os: this.platform == "ios" ? '2,3':'1,3'}, size: '-1'}
            this.$ajax({
                url: '/dsp/industry/package/query',
                data: data,
                load: true
            }).then(res => {
                this.industryPkgList = res.data.data;
            })
        },
        //人群包
        crowdList() {
            var data = this.platform == 'all' 
                        ? {filter: {os: '1,2,3'}, sort: ['tag,1'], size: '-1'} 
                        : {filter: { os: this.platform == "ios" ? '2,3':'1,3'}, sort: ['tag,1'], size: '-1'}
            this.$ajax({
                url: '/dsp/people/package/query',
                data: data,                
                load: true
            }).then(res => {
                this.crowdPkgList = res.data.data;
            })
        },
        //获取地理位置
        getLocation(type) {
            this.$ajax({
                url: "/dsp/location/type",
                data: {
                    category: type
                },
                load: true
            }).then(res => {
                if(type == "cityLevel") {
                    this.cityList = res.data;
                }else if(type == "location") {
                    this.locationList = res.data;
                }
            });
        },
        //获取兴趣标签
        getInterset() {
            this.$ajax({
                url: '/dsp/order/interest',
                data: {},
                load: true
            }).then(res => {
                this.interestList = res.data;
            })
        },
        //获取广告受众
        getAdAudiences() {
            var data = {
                // page: "1",
                // size: "20",
                filter: {
                    orgID: this.$route.params.advID,
                    type: '2',
                    depotType: 'IMEI,IDFA,MAC',
                    name: ''
                },
                token: '18900546113ce42af8e778263a3f4c2b'
                // sort: ["cTime,1"],
                // sTime: this.sTime,
                // eTime: this.eTime
            };
            this.$ajax({
                url: baseURL2+'/dmp/depot/extern/list',
                data: data,
                load: true
            }).then(res => {
                this.advAudiencesList = res.data;
            })
        },
        //获取人群ID
        getOwner() {
            var data = {
                filter: {
                    orgID: this.$route.params.advID,
                    type: '1',
                    depotType: 'IMEI,IDFA,MAC',
                    name: ''
                },
                token: '18900546113ce42af8e778263a3f4c2b'
            }
            this.$ajax({
                // url: "/dmp/device/depot/owner/list",
                url: baseURL2+'/dmp/depot/extern/list',
                data: data,
                load: true
            }).then(res => {
                this.crowdLibraryList = res.data;
            });
        },
        //获取监测站点
        getMonitor() {
            var data = {
                filter: {state: "10"},
                page: "1",
                size: "9999",
                sort: ["cTime,1"]
            }
            this.$ajax({
                url: "/dsp/monitor/list",
                data: data,
                load: true
            }).then(res => {
                // this.convertCheck = [];
                this.monitorList = res.data.data; 
                this.monitorList.unshift({enents: null, id: "", name: '单选监测站点'})              
            })
        },
        //选择监测站点
        selectSite(val) {
            this.selectSiteT ++
            this.convertList = val.events || [];
            this.data.monitorSite = val.id;
            //编辑时第一次改变不触发
            if(this.selectSiteT != 2) {
                this.monitorConvertID = []
                this.data.monitorConvert = "";
            }
        },
        //获取设备品牌
        getBrand() {           
            return this.$ajax({
                url: "/dsp/telphone/model",
                data: {},
                load: true,
            }).then(res => {
                if(this.platform == 'ios') {
                    this.telphoneList = res.data.ios;
                }else if(this.platform == 'android') {
                    this.telphoneList = res.data.android;
                }
                this.telphoneAndroid = res.data.android;               
                this.telphoneIos = res.data.ios;   
            })
        },
        //获取素材模板列表
        getTemplate() {
            this.checkPlatform()
            if((!this.spaceID && !this.notspaceID) && this.custom == '2') {
                this.modelList = [];
                this.setTemplate();
                return;
            }; 
            var mediaType = this.data.direct.mediaType;
            if(this.userInfo.adverType == "2") {
                mediaType = "13"
            }
            this.$ajax({
                url: '/dsp/creative/template',
                data: {
                    filter: {
                        adxDealID: buySkuInfo.adxDealIDs.join(',') || '',  //订单ID
                        adxAppID: this.adxAppID,   //精选媒体
                        adxAppType: this.adxAppType, //媒体分类
                        adxNotAppType: this.adxNotAppType,
                        adxID: buySkuInfo.adxIDs.join(',') || '',  
                        platform: this.platform == "all" ? "1,2,3" : this.platform == "ios" ? "2,3" : "1,3", 
                        dspSpaceID: this.spaceID, //space在DSP中的ID，多个用逗号间隔 
                        dspNotSpaceID: this.notspaceID,        //
                        creativeType: '',//所支持的素材形式， 1 图片，2 图文，包括图片和视频的APP推广形式，3 文字链，4 html，5 视频，6 vast视频
                        adInteract: this.data.interactionType,   //后续行为
                        sizeRate: '',
                        mediaType: mediaType
                    },
                    page: '1',
                    size: '20'
                },
                load: true,
            }).then(res => {
                this.modelList = res.data;
                //已选择的创意模板
                this.modelList.forEach(item => {                 
                    if(this.checkTemplate.indexOf(item.templateId) > -1) {
                        this.$set(item, 'active', true)
                    }
                })
                this.setTemplate()
                // this.templateLength = res.data.length
            })
            
        },
        setTemplate() {            
            var banner = [],
                coopen = [],
                tableScreen = [],
                videoFilm = [],
                native = [],
                incentiveVideo = [];
            this.modelList.forEach(item => {
                if(item.adType == '1') {
                    banner.push(item)
                }else if(item.adType == '2') {
                    coopen.push(item)
                }else if(item.adType == '3') {
                    tableScreen.push(item)
                }else if(item.adType == '4') {
                    videoFilm.push(item)
                }else if(item.adType == '5') {
                    native.push(item)
                }else if(item.adType == '6') {
                    incentiveVideo.push(item)
                }
            })
            this.banner = banner;
            this.coopen = coopen;
            this.tableScreen = tableScreen;
            this.videoFilm = videoFilm;
            this.native = native;
            this.incentiveVideo = incentiveVideo;
        },
        //监测模板变化
        checkModel(val) {
            var all = [],       //更新之后的模板id
                has = [],       
                nohas = [];
            this.creativeList.forEach(item => {
                has.push(item.templateID)
            })
            if(val.length) {
                val.forEach(item => {
                    all.push(item.templateId)
                })
            }
            has.forEach(item => {
                //如果上传的创意不在模板中，将其id添加到数组中
                if(all.indexOf(item) == -1) {
                    nohas.push(item)
                    // this.cannot = false;
                }else {
                    this.cannot = true;
                }
            })
            this.nohas = nohas;
        },
        //是否启动自动优化
        isOptimizedFn(val) {
            this.data.isOptimized = val ? "1" : "0";
        },
        //数字验证
        Check($event, type) {
            if(isNaN($event) || $event == "0"){
                return this.$message.error( type + "为大于0的数字！");
            }
        },
        //验证
        inputCheck() {
            var data = this.data,
                error;
            //活动
            if (data.activityID == "" || data.activityID == "0") {
                error = "请选择活动。";
                return error;
            }
            //订单名称
            if (data.name == "") {
                error = "请输入订单名称。";
                return error;
            }
            //预算
            if (this.limitBudget == false) {
                if(data.orderBudget == "") {
                    error = "预算为大于0的数字！";
                    return error;
                } 
            }else {
                data.orderBudget = "0"
            }    
            //ip定向
            var ip = data.direct.ip || "",
                ips = ip.split(",");
            if(ip != "") {
                if (ip.indexOf("，") != -1) {
                    error = "ip定向格式错误！多个ip请使用英文的','！";
                    return error;
                }
                for(var i = 0;i < ips.length; i++) {
                    if( !ips[i].match(/(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/) ){
                        error = "ip格式有误";
                        return error;
                    }
                }
            } 
            //投放速率
            if(data.controlMode == "0" && (data.limitPrice == "" || data.limitPrice == "0")) {
                error = "请填写投放速率";
                return error;
            }
            if(data.controlMode == "1" && (data.limitView == "" || data.limitView == "0")) {
                error = "请填写投放速率";
                return error;
            }
            //频次
            if(this.frequencyType != "0" && (data.frequencyLimit == "" || data.frequencyLimit == "0")) {
                error = "请填写频次";
                return error;
            }
            if(!this.dayLimit && this.endTime == "") {
                error = "请选择结束时间";
                return error;
            }

            //操作系统
            if(this.interactionType == '4') {
                if(!this.IOSCheck && !this.AndroidCheck) {
                    error = "请选择操作系统";
                    return error;
                }
            }

            //操作系统版本
            if(this.osVersion != 'all' && this.directInfo.osVersion == "") {
                error = "请选择操作系统版本";
                return error;
            }

            //流量来源
            if(this.flowSource != "1") {
                this.data.direct.sourceIn = "";
                if(this.directInfo.spaceID == "" && this.custom == "2") {
                    error = "请选择媒体！"
                    return error;
                }
            }

            //SKU
            if (this.$route.query.oType == '2' && !data.SKU.length) {
                error = "请选择一个合约资源。";
                return error;
            }
            //兴趣标签
            if(this.intersetType != '0') {
                if(!this.data.direct.interestID) {
                    error = "请选择兴趣标签";
                    return error;
                }
            }
            //人群库
            if(this.personType != '0') {
                if(!this.data.direct.depotIDs) {
                    error = "请选择人群库ID。";
                    return error;
                }
            }

            //地理位置
            if(this.locationType != 'all' && this.locationType != '3' && (this.cityID == "" && this.locationID == '')) {                
                error = "请选择地理位置"
                return error;
            }
            //年龄
            if(this.age != 'all' && data.direct.ageIn == "") {
                error = "请选择年龄";
                return error;
            }
            //收入水平
            if(this.earning != 'all' && data.direct.earningIn == "") {
                error = "请选择收入水平";
                return error;
            }
            //设备品牌
            if(this.phoneBrand != 'all' && this.directInfo.phoneBrand == "") {
                error = "请选择设备品牌";
                return error;
            }
            //设备价格
            if(this.devicePriceVal != 'all' && data.direct.devicePrice == "") {
                error = "请选择设备价格";
                return error;
            }
            //联网方式
            if(this.net != 'all' && data.direct.net == "") {
                error = "请选择联网方式";
                return error;
            }
            //运营商
            if(this.ISP != 'all' && data.direct.ISP == "") {
                error = "请选择运营商";
                return error;
            }
            //创意
            if (this.creativeList.length == 0) {
                error = "请上传一个创意。";
                return error;
            }

            if(this.data.type == 'rtb') {
                //订单出价
                if (data.bidPrice == "") {
                    error = "请输入订单出价。";
                    return error;
                }
                if (data.bidPrice <= 0) {
                    error = "订单出价必须大于0。";
                    return error;
                } 
                data.chargeMode == 'cpc' ? this.bidMax = this.cpcMax : this.bidMax = this.cpmMax;
                if (data.bidPrice > this.bidMax) {
                    error = "订单出价不能超过" + (this.bidMax) + "元";
                    return error;
                }

                //利润设置
                if(this.profit == '1') {
                    if(data.profit <= 0 || data.profit == '') {
                        error = "利润必须大于等于0！";
                        return error;                
                    }
                    if(data.profit > this.premiumMax*100) {
                        error = "利润设置不能超过"+(this.premiumMax*100)+"%";
                        return error;
                    }
                }
            }

            return error;
        },
        //url判断
        isUrl() {
            var urlReg = /^((ht|f)tps?):\/\//,
                error, vUrls = this.viewUrls ? this.viewUrls.split(" "):[],
                cUrls = this.clickUrls ? this.clickUrls.split(" "):[];
            if (!this.creativeData.name) {
                error = "创意名称不能为空。"
                return error;
            }
            // if(!this.viewUrls.length && this.templateLength) {
            //     error = "请输入曝光监测"
            //     return error;
            // }
            // if(!this.clickUrls.length && this.templateLength && (this.data.interactionType == '2' || this.data.interactionType == '4' || this.orderType == 'deal')) {
            //     error = "请输入点击监测"
            //     return error;
            // }
            if (!this.landing && (this.data.interactionType == '2' || this.data.interactionType == '4' || this.orderType == 'deal')) {
                error = "落地页地址不能为空。"
                return error;
            }
            if (this.landing && !urlReg.test(this.landing) && (this.data.interactionType == '2' || this.data.interactionType == '4' || this.orderType == 'deal')) {
                error = "落地页地址不合法。"
                return error;
            }
            if (this.appExtension.data.marketUrl) {
                var sIndex = this.appExtension.data.marketUrl.indexOf('id')
                var eIndex = this.appExtension.data.marketUrl.lastIndexOf('?')
                if (sIndex != -1 && eIndex != -1) {
                    this.appExtension.data.itunsID = this.appExtension.data.marketUrl.slice(sIndex + 2, eIndex)
                }
            }
            var condition = this.data.interactionType == '2' && (this.materialList.length == 0 && this.app_num == 'one')
            if (condition) {
                if (!this.appExtension.data.name) {
                    error = "应用名称不能为空。"
                    return error;
                } else if (this.platform == 'ios' && !this.appExtension.data.marketUrl) {
                    error = "APPStore URL不能为空。"
                    return error;
                } else if (this.platform == 'android' && !this.appExtension.data.packageName) {
                    error = "APK包名不能为空。"
                    return error;
                } else if (this.platform == 'android' && !this.appExtension.data.downloadUrl) {
                    error = "下载URL不能为空。"
                    return error;
                } else if (!this.appExtension.data.version) {
                    error = "版本不能为空。"
                    return error;
                } else if (!this.appExtension.data.description) {
                    error = "描述不能为空。"
                    return error;
                } else if (this.platform == 'ios' && this.appExtension.data.marketUrl) {
                    if (this.appExtension.data.marketUrl.indexOf('apple.com') == -1) {
                        error = "请输入正确的appStore地址。"
                        return error;
                    }
                    if(!this.appExtension.data.itunsID) {
                        // error = "监测不到itunsID！"
                        error = "是否使用该地址"
                        return error;
                    }
                } else if (!this.appExtension.data.iconURL) {
                    error = "请上传Appicon。"
                    return error;
                } 
            }
            for (var i = 0, l = vUrls.length; i < l; i++) {
                if (!urlReg.test(vUrls[i])) {
                    error = "曝光监测不合法(多个地址以空格分割，"+ vUrls[i] +" 这个url不合法)";
                    break;
                }
            }
            for (var i = 0, l = cUrls.length; i < l; i++) {
                if (!urlReg.test(cUrls[i])) {
                    error = "点击监测不合法(多个地址以空格分割，"+ cUrls[i] +" 这个url不合法)";
                    break;
                }
            }
            if (error) {
                return error;
            }
            
            var ms = this.currModel.material; 
            for (var i = 0, l = ms.length; i < l; i++) {
                if (ms[i].image && !ms[i].image.url) {
                    return this.$message.error("请上传图片。");
                } else if (ms[i].text && !ms[i].text.content) {
                    return this.$message.error("请输入文本。");
                } else if (ms[i].video && !ms[i].video.url) {
                    return this.$message.error("请上传视频。");
                } else if (ms[i].data && !ms[i].data.content) {
                    return this.$message.error("请输入"+ this.dataType[ms[i].data.type] +"。");
                }
            }
            if (error) {
                return error;
            }
        },
        //控制私有流量
        // hasPrivateFn() {
        //     return this.$ajax({
        //         url: '/dsp/sys/parameter/query',
        //         data: {
        //             "filter":{"feature":"dsp.feature.order.private.space.allow"}
        //         },
        //         load: true,
        //     }).then(res => {
        //         this.hasPrivate = res.data[0].value;
        //         this.setFlowSourceList()
        //     })
        // },
        // setFlowSourceList() {
        //     if(this.data.chargeMode == 'cpm') {
        //         if(this.hasPrivate == 1) {
        //             this.flowSourceList = this.flowSourceList1;
        //         }else {
        //             this.flowSourceList = this.flowSourceList2;
        //         }
        //     }else if(this.data.chargeMode == 'cpc') {
        //         this.flowSourceList = this.flowSourceList3;
        //     }
        // },
        // 获得最大溢价值
        getPremiumMax () {
            this.$ajax({
                url: '/dsp/sys/parameter/query',               
                token: localStorage.agentToken,
                data: {
                    "filter":{"feature":"dsp.feature.agency.advertiser.profix.maxvalue"}
                },
                load: true
            }).then(res => {
                this.premiumMax = res.data[0].value*1 || 0.6;
            })
        },
        // 控制CPC/CPM最高价格
        getPriceMax() {
            this.$ajax({
                url: '/dsp/sys/parameter/query',
                data: {
                    "filter":{"feature":"dsp.feature.advertiser.order.cpc.maxvalue"}
                },
                load: true,
            }).then(res => {
                this.cpcMax = res.data[0].value*1 || 99;
            });
            this.$ajax({
                url: '/dsp/sys/parameter/query',
                data: {
                    "filter":{"feature":"dsp.feature.advertiser.order.cpm.maxvalue"}
                },
                load: true,
            }).then(res => {
                this.cpmMax = res.data[0].value*1 || 999;
            })
        },

        //控制CPC出价
        hasCPCFn() {
            this.$ajax({
                url: '/dsp/sys/parameter/query',
                data: {
                    "filter":{"feature":"dsp.feature.advertiser.order.cpc.allow"}
                },
                load: true,
            }).then(res => {
                this.hasCPC = res.data[0].value;
            })
        },
        // ip定向
        hasIPFn() {

            this.$ajax({
                url: '/dsp/sys/parameter/query',
                data: {
                    "filter":{"feature":"dsp.feature.advertiser.order.ip.direct"}
                },
                load: true,
            }).then(res => {
                this.hasIP = res.data[0].value;
            })
        },
        //不能输入小数点
        filterNum () {
            var ss=window.event||e;
            if(ss.keyCode == 110 || ss.keyCode == 190){
                ss.preventDefault();
            }
        },
        //创建订单
        createOrder(edit) {
            var err = this.inputCheck();
            if (err) {
                this.$message.error(err);
                return;
            }
            // if(!this.cannot) {
            //     this.$message.error('素材与模板不匹配！');
            //     return;
            // }

            //投放速率
            if (this.data.controlMode == "") {
                this.data.limitPrice = "";
                this.data.speedUp = "";
                this.data.speedUnit = "";
                this.data.limitView = "";
            }
            //频次
            if(this.frequencyType == "0") {
                this.data.frequencyLimit = "0";
                this.data.frequencyUnit = "";
            }
            //时间设置
            if(this.dayLimit) {
                this.data.endTime = "NULL"
            }else {
                if(!(this.data.endTime.indexOf("23:59:59") > -1)) {
                    this.data.endTime = this.data.endTime + " 23:59:59"
                }
            }
            if(!(this.data.startTime.indexOf("00:00:00") > -1)) {
                this.data.startTime = this.data.startTime + " 00:00:00"
            }           
            //小时设置
            if(this.hoursLimit) {
                this.data.direct.deliverTimeIn = ""
            }
            //操作系统
            // this.data.platform = this.platform;
            if(this.interactionType == '4') {
                if(this.IOSCheck && this.AndroidCheck) {
                    this.data.platform = 'all'
                }else {
                    if(this.IOSCheck) {
                        this.data.platform = 'ios'
                    }
                    if(this.AndroidCheck) {
                        this.data.platform = 'android'
                    }
                }
            }
            //操作系统版本
            if(this.osVersion == 'all') {
                this.data.direct.osVersionIn = "";
            }
            
            //地理位置          
            if(this.locationType == 'all') {
                this.data.direct.userLocationIn = "";
                this.data.direct.locationType = "0";  
                this.data.direct.lbsPosition = [];              
            }else if(this.locationType == '1') {
                this.data.direct.userLocationIn = this.cityID;
                this.data.direct.lbsPosition = [];
            }else if(this.locationType == '2') {
                this.data.direct.userLocationIn = this.locationID;
                this.data.direct.lbsPosition = [];
            }

            //站点转化
            if(this.convertList.length == 0) {
                this.data.monitorConvert = ""
            }

            //兴趣标签
            if(this.intersetType == '0') {
                this.data.direct.interestID = '';
            }
            //人群库
            if(this.personType == '0') {
                this.data.direct.personType = '';
            }else{
                this.data.direct.personType = this.personType;
            }

            //性别
            if(this.gender == 'all') {
                this.data.direct.genderIn = "";
            }
            //年龄
            if(this.age == 'all') {
                this.data.direct.ageIn = "";
            }
            //收入水平
            if(this.earning == 'all') {
                this.data.direct.earningIn = "";
            }
            //设备品牌
            if(this.phoneBrand == 'all') {
                this.data.direct.phoneBrandIn = "";
            }
            //设备价格
            if(this.data.devicePriceVal == 'all') {
                this.data.direct.devicePrice = "";
            }
            //联网方式
            if(this.net == 'all') {
                this.data.direct.net = "";
            }
            //运营商
            if(this.ISP == 'all') {
                this.data.direct.ISP = "";
            }
            // console.log(this.data)
            // return
            if(edit) {
                this.editOrder()
            }else {
                this.addOrder()
            }
        },
        //创建订单
        addOrder() {
            this.$ajax({
                url: '/dsp/order/add',
                data: {
                    data: this.data
                },
                load: true
            }).then(res => {
                this.$router.push({  
                    name:'delivery.order'
                })
            })
        },
        //编辑订单
        editOrder() {
            this.$ajax({
                url: "/dsp/order/modify",
                data: {
                    data: this.data
                },
                load: true
            }).then(res => {
                this.$router.push({  
                    name:'delivery.order'
                })
            })
        },
        //编辑创意
        creativeEdit (m, index) {
            var modelList;
            // console.log(m,index)
            if(m.auditState == '2') return; 
            this.isEdit = true;
            //回填推广APP信息
            this.appExtension.show = true;
            if(m.advApp) {
                this.appExtension.data = m.advApp;
            }

            this.currModelIndex = index;   
            this.templateID = m.templateID //模板id
            this.creativeID = m.id;   //素材id
            this.currModel = m;       //素材信息
            this.creativeData.name = m.name;
            this.clickUrls = m.clickUrls ? m.clickUrls.join(',') : '';
            this.viewUrls = m.viewUrls ? m.viewUrls.join(',') : '';
            this.landing = m.landingUrl ? m.landingUrl : '';

            //获取编辑时对应模板的信息
            // this.modelList.forEach(item => {
            //     if(this.templateID == item.templateId) {
            //         this.EmodelList = item;
            //         item.material.forEach((v,i) => {
            //             if(v.image) {
            //                 m.material[i].image.size = v.image.size                            
            //             }
            //             if(v.video) {
            //                 m.material[i].video.size = v.video.size
            //             }
            //         })
            //     }
            // })
            //获取所有模板信息，匹配到所编辑的创意信息，回填创意内容
            this.$ajax({
                url: '/dsp/creative/template',
                data: {
                    filter: {
                        adxDealID: '',  //订单ID
                        adxAppID: "",   //精选媒体
                        adxAppType: "", //媒体分类
                        adxNotAppType: "",
                        adxID: "",  
                        platform: "1,2,3", 
                        dspSpaceID: "", //space在DSP中的ID，多个用逗号间隔 
                        dspNotSpaceID: "",        //
                        creativeType: '',//所支持的素材形式， 1 图片，2 图文，包括图片和视频的APP推广形式，3 文字链，4 html，5 视频，6 vast视频
                        adInteract: "",   //后续行为
                        sizeRate: ''
                    },
                    page: '1',
                    size: '20'
                },
                load: true,
            }).then(res => {
                modelList = res.data;
                return modelList;                   
            }).then(v => {
                modelList.forEach(item => {
                    if(this.templateID == item.templateId) {
                        this.EmodelList = item;
                        item.material.forEach((v,i) => {
                            if(v.image) {
                                m.material[i].image.size = v.image.size                            
                            }
                            if(v.video) {
                                m.material[i].video.size = v.video.size
                            }
                        })
                    }
                })

                this.currModel = m;       //素材信息
            
                // return;

                // 判断是否存在明星资质
                if(m.qualifications instanceof Array ) {
                    this.elseMaterial = true;
                } else {
                    // 根据list获取明星资质信息
                    this.$ajax({
                        url: '/dsp/creative/list',
                        data: {
                            'page': "1",
                            'size': "20",
                            'filter': {
                                id: m.id
                            }
                        },
                        load: true,
                    }).then(res => {
                        if(res.data.data.length) {
                            m.qualifications = res.data.data[0].qualifications;
                        }
                        
                        this.elseMaterial = false;
                        
                    })
                }
                this.show = true;
            })
            
            
            
        },
        //更新创建订单时创意列表推广APP信息
        updateAppInfo(item) {
            if (this.interactionType == '2') {
                var arr = this.creativeList
                for (var i = 0, l = arr.length; i < l; i++) {
                    if (arr[i].advApp.id == item.advApp.id) {
                        arr[i].advApp = item.advApp
                    }
                }
            }
        },
        //选择模板
        selectTemplate(v,adType) {  
            this.isEdit = false;         
            if (this.app_num == 'more' || this.materialList.length == 0) {
                this.appExtension.show = true;
            } else {
                this.appExtension.show = false;
            }
            this.show = true;
            //清空上一次数据
            v.material.forEach(item => {
                if(item.image) {
                    item.image.url = ""
                }
                if(item.data) {
                    item.data.content = ""
                }
                if(item.text) {
                    item.text.content = ""
                }
            })
            this.currModel = v;    
            this.currModel.qualifications = []     
        },
        upload(m, type) {
            this.currUpload = m;
            this.currUploadType = type;
            $("#btnImgUpload").trigger('click');
        },
        //验证尺寸
        checkImg(up, file, cb, vm) {
            var nFile = file.nFile,
            imageTpl;
            switch(this.currUploadType) {
                case "img":
                case "icon":
                    var reg = /.(png|jpe?g|gif)$/i,
                        image = new Image();
                    // 判断文件类型
                    if(!reg.test(file.name)){
                        up.removeFile(file);
                        vm.$message.error("格式错误，请上传png，jpg，jpeg，gif格式。");
                    }
                    image.onload= function() {
                        var checkWidth = image.width == vm.currUpload.width,
                            checkHeight = image.height == vm.currUpload.height;
                        if(!checkWidth || !checkHeight) {
                            up.removeFile(file);
                            return vm.$message.error("图片尺寸不合适，请重新上传(尺寸应为"+ vm.currUpload.width +"x"+ vm.currUpload.height +")");
                        }
                        if (file.size > vm.currUpload.size) {
                            up.removeFile(file);
                            return vm.$message.error("图片大小不合适，请重新上传(最大限制为"+ Number(vm.currUpload.size / 1024).toFixed(0) + "KB)");
                        }
                        cb && cb();
                    };
                    image.src = window.URL.createObjectURL(nFile);
                break;
                case "video":
                    var url, video;
    
                    // 文件大小判断
                    if (file.size > vm.currUpload.size) {
                        up.removeFile(file);
                        vm.$message.error("视频大小不合适，请重新上传(最大限制为"+ Number(vm.currUpload.size / 1024).toFixed(0) + "KB)");
                        return;
                    }
                    
                    url = window.URL.createObjectURL(nFile);
                    video = $(".video_temp").attr("src",url)[0];
    
                    //浏览器只支持MP4部分编码格式，不支持的编码格式在上传时会导致oncanplay事件不触发                
                    //此函数检测浏览器支持哪种 视频格式
                    function supportsVideoType(type) {
                        let video;
                        let formats = {
                            ogg: 'video/ogg; codecs="theora"',
                            h264: 'video/mp4; codecs="avc1.42E01E"',
                            webm: 'video/webm; codecs="vp8, vorbis"',
                            vp9: 'video/webm; codecs="vp9"',
                            hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
                        };
                        if(!video) {
                            video = document.createElement('video')
                        }
                        return video.canPlayType(formats[type] || type);
                    }
                
                    var types = ['ogg', 'webm', 'vp9', 'h264', 'hls'],
                        arr = [];
                    for (let i = 0 ; i < types.length; i++){
                        var canPlay = supportsVideoType(types[i]);
                        if (canPlay =='probably') {
                            // can play;
                            arr.push(types[i])
                        } else if (canPlay == 'maybe') {
                            // is not sure to play or not;
                            arr.push(types[i])
                        } else {
                            // can not play;
                        }
                    } 
                    this.supportsArr = arr;
                    
                    // if(!video.oncanplay) {
                    //     vm.$message.error("不支持该视频编码格式，请上传"+arr.join(",")+"编码格式的视频！")
                    // }      
                    video.oncanplay = function () {
                        // vm.isOK = false;
                        video.oncanplay = null;
                        var max = vm.currUpload.maxDuration,
                            min = vm.currUpload.minDuration,
                            duration = Math.round(this.duration); 
                        // 判断视频时长
                        if( min <= duration && duration <= max ) {
                            vm.currUpload.duration = duration + "";
                        } else {
                            up.removeFile(file);
                            vm.$message.error("视频时长不合适，请重新上传(时长应为"+ min +"秒-"+ max +"秒)");
                            return;
                        }
                        // 判断视频长宽
                        if(Math.abs(vm.currUpload.width/vm.currUpload.height - this.videoWidth/this.videoHeight) < 0.1) {
                            vm.currUpload.duration = this.duration.toFixed(0) + "";
                            cb && cb();
                        } else {
                            var w = vm.currUpload.width,
                                h = vm.currUpload.height,
                                GCD = vm.gcd(w, h);
                            up.removeFile(file);
                            vm.$message.error("当前视频尺寸为"+this.videoWidth+"x"+this.videoHeight+"，请重新上传(宽高比例应接近"+ vm.currUpload.width/GCD +':'+ vm.currUpload.height/GCD +",上下误差不超过10%)");
                        }
                        // vm.callback(vm.isOK)
                    }
                    
                break;
                case "appIcon":
                    var reg = /.(png|jpe?g|gif)$/i,
                        image = new Image();
                    // 判断文件类型
                    if(!reg.test(file.name)){
                        up.removeFile(file);
                        vm.$message.error("格式错误，请上传png，jpg，jpeg，gif格式。");
                    }
                    image.onload= function() {
                        if(image.width / image.height != 1) {
                            up.removeFile(file);
                            return vm.$message.error("图片尺寸尺寸应为1:1");
                        }
                        if (file.size > 50*1024) {
                            up.removeFile(file);
                            return vm.$message.error("图片大小不合适，请重新上传(最大限制为50KB)");
                        }
                        cb && cb();
                    };
                    image.src = window.URL.createObjectURL(nFile);
                break;
                case "qua":
                    var reg = /.(png|jpe?g|gif)$/i;
                    // 判断文件类型
                    if(!reg.test(file.name)){
                        up.removeFile(file);
                        vm.$message.error("格式错误，请上传png，jpg，jpeg，gif格式。");
                    } else {
                        cb && cb();
                    }
                break;
            }
        },
        //获取最大公约数
        gcd(m, n){
            var u =+ m,v =+ n,t = v; 
            while (v != 0) { 
                t = u%v; 
                u = v; 
                v = t; 
            } 
            return u 
        },
        uploadFn() {      
            var vm = this;      
            fileUpload({
                funcUrl: 0,
                btnID: "btnImgUpload",
                // inpID: "inpImgUpload",
                BeforeUpload(up, file, cb) {
                    vm.checkImg(up, file, cb, vm)
                    
                },
                FileUploaded(info) {
                    var currUpload = vm.currUpload,
                        qua = vm.currModel.qualifications;
                    vm.currUpload.url = info.url
                    vm.$forceUpdate();//强制刷新
                    if(vm.currUploadType == "qua") {
                        currUpload.name = "明星资质";
                        if(!qua) {
                            vm.currModel.qualifications = qua = [];
                        }
                        qua.push(currUpload)
                    } else if(vm.currUploadType == "appIcon") {
                        vm.appExtension.data.iconURL = info.url;
                        vm.$forceUpdate();//强制刷新
                    } else {
                        if (currUpload.mims[0].indexOf('video') == -1) {
                            currUpload.width = info.w + "";
                            currUpload.height = info.h + "";
                        }
                        currUpload.mime = info.type;
                        currUpload.size = info.size + "";
                        currUpload.name = info.name;
                    }                    
                }
            });
        },
        //添加创意/编辑
        addCreative() {
            var error = this.isUrl();
            if (error) {
                return this.$message.error(error);
            }
            var data = {
                "name": this.creativeData.name,
                "templateID": this.isEdit ? this.templateID : this.currModel.templateId,
                "interactionType": this.data.interactionType,
                "material": this.currModel.material,
                "landingUrl": this.landing,
                "viewUrls": this.viewUrls ? this.viewUrls.split(","):[],
                "clickUrls": this.clickUrls ? this.clickUrls.split(",") : [],
                "adType": this.currModel.adType,
                "creativeType": this.currModel.creativeType,
                "industry": this.active.industry,
                "qualifications": this.currModel.qualifications || []
            }
            if (this.data.interactionType == '2') {
                this.appExtension.data.platform = this.platform
                this.appExtension.data.orgID = this.data.orgID 
                this.appExtension.data.advertiserID = this.data.advertiserID
                var appExtension = {}
                for(var k in this.appExtension.data){
                    if(this.appExtension.data[k]) {
                        appExtension[k] = this.appExtension.data[k]
                    }
                }
                data.advApp = appExtension
            }
            // return
            if(this.isEdit) {
                data.id = this.creativeID;
                this.$ajax({
                    url: '/dsp/creative/modify',
                    data: {
                        data: data                                            
                    },
                    load: true,
                }).then(res => {
                    this.creativeList[this.currModelIndex] = res.data;
                    this.updateAppInfo(res.data)
                    this.show = false;
                })
            }else {
                this.$ajax({
                    url: "/dsp/creative/add",
                    data: {
                        data:data
                    },
                    load: true
                }).then(res => {
                    if(res.data.length) {
                        var creativeID = res.data[0].id;
                        this.creativeList.push(res.data[0]);
                        this.show = false;
                        this.data.creativeID.push(creativeID);
                        this.updateAppInfo(res.data[0])
                        var imgs = [];
                        this.creativeList.forEach((item,index) => {
                            imgs[index] = [];
                            item.material.forEach((v,i) => {
                                if(v.image) {
                                    imgs[index].push({'w':v.image.width,'h':v.image.height,'src':v.image.url})
                                }
                            })
                        })
                        this.imgs = imgs;

                        this.checkTemplate.push(res.data[0].templateID)

                        this.modelList.forEach(item => {
                            if(this.checkTemplate.indexOf(item.templateId) > -1) {
                                this.$set(item, 'active', true)
                            }
                            // if(data.templateID == item.templateId) {
                            //     item.active = true;
                            // }
                        })
                        this.setTemplate()
                    }
                })
            }
        },
        //删除素材
        deleteCreative(data, id, index) {
            //要删除的素材的索引
            this.delIndex = index;
            this.$confirm('确认删除该素材?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return this.$ajax({
                    url: '/dsp/order/creative/del',
                    data: {
                        "orderID": this.$route.query.orderId,
                        "creativeID": id
                    },
                    load: true
                })
            })
                .then(res => {    

                    var checkList = [];         
                    
                    this.creativeList.splice(this.delIndex, 1);//删除素材
                    this.data.creativeID.splice(this.delIndex, 1);//移除删除的素材ID
                    this.checkTemplate.splice(this.delIndex, 1);//移除删除的模板的选中样式
                    this.imgs.splice(this.delIndex, 1) //移除素材对应的图片/视频

                    //获取已选模板的id
                    this.creativeList.forEach(item => {
                        checkList.push(item.templateID)             
                    })
                    //清除素材的选中状态
                    this.modelList.forEach(item => {
                        if(item.templateId == data.templateID) {
                            if(checkList.indexOf(item.templateId) == -1) {
                                this.$set(item, 'active', false)
                            }                      
                        }                    
                    })
                    //删除nohas中 改素材id
                    var index;
                    this.nohas.forEach(item => {
                        if(item == id) {
                            index = this.nohas.indexOf(id);
                            this.nohas.splice(index, 1)
                        }
                    })
                    this.setTemplate();
                    this.$message.success("操作成功");
                })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //删除图片
        delPic(index, type) {
            if(type == "qua") {
                this.currModel.qualifications.splice(index,1);                
            } else {
                this.currModel.material[index][type].url = "";
            }
            this.$forceUpdate();//强制刷新
        }
    }
}
</script>

<style lang="less">
.new-order{
    .form-box{
        padding: 25px 10px;
        .form-group{
            margin-bottom: 30px;
            position: relative;
            padding-left: 172px;
            .name{
                font-size: 14px;
                width: 154px;
                text-align: left;
                position: absolute;
                left: 0;
                display: inline-block;
                max-width: 100%;
                line-height: 40px;
            }
            .el-wrap{
                width: 100%;
                display: inline-flex;
                align-items: center; 
                .el-date-editor{
                    width: 254px;
                }  
                @media screen and (max-width: 1400px) {
                    .el-date-editor{
                        width: 200px;
                        .el-input__inner{
                            width:100%;
                        }
                    }  
                }              
            }
            .custom {
                width: 700px;
                height: 40px;
                border-top: 1px dashed #bbb;
                line-height: 40px;
            }
            .sp{
                // margin-bottom: 20px;
            }
        }
    }
    .order-content{
        background-color: #fff;
        width: 100%;
        border-radius: 8px;
        box-shadow: 0px 2px 12px 2px rgba(220, 220, 220, 1);
        .title{
            color: #373737;
            font-size: 22px;
            .circle{
                display: inline-block;
                margin-right: 9px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #4F4F4F;
                vertical-align: 2px;
            }
        }
        
        .form-box{
            .form-group{
                .name{
                }
                .el-wrap{  
                    .price{
                        margin-left: 8px;
                        margin-right: 20px;
                    }            
                }            
                .info{
                    width: 464px;
                    height: 40px;
                }
                .set{
                    height: 40px;
                    .icon{
                        width: 16px;
                        height: 16px;
                        display: inline-block;
                        background: url('../../../common/img/images/icon_16.png') no-repeat center;
                        cursor: pointer;
                        vertical-align: middle;
                    }
                }
                .textarea{
                    width: 250px;
                }
                .throng-table-wrap{
                    width: 720px;
                }
                .interest-wrap{
                    width: 700px;
                }
                .sex,.system{
                    padding-left: 108px;
                }
                .age,.income,.Eprice,.network,.operator{
                    padding-left: 110px;
                }
            }
            .grid {
                margin: 20px;
                margin-left: 0;
                padding-bottom: 20px;
                >li {
                    width: 320px;
                    margin-left: 20px;
                    margin-bottom: 20px;
                    padding-bottom: 36px;
                    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.125);
                    // float: left;
                    >span {
                        position: absolute;
                        width: 30px;
                        height: 30px;
                        top: -1px;
                        right: -1px;
                        background: url("../../../common/img/images/icon-unselect-order.png") no-repeat center;
                        z-index: 9;
                        cursor: pointer;
                    }
                    .icon_select {
                        background: url("../../../common/img/images/icon-select-order.png") no-repeat center;
                    }
                    .grid-top {
                        border: 1px solid #cccccc;
                        border-radius: 5px;
                        z-index: 2;
                        position: relative;
                        background: #fff;
                    }
                    .border-select {
                        border: 1px solid #2b91f6;
                    }
                }
                .res-title {
                    font-size: 14px;
                    color: #3d3d3d;
                    text-align: center;
                    margin-top: 20px;
                    font-weight: bold;
                    padding: 0;
                    .icon-os {
                        width: 14px;
                        height: 16px;
                        vertical-align: sub;
                        margin-right: 5px;
                        display: inline-block;
                    }
                    .icon-android {
                        background: url("../../../common/img/images/icon_android.png");
                    }
                    .icon-ios {
                        width: 13px;
                        background: url("../../../common/img/images/icon_ios.png");
                    }
                }
                .app-cover-list {
                    width: 135px;
                    height: 135px;
                    margin: 20px auto 0;
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: space-around;
                    align-items: center;
                    border-radius: 16px;
                    background-color: #e6e6e6;
                    background-size: 100% 100%;
                    background-position: center;
                    li {
                        height: 52px;
                        width: 52px;
                        border-radius: 15px;
                        position: relative;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: contain;
                        a {
                            display: block;
                            width: 100%;
                            height: 100%;
                            color: #44a1f7;
                            text-align: center;
                            padding: 10px;
                            border-radius: 15px;
                            background-color: #ffffff;
                        }
                    }
                }
                .app-more {
                    width: 440px;
                    position: absolute;
                    padding: 20px;
                    padding-bottom: 0;
                    background-color: #fff;
                    top: -20px;
                    left: 60px;
                    border-radius: 5px;
                    box-shadow: 0px 0px 5px 2px #ccc;
                    z-index: 10;
                    .app-more-info {
                        width: 50%;
                        margin-bottom: 20px;
                        .app-more-cover {
                            height: 52px;
                            width: 52px;
                            float: left;
                            margin-right: 20px;
                        }
                        >p {
                            margin: 0;
                            line-height: 26px;
                        }
                    }
                }
                .app-name {
                    font-size: 14px;
                    color: #3d3d3d;
                    margin: 10px 20px 0;
                    text-align: center;
                }
                .line {
                    margin: 0 10px;
                    height: 1px;
                    background: #bfbfbf;
                    margin-top: 20px;
                }
                .app-info {
                    margin: 0 15px;
                    padding: 10px 5px;
                    font-size: 12px;
                    border-bottom: 1px dashed #e6e6e6;
                    p {
                        margin: 0;
                        word-break: break-all;
                    }
                    .info-name {
                        color: #8c8c8c;
                    }
                    .info-contant {
                        margin-top: 10px;
                        color: #3d3d3d;
                    }
                }
                .app-info.last {
                    border-bottom: none;
                }
                .btn-white {
                    width: 260px;
                    height: 35px;
                    display: block;
                    color: #737373;
                    border: 1px solid #d6d6d6;
                    border-radius: 5px;
                    background: url("../../../common/img/images/select-bg.png") repeat;
                    background-size: 1px 100%;
                    margin: 15px auto 20px;
                    padding: 0;
                }
                .btn-blue {
                    width: 100%;
                    height: 40px;
                    position: absolute;
                    bottom: 0px;
                    border-radius: 0 0 5px 5px;
                    left: 0;
                    z-index: 1;
                    padding: 0;
                    border-radius: 0 0 5px 5px;
                    border: 1px solid #489df2;
                    background: url("../../../common/img/images/bg_blue.png") repeat;
                    background-size: 1px 100%;
                    color: #fff;
                    font-size: 12px;
                }
            }   
            .content-title {
                font-size: 14px;
                line-height: 56px;
                border-bottom: 1px solid #cccccc;
                padding-left: 20px;
                padding-right: 20px;
                .content-title-filter {
                    float: right;
                }          
            }
            .detail-page {
                padding-bottom: 40px;
                .bs{
                    padding-bottom: 40px;
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
                .btn-blue {
                    width: 240px;
                    height: 40px;
                    margin-left: 10px;
                }
                .btn-white {
                    width: 120px;
                    height: 40px;
                }
                .group-btn {
                    padding: 20px;
                }
            }         
            .more-load {
                width: 100%;
                height: 60px;
                line-height: 60px;
                text-align: center;
                font-size: 16px;
                cursor: pointer;
                border-top: 1px solid #ccc;
            }
        }
        .material{
            background: #E4F5FF;
            margin-top: 28px;
            .form-group{
                margin-bottom: 20px;
                .name{
                    color: #101010;
                    line-height: 50px;
                }
                .el-wrap{
                    width: 100%;
                    height: auto;
                    display: inline-block;
                    .word{
                        margin-left: 8px;
                        margin-right: 20px;
                    }
                    .pic{
                        border: 1px solid transparent;
                        float: left;
                        margin-bottom: 10px;
                        width: auto;
                        height: 50px;
                        line-height: 50px;
                        background: #fff;
                        border-radius: 4px;
                        margin-right: 20px;
                        padding: 0 8px 0 20px;
                        color: #101010;
                        cursor: pointer;
                        &:hover{
                            background: #32A7FF;
                            color: #fff;
                            .icon{
                                background: url('../../../common/img/images/icon_11.png') no-repeat center;
                            }
                        }
                        .icon{
                            float: right;
                            width: 22px;
                            height: 100%;
                            background: url('../../../common/img/images/icon_10.png') no-repeat center;
                        }
                        .template-name{
                            display: inline-block;
                            width: auto;
                            margin-right: 10px;
                            // overflow:hidden;
                            // text-overflow:ellipsis;
                            // white-space:nowrap
                        }
                    }
                    .template-select{
                        border-color: #32a7ff;
                        &:hover{
                            background: #fff;
                            color: #101010;
                            .icon{
                                background: url('../../../common/img/images/icon_10.png') no-repeat center;
                            }
                        }
                        .selected{
                            float: right;
                            width: 22px;
                            height: 100%;
                            background: url('../../../common/img/images/icon_09.png') no-repeat center;
                        }
                        .template-name{
                            color: #32a7ff;
                        }
                    }
                    .active{
                        background: #32A7FF;
                        color: #fff;
                        .icon{
                            background: url('../../../common/img/images/icon_11.png') no-repeat center;
                        }
                    }
                    .native{
                        padding: 0 8px 0 20px;
                        color: #32A7FF;
                        height: 50px;
                        line-height: 50px;
                        border-radius: 4px 0 0 4px;
                        border:1px solid #32A7FF;
                        background: #fff;
                        .selected{
                            float: right;
                            margin-left: 34px;
                            width: 22px;
                            height: 100%;
                            background: url('../../../common/img/images/icon_09.png') no-repeat center;
                        }
                    }
                    .add{
                        margin-right: -9px;
                        margin-left: 9px;
                        float: right;
                        width: 30px;
                        height: 48px;
                        background: #32A7FF url('../../../common/img/images/icon_12.png') no-repeat center;
                        border-radius: 0 4px 4px 0;
                    }
                }
            }
            .form-group:last-child{
                margin-bottom: 0px;
            }
        }
        .tempBox{
            .template-slider{
                width: 51px;
                height: 26px;
                display: block;
                margin: 14px auto 0;
                cursor: pointer;
                background: url('~adv@/assets/img/silder.png') no-repeat center;
                margin-top: -26px;
            }
        }
        .tempBox.off{
            .template-slider{
                transform: rotate(180deg);
                background: url('~adv@/assets/img/chart-silder.jpg') no-repeat center;
                margin-top: 0;
            }
        }
        .material-table{
            .disabled{
                .el-button{
                    cursor: not-allowed;
                    background-color: #999;
                    border-color: #999;
                }               
            }
            td{
                p{
                    word-break: break-all;
                }
            }
        }
        .hide-set{
            width: 380px;
            height: 60px;
            line-height: 60px;
            padding: 0 30px;
            background: #E4F5FF;
            color: #32A7FF;
            font-size: 18px;
            border-radius: 0 40px 40px 0;
            margin-top: 20px;
            cursor: pointer;
            .icon{
                width: 30px;
                height: 30px;
                background: url('../../../common/img/images/icon_15.png') no-repeat center;
                float: right;
                margin-top: 15px;
            }
            .active{
                background: url('../../../common/img/images/icon_14.png') no-repeat center;
            }
        }
        .bottom{
            padding: 40px;
            border-top: 1px solid #DCDCDC;
            .btn-cancel{
                width: 100px;
                height: 46px;
                font-size: 14px;
                padding: 0;
                line-height: 46px;
                border-color: #99C8FF;
            }
            .btn-ok{
                width: 180px;
                height: 46px;
                color: #fff;
                font-size: 14px;
                padding: 0;
                line-height: 46px;
                background-color: #97CE57;
            }
        }
        
    }
    .creative-box{
        .mask{
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
        }
        .creative-main{
            width: 700px;
            height: 100%;
            background-color: #fff;
            position: fixed;
            top: 0;
            right: 0;
            z-index: 11;
            .creative-main-head{
                padding-left: 20px;
                height: 70px;
                line-height: 70px;
                background-color: #fafafa;
                font-size: 18px;
            }
            .form-box{
                height: calc(~'100% - 196px');
                overflow-y: auto;
                padding: 25px 20px;
                .form-group{
                    .el-wrap{
                        width: 360px;
                        .btn-upload{
                            width: 100px;
                            height: 32px;
                            background-color: #97CE57;
                            color: #fff;
                            padding: 0;
                            line-height: 32px;
                            margin-top: 5px;
                            margin-bottom: 10px;
                        }
                        .icon{
                            width: 16px;
                            height: 16px;
                            display: inline-block;
                            background: url('../../../common/img/images/icon_16.png') no-repeat center;
                            cursor: pointer;
                            margin-top: -5px;
                        }
                    }
                    .upload{
                        display: inline-block;
                        width: 360px;
                        height: 100px;
                        background: #fafafa;
                        .image-wrap{
                            display: inline-block;
                            width: 80px;
                            height: 80px;
                            margin-top: 10px;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                            video{
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .icon{
                            float: right;
                            margin-right: 14px;
                            margin-top: 35px;
                            width: 30px;
                            height: 30px;
                            background: url('../../../common/img/images/icon_13.png') no-repeat center;
                        }
                    }
                }
                .extend{
                    width: 300px;
                    height: 40px;
                    line-height: 40px;
                    padding: 0 30px;
                    background: #E4F5FF;
                    color: #32A7FF;
                    font-size: 14px;
                    border-radius: 0 40px 40px 0;
                    // margin-top: 20px;
                    margin-left: -20px;
                    cursor: pointer;
                    .icon{
                        width: 40px;
                        height: 40px;
                        float: right;
                        background: url('../../../common/img/images/icon_15.png') no-repeat center;
                    }
                    .active{
                        background: url('../../../common/img/images/icon_14.png') no-repeat center;
                    }
                }
            }
            .bottom{
                height: 126px;
                line-height: 126px;
                text-align: center;
                border-top: 1px solid #DCDCDC;
                .btn-cancel{
                    width: 100px;
                    height: 46px;
                    padding: 0;
                    line-height: 46px;
                    background-color: #fff;
                    color: #8691CA;
                }
                .btn-ok{
                    width: 160px;
                    height: 46px;
                    padding: 0;
                    line-height: 46px;
                    background-color: #32A7FF;
                    color: #fff;
                }
            }
        }
    }
    .video-box {
        display: none;
        video {
            width: 500px;
            display: block;
        }
    }
    .material-cover {
        width: 150px;
        height: 150px;
        background-color: #808080;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        cursor: pointer;
        position: relative;
        iframe {
            height: 100%;
        }
        iframe, video {
            width: 100%;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(0,-50%);
        }
        .material-cover-mask {
            width: 100%;
            height: 100%;
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            background: url("../../../common/img/images/icon_magnify.png") no-repeat center;
        }
    }
    .material-cover:hover .material-cover-mask {
        display: block;
    }
    .iframe-box{
        background: rgba(0,0,0,0.85);
        .el-dialog{
            background: transparent;
            box-shadow: 0 0 0 rgba(0,0,0,0);
        }
    }
}
</style>
