function myNew(parent,...args){
    // 创建新的对象
    let child = Object.create(parent.prototype)
    // 执行函数得到返回的结果
    let res = parent.apply(child,args)
    // 如果res是个对象就返回res，否则就返回child
    return typeof res ==='object'?res : child
}