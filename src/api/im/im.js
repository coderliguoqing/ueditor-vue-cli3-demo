import request from '@/utils/request'

export function getFriendList(data){
  return request({
    url: '/im/getFriendList',
    method: 'post',
    data: data
  })
}

export function getGroupList(data){
  return request({
    url: '/im/getGroupList',
    method: 'post',
    data: data
  })
}
