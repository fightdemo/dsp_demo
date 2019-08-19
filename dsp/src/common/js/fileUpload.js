import Axios from 'axios'
import {
  Loading,
  Message
} from 'element-ui';
import {uploadUrl} from './config'

var loadingInstance,UPLOAD_OPTION;

export default fileUpload

function fileUpload(obj) {
  if (!UPLOAD_OPTION) {
    Axios({
      url: uploadUrl + "/fileUp/getUpInfo",
      method: "POST",
      data: {
        "project": 0, // 项目,   0代表dsp， 1代表adx
        "funcUrl": obj.funcUrl || 0 //功能， 0代表ad， 1代表oem， 2代表clientInfo
        // "project": 4, // 项目,  4代表atd
        // "funcUrl": obj.funcUrl || 2 //功能， 0:ad， 1:oem， 2:clientInfo，3:other，4:logo
      },
    }).then(function (res) {
      var data = res.data;
      UPLOAD_OPTION = {
        upKey: data.data.upKey,
        dir: data.data.dir,
        funcUrl: data.data.funcUrl,
        // status: data.status
        status: 0
      };
      uploadStatic(obj);
    });
  } else {
    uploadStatic(obj);
  }

  // 文件上传到本地服务器
  function uploadStatic(option) {
    var input;
    // loading默认为true
    if(option.loading !== false) {
      option.loading = true;
    }
    if(option.inpID) {
      input = document.getElementById(option.inpID)
    } else {
      // 保证id唯一
      var iptID = 'uploadInput' + (new Date()).getTime();
      input = document.createElement('input');
      input.setAttribute('id', iptID);
      input.setAttribute('type', 'file');
      input.setAttribute('name', 'file');
      document.body.appendChild(input);
      input.style.display = 'none';
    }
    var xhr = new XMLHttpRequest();
    if (option.btnID) {
      document.getElementById(option.btnID).onclick = function () {
        input.click();
      }
    }

    input.onchange = function () {
      var fd = new FormData();
      // 模拟七牛的up对象
      var up = {
        file: [],
        removeFile: function (file) {
          var index = Array.prototype.indexOf.call(input.files, file.nFile);
          if (index != -1) {
            up.file.splice(index, 1);
          }
        }
      }
      for (var i = 0; i < input.files.length; i++) {
        up.file.push(input.files[i])
      }
      if (!input.value) {
        return;
      }
      if (option.maxSize && input.files[0].size > option.maxSize * 1024 * 1024) {
        Message.error('请上传小于' + option.maxSize + 'M的文件');
        return;
      }
      if (option.BeforeUpload instanceof Function) {
        for (var i = 0; i < input.files.length; i++) {
          // 模拟七牛file对象
          var file = {
            nFile: input.files[i],
            name: input.files[i].name,
            size: input.files[i].size,
          }
          option.BeforeUpload(up, file, next)
        }
      } else {
        next()
      }
      // 结束后清空input
      input.value = "";

      function next() {
        if (up.file.length == 0) {
          return;
        }
        if (option.preview instanceof Function) {
          var preArr = []
          nameReg = /(\.jpe?g)|(\.png)|(\.gif)|(\.mp4)$/;
          for (var i = 0; i < up.file.length; i++) {
            var file = up.file[i];
            if (nameReg.test(file.name)) {
              preArr.push(getObjectURL(file))
            } else {
              preArr.push("");
            }
          }
          option.preview(preArr)
        }
        fd.append('file', up.file[0]);
        xhr.open('post', uploadUrl + '/fileUp/upload/' + UPLOAD_OPTION.dir + '/' + UPLOAD_OPTION.funcUrl + '/' + UPLOAD_OPTION.upKey);
        
        if (option.loading) {
          loadingInstance = Loading.service({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
        }
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            // 请求结束关闭loading
            if(option.loading) loadingInstance.close();
            if (xhr.status == 200) {
              var res = JSON.parse(xhr.responseText);
              if (res.status != -1) {
                option.FileUploaded && option.FileUploaded(res.data);
              } else {
                option.Error && option.Error();
              }
              input.value = "";
            } else if (xhr.status != 0) {
              Message.error("上传失败")
            }
          }
        }
        xhr.upload.onprogress = function (event) {
          var pre = Math.floor(100 * event.loaded / event.total);
          option.UploadProgress && option.UploadProgress(pre);
        }
        xhr.send(fd);
      }
    }

    function getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    }
  }

}
