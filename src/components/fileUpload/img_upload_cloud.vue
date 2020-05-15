<template>
  <div>
    <div class="wrapper">
      <div class="uploaded-container" v-if="fileList.length > 0" v-for="(file, index) in fileList" :key="index">
        <!-- 遮罩 -->
        <div class="mask-div" v-if="uploadLoading && file.url.length > 400"></div>
        <!-- 进度条 -->
        <el-progress class="progress" type="circle" :percentage="percentage" v-if="uploadLoading && file.url.length > 400"></el-progress>
        <div :class="disabled ? 'hidden' : 'delete-icon'" @click="removeFile(file)"></div>
        <!-- <img v-if="file.url.length > 400" class="uploaded-img" :src="file.url" v-preview="file.url"/>
        <img v-else class="uploaded-img" :src="file.url" v-preview="file.url"/> -->
        <img class="uploaded-img" :src="file.url" :preview="file.url"/>
      </div>
      <!-- 上传按钮 -->
      <div :class=" (fileList.length < countLimit && type === 'list' && !disabled) || (ifShow && !uploadLoading && type === 'singel' && fileList.length <1) ? 'upload-module' : 'upload-module hidden'">
        <div :id="id"  limitSize="1" :ext="ext"></div>
        <div class="plus-icon"></div>
      </div>
    </div>
    <div v-if="position === 'left'" class="upload-tip left">{{tip}}</div>
    <div v-if="position === 'center'" class="upload-tip center">{{tip}}</div>
    <div v-if="position === 'right'" class="upload-tip right">{{tip}}</div>
  </div>
</template>

<script>
import "./js/jquery.js"
import "./js/webuploader.js"
import CRC32 from "./js/crc32.js"
import { Base64 } from "js-base64"
export default {
  name: "img-upload-cloud",
  props: {
    // 待删除的组件名称，页面有多个上传组件时，每一个都需要定义id，注销的组件名称为必填，值为上一个相同上传组件的id值
    unRegisterName: {
      type: String,
      default: function () {
        return ''
      }
    },
    disabled: {
      type: Boolean,
      default: function (){
        return false
      }
    },
    // id，如果页面只需要一个上传按钮时可不传，否则必传
    id: {
      type: String,
      default: function() {
        return "CloudUpload";
      }
    },
    // 列表上传-list，单个图片上传-singel
    type: {
      type: String,
      default: function() {
        return "singel";
      }
    },
    //上传提示
    tip: {
      type: String,
      default: function() {
        return "";
      }
    },
    position: {
      type: String,
      default: function() {
        return "left";
      }
    },
    //文件后缀名限制
    ext: {
      type: String,
      default: function() {
        return "gif,jpg,jpeg,bmp,png";
      }
    },
    //分片大小设置
    chunkSize: {
      type: Number,
      default: function() {
        return 2097152;
      }
    },
    //分片上传重试次数
    chunkRetry: {
      type: Number,
      default: function() {
        return 1;
      }
    },
    //是否自动上传
    auto: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    //上传文件大小限制
    sizeLimit: {
      type: Number,
      default: function() {
        return 209715200;
      }
    },
    //上传文件数量限制
    countLimit: {
      type: Number,
      default: function() {
        return 5;
      }
    }
  },
  data() {
    return {
      filePath: process.env.VUE_APP_FILE_PATH,
      ifShow: true,
      appId: process.env.VUE_APP_cloudAppId,
      token: "", //上传凭证
      securityKey: process.env.VUE_APP_cloudSecurityKey,
      checkUrl: process.env.VUE_APP_cloudCheckUrl,
      uploadUrl: process.env.VUE_APP_cloudUploadUrl,
      mergeUrl: process.env.VUE_APP_cloudMergeUrl,
      readUrl: process.env.VUE_APP_cloudReadUrl,
      previewName: "", //预览按钮显示的名字
      wul_fileMd5: "", //文件md5
      wul_size: 0, //文件大小
      wul_fileName: "", //文件名称
      wul_chunk: 0, //切片上传数
      wul_uploader: "", //上传控件
      fileList: [],
      listType: "text",
      percentage: 0,
      fileObject: {
        uid: "",
        name: "",
        ext: "",
        type: "",
        status: "",
        percentage: 0,
        url: ""
      },
      tempIndex: 1,
      uploadLoading: false,
      extend4check: "", //业务支持信息
      callback4check: false, //调用检测接口时iscallback参数的值
      isSecret: false, //是否私密文件
      preId: -1 //回调占位符
    };
  },
  methods: {
    setFileList (list) {
      list.forEach( item =>{
        if(item.url.indexOf(this.readUrl) < 0){
          item.url = this.readUrl + item.url
        }
      })
      this.fileList = list
      this.ifShow = this.type !== 'singel'
    },
    onFileSelect() {
      if (this.type === "singel") {
        this.ifShow = false;
      } else {
        this.ifShow = true;
      }
      // 直接上传,如果是自动上传，不需要此段代码
      if (!this.auto) {
        if (this.wul_uploader.getFiles()[0] != null) {
          this.wul_uploader.upload(this.wul_uploader.getFiles()[0].id);
        } else {
          this.$message({
            message: "请选择上传文件",
            type: "error"
          });
        }
      }
      this.$previewRefresh();
    },
    /**
     * 获取当前上传列表中的文件
     * @returns {Array|*}
     */
    getFileList: function() {
      let copyList = $.extend(true,[],this.fileList);
      if(copyList){
        var parttern = this.readUrl
        if(copyList){
          copyList.forEach( item =>  item.url = item.url.replace(parttern,''))
        }
      }
      return copyList;
    },
    //获取url兼容不同浏览器
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    //绑定事件
    wul_init: function() {
      //一次只能上传一个文件,即当状态不为ready或者uploadind的时候
      this.wul_uploader.on(
        "beforeFileQueued",
        function(files) {
          if (
            this.fileObject.status === "ready" ||
            this.fileObject.status === "uploading"
          ) {
            this.$message({
              message: "请先上传文件到服务器",
              type: "error"
            });
            return;
          }
        }.bind(this)
      );
      this.wul_uploader.on(
        "filesQueued",
        function(files) {
          if (
            this.fileObject.status === "ready" ||
            this.fileObject.status === "uploading"
          ) {
            this.$message({
              message: "请先上传文件到服务器",
              type: "error"
            });
            return;
          }
          if (files.length > 1) {
            for (var i = 0; i < files.length; i++) {
              this.wul_uploader.cancelFile(files[i]);
            }
            this.wul_uploader.reset();
            this.wul_fileMd5 = "";
            this.wul_size = 0;
            this.wul_fileName = "";
            this.wul_chunk = 0; //当前切片数
            this.percentage = 0;
          } else if (files.length === 0) {
            //未选择到有效文件时，不做任何处理
          } else {
            if (this.fileList.length == this.countLimit) {
              this.$message({
                message: "已经达到上传文件限制数量",
                type: "error"
              });
            } else {
              //此时往需要上传的文件列表中添加文件
              var _this = this;
              this.wul_uploader.makeThumb(
                files[0],
                function(error, src) {
                  if (error) {
                    return;
                  }
                  let file = {
                    uid: Date.now() + _this.tempIndex++,
                    name: files[0].name,
                    type: files[0].type,
                    ext: files[0].ext,
                    fileSize: files[0].size,
                    status: "ready",
                    percentage: 0,
                    url: src
                  };
                  _this.fileObject = file;
                  _this.fileList.push(_this.fileObject);
                  if (_this.auto) {
                    _this.uploadLoading = true;
                  }
                },
                1,
                1
              );
            }
          }
        }.bind(this)
      );
      //文件校验格式和大小
      this.wul_uploader.on(
        "error",
        function(type) {
          if (type == "Q_EXCEED_SIZE_LIMIT") {
            this.$message({
              message: "文件超过指定大小",
              type: "error"
            });
          }
          if (type == "Q_TYPE_DENIED") {
            this.$message({
              message: "文件格式错误，请选择文件",
              type: "error"
            });
          }
          if (type == "F_EXCEED_SIZE") {
            this.$message({
              message: "文件超过" + this.sizeLimit / 1024 / 1024 + "M",
              type: "error"
            });
          }
        }.bind(this)
      );
      //上传进度
      this.wul_uploader.on(
        "uploadProgress",
        function(file, percentage) {
          this.percentage = parseInt(percentage * 100);
          this.fileObject.status = "uploading";
          this.fileObject.percentage = parseInt(this.percentage);
        }.bind(this)
      );
      //每次切片上传完成之后的判断
      this.wul_uploader.on("uploadAccept", function(object, ret) {
        if (ret.responseCode != 0) {
          this.wul_uploader.cancelFile(this.wul_uploader.getFiles()[0].id);
        }
      });
      this.wul_uploader.on("uploadBeforeSend", function(object, data, headers) {
      });
    },
    option: function(key, val) {
      this.wul_uploader.option(key, val);
      var options = this.wul_uploader.options;
      this.wul_uploader.destroy(); //注销uploader
      this.wul_uploader = WebUploader.create(options);
      this.wul_init();
    },
    stop: function() {
      if(this.wul_uploader.getFiles().length>0){
        this.wul_uploader.cancelFile(this.wul_uploader.getFiles()[0].id);
        this.uploadLoading = false;
      }
    },
    start: function() {
      if (this.wul_uploader.getFiles()[0] != null) {
        this.uploadLoading = true;
        this.wul_uploader.upload(this.wul_uploader.getFiles()[0].id);
      } else {
        this.$message({
          message: "请选择上传文件",
          type: "error"
        });
      }
    },
    removeFile: function(file) {
      this.fileList.splice(this.fileList.indexOf(file), 1);
      if (file.status == "ready") {
        this.wul_uploader.reset();
        this.fileObject = {
          uid: "",
          name: "",
          ext: "",
          type: "",
          status: "",
          percentage: 0,
          url: ""
        };
        this.percentage = 0;
      }
      if (this.fileList.length === 0) {
        this.ifShow = true;
      }
    },
    //清空所有文件并清除文件列表
    removeAllFile: function() {
      this.fileList = [];
      this.fileObject = {
        uid: "",
        name: "",
        ext: "",
        type: "",
        status: "",
        percentage: 0,
        url: ""
      };
      this.uploadLoading = false;
      this.ifShow = true;
      this.wul_uploader.reset();
      this.percentage = 0;
    },
    change: function() {
      this.option("accept", {
        title: "Images",
        extensions: "gif,jpg,jpeg,bmp,png"
      });
    },
    requestToken: function(paramsJsonStr) {
      var tokenValue = '';
      let data = {params: paramsJsonStr,securityKey: this.securityKey};
      jQuery.ajax({
        type: "POST",
        // 测试
        url: process.env.VUE_APP_API + process.env.VUE_APP_createToken,
        data: JSON.stringify(data),
        async: false,
        contentType: "application/json",
        dataType: "json",
        success: function(response){
          if (response.isSuccess == true) {
            tokenValue = response.data;
          } else {
            this.$message({
              message: "获取凭证错误",
              type: "error"
            });
          }
        }.bind(this),
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          this.$message({
            message: "上传失败...",
            type: "error"
          });
          this.uploadLoading = false;
        }.bind(this)
      })
      return tokenValue;
    },
    getFileCrc32: function(block) {
      var tokenDeferred = $.Deferred();
      var fr = new FileReader();
      fr.onload = function(e) {
        var result = CRC32.bstr(this.result).toString(16);
        tokenDeferred.resolve(result);
      };
      fr.readAsBinaryString(
        block.file.source.source.slice(block.start, block.end)
      );
      return tokenDeferred.promise();
    },
    fileBuf: function(file) {
      var deferred = $.Deferred(function(file) {
        var fr = new FileReader();
        fr.onload = function(e) {
          var result = CRC32.buf(this.result).toString(16);
          deferred.resolve();
        };
        fr.readAsArrayBuffer(
          );
          file.file.source.source.slice(file.start, file.end)
      });
    }
  },
  mounted() {
    if(this.unRegisterName){
      WebUploader.Uploader.unRegister(this.unRegisterName)
    }
    WebUploader.Uploader.register(
      {
        name: this.id,
        "before-send-file": "beforeSendFile",
        "before-send": "beforeSend",
        "after-send-file": "afterSendFile"
      },
      {
        beforeSendFile: function(file) {
          var deferred = WebUploader.Deferred();
          this.wul_uploader.md5File(file).then(
            function(val) {
              this.wul_fileMd5 = val;
              this.wul_size = file.size;
              this.wul_fileName = file.name;

              var paramsJsonStr = JSON.stringify({
                chunkSize: this.chunkSize,
                extend: this.extend4check,
                fileMd5: this.wul_fileMd5,
                fileName: this.wul_fileName,
                isCallback: this.callback4check,
                isSecret: this.isSecret,
                size: this.wul_size
              });
              var tokenValue = this.requestToken(paramsJsonStr);
              if (tokenValue == null || tokenValue == "") {
                deferred.reject();
                return deferred.promise();
              }
              // 获取断点续传位置
              jQuery.ajax({
                type: "POST",
                // 测试
                url: this.checkUrl,
                data: {
                  // 应用分配id
                  appId: this.appId,
                  // 当前时间戳
                  t: tokenValue
                },
                dataType: "json",
                // 上传失败
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                  this.$message({
                    message: "上传失败...",
                    type: "error"
                  });
                  this.uploadLoading = false;
                }.bind(this),
                success: function(response) {
                  if (response.isSuccess == true) {
                    //表示该文件不需要分片，已经上传成功
                    if (response.data.uri) {
                      this.stop();
                      deferred.reject();
                      this.wul_uploader.reset();
                      this.fileObject.status = "success";
                      this.fileObject.percentage = 100;
                      this.fileObject.url = this.readUrl + response.data.uri;
                    }
                    // 切片获取成功
                    this.wul_chunk = response.data.chunk;
                    if (this.callback4check) {
                      this.preId = response.data.preId;
                    }
                    deferred.resolve();
                    this.uploadLoading = false;
                  } else {
                    // 切片获取失败,请求成功
                    this.wul_uploader.cancelFile(file); //取消文件上传
                    this.$message({
                      message: "切片检查失败,请联系管理员",
                      type: "error"
                    });
                    deferred.resolve();
                    this.uploadLoading = false;
                  }
                }.bind(this)
              });
              return deferred.promise();
            }.bind(this)
          );
          return deferred.promise();
        }.bind(this),
        beforeSend: function(block) {
          var deferred = WebUploader.Deferred();
          if (block.chunk < this.wul_chunk) {
            return deferred.reject();
          }
          this.getFileCrc32(block).then(function(crc32) {
            var chunkCrc32 = crc32;
            var paramsJsonStr = JSON.stringify({
              chunkSize: this.chunkSize,
              chunk: block.chunk,
              chunkCrc: chunkCrc32,
              size: this.wul_size,
              fileMd5: this.wul_fileMd5
            });
            var tokenValue = this.requestToken(paramsJsonStr);
            this.wul_uploader.options.formData = {
              appId: this.appId,
              t: tokenValue
            };
            deferred.resolve();
          }.bind(this)
          );
          return deferred.promise();
        }.bind(this),
        afterSendFile: function(file) {
          var params = {
            chunkSize: this.chunkSize,
            fileName: this.wul_fileName,
            size: this.wul_size,
            isSecret: this.isSecret,
            fileMd5: this.wul_fileMd5
          };
          if (this.preId > -1) {
            params.preId = this.preId;
          }
          var paramsJsonStr = JSON.stringify(params);
          var tokenValue = this.requestToken(paramsJsonStr);
          // 如果分块上传成功，则通知后台合并分块
          jQuery.ajax({
            type: "POST",
            url: this.mergeUrl,
            data: {
              appId: this.appId,
              t: tokenValue
            },
            success: function(response) {
              if (response.isSuccess) {
                this.fileObject.status = "success";
                this.fileObject.percentage = 100;
                this.fileObject.url = this.readUrl + response.data.uri;
                // 判断是不是自动上传，如果是此处将结果保存到文件列表中，并且刷新界面显示
                if (this.auto) {
                  this.onFileSelect();
                }
              } else {
                this.fileObject.status = "exception";
                this.$message({
                  message: "上传失败,失败原因:" + response.responseMsg,
                  type: "error"
                });
              }
              this.uploadLoading = false;
              this.wul_uploader.reset();
              this.percentage = 0;
              this.wul_fileMd5 = "";
              this.wul_size = 0;
              this.wul_fileName = "";
              this.wul_chunk = 0; //当前切片数
            }.bind(this)
          });
        }.bind(this)
      }
    );
    this.wul_uploader = WebUploader.create({
      // swf文件路径
      swf: "./js/Uploader.swf",
      // 文件接收服务端。
      server: this.uploadUrl,
      // 定义选择按钮
      pick: {
        id: "#" + this.id,
        innerHTML: this.previewName,
        'multiple': false
      },
      // 自动上传
      auto: this.auto,
      // 禁止浏览器打开文件
      disableGlobalDnd: true,
      // 分片上传
      chunked: true,
      // 分片大小为2M
      chunkSize: this.chunkSize,
      // 分片上传失败重试次数
      chunkRetry: this.chunkRetry,
      // 图片不做压缩
      compress: false,
      // 队列设置10个,为了选择多个文件的时候能提示
      fileNumLimit: 10,
      // 提前准备好下一个文件
      prepareNextFile: true,
      // 限制单个文件大小
      fileSingleSizeLimit: this.sizeLimit,
      //线程数
      threads: 1,
      // 限制格式
      accept: {
        title: "access",
        extensions: this.ext
      }
    });
    this.wul_init();
    // 判断disabled是否禁用上传和删除
    if(this.disabled){
      this.ifShow = false
    }
  },
  beforeDestroy () {
    this.removeAllFile()
    WebUploader.Uploader.unRegister(this.id);
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/upload.css";
/* ----------------Reset Css--------------------- */
  html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, figcaption, figure, footer, header, hgroup, menu, nav, section, summary,
  time, mark, audio, video, input  {
    margin: 0;
    padding: 0;
    border: none;
    outline: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  html, body, form, fieldset, p, div, h1, h2, h3, h4, h5, h6 {
    -webkit-text-size-adjust: none;
  }

  article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
    display: block;
  }

  body {
    font-family: arial, sans-serif;
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after, q:before, q:after {
    content: '';
    content: none;
  }

  ins {
    text-decoration: none;
  }

  del {
    text-decoration: line-through;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

.hidden {
  display: none;
}
.wrapper {
  background-color: #f8f8ff;
  display: flex;
  flex-wrap: wrap;
  .uploaded-container {
    // float: left;
    width: 150px;
    height: 150px;
    border-radius: 4px;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
    cursor: pointer;
    &:last-child {
      margin-right: 0px;
    }
    .mask-div {
      float: left;
      width: 150px;
      height: 150px;
      background: #fbfdff;
      border-radius: 4px;
      position: absolute;
      z-index: 999;
      border: 1px solid #c0ccda;
    }
    .progress {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -63px;
      margin-top: -63px;
      z-index: 1400;
    }
    .uploaded-img {
      width: 150px;
      height: 100%;
      border-radius: 4px;
      border: 1px solid #c0ccda;
    }
    .delete-icon {
      display: none;
    }
    &:hover {
      .delete-icon {
        display: block;
        position: absolute;
        right: -1px;
        width: 20px;
        height: 20px;
        opacity: 0.8;
        background: #ffffff;
        box-shadow: 0 1px 2px 0 rgba(204, 204, 204, 0.5);
        border-radius: 0 0 0 20px;
        cursor: pointer;
        &:before {
          content: "";
          width: 20px;
          height: 20px;
          position: absolute;
          top: -2px;
          right: 0px;
          left: 2px;
          background: url(../../assets/img/close@2x.png) no-repeat;
          background-size: 20px 20px;
        }
        &:hover {
          box-shadow: 0;
          &::before {
            content: "";
            width: 20px;
            height: 20px;
            position: absolute;
            top: -2px;
            right: 0px;
            left: 2px;
            background: url(../../assets/img/close_active@2x.png) no-repeat;
            background-size: 20px 20px;
          }
        }
      }
    }
  }
  .upload-module {
    margin-right: 15px;
    float: left;
    width: 148px;
    height: 148px;
    background: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    .upload-btn {
      width: 100%;
      height: 100%;
      position: absolute;
      color: #fbfdff;
      z-index: 999;
    }
    .selectFile {
      position: absolute;
      filter: alpha(opacity=0);
      opacity: 0;
      width: 92px;
      height: 92px;
      cursor: pointer;
      z-index: 9999999;
    }
    .plus-icon {
      position: absolute;
      width: 40px;
      height: 40px;
      top: 50%;
      left: 50%;
      margin-top: -20px;
      margin-left: -20px;
      border-radius: 100px;
      box-sizing: border-box;
      z-index: 99;
      &:before {
        content: "";
        position: absolute;
        width: 40px;
        height: 2px;
        left: 50%;
        top: 50%;
        margin-left: -20px;
        margin-top: -1px;
        background-color: #cccccc;
      }
      &:after {
        content: "";
        position: absolute;
        width: 2px;
        height: 40px;
        left: 50%;
        top: 50%;
        margin-left: -1px;
        margin-top: -20px;
        background-color: #cccccc;
      }
    }
    &:hover {
      border: 1px dashed #409eff;
    }
  }
}
.upload-tip {
  color: red;
  font-size: 12px;
  margin-top: 7px;
  float: left;
  width: 148px;
  line-height: 22px;
}
.left {
  text-align: left;
}
.center {
  text-align: center;
}
.right {
  text-align: right;
}
</style>