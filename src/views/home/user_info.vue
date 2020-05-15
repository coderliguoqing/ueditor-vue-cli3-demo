<template>
  <div class="main-582b530c">
    <el-form label-width="130px" :model="user">
      <el-form-item label="用户ID">
        <el-input v-model="user.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="登录名称">
        <el-input v-model="user.loginName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="email">
        <el-input v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="user.mobile"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="user.nick"></el-input>
      </el-form-item>
      <el-form-item label="个性签名">
        <el-input v-model="user.sign"></el-input>
      </el-form-item>
      <el-form-item label="图片上传">
        <el-upload data-v-5820adc class="avatar-uploader" action="" :show-file-list="false"
                    :before-upload="beforeAvatarUpload" :http-request="uploadImage"
                    style="display: inline;float:left;">
          <img v-if="avatar" :src="avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip" style="text-align: center;">图片大小不超过5M</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" style="width:100%;" @click="submitForm()" v-loading="editLoading">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getUserInfo } from "@/api/system/login"
import { editUser,uploadImg } from '@/api/system/user'
export default {
  data(){
    return{
      user: {},
      editLoading: false,
      fileObject: {
        uid: "",
        name: "",
        ext: "",
        type: "",
        status: "",
        percentage: 0,
        url: ""
      },
      avatar: ''
    }
  },
  methods: {
    submitForm: function(){
      this.editLoading = true;
      if( this.avatar == null || this.avatar == '' ){
        this.$message({
          message: '请上传头像图片!',
          type: 'error',
          duration: 3000
        });
        this.editLoading = false;
        return;
      }
      this.user.avatar = this.avatar;
      let para = {user: Object.assign({}, this.user)};
      editUser(para).then(response => {
        if(response.isSuccess == true ){
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        }else{
          this.$message({
            message: response.responseMsg,
            type: 'error'
          });
        }
      })
      this.editLoading = false;
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPEG = file.type === 'image/jpeg';
      const isJPG = file.type === 'image/jpg';
      const isPNG = file.type === 'image/png';
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!(isJPG || isPNG || isJPEG)) {
        this.$message.error('请上传格式为jpeg/jpg/png的图片!');
      }
      if (!isLt5M) {
        this.$message.error('上传的图片大小不能超过 5MB!');
      }
      return (isJPG || isPNG || isJPEG) && isLt5M;
    },
    //图片上传请求
    uploadImage(obj) {
      let reader = new window.FileReader();
      let flag = this.beforeAvatarUpload(obj.file);
      if (!flag) return;
      //上传
      var formData = new FormData();
      formData.append("file", obj.file);
      formData.append("name", "file");
      uploadImg(formData).then(response => {
        this.avatar = response.data;
      })
    }
  },
  mounted() {
    getUserInfo().then(response => {
      this.user = response;
      this.avatar = response.avatar;
    })
  }
}
</script>
<style>
  .main-582b530c{
    width:40%;
    text-align:center;
    margin-top:100px;
    margin-left: 30%;
  }
  .main-582b530c el-input{
    min-width:120px;
  }
  .avatar-uploader .el-upload{
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>