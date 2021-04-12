// 状态值
const PENDING = "PENDING"
const FULFILLED = "FULFILLED"
const REJECTED = "REJECTED"

class MyPromise {
    constructor(executor){
        // 默认状态值
        this.status = PENDING
        // 保存成功状态值
        this.succ=undefined
        // 保存失败状态值
        this.fail=undefined
        // 成功回调
        this.onResolvedCallbacks=[]
        // 失败回调
        this.onRejectedCallbacks=[]
        // 成功时调用的方法
        const resolve = (value) =>{
            // 防止executor中多次调用
            if(this.status===PENDING){
                this.status=FULFILLED
                this.succ=value
                this.onResolvedCallbacks.forEach((fn)=>{
                    fn()
                })
            }
        }
        // 失败时调用的方法
        const reject =(value)=>{
            // 防止executor中多次调用
            if(this.status===PENDING){
                this.status=REJECTED
                this.fail=value
                this.onRejectedCallbacks.forEach((fn)=>{
                    fn()
                })
            }
        }
        try{
            executor(resolve,reject)
        }catch(error){
            reject(error)
        }
    }
    then(onFulfilled,onRejected){
        if(this.status===FULFILLED){
            onFulfilled(this.value)
        }else if(this.status===REJECTED){
            onRejected(this.fail)
        }else if(this.status === PENDING){
            this.onResolvedCallbacks.push(() => { onFulfilled(this.value); });
            this.onRejectedCallbacks.push(() => { onRejected(this.fail); });
        }
    }
}