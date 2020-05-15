<template>
  <div id="main">
    <div id="logo_nav">
      <img src="@/assets/img/logo.png" style="height: 152px; width: 416px;" />
    </div>
    <div id="login_div">
      <div id="login_head">
        <p>VUE-admin管理系统欢迎您</p>
        <hr style="height:3px;border:none;border-top:2px solid #76869F;width:85%;margin-top:0px;" />
      </div>
      <div id="login_btn">
        <div class="form-group">
          <label class="control-label" for="inputSuccess1">账&nbsp;&nbsp;&nbsp;&nbsp;号</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="userText" class="span-css">{{userText}}</span>
          <input type="text" class="form-control" id="username" v-model="userName" placeholder="请输入用户名">
        </div>
        <div class="form-group">
          <label class="control-label" for="inputPassword">密&nbsp;&nbsp;&nbsp;&nbsp;码</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="passText" class="span-css">{{passText}}</span>
          <input type="password" class="form-control" id="password" v-model="password" placeholder="请输入密码">
        </div>
        <div class="form-group">
          <label class="control-label" for="inputVericode">验证码</label>&nbsp;&nbsp;&nbsp;&nbsp;
          <span id="randText" class="span-css">{{randText}}</span>
          <table>
            <tr>
              <td style="width:50%;"><input type="text" class="form-control" id="rand" v-model="rand" placeholder="验证码"></td>
              <td style="width:50%;text-align:right;"><IMG :src="safeCode" border=0 id="safecode" />
                <img src="@/assets/img/icon_refresh.png" style="width:17px;height:17px;" @click="reloadcode('true')">
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div id="login_sub">
        <button type="button" @click="onLogin" class="btn btn-primary" v-bind:disabled="isDisabled" 
        style="width:85%;background-color:#256DF6">
          {{loginBtnText}}</button>
      </div>
    </div>

    <div class="footer">
      <p>Copyright © 2019 Tony All Right Reserved.</p>
    </div>
  </div>
</template>
<script>
import { login, getVerifyCode } from "@/api/system/login";
import { setToken } from "@/utils/permission";
import { randomBytes } from 'crypto';
export default {
  data() {
    return {
      isContinue: true,
      type: "",
      text: "",
      isDisabled: false,
      loginBtnText: "登 录",
      userName: "",
      password: "",
      rand: "",
      safeCode: "#",
      userText: "",
      passText: "",
      randText: ""
    };
  },
  methods: {
    onLogin: function() {
      //点击登录按钮之后不可重复再点击
      this.isDisabled = true;
      this.isContinue = true;
      this.loginBtnText = "登录中...";
      var username = this.userName;
      var password = this.password;
      var rand = this.rand;
      var uniqueCode = sessionStorage.getItem(
        process.env.VUE_APP_NAME + "_uniqueKey"
      );
      this.userText = null;
      this.passText = null;
      this.randText = null;
      if (username == "" || username == null) {
        this.userText = "请输入您的账号信息!";
        this.isDisabled = false;
        this.loginBtnText = "登 录";
        this.isContinue = false;
      }
      if (password == "" || password == null) {
        this.passText = "请输入您的密码信息!";
        this.isDisabled = false;
        this.loginBtnText = "登 录";
        this.isContinue = false;
      }
      if (rand == "" || rand == null) {
        this.randText = "请输入下方图片中的数字验证码!"
        this.isDisabled = false;
        this.loginBtnText = "登 录";
        this.isContinue = false;
      }
      if(this.isContinue == false){
        return;
      }
      var params = {
        username: username,
        password: password,
        verifyCode: rand,
        uniqueCode: uniqueCode
      };
      login(params).then(response => {
        if (response.isSuccess == true) {
          setToken(response.data);
          this.$router.push({ path: "/index" });
          //这一步的操作是为了让页面重新加载，避免index页面中部分样式由于class未加载，而js文件中处理程序已经执行导致的组件加载不出来的问题
          this.$router.go(0);
        } else {
          this.isDisabled = false;
          this.loginBtnText = "登 录";
          this.$message({
            message: response.responseMsg,
            type: "error",
            duration: 3000
          });
          this.reloadcode();
        }
      });
    },
    //重新加载验证码
    reloadcode: function(refresh) {
      var uniqueKey = sessionStorage.getItem(
        process.env.VUE_APP_NAME + "_uniqueKey"
      );
      var params = { uniqueKey: uniqueKey, refresh: refresh };
      getVerifyCode(params).then(response => {
        if (response.isSuccess == true) {
          this.safeCode = "data:image/jpeg;base64," + response.data;
        }
      });
    },
    //生成随机字符串
    randomString: function(len) {
      len = len || 32;
      let timestamp = new Date().getTime();
      let $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefhijklmnopqrstuvwxyz123456789";
      let maxPos = $chars.length;
      let randomStr = "";
      for (let i = 0; i < len; i++) {
        randomStr += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return randomStr + timestamp;
    }
  },
  mounted(){
    //加载验证码接口
    var uniqueKey = sessionStorage.getItem(process.env.VUE_APP_NAME + "_uniqueKey");
    if( uniqueKey == null || uniqueKey == ""){
      uniqueKey = this.randomString(32);
      sessionStorage.setItem(process.env.VUE_APP_NAME + "_uniqueKey",uniqueKey);
    }
    this.reloadcode("false");
    //捕获回车事件登录
    document.onkeydown = function (event_e) {
      if (window.event){
        event_e = window.event;
      }
      var int_keycode = event_e.charCode || event_e.keyCode;
      if (int_keycode == 13) {
        this.onLogin();
      }
    }.bind(this)
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #main {
    margin: 0 auto;
    padding: 0px;
    background: url("../../assets/img/bg_keji5.jpg") no-repeat;
    width: 100%;
    height: 100%;
    background-attachment: fixed;
    background-size: cover;
    -webkit-background-size: cover;
    /* 兼容Webkit内核浏览器如Chrome和Safari */
    -o-background-size: cover;
    /* 兼容Opera */
    zoom: 1;
  }

  #login_div {
    width: 300px;
    height: 430px;
    background-color: #fff;
    position: absolute;
    right: 10%;
    top: 50%;
    margin-top: -215px;
    filter: alpha(opacity=80);
    /*ie滤镜，透明度50%*/
    -moz-opacity: 0.8;
    /*Firefox私有，透明度50%*/
    opacity: 0.9;
    /*其他，透明度50%*/
    z-index: 999;
    border-radius: 2px;
    background: #fff;
    box-shadow: 0 0 15px rgba(6, 21, 77, 0.4);
    -ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=6, Direction=145, Color='#666666')";
  }

  #logo_nav {
    width: 416px;
    height: 152px;
    position: absolute;
    top: 50%;
    left: 14.5%;
    margin-top: -76px;
  }

  #login_head {
    width: 100%;
    height: auto;
  }

  #login_head p {
    font-family: "微软雅黑";
    font-size: 20px;
    color: #265df6;
    padding-left: 7.5%;
    padding-top: 40px;
    font-weight: 900;
  }

  #login_btn {
    width: 90%;
    padding-left: 7.5%;
    font-family: "微软雅黑";
    color: #76869F;
  }

  #login_sub {
    text-align: center;
    padding-top: 30px;
  }

  .span-css {
    color: red;
    font-size: 12px;
    font-weight: 900;
  }

  .footer {
    width: 100%;
    height: 50px;
    text-align: center;
    position: absolute;
    top: 90%;
    z-index: 888;
  }

  .footer p {
    color: white;
    line-height: 25px;
  }

  .footer a:focus {
    outline: none;
  }

  .footer a {
    color: white;
    font-size: 12px;
  }

  .footer ul {
    text-align: center;
    margin: 0;
    line-height: 25px;
    padding: 0;
  }
</style>

