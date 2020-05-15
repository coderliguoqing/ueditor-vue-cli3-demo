<template>
  <div id="main">
    <el-row :gutter="20">
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.dicttypeId" placeholder="类型代码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.dicttypeName" placeholder="类型名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" v-on:click="getDictList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" v-on:click="resetForm">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="handleAddType">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 业务字典左边表格布局-->
      <el-col :span="10" class="toolbar" style="padding-top: 0px">
        <div class="grid-content bg-purple">
          <!--列表-->
          <el-table :data="typeList" highlight-current-row v-loading="listLoading" fit @row-click="handleRowClick"
                    ref="singleTable" style="width: 100%;">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="dicttypeId" label="类型代码" sortable>
            </el-table-column>
            <el-table-column prop="dicttypeName" label="类型名称" sortable>
            </el-table-column>
<!--            <el-table-column prop="createTime" label="创建日期" :formatter="formatDate" sortable>
            </el-table-column>
            <el-table-column prop="opTime" label="更新时间" :formatter="formatDate" sortable>
            </el-table-column>-->
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="warning"  icon="el-icon-edit" @click="handleEditType(scope.$index, scope.row)">编辑
                </el-button>
                <el-button type="danger"  icon="el-icon-delete" @click="handleDelType(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="12" class="toolbar">
            <el-pagination
              @size-change="handleSizeChangeType"
              @current-change="handleCurrentChangeType"
              :current-page="pageNum_type"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pagesize_type"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total_type">
            </el-pagination>
          </el-col>
        </div>
      </el-col>
      <!-- 业务字典右边表格布局-->
      <el-col :span="14">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="handleAddEntry">新增字典项</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-refresh" @click="reloadDictCache">刷新缓存</el-button>
          </el-form-item>
        </el-form>
        <div class="grid-content bg-purple">
          <!--列表-->
          <el-table :data="entryList" highlight-current-row v-loading="listLoading" fit ref="singleTable"
                    style="width: 100%;">
            <el-table-column type="index" width="50">
            </el-table-column>
            <!-- <el-table-column prop="dicttypeId" label="类型代码">
            </el-table-column> -->
            <el-table-column prop="dictId" label="字典项代码" sortable>
            </el-table-column>
            <el-table-column prop="dictName" label="字典项名称">
            </el-table-column>
            <el-table-column prop="status" label="字典项状态" :formatter="formatStatus" sortable>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="90" sortable>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="warning"  icon="edit" @click="handleEditEntry(scope.$index, scope.row)">
                  编辑
                </el-button>
                <el-button type="danger"  icon="delete2" @click="handleDelEntry(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--工具条-->
          <el-col :span="12" class="toolbar">
            <el-pagination
              @size-change="handleSizeChangeEntry"
              @current-change="handleCurrentChangeEntry"
              :current-page="pageNum_entry"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pagesize_entry"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total_entry">
            </el-pagination>
          </el-col>
        </div>
      </el-col>
    </el-row>

    <!-- 字典类型编辑界面-->
    <el-dialog title="字典类型编辑" :visible.sync="editFormVisibleType">
      <el-form :model="editFormType" label-width="140px" :rules="editFormRulesType" ref="editFormType">
        <el-form-item label="类型代码" prop="dicttypeId">
          <el-input v-model="editFormType.dicttypeId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" prop="dicttypeName">
          <el-input v-model="editFormType.dicttypeName" :maxlength="80"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisibleType = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmitType" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 字典项代码编辑界面-->
    <el-dialog title="字典类型编辑" :visible.sync="editFormVisibleEntry">
      <el-form :model="editFormEntry" label-width="140px" :rules="editFormRulesEntry" ref="editFormEntry">
        <el-form-item label="类型代码" prop="dicttypeId">
          <el-input v-model="editFormEntry.dicttypeId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="字典项代码" prop="dictId">
          <el-input v-model="editFormEntry.dictId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="字典项名称" prop="dictName">
          <el-input v-model="editFormEntry.dictName" :maxlength="80"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editFormEntry.status">
            <el-radio class="radio" :label=1>有效</el-radio>
            <el-radio class="radio" :label=0>无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model.number="editFormEntry.sort" :min="0" :max="5000"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisibleEntry = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmitEntry" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--字典新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisibleType">
      <el-form :model="addFormType" label-width="140px" :rules="addFormRulesType" ref="addFormType">
        <el-form-item label="类型代码" prop="dicttypeId">
          <el-input v-model="addFormType.dicttypeId" auto-complete="off" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="类型名称" prop="dicttypeName">
          <el-input v-model="addFormType.dicttypeName" auto-complete="off" :maxlength="80"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisibleType = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmitType" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!-- 字典项代码新增界面-->
    <el-dialog title="字典项代码新增" :visible.sync="addFormVisibleEntry">
      <el-form :model="addFormEntry" label-width="140px" :rules="addFormRulesEntry" ref="addFormEntry">
        <el-form-item label="类型代码" prop="dicttypeId">
          <el-input v-model="addFormEntry.dicttypeId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="字典项代码" prop="dictId">
          <el-input v-model="addFormEntry.dictId"></el-input>
        </el-form-item>
        <el-form-item label="字典项名称" prop="dictName">
          <el-input v-model="addFormEntry.dictName" :maxlength="80"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="addFormEntry.status">
            <el-radio class="radio" :label=1>有效</el-radio>
            <el-radio class="radio" :label=0>无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="addFormEntry.sort" :min="0" :max="5000"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisibleEntry = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmitEntry" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import util from '@/utils/util'
  import {getTypeList, getEntryList, saveType, deleteType, saveEntry, deleteEntry, reloadTypeCache} from '@/api/system/dict'
  export default {
    data () {
      return {
        filters: {
          dicttypeId: '',
          dicttypeName: ''
        },
        typeList: [],
        entryList: [],
        //默认数据总数
        total_type: 0,
        total_entry: 0,
        //查询的页码
        start: 1,
        //默认分页大小
        pagesize_type: 10,
        pagesize_entry: 10,
        //当前页码
        pageNum_type: 1,
        pageNum_entry: 1,
        listLoading: false,
        //定义初始化的字典子项查询条件
        queryStr: "",
        sels: [],

        //编辑字典类型数据
        editFormVisibleType: false,//编辑界面是否显示
        editLoading: false,
        editFormRulesType: {
          dicttypeName: [
            {required: true, message: '请输入类型名称', trigger: 'blur'}
          ]
        },
        //编辑字典项代码数据
        editFormVisibleEntry: false,//编辑界面是否显示
        editLoading: false,
        editFormRulesEntry: {
          dictName: [
            {required: true, message: '请输入字典项名称', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择字典项状态', trigger: 'change', type: 'number'}
          ],
          sort: [
            {required: true, message: '请输入排序权重'},
            {type: 'number', message: '请输入数字'}
          ]
        },
        //字典类型编辑界面数据
        editFormType: {
          id: 0,
          dicttypeId: '',
          dicttypeName: '',
          createTime: new Date(),
          opTime: new Date()
        },
        //字典项代码编辑界面数据
        editFormEntry: {
          id: 0,
          dicttypeId: '',
          dictId: '',
          dictName: '',
          status: 1,
          sort: 1,
          createTime: new Date(),
          opTime: new Date()
        },

        //新增字典类型数据
        addFormVisibleType: false,//编辑界面是否显示
        addLoading: false,
        addFormRulesType: {
          dicttypeId: [
            {required: true, message: '请输入类型代码', trigger: 'blur'}
          ],
          dicttypeName: [
            {required: true, message: '请输入类型名称', trigger: 'blur'}
          ]
        },
        //新增字典代码数据
        addFormVisibleEntry: false,//新增界面是否显示
        addLoading: false,
        addFormRulesEntry: {
          dictId: [
            {required: true, message: '请输入字典项代码', trigger: 'blur'}
          ],
          dictName: [
            {required: true, message: '请输入字典项名称', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择字典项状态', trigger: 'change', type: 'number'}
          ],
          sort: [
            {required: true, message: '请输入排序权重'},
            {type: 'number', message: '请输入数字'}
          ]
        },
        //字典类型新增界面数据
        addFormType: {
          dicttypeId: '',
          dicttypeName: '',
          createTime: new Date(),
          opTime: new Date()
        },
        //字典项代码新增界面数据
        addFormEntry: {
          id: '',
          dicttypeId: '',
          dictId: '',
          dictName: '',
          status: 1,
          sort: 1,
          createTime: new Date(),
          opTime: new Date()
        }
      }
    },
    methods: {
      //格式化时间
      formatDate: function (row, column) {
        if (column.property == "createTime") {
          var date = new Date();
          date.setTime(row.createTime);
          return util.formatDate.format(date, "yyyy-MM-dd hh:mm");
        } else if (column.property == "opTime") {
          var date = new Date();
          date.setTime(row.opTime);
          return util.formatDate.format(date, "yyyy-MM-dd hh:mm");
        }
      },
      //状态格式化
      formatStatus: function (row, column) {
        if (column.property == "status") {
          if (row.status == "1") {
            return "有效";
          } else if (row.status == "0") {
            return "无效";
          }
        }
      },
      //type表格页码变更时
      handleCurrentChangeType(val) {
        this.pageNum_type = val;
        this.getDictList();
      },
      //entry表格页码变更时
      handleCurrentChangeEntry(val) {
        this.pageNum_entry = val;
        this.getEntryList(this.queryStr);
      },
      //type表格每页显示数据量变更
      handleSizeChangeType: function (val) {
        this.pagesize_type = val;
        this.getDictList();
      },
      //entry表格每页显示数据量变更
      handleSizeChangeEntry: function (val) {
        this.pagesize_entry = val;
        this.getEntryList(this.queryStr);
      },
      getDictList() {
        var page = new Object();
        page.pageNum = this.pageNum_type;
        page.pageSize = this.pagesize_type;
        var dictType = new Object();
        dictType.dicttypeId = this.filters.dicttypeId;
        dictType.dicttypeName = this.filters.dicttypeName;
        var para = {
          page: page,
          dictType: dictType
        };
        this.listLoading = true;
        getTypeList(para).then(response => {
          this.typeList = response.list;
          this.total_type = Number(response.total);
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
        })
      },
      //获取字典项代码列表
      getEntryList(val){
        var page = new Object();
        page.pageNum = this.pageNum_entry;
        page.pageSize = this.pagesize_entry;
        var dictEntry = new Object();
        dictEntry.dicttypeId = val.dicttypeId;
        var para = {
          page: page,
          dictEntry: dictEntry
        };
        this.listLoading = true;
        getEntryList(para).then(response => {
          this.entryList = response.list;
          this.total_entry = Number(response.total);
          this.listLoading = false;
        }).catch(error => {
          this.listLoading = false;
        })
      },

      //点击字典类型表格行的时候触发
      handleRowClick(val) {
        this.selection = val;
        this.getEntryList(val);
        this.queryStr = val;
      },

      //显示字典类型编辑界面
      handleEditType: function (index, row) {
        this.editFormVisibleType = true;
        this.editFormType = Object.assign({}, row);
      },
      //编辑字典类型
      editSubmitType: function () {
        this.$refs.editFormType.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = {dictType: Object.assign({}, this.editFormType)};
              saveType(para).then(response => {
                this.editLoading = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$refs['editFormType'].resetFields();
                this.editFormVisibleType = false;
                this.getDictList();
              }).catch(error => {
                this.editLoading = false;
                this.listLoading = false;
              })
            });
          }
        });
      },
      //删除type字典类型
      handleDelType: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {id: row.id};
          deleteType(para).then(response => {
            this.editLoading = false;
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getDictList();
          }).catch(error => {
            this.editLoading = false;
            this.listLoading = false;
          })
        })
      },

      //显示字典类型新增界面
      handleAddType: function () {
        this.addFormVisibleType = true;
        this.addFormType = {
          dicttypeId: '',
          dicttypeName: '',
          createTime: new Date(),
          opTime: new Date()
        };
      },

      //新增字典类型代码
      addSubmitType: function () {
        this.$refs.addFormType.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              let para = {dictType: Object.assign({}, this.addFormType)};
              saveType(para).then(response => {
                this.addLoading = false;
                if (response.isSuccess == true) {
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  });
                  this.$refs['addFormType'].resetFields();
                  this.addFormVisibleType = false;
                  this.getDictList();
                } else {
                  this.$message({
                    message: response.responseMsg,
                    type: 'error'
                  });
                }
              }).catch(error => {
                this.addLoading = false;
                this.listLoading = false;
              })
            })
          }
        });
      },

      //显示字典项代码编辑界面
      handleEditEntry: function (index, row) {
        this.editFormVisibleEntry = true;
        this.editFormEntry = Object.assign({}, row);
      },

      //编辑字典项代码
      editSubmitEntry: function () {
        this.$refs.editFormEntry.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = {dictEntry: Object.assign({}, this.editFormEntry)};
              saveEntry(para).then(response => {
                this.editLoading = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$refs['editFormEntry'].resetFields();
                this.editFormVisibleEntry = false;
                this.getEntryList(this.queryStr);
              }).catch(error => {
                this.editLoading = false;
                this.listLoading = false;
              })
            })
          }
        });
      },

      //删除type字典类型
      handleDelEntry: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {id: row.id};
          deleteEntry(para).then(response => {
            this.editLoading = false;
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getEntryList(this.queryStr);
          }).catch(error => {
            this.editLoading = false;
            this.listLoading = false;
          })
        })
      },

      //显示字典项代码新增界面
      handleAddEntry: function () {
        if (this.queryStr == '') {
          this.$message({
            message: '请选择类型代码添加',
            type: 'warning'
          });
          return
        }
        this.addFormVisibleEntry = true;
        this.addFormEntry = {
          dictId: '',
          dicttypeId: this.queryStr.dicttypeId,
          dictName: '',
          status: 1,
          sort: 1,
          createTime: new Date(),
          opTime: new Date()
        };
      },
      //新增字典项代码
      addSubmitEntry: function () {
        this.$refs.addFormEntry.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              let para = {dictEntry: Object.assign({}, this.addFormEntry)};
              saveEntry(para).then(response => {
                this.addLoading = false;
                if (response.isSuccess == true) {
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  });
                  this.$refs['addFormEntry'].resetFields();
                  this.addFormVisibleEntry = false;
                  this.getEntryList(this.queryStr);
                } else {
                  this.$message({
                    message: response.responseMsg,
                    type: 'error'
                  });
                }
              }).catch(error => {
                this.addLoading = false;
                this.listLoading = false;
              })
            })
          }
        });
      },
      //刷新缓存
      reloadDictCache:function(){
          if( this.queryStr.dicttypeId == null ){
            this.$message({
              message: '请选择业务字典',
              type: 'error'
            });
          }else{
            let para = {dictTypeId:this.queryStr.dicttypeId};
            reloadTypeCache(para).then(response => {
              this.addLoading = false;
              if (response.isSuccess == true) {
                this.$message({
                  message: response.responseMsg,
                  type: 'success'
                });
              } else {
                this.$message({
                  message: response.responseMsg,
                  type: 'error'
                });
              }
            })
          }
      },
      //重置查询
      resetForm(){
        this.filters = {
          dicttypeId: '',
          dicttypeName: ''
        }
      }
    },
    mounted() {
      this.getDictList();
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #main {
    margin: 15px 15px 15px 15px;
  }
</style>