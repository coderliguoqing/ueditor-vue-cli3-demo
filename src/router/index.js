import Vue from 'vue'
import Router from 'vue-router'

import login from '@/views/login/login'
import index from '@/views/home/index'
import welcome from '@/views/home/welcome'

Vue.use(Router)

/**
 * 路由加载优化说明：
 * 项目的路由加载分为两部分，一部分为初始加载页面，即项目访问时需要打开的页面，直接加载
 *  另一部分为业务相关页面，则在点击菜单时，再加载该页面
 * 这样做的目的是解决前端项目过大，导致第一次打开项目时，由于要加载的资源文件太大，导致访问非常缓慢的问题；
 */
const router = new Router({
  routes: [
    { path: '/', name: 'login', component: login },
    { path: '/login', name: 'login', component: login },
    { path: '/index', name: 'index', component: index },
    { path: '/welcome', name: 'welcome', component: welcome },
    //以下路由为懒加载
    { path: '/updatePassword', name: 'updatePassword', component: () => import('../views/home/update_password') },
    { path: '/dict', name: 'dict', component: () => import('../views/system/dict_list') },
    { path: '/menu', name: 'menu', component: () => import('../views/system/menu_list') },
    { path: '/role', name: 'role', component: () => import('../views/system/role_list') },
    { path: '/user', name: 'user', component: () => import('../views/system/user_list') },
    { path: '/chat', name: 'caht', component: () => import('../views/im/chat') },
    { path: '/userInfo', name: 'userInfo', component: () => import('../views/home/user_info') }
  ]
})


export default router