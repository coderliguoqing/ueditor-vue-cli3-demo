import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import router from '../router'
import { getToken } from '@/utils/permission'

const service = axios.create({
  timeout: 100000,    //请求超时时间
  baseURL: process.env.VUE_APP_API   //api的baseurl
})

service.interceptors.request.use(config => {
  if(getToken()){
    config.headers['Authorization'] = getToken()   //在请求头中拼上token
  }
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    //非200抛错
    const res = response.data
    if(response.status !== 200){
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject('error')
    }else{
      if(res.isSuccess == false ){
        switch ( res.responseCode ){
          case 500:
              Message({
              message: '500 ' + "服务器内部错误",
              type: 'error'
            });
            break;
          case 404:
            Message({
              message: '404 ' + "访问的资源不存在",
              type: 'error'
            });
            break;
          case 403:
            AppInstance.$message({
              message: '403 ' + "服务器拒绝了您的请求",
              type: 'error'
            });
            break;
          case 401:
            MessageBox.confirm('您的登录已失效，可以继续留在该页面，或者重新登录', '确定退出', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              router.push({ path: "/login" });
            })
            break;
          default:
            Message({
              message: res.responseMsg,
              type: 'error'
            });
            break;
        }
      }
      return response.data
    }
  },
  error => {
    console.log('err'+error)
    if (error.toString().trim() === 'Error: Network Error') {
      MessageBox.confirm('网络请求异常，请稍后重试', '出错了', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    }else{
      Message({
        message: error.message,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
