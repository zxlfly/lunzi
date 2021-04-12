Function.prototype.myBind=function(obj){
    if(typeof this !=="function"){
        throw new Error("Function.prototype.myBind视图绑定的内容不可调用")
    }
    var args = Array.prototype.slice.call(arguments,1)
    // 保存this 因为返回的是一个函数
    var fn = this
    // 空白函数为了给实例对象套一层原型，避免直接修改该对象的__proto__时影响了fn
    // 但是不代表就不能改了。。。
    var box = function(){}
    box.prototype=fn.prototype
    var bound= function(){
        // 这里的arguments是bound的
        var params = Array.prototype.slice.call(arguments)
        // 通过constructor判断是否通过new调用
        fn.apply(this.constructor===fn?this:obj,args.concat(params))
    }
    bound.prototype=new box()
    return bound
}