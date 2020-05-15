<template>
  <el-dialog title="添加好友" :visible.sync="dialogVisible" :modal-append-to-body="false">
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
        </el-form>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24" class="toolbar" style="padding-top: 15px">
        <div class="grid-content bg-purple">
          <el-table row-key="id" :data="userList" border tooltip-effect="dark" style="width: 100%;"
                    v-loading="listLoading" element-loading-text="拼命加载中">
            <el-table-column prop="loginName" label="登录名" width="100"> </el-table-column>
            <el-table-column prop="name" label="名称" > </el-table-column>
            <el-table-column prop="enabled" label="状态" :formatter="(row,column)=>formatField(row,column,'enabled','IF_ENABLED')" width="80"> </el-table-column>
            <!-- <el-table-column prop="mobile" label="手机" > </el-table-column>
            <el-table-column prop="email" label="邮件" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="phone" label="电话" > </el-table-column> -->
            <el-table-column prop="createTime" label="创建时间" sortable  :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="addUser(scope.$index, scope.row)">添加好友</el-button>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">返回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import util from '@/utils/util'
import { getUserInfo } from '@/utils/permission'
import { getUserList } from '@/api/system/user'
export default {
  name: "add-friend",
  props: [],
  data() {
    return{
      dialogVisible: false,
      filters:{
        loginName: '',
        name: ''
      },
      userList: [],
      listLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    formatField: function (row,column,columnName,dictTypeId) {  
      return util.formatDict.formatTableField(row,column,columnName,dictTypeId);  
    },
    addUser: function(index, row){
      let imClient = this.$store.getters.imClient;
      var user = JSON.parse(getUserInfo());
      var message = {
        cmd: 8,
        contentType: 0,
        chatType: 2,
        userId: user.id,
        joinUserId: row.id,
        joinType: 1,
        status: 1
      };
      imClient.send(JSON.stringify(message));
      this.$message({
        message: '发送成功！',
        type: 'success'
      });
      this.dialogVisible = false;
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
    //表格每页显示数据量变更
    handleSizeChange: function (val) {
      this.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.pageNum= val;
      this.search();
    }
  },
  mounted: function(){
    this.$nextTick(() => {
      this.$on('openDialog', function(action){
        this.dialogVisible = true;
      })
    })
  }
}
</script>
