import request from '@/utils/request'

export function getRoleList(data){
  return request({
    url: '/auth/role/list',
    method: 'post',
    data: data
  })
}

export function editRole(data){
  return request({
    url: '/auth/role/edit',
    method: 'post',
    data: data
  })
}

export function getRoleInfo(data){
  return request({
    url: '/auth/role/' + data,
    method: 'get'
  })
}

export function deleteRole(){
  return request({
    url: '/auth/role/' + data,
    method: 'delete'
  })
}