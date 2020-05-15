<template>
  <div class="middle-header">
    <el-row :span="24">
      <div style="height: 30px;width: 100%;"></div>
    </el-row>
    <el-row :span="24">
      <el-col :span="16">
        <el-input placeholder="搜索" prefix-icon="el-icon-search"></el-input>
      </el-col>
      <el-col :span="4">
        <el-dropdown trigger="click" szie="medium" @command="handleCommand">
          <el-button icon="el-icon-plus" circle></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>扫一扫</el-dropdown-item>
            <el-dropdown-item command="addFriend">添加好友</el-dropdown-item>
            <el-dropdown-item command="createGroup">创建群聊</el-dropdown-item>
            <el-dropdown-item>添加群聊</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <add-friend ref="addFriendDialog"></add-friend>
    <create-group ref="createGroupDialog"></create-group>
  </div>
</template>
<script>
import AddFriend from '@/views/im/add_friend.vue'
import CreateGroup from '@/views/im/create_group.vue'
export default {
  components: {AddFriend,CreateGroup},
  name: "middle-header",
  props: [],
  data(){
    return{

    }
  },
  methods: {
    handleCommand(command){
      switch(command){
        case 'addFriend':
          this.$refs.addFriendDialog.$emit('openDialog', null);
          break;
        case 'createGroup':
          this.$refs.createGroupDialog.$emit('openDialog', null);
          break;
      }
    }
  }
}
</script>
<style scoped>
.middle-header {
  width: 100%;
  height: 78px;
  float: top;
}
.middle-header .el-row .el-col {
  margin-left: 20px;
}
</style>
