<template>
  <div id="main-div">
    <!-- Main Header -->
    <header class="main-header">
      <!-- Logo -->
      <a href class="logo">
        <!-- mini logo for sidebar mini 50x50 pixels -->
        <span class="logo-mini">
          <b>Tony</b>
        </span>
        <!-- logo for regular state and mobile devices -->
        <span class="logo-lg">
          <b>vue-admin-demo</b>
        </span>
      </a>

      <!-- Header Navbar -->
      <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <a href="javascript:void(0)" class="sidebar-toggle" data-toggle="offcanvas" role="button">
          <span class="sr-only">切换导航</span>
        </a>

        <!-- Navbar Right Menu -->
        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">
            <!-- Notifications Menu -->
            <!-- <li class="dropdown notifications-menu">
              <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown" >
                <i class="fa fa-bell-o"></i>
                <span class="label label-warning">10</span>
              </a>
              <ul class="dropdown-menu">
                <li class="header">你有10条消息</li>
                <li>
                  <ul class="menu">
                    <li>
                      <a href="javascript:void(0)">
                        <i class="fa fa-users text-aqua"></i> 新用户注册!
                      </a>
                    </li>
                  </ul>
                </li>
                <li class="footer">
                  <a href="javascript:void(0)">查看所有</a>
                </li>
              </ul>
            </li> -->

            <!-- User Account Menu -->
            <li class="dropdown user user-menu">
              <!-- Menu Toggle Button -->
              <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">
                <!-- The user image in the navbar-->
                <img src="@/assets/img/img_inConstruction.png" class="user-image" alt="User Image" />
                <!-- hidden-xs hides the username on small devices so only the image appears. -->
                <span class="hidden-xs" id="name">{{nickName}}</span>
              </a>
              <ul class="dropdown-menu">
                <!-- The user image in the menu -->
                <li class="user-header">
                  <img
                    src="@/assets/img/img_inConstruction.png"
                    class="user-image"
                    alt="User Image"
                  />
                  <p id="pname">
                    {{nickName}}
                    <small>2016年注册</small>
                  </p>
                </li>
                <!-- Menu Body -->
                <li class="user-body">
                  <div class="row">
                    <div class="col-xs-4 text-center">
                      <a href="javascript:void(0)" @click="updateUserInfo">个人信息</a>
                    </div>
                    <div class="col-xs-4 text-center">
                      <a href="javascript:void(0)">设置</a>
                    </div>
                    <div class="col-xs-4 text-center">
                      <a href="javascript:void(0)">主题</a>
                    </div>
                  </div>
                  <!-- /.row -->
                </li>
                <!-- Menu Footer-->
                <li class="user-footer">
                  <div class="pull-left">
                    <a href="javascript:void(0)" @click="updatePassword" class="btn btn-default btn-flat">修改密码</a>
                  </div>
                  <div class="pull-right">
                    <a href="javascript:void(0)" @click="logout" class="btn btn-default btn-flat">退出</a>
                  </div>
                </li>
              </ul>
            </li>
            <!-- Control Sidebar Toggle Button -->
            <li>
              <a href="javascript:void(0)" data-toggle="control-sidebar">
                <i class="fa fa-gears"></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
      <!-- sidebar: style can be found in sidebar.less -->
      <section class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel">
          <div class="pull-left image">
            <img src="@/assets/img/img_inConstruction.png" class="user-image" alt="User Image" />
          </div>
          <div class="pull-left info">
            <p id="aname">{{nickName}}</p>
            <!-- Status -->
            <a href="javascript:void(0)">
              <i class="fa fa-circle text-success"></i> 在线
            </a>
          </div>
        </div>
        <!-- Sidebar Menu -->
        <ul class="sidebar-menu"></ul>
        <!-- /.sidebar-menu -->
      </section>
      <!-- /.sidebar -->
    </aside>
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper" id="content-wrapper">
      <div class="content-tabs">
        <button class="roll-nav roll-left tabLeft" onclick="scrollTabLeft()">
          <i class="fa fa-backward"></i>
        </button>
        <nav class="page-tabs menuTabs tab-ui-menu" id="tab-menu">
          <div class="page-tabs-content" style="margin-left: 0px;"></div>
        </nav>
        <button class="roll-nav roll-right tabRight" onclick="scrollTabRight()">
          <i class="fa fa-forward" style="margin-left: 3px;"></i>
        </button>
        <div class="btn-group roll-nav roll-right">
          <button class="dropdown tabClose" data-toggle="dropdown">
            页签操作
            <i class="fa fa-caret-down" style="padding-left: 3px;"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-right" style="min-width: 128px;">
            <li>
              <a class="tabReload" href="javascript:refreshTab();">刷新当前</a>
            </li>
            <li>
              <a class="tabCloseCurrent" href="javascript:closeCurrentTab();">关闭当前</a>
            </li>
            <li>
              <a class="tabCloseAll" href="javascript:closeOtherTabs(true);">全部关闭</a>
            </li>
            <li>
              <a class="tabCloseOther" href="javascript:closeOtherTabs();">除此之外全部关闭</a>
            </li>
          </ul>
        </div>
        <button class="roll-nav roll-right fullscreen">
          <i class="fa fa-arrows-alt"></i>
        </button>
      </div>
      <div class="content-iframe" style="background-color: #ffffff;">
        <div class="tab-content" id="tab-content"></div>
      </div>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <!-- Control Sidebar -->
    <aside class="control-sidebar control-sidebar-dark">
      <!-- Create the tabs -->
      <ul class="nav nav-tabs nav-justified control-sidebar-tabs">
        <!--  <li><a href="#control-sidebar-home-tab" data-toggle="tab"><i class="fa fa-home"></i></a></li>
        <li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i class="fa fa-gears"></i></a></li>-->
      </ul>
      <!-- Tab panes -->
      <div class="tab-content">
        <!-- Home tab content -->
        <div class="tab-pane" id="control-sidebar-home-tab"></div>
        <!-- /.tab-pane -->
        <!-- Stats tab content -->
        <div class="tab-pane" id="control-sidebar-stats-tab">状态面板设置</div>
        <!-- /.tab-pane -->
        <!-- Settings tab content -->
        <div class="tab-pane" id="control-sidebar-settings-tab"></div>
        <!-- /.tab-pane -->
      </div>
    </aside>
    <div class="control-sidebar-bg"></div>
  </div>
</template>
<script>
import { getMenuData, getUserInfo, logout } from "@/api/system/login";
import { setPermission, removePermission, setUserInfo, removeUserInfo, removeToken } from "@/utils/permission";
export default {
  data() {
    return {
      nickName: "",
      addTabsCount: null
    };
  },
  mounted() {
    if(sessionStorage.getItem(process.env.VUE_APP_NAME+"-addTabsCount")==null){
      this.addTabsCount = 1;
      sessionStorage.setItem(process.env.VUE_APP_NAME+"-addTabsCount", this.addTabsCount);
    }
    this.addTabsCount = sessionStorage.getItem(process.env.VUE_APP_NAME+"-addTabsCount");
    if( this.addTabsCount == 1 ){
      addTabs({
        id: "10008",
        title: "欢迎页",
        close: false,
        url: "/#/welcome"
      })
      this.addTabsCount++
      sessionStorage.setItem(process.env.VUE_APP_NAME+"-addTabsCount", this.addTabsCount);
    }
    this.getMenuData();
    this.getUserInfo();
    //ueditor初始化配置项使用接口地址
    sessionStorage.setItem("serverUrl", process.env.VUE_APP_SERVER_URL);
  },
  methods: {
    //获取菜单信息
    getMenuData: function() {
      getMenuData().then(response => {
        $(".sidebar-menu").sidebarMenu({
          data: response.menus,
          param: {
            strUser: "admin"
          }
        });
        //将用户的权限标识存入前端的缓存
        var permission = response.permission;
        setPermission(permission);
      });
    },
    //获取用户信息
    getUserInfo: function() {
      getUserInfo().then(response => {
        var data = response;
        var para = {
          id: data.id,
          loginName: data.loginName,
          name: data.name,
          mobile: data.mobile,
          avatar: data.avatar,
          nick: data.nick,
          sign: data.sign
        };
        setUserInfo(JSON.stringify(para));
        this.nickName = response.name;
      });
    },
    //修改密码
    updatePassword: function() {
      addTabs({
        id: "10009",
        title: "修改密码",
        close: true,
        url: "/#/updatePassword"
      });
    },
    updateUserInfo: function(){
      addTabs({
        id: "10010",
        title: "修改用户信息",
        close: true,
        url: "/#/userInfo"
      });
    },
    //退出登录
    logout: function() {
      logout().then(response => {
        removeToken();
        removePermission();
        removeUserInfo();
        sessionStorage.removeItem(process.env.VUE_APP_NAME+"-addTabsCount");
        this.$router.push({ path: "/login" });
      });
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #main-div {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

</style>