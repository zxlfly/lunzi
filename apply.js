Function.prototype.myApply=function(obj,arr){
    // context就是要绑定的对象
    // 将函数绑定到这个对象上，然后执行
    var context =( obj===null||obj===undefined||obj===window)?window:Object(obj)
    context.fn=this
    var res
    if(!arr){
        res = context.fn()
    }else{
        // 处理参数  是个数组
        var args = []
        for (let i = 1; i < arguments.length; i++) {
            args.push('arguments[' + i + ']')
        }
        // 执行使用eval是因为如果参数是类似这种[1,2,3]，如果使用.join方法拼接就变成了"1,2,3"，成了一个参数。
        // 所以我们直接处理成类似这种["arguments[1]","arguments[2]","arguments[3]"],eval处理的时候就不会有问题了
        // eval在默认的情况会当里面的字符串就是写在这个位置的，所以不会存在作用域问题
        // eval在执行时会将变量转为字符串，这里隐性执行了args.toString()
        res = eval('context.fn(' + args +')')
    }
    delete context.fn
    return res
}
