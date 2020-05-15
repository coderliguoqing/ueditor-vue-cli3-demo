import request from '@/utils/request'

export function getUserAllRight(data){
  return request({
    url: '/auth/user/getUserAllRight',
    method: 'post',
    data: data
  })
}

export function getUserInfoBySso(data){
  return request({
    url: '/auth/user/getUserInfoBySso',
    method: 'post',
    data: data
  })
}

export function getUserAuthList(data){
  return request({
    url: '/auth/user/authList',
    method: 'post',
    data: data
  })
}

export function editAuthList(data){
  return request({
    url: '/auth/user/editAuthList',
    method: 'post',
    data: data
  })
}

export function getUserList(data){
  return request({
    url: '/auth/user/list',
    method: 'post',
    data: data
  })
}

export function editUser(data){
  return request({
    url: '/auth/user/edit',
    method: 'post',
    data: data
  })
}

export function editPassword(data){
  return request({
    url: '/auth/user/editPassword',
    method: 'post',
    data: data
  })
}

export function deleteUser(data){
  return request({
    url: '/auth/user/' + data.userId,
    method: 'delete',
    data: data
  })
}

export function uploadImg(data){
  return request({
    url: '/common/qiNiuUpload',
    method: 'post',
    data: data
  })
}