<template>
  <div id="main">
    <button size="primary" type="info" icon="plus" @click="getContent">获取内容</button>
    <vue-ueditor-wrap v-model="msg" :config="config" :destroy="true"></vue-ueditor-wrap>
  </div>
</template>

<script>
  import VueUeditorWrap from 'vue-ueditor-wrap'

  export default{
    name: 'hello',
    components: {VueUeditorWrap},
    data(){
      return {
        config: {
          //可以在此处定义工具栏的内容
          // toolbars: [
          //  ['fullscreen', 'undo', 'redo','|','bold', 'italic', 'underline',
          //  '|','superscript','subscript','|', 'insertorderedlist', 'insertunorderedlist',
          //  '|','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify']
          // ],
          autoHeightEnabled: false,
          autoFloatEnabled: true,
          initialContent:'请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
          autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
          initialFrameWidth: null,
          initialFrameHeight: 1450,
          UEDITOR_HOME_URL: process.env.BASE_URL + 'ueditor/'
        },
        msg: '请输入内容'
      }
    },
    methods: {
      //获取文档内容
      getContent: function(){
        var content = this.msg;
        console.log(this.msg);
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #main {
    margin: 15px 15px 15px 15px;
  }
</style>