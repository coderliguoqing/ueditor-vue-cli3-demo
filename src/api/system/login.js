import request from '@/utils/request'

export function login(params){
  return request({
    url: '/auth/token',
    method: 'post',
    data: params
  })
}

export function getVerifyCode(params){
  return request({
    url: '/common/getVerifyCode',
    method: 'post',
    data: params
  })
}

export function getMenuData(){
  return request({
    url: '/auth/menu/nav',
    method: 'post'
  })
}

export function getUserInfo(){
  return request({
    url: '/auth/user/info',
    method: 'get'
  })
}

export function logout(){
  return request({
    url: '/auth/token',
    method: 'delete'
  })
}

export function updatePassword(params){
  return request({
    url: '/auth/sys/password',
    method: 'post',
    data: params
  })
}