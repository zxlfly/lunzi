class EventBus{
    constructor(){
        // 存储事件
        this._events = this._events||new Map()
        // 监听上限（非必须）
        this._maxLis=this._maxLis||99
    }
    /**
     * @param{string}type 事件名
     * @param{function}fn 触发事件的回调函数
     */
    on(type,fn){
        // 获取对应的事件名的函数清单
        let handler = this._events.get(type)
        if(!handler){
            // 不存在直接设置
            this._events.set(type,fn)
        }else if(typeof handler ==='function'){
            // 存在了 值变成数组
            this._events.set(type,[handler,fn])
        }else{
            // 存在值是数组 直接添加
            handler.push(fn)
        }
    }
    /**
     * @param{string}type 事件名
     * @param{string}fnName 触发事件的回调函数名
     */
    off(type,fnName){
        // 如果type不存在卸载所有的
        if(!type){
            this._events.clear()
        }
        // 获取对应的事件名的函数清单
        let handler = this._events.get(type)
        if(handler&&typeof handler ==='function'){
            // 有值且是一个函数
            this._events.delete(type)
        }else{
            // 值是数组
            if(!fnName){
                this._events.delete(type)
            }else{
                handler=handler.map(item=>{
                    if(item.name!==fnName){
                        return item 
                    }
                })
            }
        }
    }
    /**
     * @param{string}type 事件名
     * @param{any}args 触发函数可选传入参数
     */
    emit(type,...args){
        // 获取对应的事件名的函数清单
        let handler = this._events.get(type)
        if(!handler){return false}
        if(Array.isArray(handler)){
            for (let i = 0; i < handler.length; i++) {
                if(args.length>0){
                    handler[i].apply(this,args)
                }else{
                    handler[i].call(this)
                }
            }
        }else{
            if(args.length>0){
                handler.apply(this,args)
            }else{
                handler.call(this)
            }
        }
        return true
    }
}
let eb=new EventBus();
function cb(args){
    console.log('cb',args);
}
function cbone(args){
    console.log('cbone',args);
}
eb.on('event1',cb);
eb.emit('event1',33)
eb.off('event1','cb');
eb.emit('event1',33)