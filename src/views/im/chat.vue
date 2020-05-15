<template>
  <div class="main-container">
    <!-- 左边侧边栏 -->
    <div class="aside-left">
      <img :src="curUser.avatar" class="aside-avatar">
      <img :src="chatImgUrl" @click="showChatList" alt="聊天" class="aside-icon"/>
      <img :src="friendImgUrl" @click="showFriendList" alt="通讯录" class="aside-icon"/>
    </div>
    <!-- 中间对话列表栏 -->
    <div class="aside-middle">
      <!--上边搜索头部栏-->
      <middle-header></middle-header>
      <!--下方对话列表栏-->
      <div class="middle-list">
        <!--一行-->
        <div class="list-detail" v-for="user in users"  v-if="showChats"
          :key="user.chatId" v-bind="users" @click="selectUser(user)">
          <div class="detail-img">
            <img :src="user.avatar">
          </div>
          <div class="detail-right">
            <div class="detail-title">
              <el-col :span="15">
                <p class="p-title">{{user.chatName}}</p>
              </el-col>
              <el-col :span="9">
                <p class="p-time">{{getShowTime(user.updateTime)}}</p>
              </el-col>
            </div>
            <div class="detail-content">
              <el-col :span="24">
                <p>{{getContent(user)}}</p>
              </el-col>
            </div>
          </div>
        </div>
        <!--群聊列表-->
        <div v-if="showFriends">
          <div class="load-more-msg" >
            <el-button type="text" style="padding-left: 15px;">群聊</el-button>
          </div>
          <div class="list-detail" v-for="group in groups" :key="group.id" v-bind="groups" @click="selectFriend(group)">
            <div class="detail-img">
              <img :src="group.avatar">
            </div>
            <div class="detail-right">
              <p class="p-nick">{{group.groupName}}</p>
            </div>
          </div>        
          <!--好友列表-->
          <div class="load-more-msg">
            <el-button type="text" style="padding-left: 15px;">好友</el-button>
          </div>
          <div class="list-detail" v-for="friend in friends" :key="friend.id" v-bind="friends" @click="selectFriend(friend)">
            <div class="detail-img">
              <img :src="friend.avatar">
            </div>
            <div class="detail-right">
              <p class="p-nick">{{friend.nick}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右边主对话框栏 -->
    <div class="aside-right" v-if="showRightSide">
      <div class="right-title">
        <span>{{chatUser.chatName}}</span>
      </div>
      <div class="right-msg" id="chat-box">
        <div class="load-more-msg">
          <el-button type="text" v-if="showLoadMore" @click="loadMoreMsg">加载更多</el-button>
          <el-button type="text" v-if="!showLoadMore">没有更多新消息了</el-button>
        </div>
        <div class="right-msg-box" v-for="message in messageList" :key="message.id" v-bind="messageList">
          <div class="list-msg-left" v-if="message.from!=curUser.id">
            <div class="msg-left-img">
              <img :src="message.avatar">
            </div>
            <div class="msg-left-msg">
              <div class="msg-box">
                <p>{{message.content}}</p>
              </div>
            </div>
          </div>
          <div class="list-msg-right" v-else>
            <div class="msg-right-msg">
              <div class="msg-box">
                <p>{{message.content}}</p>
              </div>
            </div>
            <div class="msg-right-img">
              <img :src="message.avatar">
            </div>
          </div>
        </div>
      </div>
      <div class="right-input">
        <el-input type="textarea" :rows="3" placeholder="请输入内容"
          v-model="textarea" @keyup.enter.native="sendMsg"></el-input>
        <el-button style="float:right;margin: 5px 40px 5px 0" @click="sendMsg">发送</el-button>
        <el-button style="float:right;margin: 5px 40px 5px 0" @click="sendCmd">发送cmd</el-button>
      </div>
    </div>
    <!--个人信息-->
    <div class="aside-right" v-if="showFriend">
      <div class="user-header">
        <div class="header-left">
          <div class="header-title">
            <p>{{curFriend.nick}}</p>
          </div>
          <div class="header-desc">
            <p>{{curFriend.sign}}</p>
          </div>
        </div>
        <div class="header-right">
          <img :src="curFriend.avatar" alt="头像"/>
        </div>
      </div>
      <div class="user-btn">
        <el-button type="success" size="medium" @click="sendToFriend">发送消息</el-button>
      </div>
    </div>
    <!-- 右边命令框-->
    <!-- <div class="aside-cmd">
      <div v-html="logDiv" id="aside-cmd"></div>
    </div> -->
  </div>
</template>
<script>
import { IMClient } from '@/utils/im_client'
import { getUserInfo,getToken } from '@/utils/permission'
import MiddleHeader from '@/views/im/middle_header.vue'
import { updateTimeShow } from '@/utils/date'
import { getFriendList,getGroupList } from '@/api/im/im'
export default {
  components: {MiddleHeader},
  data(){
    return {
      textarea: '',
      messageList: [],
      users: [],
      chatUser: {},
      logDiv: '',
      imClient: null,
      curUser: {},
      groups: {},
      showRightSide: false,
      pageNum: 1,
      pageSize: 15,
      showLoadMore: false,
      chatType: 0,
      friend: {},
      friends: [],
      showChats: true,
      showFriends: false,
      chatImgUrl: require("../../assets/img/chat_selected.png"),
      friendImgUrl: require("../../assets/img/contacts_unselected.png"),
      curFriend: {},
      showFriend: false
    }
  },
  mounted(){
    if('WebSocket' in window){
      this.initIMClient();
    }else{
      this.$message({
        message: '当前浏览器 Not support websocket',
        type: 'error'
      });
    }
  },
  beforeDestroy(){
    this.imClient.onClose();
  },
  methods: {
    showChatList(){
      this.showChats = true;
      this.showFriends = false;
      this.showRightSide = true;
      this.showFriend = false;
      this.chatImgUrl = require("../../assets/img/chat_selected.png");
      this.friendImgUrl = require("../../assets/img/contacts_unselected.png");
    },
    showFriendList(){
      this.showChats = false;
      this.showFriends = true;
      this.showRightSide = false;
      this.chatImgUrl = require("../../assets/img/chat_unselected.png");
      this.friendImgUrl = require("../../assets/img/contacts_selected.png");
    },
    //加载更多聊天记录
    loadMoreMsg(){
      this.getMessageList();
    },
    initIMClient() {
      let wsUrl = process.env.VUE_APP_WS_URL + "?token=" + getToken();
      const imClient = new IMClient(wsUrl, 35 * 1000);
      this.$store.dispatch('setIMClient', imClient);
      this.imClient = imClient;
      this.imClient.bindHandleMessage(this.handleMessage);
      //this.imClient.connect(this.userInitIm);
      this.imClient.connect();
      this.getFriendList();
      this.getGroupList();
    },
    handleMessage(message) {
      message = JSON.parse(message);
      switch(message.cmd) {
        case 2:
          //心跳检测
          console.log(message);
          break;
        case 5:
          //接收到私聊、群聊信息
          var chat = {
            from: message.from, 
            content: message.content,
            contentType: 0,
            avatar: this.chatUser.avatar, 
            id: message.id,
            createTime: message.createTime,
            msgType: message.msgType,
            cmd: message.cmd,
            chatType: message.chatType,
            to: message.to,
            fromNick: message.fromUserNick
          };
          if(message.chatType == 1){
            chat.avatar = message.fromUserAvatar;
            if(chat.from != this.curUser.id && message.groupId == this.chatUser.chatId){
              this.messageList.push(chat);
            }
          }else{
            //当前接收非选择chatUser，则不push
            if(message.from == this.chatUser.chatId){
              this.messageList.push(chat);
            }
          }
          this.scrollToBottom();
          this.updateChatList(chat, message.chatType);
          break;
        case 7:
          //接收到信息初始化
          this.initOnlineUser(message);
          break;
        case 8:
          //接收到添加好友请求
          if(message.joinType == 1){
            //添加请求
            var addUser = message.extras.user;
            this.$confirm('用户【'+addUser.nick+'】请求添加你为好友，是否同意', '提示', {
              confirmButtonText: '同意',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //同意
              var para = {
                cmd: 8,
                contentType: 0,
                chatType: 2,
                userId: message.joinUserId,
                joinUserId: message.userId,
                joinType: 2,
                status: 1
              }
              this.imClient.send(JSON.stringify(para));
            }).catch(() => {
              //不同意

            })
          }
          break;
        case 9:
          //更新chatList
          this.users = message.extras.chatList;
          break;
        case 11:
          //收到历史聊天消息
          let list = message.extras.messageList.list;
          var msgList = [];
          for(var i=0; i<list.length; i++){
            var msg = list[i];
            var chat = {
              id: msg.id,
              content: msg.content,
              contentType: msg.contentType,
              createTime: msg.createTime,
              from: msg.fromUserId,
              to: msg.toUserId,
              avatar: '',
              groupId: msg.groupId
            }
            if(msg.fromUserId == this.curUser.id){
              chat.avatar = this.curUser.avatar;
            }else{
              chat.avatar = this.chatUser.avatar;
            }
            if(message.extras.chatType == 1){
              chat.from = msg.userId;
              chat.to = msg.groupId;
              chat.avatar = msg.userAvatar;
            }
            msgList.push(chat);         
          }
          if(this.messageList.length != 0){
            this.messageList = msgList.concat(this.messageList);
          }else{
            this.messageList = msgList;
            this.scrollToBottom();
          }
          if(list.length == 15){
            this.pageNum++;
            this.showLoadMore = true;
          }else{
            this.showLoadMore = false;
          }
          break;
      }
    },
    //用户IM初始化
    userInitIm(){
      var message = {cmd: 1, msgType: 1, extras: this.curUser };
      this.imClient.send(JSON.stringify(message));
    },
    initOnlineUser: function(data){
      this.users = data.extras.chatList;
      this.curUser = data.extras.user;
    },
    sendMsg() {
      var message = {
        cmd: 5,
        contentType: 0,
        chatType: this.chatType,
        from: this.curUser.id,
        to: this.chatUser.chatId,
        content: this.textarea,
        avatar: this.curUser.avatar,
        groupId: this.chatUser.chatId
      };
      this.textarea = null;
      this.imClient.send(JSON.stringify(message));
      this.messageList.push(message);
      this.scrollToBottom();
      this.updateChatList(message, 1);
    },
    sendCmd() {
      var message = this.textarea;
      this.imClient.send(message);
      this.textarea = null;
    },
    getFriendList(){
      let data = {userId: this.curUser.id};
      getFriendList(data).then(response => {
        this.friends = response.data;
      })
    },
    getGroupList(){
      let data = {userId: this.curUser.id};
      getGroupList(data).then(response => {
        this.groups = response.data;
      })
    },
    //更新会话对象中的列表
    updateChatList(message, type){
      for(var i = 0; i < this.users.length; i++){
        var user = this.users[i];
        if(type == 1){
          if(message.to == user.chatId){
            this.users[i].content = message.content;
            this.users[i].fromUserId = message.from;
            this.users[i].fromNick = message.fromNick;
            this.users[i].updateTime = new Date();
          }
        }else if(type == 2){
          if(message.from == user.chatId){
            this.users[i].content = message.content;
            this.users[i].fromUserId = message.from;
            this.users[i].updateTime = new Date();
          }
        }
      }
    },
    selectUser: function(user) {
      this.showFriend = false;
      this.showRightSide = true;
      this.chatUser = user;
      this.chatType = user.chatType;
      this.messageList = [];
      this.pageNum = 1;
      this.getMessageList();
    },
    //创建新的聊天
    sendToFriend: function(){
      this.showChatList();
      var message = {
        cmd: 9,
        chatId: this.curFriend.id,
        chatName: this.curFriend.nick,
        chatType: this.curFriend.chatType,
        avatar: this.curFriend.avatar,
        content: null,
        contentType: 0,
        fromUserId: this.curUser.id,
        fromNick: this.curUser.nick,
        updateTime: new Date()
      }
      for(var i=0; i<this.users.length; i++){
        var user = this.users[i];
        if(message.chatId == user.chatId && message.chatType == user.chatType){
          this.selectUser(message);
          return
        }
      }
      this.users.unshift(message);
      //this.imClient.send(JSON.stringify(message));
    },
    selectFriend: function(friend){
      if(friend.nick != undefined){
        this.curFriend = friend;
        this.showFriend = true;
        this.curFriend.chatType = 2;
      }else{
        this.curFriend = {
          id: friend.id,
          nick: friend.groupName,
          sign: friend.description,
          avatar: friend.avatar,
          chatType: 1
        }
      }
      this.showFriend = true;
    },
    getMessageList(){
      //获取历史消息记录
      var message = {
        cmd: 10,
        chatType: this.chatUser.chatType,
        fromUserId: this.chatUser.id,
        toUserId: this.chatUser.chatId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.imClient.send(JSON.stringify(message));
    },
    scrollToBottom: function(){
      this.$nextTick(() => {
        var chatDiv = document.getElementById('chat-box');
        chatDiv.scrollTop = chatDiv.scrollHeight;
      })
    },
    getAvatar(avatar) {
      return process.env.VUE_APP_cloudReadUrl + avatar;
    },
    getShowTime(time) {
      return updateTimeShow(time);
    },
    getContent(user) {
      var msg;
      if(user.chatType == 2){
        //私聊
        if(user.fromUserId == this.curUser.id){
          msg = user.content;
        }else{
          msg = user.chatName + "：" + user.content;
        }
      }else if(user.chatType == 1){
        msg = user.fromNick + "：" + user.content
      }
      if(msg != null && msg.length > 12){
        msg = msg.substr(0, 12) + "...";
      }
      return msg;
    }
  }
}
</script>
<style scoped>
.body {
  background: #e6e6e6;
  width: 100%;
  height: 100%;
  min-width: 1000px;
  min-height: 600px;
}
.main-container {
  width: 1000px;
  height: 600px;
  position: absolute;
  right: 50%;
  top: 50%;
  margin-top: -300px;
  margin-right: -500px;
  background: #edeae9;
  border-radius: 2px;
}
.aside-left {
  background-color: #28292d;
  height: 100%;
  width: 60px;
  float: left;
}
.aside-left .aside-avatar{
  width: 40px;
  height: 40px;
  margin: 20px 10px 0 10px;
}
.aside-left .aside-icon {
  width: 30px;
  height: 30px;
  margin: 20px 15px 0 15px;
}
.aside-middle {
  background-color: #eeeae8;
  height: 100%;
  width: 250px;
  float: left;
}
.aside-right {
  background-color: #f5f5f5;
  height: 100%;
  width: 690px;
  float: left;
}
.right-title {
  width: 100%;
  height: 78px;
  border-bottom: solid 1px #e7e7e7;
  float: top;
}
.right-title span {
  font-size: 16px;
  font-weight: 700;
  font-family: "微软雅黑";
  margin-left: 30px;
  line-height: 78px;
}
.right-msg {
  width: 100%;
  height: 413px;
  float: top;
  border-bottom: solid 1px #e7e7e7;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 10px;
}
.right-msg .load-more-msg {
  text-align: center;
}
.right-msg-box {
  width: 690px;
  height: fit-content;
  min-height: 65px;
}
.list-msg-left,
.list-msg-right {
  width: 690px;
  height: fit-content;
}
.list-msg-left .msg-left-img {
  width: 84px;
  height: 64px;
  float: left;
}
.list-msg-right .msg-right-img {
  width: 84px;
  height: 64px;
  float: left;
}
.list-msg-left .msg-left-img img {
  width: 44px;
  height: 44px;
  margin: 20px 0 0 40px;
}
.list-msg-right .msg-right-img img {
  width: 44px;
  height: 44px;
  margin: 20px 40px 0 0;
}
.list-msg-left .msg-left-msg {
  width: 606px;
  height: auto;
  float: right;
}
.list-msg-right .msg-right-msg {
  width: 606px;
  height: auto;
  float: left;
}
.msg-left-msg .msg-box {
  width: fit-content;
  max-width: 400px;
  background: #ffffff;
  border-radius: 5px;
  margin-top: 20px;
  margin-left: 10px;
}
.msg-right-msg .msg-box {
  width: fit-content;
  max-width: 400px;
  background: #9eea6a;
  border-radius: 5px;
  margin-top: 20px;
  margin-right: 10px;
  float: right;
}
.list-msg-left .msg-left-msg .msg-box p,
.list-msg-right .msg-right-msg .msg-box p {
  font-size: 14px;
  font-family: "微软雅黑";
  font-weight: 520;
  line-height: 15px;
  padding: 15px 15px 15px 15px;
  margin: 0px;
}
.right-input {
  width: 100%;
  height: 108px;
  float: top;
}
.middle-header {
  width: 100%;
  height: 78px;
  float: top;
}
.middle-header .el-row .el-col {
  margin-left: 20px;
}
.middle-list {
  background: #dedede;
  width: 100%;
  height: 522px;
  float: top;
  overflow: auto;
}
.middle-list .list-detail {
  width: 100%;
  height: 78px;
}
.middle-list .list-detail:hover {
  background: #d5d3d2;
}
.detail-img {
  width: 80px;
  height: 100%;
  float: left;
}
.detail-img img {
  width: 50px;
  height: 50px;
  margin: 15px 15px 15px 15px;
}
.detail-right {
  width: 153px;
  height: 100%;
  float: left;
}
.detail-right .el-col {
  height: 38px;
}
.detail-right .p-nick {
  line-height: 78px;
  font-family: "微软雅黑";
  font-size: 14px;
  font-weight: 550;
}
.detail-title {
  width: 170px;
  height: 40px;
  padding-top: 10px;
}
.detail-title p {
  font-family: "微软雅黑";
  line-height: 25px;
}
.detail-title .p-title {
  font-weight: 550;
  font-size: 14px;
  overflow: hidden;
}
.detail-title .p-time {
  font-weight: 500;
  font-size: 12px;
}
.detail-content {
  width: 170px;
  height: 38px;
  text-align: left;
}
.detail-content p {
  font-size: 12px;
  font-family: "微软雅黑";
  line-height: 12px;
}
.aside-cmd {
  width: 250px;
  height: 100%;
  margin-left: 10px;
  background: #28292d;
  float: left;
}
.aside-cmd div {
  height: 100%;
  font-size: 12px;
  line-height: 20px;
  color: #0dbc79;
  padding: 10px 10px 10px 10px;
  text-align: left;
  overflow: auto;
}
.user-header {
  width: 100%;
  height: 300px;
}
.user-header .header-left {
  width: 60%;
  height: 100%;
  float: left;
}
.header-left .header-title {
  width: 200px;
  height: 30px;
  margin: 200px 0 0 200px;
}
.header-title p{
  font-size: 18px;
  font-weight: 600;
  font-family: "微软雅黑";
}
.header-desc p {
  font-size: 14px;
  font-weight: 500;
  font-family: "微软雅黑";
}
.header-left .header-desc {
  width: 200px;
  height: 20px;
  margin: 10px 0 0 200px;
}
.header-right img{
  width: 68px;
  height: 68px;
  float: left;
  margin: 200px 0 0 0; 
}
.user-btn {
  margin: 20px 0 0 330px;
}
</style>