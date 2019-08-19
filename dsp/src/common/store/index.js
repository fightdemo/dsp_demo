import {
  ajax
} from '@/common/js/utils';


export default {
  state: {
    userInfo: {},
    oem: JSON.parse(localStorage.oem||'{}'),
    permission: {},
    silderFlag: false,
  },
  mutations: {
    setUserInfo(state, data) {
      state.userInfo = data
    },
    setOem(state, data) {
      state.oem = data
      localStorage.oem = JSON.stringify(data);
    },
    setPermission(state, data) {
      state.permission = data;
    },
    setSilderFlag(state, data) {
      state.silderFlag = data;
    }
  },
  actions: {
    // 用户信息
    getUserInfo(context) {
      return ajax({
        url: '/dsp/UserInfo',
        load:true,
        data: {}
      }).then(res => {
        context.commit('setUserInfo', res.data)
      })
    },
    getPermission(context) {
      return ajax({
        url: '/dsp/pri/user/action',
        daa: {},
        load:true,
      }).then(res => {
        var obj = {
          view: setData(res.data.view),
          act: setData(res.data.act),
        };
        context.commit('setPermission', obj)

        function setData(arr,parent) {
          var obj = {},i,temp,name;
          arr = arr || [];
          for (i = 0; i < arr.length; i++) {
            temp = arr[i];
            name = parent? parent + '.' + temp.name : temp.name;
            obj[temp.actionID] = name;

            if (temp.sub) Object.assign(obj,setData(temp.sub,name))
          }
          return obj;
        }
      })
    },
    getSilderFlag(context) {
      context.commit('setSilderFlag')
    }
  }
};
