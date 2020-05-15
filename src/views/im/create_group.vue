<template>
  <el-dialog title="创建群聊" :visible.sync="dialogVisible" :modal-append-to-body="false">
    <el-form label-width="100px" class="demo-ruleForm">
      <el-form-item label="群聊名称">
        <el-input v-model="groupName"></el-input>
      </el-form-item>
      <el-form-item label="群聊描述">
        <el-input v-model="desc"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <img-upload-cloud :ref="'uploadCloud'" :id="'uploadCloud'" :sizeLimit="2097152" :countLimit="1" ext="jpg,png,jpeg,bmp"></img-upload-cloud>
      </el-form-item>
      <el-form-item label="选择好友" style="min-width:630px;">
        <el-transfer v-model="value" :data="data" :titles="['好友', '已选择']"></el-transfer>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import ImgUploadCloud from '@/components/fileUpload/img_upload_cloud.vue'
import {getFriendList} from '@/api/im/im'
import {getUserInfo} from '@/utils/permission'
export default {
  components: {ImgUploadCloud},
  data(){
    return{
      fileObject: {
        uid: "",
        name: "",
        ext: "",
        type: "",
        status: "",
        percentage: 0,
        url: ""
      },
      value: [],
      data: [],
      dialogVisible: false,
      groupName: null,
      user: {},
      desc: ''
    }
  },
  methods: {
    addSubmit(){
      if(this.groupName == null || this.groupName == ''){
        this.$message({
          message: '请填写群聊名称',
          type: 'error'
        });
        return
      }
      var fileList = this.$refs.uploadCloud.getFileList();
      if( fileList.length == 0 ){
        this.$message({
          message: '请上传头像图片!',
          type: 'error',
          duration: 3000
        });
        return
      }
      if(this.value.length == 0){
        this.$message({
          message: '请选择好友!',
          type: 'error',
          duration: 3000
        });
        return
      }
      var message = {
        cmd: 12,
        userId: this.user.id,
        joinUserId: this.value,
        groupName: this.groupName,
        avatar: fileList[0].url,
        desc: this.desc
      }
      let imClient = this.$store.getters.imClient;
      imClient.send(JSON.stringify(message));
      this.$message({
        message: '发送成功！',
        type: 'success'
      });
      this.dialogVisible = false;
    },
    getFriendList(){
      this.user = JSON.parse(getUserInfo());
      let data = {userId: this.user.id};
      getFriendList(data).then(response => {
        for(var i=0; i<response.data.length; i++){
          var obj = response.data[i];
          var userObj = {
            key: obj.id,
            label: obj.nick
          }
          this.data.push(userObj);
        }
      })
    }
  },
  mounted: function(){
    this.$nextTick(() => {
      this.$on('openDialog', function(action){
        this.dialogVisible = true;
      })
    })
    this.getFriendList();
  }
}
</script>
