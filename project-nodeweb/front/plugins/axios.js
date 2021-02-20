import Vue from 'vue'
import axios from 'axios'
import {MessageBox} from 'element-ui'
let service = axios.create({
  timeout:5000,
  // 前缀
  baseURL:'/api'
})
const TOKEN_KEY = 'KKB_USER_TOKEN'

// @ todo 拦截器 管理token

export default({store, redirect})=>{
  // 请求拦截
  service.interceptors.request.use(
    config=>{
      // 请求加token
      const token = window.localStorage.getItem(TOKEN_KEY)
      // 设置url白名单
      if(token){
        config.headers.common['Authorization'] = 'Bearer '+token
      }
      return config
    },
    err=>{
      return Promise.reject(err)
    }
  )
// 响应拦截
service.interceptors.response.use(
  async response=>{
    let {data, config} = response
    // console.log('响应拦截',response)
    // 写token
    // 也可以卸载login的逻辑李
    if(data.code===0){
      if(config.url ==='/api/user/login'){
        localStorage.setItem(TOKEN_KEY, data.data.token)
      }
    }else if(data.code===-666){
      // code是-666的 意味着token过期
      // @todo
       MessageBox.confirm('登录过期了','过期',{
        confirmButtonText:'登录',
        showCancelButton:false,
        type:'warning'
      }).then(()=>{
        localStorage.removeItem(TOKEN_KEY)
        redirect({ path:'/login'})
      })

    }
    return data
  },
  err=>{
    return Promise.reject(err)
  }
)
}


// 这里要设置token管理和路由跳转



Vue.prototype.$http =service

export const http = service
