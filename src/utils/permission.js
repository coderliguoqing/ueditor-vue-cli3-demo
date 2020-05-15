/**
 * Created by Guoqing.Lee on 2019/07/10 10:22
 * 用户处理用户token相关操作
 */
const TokenKey = process.env.VUE_APP_NAME + '-token'
const PermisKey = process.env.VUE_APP_NAME + '_user_permission'
const UserInfoKey = process.env.VUE_APP_NAME + '_user_info'

export function getToken(){
  return sessionStorage.getItem(TokenKey);
}

export function setToken(token){
  return sessionStorage.setItem(TokenKey, token);
}

export function removeToken(){
  return sessionStorage.removeItem(TokenKey);
}

export function setPermission(permission){
  return  sessionStorage.setItem(PermisKey,permission);
}

export function getPermission(){
  return  sessionStorage.setItem(PermisKey);
}

export function removePermission(){
  return sessionStorage.removeItem(PermisKey);
}

export function getUserInfo(){
  return sessionStorage.getItem(UserInfoKey);
}

export function setUserInfo(userInfo){
  return sessionStorage.setItem(UserInfoKey,userInfo);
}

export function removeUserInfo(){
  return sessionStorage.removeItem(UserInfoKey);
}