import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
app.config.errorHandler = (err, vm, info) => {
    // 处理错误
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    console.log(err);
    console.log(vm);
    console.log(info);
    // 
}
app.mount('#app')
