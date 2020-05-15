import request from '@/utils/request'

export function getTypeList(data){
  return request({
    url: '/sys/dict/type/list',
    method: 'post',
    data: data
  })
}

export function getEntryList(data){
  return request({
    url: '/sys/dict/entry/list',
    method: 'post',
    data: data
  })
}

export function saveType(data){
  return request({
    url: '/sys/dict/type/save',
    method: 'post',
    data: data
  })
}

export function deleteType(data){
  return request({
    url: '/sys/dict/type/delete',
    method: 'post',
    data: data
  })
}

export function saveEntry(data){
  return request({
    url: '/sys/dict/entry/save',
    method: 'post',
    data: data
  })
}

export function deleteEntry(data){
  return request({
    url: '/sys/dict/entry/delete',
    method: 'post',
    data: data
  })
}

export function reloadTypeCache(data){
  return request({
    url: '/sys/dict/type/reloadCache',
    method: 'post',
    data: data
  })
}

export function getDict(data){
  return request({
    url: '/common/getDict',
    method: 'post',
    data: data
  })
}