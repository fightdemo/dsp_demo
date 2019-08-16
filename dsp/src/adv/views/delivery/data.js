export default {
    data() {
        return {
            //出价类型
            chargeModeList: [
                {'label':'cpm', 'name':'CPM'},
                {'label':'cpc', 'name':'CPC'}
            ],
            //后续行为
            interactionTypeList: [
                // {'label':'1', 'name':'仅展示'},
                {'label':'4', 'name':'跳转网页'},
                {'label':'2', 'name':'应用下载'}
            ],
            //投放速率
            controlModeList: [
                {'label':'2', 'name':'系统默认控制'},
                {'label':'0', 'name':'按花费控制'},
                {'label':'1', 'name':'按曝光量控制'}
            ],
            //
            speedUpList: [
                {'id':'0', 'value':'匀速'},
                {'id':'1', 'value':'加速'}
            ],
            //
            speedUnitList: [
                {'id':'day', 'value':'天'},
                {'id':'hour', 'value':'小时'}
            ],
            //
            frequencyList: [
                {'label':'0', 'name':'不设置频次'},
                {'label':'1', 'name':'自定义频次'}
            ],
            platformList1: [
                {'label':'all', 'name':'不限'},
                {'label':'ios', 'name':'自定义'}
            ],
            platformList2: [
                {'label':'ios', 'name':'IOS'},
                {'label':'android', 'name':'Android'}
            ],
            osVersionlist: [
                {'label':'all', 'name':'不限'},
                {'label':'custom', 'name':'自定义'}
            ],
            flowSourceList: [
                {'label': '1', 'name': '全网优化'},
                {'label': '2', 'name': '精选媒体'},
                {'label': '3', 'name': '推荐媒体'},
                {'label': '4', 'name': '激励视频媒体'}
            ],
            customList: [
                {'label': '1', 'name': '全选'},
                {'label': '2', 'name': '自定义'}
            ],
            // flowSourceList1: [
            //     {'label': '1', 'name': '全网优化'},
            //     {'label': '2', 'name': 'SDK流量'},
            //     {'label': '3', 'name': '媒体分类'},
            //     {'label': '4', 'name': '精选媒体'},
            //     {'label': '5', 'name': '指定媒体'},
            //     {'label': '6', 'name': '新品媒体'},
            //     {'label': '7', 'name': '精选行业包'},
            //     {'label': '8', 'name': '精选人群包'}
            // ],
            // flowSourceList2: [
            //     {'label': '1', 'name': '全网优化'},
            //     {'label': '3', 'name': '媒体分类'},
            //     {'label': '4', 'name': '精选媒体'},
            //     {'label': '5', 'name': '指定媒体'},
            //     {'label': '6', 'name': '新品媒体'},
            //     {'label': '7', 'name': '精选行业包'},
            //     {'label': '8', 'name': '精选人群包'}
            // ],
            // flowSourceList3: [
            //     {'label': '1', 'name': '全网优化'},
            //     {'label': '3', 'name': '媒体分类'}
            // ],
            area: [
                {'label': 'all', 'name': '不限'},
                {'label': '2', 'name': '省市'},
                {'label': '1', 'name': '一二线城市'},
                {'label': '3', 'name': '地理位置'}
            ],
            interest: [
                {'label': '0', 'name': '不使用'},
                {'label': '1', 'name': '自定义兴趣标签'}
            ],
            throng: [
                {'label': '0', 'name': '不使用'},
                {'label': '1', 'name': '广告受众'},
                {'label': '2', 'name': '人群ID'}
            ],
            sex1: [
                {'label':'all', 'name':'不限'},
                {'label':'m', 'name':'自定义'}
            ],
            sex2: [
                {'label':'m', 'name':'男'},
                {'label':'f', 'name':'女'}
            ],
            age1: [
                {'label':'all', 'name':'不限'},
                {'label':'custom', 'name':'自定义'}
            ],
            age2: [
                {'label':'1', 'name':'<18'},
                {'label':'2', 'name':'18-25'},
                {'label':'3', 'name':'25-30'},
                {'label':'4', 'name':'30-35'},
                {'label':'5', 'name':'35-40'},
                {'label':'6', 'name':'40-50'},
                {'label':'7', 'name':'>50'},
            ],
            custom1: [
                {'label':'all', 'name':'不限'},
                {'label':'custom', 'name':'自定义'}
            ],
            custom2: [
                {'label':'1', 'name':'1000RMB以下'},
                {'label':'2', 'name':'1001-3000RMB'},
                {'label':'3', 'name':'3001-5000RMB'},
                {'label':'4', 'name':'5001-10000RMB'},
                {'label':'5', 'name':'10000RMB以上'}
            ],
            phone1: [
                {'label':'all', 'name':'不限'},
                {'label':'custom', 'name':'自定义'}
            ],
            devicePriceList1: [
                {'label':'all', 'name':'不限'},
                {'label':'custom', 'name':'自定义'}
            ],
            devicePriceList2: [
                {'label':'1', 'name':'500元以下'},
                {'label':'2', 'name':'500-1000元'},
                {'label':'3', 'name':'1000-2000元'},
                {'label':'4', 'name':'2000-3000元'},
                {'label':'5', 'name':'3000-4000元'},
                {'label':'6', 'name':'4000元以上'}
            ],
            netList: [
                {'label':'1', 'name':'wifi'},
                {'label':'2', 'name':'2G'},
                {'label':'3', 'name':'3G'},
                {'label':'4', 'name':'4G'},
                {'label':'5', 'name':'5G'},
                {'label':'6', 'name':'其他'}
            ],
            ISPList: [
                {'label':'1', 'name':'移动'},
                {'label':'2', 'name':'联通'},
                {'label':'3', 'name':'电信'},
                {'label':'4', 'name':'其他'}
            ],
            list: [
                {'label':'all', 'name':'不限'},
                {'label':'custom', 'name':'自定义'}
            ],
            radioList: [
                {'label':'1', 'name':'定向'},
                {'label':'2', 'name':'排除'}
            ],
            onlineEnum: {
                10: '离线',
                20: '上线中',
                30: '已上线',
                40: '离线中',
                50: '上传中',
                60: '未完成',
                100: '出错，联系管理员'
            },
            dataType: [0, "	品牌名称/贊助信息", "描述信息", "用户评级", "点赞数", "下载数量",
            "价格", "售卖价格", "服务电话", "地址", "描述信息2", "URL", "评论数", "H5","按钮文字"]
        }
    }
}