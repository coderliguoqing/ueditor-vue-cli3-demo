<template>
  <div id="main">
    <el-row :gutter="20">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.loginName" placeholder="登录名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" v-on:click="search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon--repeat" v-on:click="resetForm">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" v-on:click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24" class="toolbar" style="padding-top: 15px">
        <div class="grid-content bg-purple">
          <el-table row-key="id" :data="userList" border tooltip-effect="dark" style="width: 100%"
                    v-loading="listLoading" element-loading-text="拼命加载中">
            <el-table-column prop="loginName" label="登录名" width="100"> </el-table-column>
            <el-table-column prop="name" label="名称" > </el-table-column>
            <el-table-column prop="enabled" label="状态" :formatter="(row,column)=>formatField(row,column,'enabled','IF_ENABLED')" width="80"> </el-table-column>
            <el-table-column prop="mobile" label="手机" > </el-table-column>
            <el-table-column prop="email" label="邮件" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="phone" label="电话" > </el-table-column>
            <el-table-column prop="createTime" label="创建时间" sortable  :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button type="info" size="mini" @click="authUser(scope.$index, scope.row)">授权</el-button>
                <el-button type="warning" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" v-if="hasPermissions('user:delete')" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <el-button type="info" v-if="showEnabled(scope.row)" size="mini" @click="handleEnabled('1', scope.row)">启用</el-button>
                <el-button type="danger" v-else size="mini" @click="handleEnabled('0', scope.row)">停用</el-button>
                <el-button type="success" size="mini" @click="updatePassword(scope.$index, scope.row)">更新密码</el-button>
                <el-button type="text" size="mini" @click="showPermissions(scope.$index, scope.row)">权限展示</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="userFormVisible">
      <el-form :model="userForm" label-width="100px" :rules="userFormRules" ref="userForm" >
        <el-row>
          <el-col :span="12">
            <el-form-item required label="登录名" prop="loginName" >
              <el-input v-model="userForm.loginName" :disabled="readName" :minlength="4" :maxlength="15" @blur="getUserInfoBySso"  placeholder="请填写登录账号，4-15个字符" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required v-if="showPassword" label="密码" prop="password" >
              <el-input type="password" v-model="userForm.password" :minlength="6" :maxlength="18" placeholder="请填写密码，6-18个字符" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item required label="名称" prop="name" >
              <el-input v-model="userForm.name" :minlength="1" :maxlength="15" placeholder="请填写名称，1-15个字符" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item required label="手机" prop="mobile" >
              <el-input v-model="userForm.mobile" :minlength="11" :maxlength="11" placeholder="请填写手机号码" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="邮件" prop="email" >
              <el-input v-model="userForm.email" :minLength="1" :maxLength="50" placeholder="请填写邮件地址" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks" >
              <el-input type="textarea" v-model="userForm.remarks" :maxLength="50" placeholder="备注信息不超过50个字符" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top:-40px;">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="editSubmit" :loading="editLoading">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="更新密码" :visible.sync="passwordFormVisible" >
      <div style="text-align:center;">
        <el-input type="password" v-model="newPassword" style="width:80%;" placeholder="请填写密码，6-18个字符"  :minlngth="6" :maxlength="18"></el-input>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top:20px;">
        <el-button @click="cancelPassDialog">取消</el-button>
        <el-button type="primary" @click="submitPassword" :loading="editLoading">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="用户授权管理" :fullscreen="true" :visible.sync="authFormVisible" >
      <el-row :gutter="20">
        <el-col :span="10">
          <el-table row-key="id" :data="authList" border tooltip-effect="dark" style="width: 100%;height:500px;"
                    @selection-change="authChangeAll" v-loading="listLoading" element-loading-text="拼命加载中">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="已授予角色"> </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="4">
          <el-row>
            <el-button style="width:150px;margin-top:200px;" :loading="authLoading" @click="addAuthList" type="success">授权</el-button>
          </el-row>
          <el-row>
            <el-button style="width:150px;margin-top:25px;" :loading="authLoading" @click="deleteAuthList" type="danger">取消</el-button>
          </el-row>
        </el-col>
        <el-col :span="10">
          <el-table row-key="id" :data="unAuthList" border tooltip-effect="dark" style="width: 100%;height:500px;"
                    @selection-change="unAuthChangeAll" v-loading="listLoading" element-loading-text="拼命加载中">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="未授予角色"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer" style="margin-top:-20px;">
        <el-button @click="cancelAuth">取消</el-button>
      </div>
    </el-dialog>

    <!--用户权限展示模态框-->
    <el-dialog title="用户菜单权限展示" :fullscreen="true" :visible.sync="showPermissionsVisible" >
      <div class="box-content">
        <div id="userRightsTree" class="charts" v-loading="treeLoading" ></div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import util from '@/utils/util'
  import {getUserAllRight, getUserInfoBySso, getUserAuthList, editAuthList, getUserList, editUser,
    editPassword, deleteUser} from '@/api/system/user'
  import {getUserInfo} from "@/utils/permission"
  export default {
    data() {
      return {
        filters:{
          loginName: '',
          name: ''
        },
        userList: [],
        listLoading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
        options: [],
        userFormVisible: false,
        userForm:{
          loginName: '',
          name: '',
          password: '',
          mobile: '',
          email: '',
          remarks: ''
        },
        userFormRules:{
          loginName: [
            { required: true, message: '请填写登录账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请填写名称', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请填写手机号码', trigger: 'blur' }
          ]
        },
        editLoading: false,
        showPassword: true,
        title: '',
        passwordFormVisible: false,
        newPassword: '',
        authList: [],
        unAuthList: [],
        authTables: [],
        unAuthTables: [],
        authFormVisible: false,
        userId: '',
        authLoading: false,
        readName: false,
        isAdmin: false,
        userInfo: {},
        id: '',
        showPermissionsVisible: false,
        treeLoading: false
      };
    },
    methods:{
      //展示用户的所有权限信息
      showPermissions: function(index, row){
        this.showPermissionsVisible = true;
        this.treeLoading = true;
        var para = { userId: row.id };
        getUserAllRight(para).then(response => {
          this.treeLoading = false;
          this.drawUserRightsTree(response.data);
        }).catch(error => {
          this.treeLoading = false;
        })
      },
      //画树形图
      drawUserRightsTree: function(data) {
        let userRightsTreeChart = this.$echarts.init(
          document.getElementById("userRightsTree")
        );
        //清空原始数据
        userRightsTreeChart.clear();
        var option = {
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove"
          },
          series: [
            {
              type: "tree",
              data: [data],
              top: "1%",
              left: "7%",
              bottom: "1%",
              right: "20%",
              symbolSize: 7,
              label: {
                normal: {
                  position: "left",
                  verticalAlign: "middle",
                  align: "right",
                  fontSize: 14
                }
              },
              leaves: {
                label: {
                  normal: {
                    position: "right",
                    verticalAlign: "middle",
                    align: "left"
                  }
                }
              },
              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        };
        userRightsTreeChart.setOption(option);
      },
      formatField: function (row,column,columnName,dictTypeId) {  
        return util.formatDict.formatTableField(row,column,columnName,dictTypeId);  
      },
      //对接SSO系统，获取用户信息
      getUserInfoBySso: function(){
        if( this.userForm.loginName == null || this.userForm.loginName == ''){
          return;
        }
        let para = {userId: this.userForm.loginName};
        getUserInfoBySso(para).then(response => {
          if( response.isSuccess == true ){
            if( response.data != null ){
              this.userForm = {
                loginName: response.data.staffNum,
                name: response.data.staffName,
                password: '',
                mobile: response.data.tel,
                email: response.data.email,
                remarks: ''
              }
            }else{
              this.$message({
                message: "未获取到对应的员工信息，请重新输入",
                type: 'error'
              });
              this.userForm = {
                loginName: '',
                name: '',
                password: '',
                mobile: '',
                email: '',
                remarks: ''
              }
            }
          }else{
            this.$message({
              message: response.responseMsg,
              type: 'error'
            });
          }
        })
        this.listLoading = false;
      },
      authChangeAll: function(table){
        this.authTables = table;
      },
      unAuthChangeAll: function(table){
        this.unAuthTables = table;
      },
      authUser: function( index, row ){
        this.userId = row.id;
        this.getUserAuthList(row.id);
        this.authFormVisible = true;
      },
      getUserAuthList: function( userId ){
        let para = {userId: userId};
        this.listLoading = true;
        getUserAuthList(para).then(response => {
          if( response.isSuccess == true ){
            this.authList = response.data.authList;
            this.unAuthList = response.data.unAuthList;
          }else{
            this.$message({
              message: response.responseMsg,
              type: 'error'
            });
          }
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
        })
      },
      addAuthList: function(){
        this.changeAuthList('auth');
      },
      deleteAuthList: function(){
        this.changeAuthList('unAuth');
      },
      changeAuthList: function( type ){
        var list = [];
        if( type == 'auth' ){
          if( this.unAuthTables.length == 0 ){
            this.$message({
              message: '请选择未授权角色',
              type: 'error'
            });
            return
          }
          list = this.unAuthTables;
        }else if(type == 'unAuth'){
          if( this.authTables.length == 0 ){
            this.$message({
              message: '请选择已授权角色',
              type: 'error'
            });
            return
          }
          list = this.authTables;
        }
        this.authLoading = true;
        let para = { type: type, list: list, userId: this.userId };
        editAuthList(para).then(response => {
          if( response.isSuccess == true ){
            this.$message({
              message: '请求成功',
              type: 'success'
            });
            this.getUserAuthList(this.userId);
          }else{
            this.$message({
              message: response.responseMsg,
              type: 'error'
            });
          }
          this.authLoading = false;
        }).catch(error => {
          this.authLoading = false;
        })
      },
      cancelAuth: function(){
        this.userId = '';
        this.authTables = [];
        this.unAuthTables = [];
        this.authFormVisible = false;
      },
      search: function(){
        var page = new Object();
        page.pageNum = this.pageNum;
        page.pageSize = this.pageSize;
        var user = new Object();
        user.loginName = this.filters.loginName;
        user.name = this.filters.name;
        let para = {
          page: page,
          user: user
        };
        this.listLoading = true;
        getUserList(para).then(response => {
          this.userList = response.list;
          this.total = Number(response.total);
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
        })
      },
      resetForm: function(){
        this.filters = {
            loginName: '',
            name: '',
            companyCode: ''
        }
      },
      showEnabled: function(row){
        if( row.enabled == 1 ){
          return false;
        }
        return true;
      },
      handleAdd: function(){
        this.userForm = {
          loginName: '',
          name: '',
          password: '',
          mobile: '',
          email: '',
          remarks: ''
        }
        this.readName = false;
        this.title = "新增用户";
        this.id = '';
        this.showPassword = true;
        this.userFormVisible = true;
      },
      handleEdit: function(index, row){
        this.title = "编辑用户";
        this.showPassword = false;
        this.readName = true;
        this.userForm = Object.assign({}, row);
        this.id = row.id;
        this.userFormVisible = true;
      },
      handleEnabled: function(val, row){
        var str = "";
        if( val == "1" ){
          str = "是否确认启用该账号";
        }else{
          str = "是否确认停用该账号";
        }
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var user = {};
          user.id = row.id;
          user.enabled = val;
          let para = {user: user};
          editUser(para).then(response => {
            if(response.isSuccess == true ){
              this.editLoading = false;
              this.$message({
                message: '请求成功',
                type: 'success'
              });
              this.search();
            }else{
              this.editLoading = false;
              this.$message({
                message: response.responseMsg,
                type: 'error'
              });
            }
          }).catch(error => {
            this.editLoading = false;
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      submitPassword: function(){
        if( this.newPassword == '' ){
          this.$message({
            message: "请输入密码信息",
            type: 'error'
          });
          return
        }
        let para = {id: this.id, newPassword: this.newPassword};
        editPassword(para).then(response => {
          if(response.isSuccess == true ){
            this.editLoading = false;
            this.$message({
              message: '请求成功',
              type: 'success'
            });
            this.passwordFormVisible = false;
            this.search();
          }else{
            this.editLoading = false;
            this.$message({
              message: response.responseMsg,
              type: 'error'
            });
          }
        }).catch(error => {
          this.editLoading = false;
        })
      },
      updatePassword: function(index, row){
        this.id = row.id;
        this.newPassword = '';
        this.passwordFormVisible = true;
      },
      handleDelete: function(index, row){
        this.$confirm('是否确认删除选中的用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let para = {userId: row.id};
          deleteUser(para).then(response => {
            if( response.isSuccess == true ){
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.search();
            }else{
              this.$message({
                message: response.message,
                type: 'error'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      editSubmit: function(){
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              let para = {user: Object.assign({}, this.userForm)};
              para.user.id = this.id;
              para.user.enabled = '1';
              editUser(para).then(response => {
                if(response.isSuccess == true ){
                  this.editLoading = false;
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                  this.$refs.userForm.resetFields();
                  this.search();
                  this.cancelDialog();
                }else{
                  this.editLoading = false;
                  this.$message({
                    message: response.responseMsg,
                    type: 'error'
                  });
                }
              }).catch(error => {
                this.editLoading = false;
              })          
            })
          }
        })
      },
      cancelDialog: function(){
        this.$refs['userForm'].resetFields();
        this.userFormVisible = false;
      },
      cancelPassDialog: function(){
        this.newPassword = '';
        this.passwordFormVisible = false;
      },
      //表格每页显示数据量变更
      handleSizeChange: function (val) {
        this.pageSize = val;
        this.search();
      },
      handleCurrentChange(val) {
        this.pageNum= val;
        this.search();
      },
      hasPermissions: function(obj){
        return util.permissionValid.hasPermissions(obj);
      }
    },
    mounted() {
      this.userInfo = JSON.parse(getUserInfo());
      this.search();
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #main {
    margin: 15px 15px 15px 15px;
  }
  .box-content {
    width: 100%;
    height: 1000px;
  }
  .charts {
    width: 100%;
    height: 100%;
  }
</style>