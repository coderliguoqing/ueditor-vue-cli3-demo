# vue-admin-demo
基于`vue-cli3`的前后分离框架后台web管理系统端.

## 说明  
基于`vue-cli3`构建的后端管理系统WEB框架  

技术 | 说明 | 官网
---- | ---- | ----
Vue | 前端框架 | [https://vuejs.org/](https://vuejs.org/)
Vue-Router | 路由框架 | [https://router.vuejs.org/](https://router.vuejs.org/)
Vuex | 全局状态管理框架 | [https://vuex.vuejs.org/](https://vuex.vuejs.org/)
Axios | 前端HTTP框架 | [https://github.com/axios/axios](https://github.com/axios/axios)
Element-ui | 前端UI框架 | [https://element.eleme.io/](https://element.eleme.io/)
UEditor | 富文本编辑器 | [http://ueditor.baidu.com/website/](http://ueditor.baidu.com/website/)
Admin-LTE | 前端结构框架 | [https://adminlte.io/](https://adminlte.io/)

说明：升级版本之后，简化了各项配置文件，丢弃了之前与后台的ajax的方式，采用更加vue的axios；对Admin-LTE和ueditor的集成更加优化，ueditor的集成使用了vue-ueditor-wrap插件，可实现数据的双向绑定和一个页面多次实例化；整体的工程更加前端化和接近前端的开发标准.

## 问题
Element-ui 2.7.0以上版本不支持el-table 中 row-style  返回display
官方bug连接https://github.com/ElemeFE/element/issues/16048

## 项目框架介绍
**1.升级说明**  
项目采用`vue-cli3`构建，极大的简化了对于上一个版本配置文件的管理，将`ajax`替换了成了与vue更融合的`axios`；对`Admin-LTE`和`ueditor`的组件集成更加优化，`ueditor`在原有源代码改动的基础上，集成了`vue-ueditor-wrap`插件，可实现数据的双向绑定；使得整体的工程更接近前端开发的标准

**2.项目结构介绍**
``` lua
project
├── public 静态资源文件目录，与旧版本的static类似  
├── src 开发相关的文件目录  
├── /src/api 接口调用相关处理  
├── /src/assets css,js,img等相关资源目录  
├── /src/components 封装的组件目录  
├── /src/router  路由  
├── /src/styles  安装的组件引入的css样式  
├── /src/utils   axios请求封装处理，util处理方法  
├── /src/views   功能相关页面
├── .env.***     分环境变量参数
└── vue.config.js  项目相关配置(开发同学基本不需要调整) 
```

https://github.com/HaoChuan9421/vue-ueditor-wrap  
https://www.cnblogs.com/ocean-sky/p/7132319.html


**3.构建项目**
```bash
#切换使用淘宝的npm镜像（国内npm太慢，建议切换为淘宝镜像）
npm config set registry https://registry.npm.taobao.org
#利用npm安装项目相关的依赖模块
npm install 
#启动开发环境的本地服务，访问路径localhost:8080
npm run dev
#测试环境压缩打包 
npm run devbuild
# 生产压缩打包
npm run build
```

**4.新增页面路由（懒加载）**  
> a、新增页面功能后，请在/src/router.js中添加路由  
> b、此处特别说明，当业务系统功能逐渐增多，如果在路由中一次性加载所有页面会造成访问特别缓慢，在这里路由中引入了懒加载的模式，除了系统相关页面第一加载，其余的业务相关的页面，均在打开时才进行加载；

**5.问题**  
> Element-ui 2.7.0以上版本不支持el-table 中 row-style  返回display，请暂时不要升级到更高的版本  
> 官方bug连接https://github.com/ElemeFE/element/issues/16048

**6.常用组件(table字段字典值映射）**  
```html
<el-table-column prop="enabled" label="可见" :formatter="(row,column)=>formatField(row,column,'enabled','IF_ENABLED')">
</el-table-column>
```
> 封装业务表格字段中，涉及到业务字段的方法，直接在字段中按如上代码引入formatter方法，参数分别为  
row 行对象  
column  列对象  
columnName  当前字段prop  
dictTypeId  对应的业务字典项ID  

页面引入util.js  
  `import util from '@/utils/util' ` 

在method: {} 中引入如下方法，即可  
//表格字段格式化  
```js
formatField: function (row,column,columnName,dictTypeId) {  
  return util.formatDict.formatTableField(row,column,columnName,dictTypeId);  
}  
```

**7.常用组件（btn权限设置）**  
- `import util from '@/utils/util'`
- 在methods:{} 中定义方法：  
  ```js
  hasPermissions: function(obj){
    return util.permissionValid.hasPermissions(obj);
  }
  ```
- 在btn上添加v-if的控制  
  ```js
  <el-button v-if="hasPermissions('customer:view')"  type="success" icon="plus" v-on:click="handleAdd">新增</el-button>
  ```
- 该组件与框架的权限配合使用 customer:view 为框架菜单中定义的权限信息 
