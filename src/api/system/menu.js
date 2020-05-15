import request from '@/utils/request'

export function getMenuTreeList(){
  return request({
    url: '/auth/menu/tree',
    method: 'get'
  })
}

export function deleteMenu(data){
  return request({
    url: '/auth/menu/delete',
    method: 'delete',
    data: data
  })
}

export function editMenu(data){
  return request({
    url: '/auth/menu/edit',
    method: 'post',
    data: data
  })
}