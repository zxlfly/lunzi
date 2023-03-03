// 深复制对象 返回复制的对象
const deelClone = (obj) => {
    if (!obj) return
    // 一个检测传入的对象是否是指定类型的函数 返回boolean
    function isType(obj, type) {
        if (typeof obj !== 'object') return false
        var objType = Object.prototype.toString.call(obj).toLowerCase()
        var flag = false
        switch (type) {
            case 'array':
                flag = objType === '[object array]'
                break
            case 'date':
                flag = objType === '[object date]'
                break
            case 'regexp':
                flag = objType === '[object regexp]'
                break
            default:
                flag = false
        }
        return flag
    }
    // 获取regexp的参数 返回参数值
    function getRegexp(reg) {
        var flags = ''
        if (reg.global) flags += 'g'
        if (reg.ignoreCase) flags += 'i'
        if (reg.multiline) flags += 'm'
        return flags
    }
    //维护两个储存循环引用的数组
    var parents = []
    var children = []
    function cloneObj(obj) {
        var child, proto
        if (typeof obj === 'function') return obj
        if (typeof obj !== 'object') return obj
        if (isType(obj, 'array')) {
            // 对数组做特殊处理
            child = []
        } else if (isType(obj, 'regexp')) {
            // 对正则对象做特殊处理
            child = new RegExp(obj.source, getRegexp(obj))
            if (parent.lastIndex) child.lastIndex = parent.lastIndex
        } else if (isType(obj, 'date')) {
            // 对时间对象做特殊处理
            child = new Date(obj.getTime())
        } else {
            if (obj === null) {
                return obj
            } else {
                // 处理对象原型
                proto = Object.getPrototypeOf(obj)
                // 利用Object.create切断原型链
                child = Object.create(proto)
            }
        }

        // 处理循环引用
        var index = parents.indexOf(children)
        if (index > -1) {
            // 如果父数组存在本对象,说明之前已经被引用过,直接返回此对象
            return children[index]
        }
        parents.push(obj)
        children.push(child)
        //  对对象做特殊处理
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                // 递归调用
                child[key] = cloneObj(obj[key])
            }
        }
        return child
    }
    return cloneObj(obj)
}




function deepCloneSimple(target) {
    let newObj; // 定义一个变量，准备接新副本对象
    // 如果当前需要深拷贝的是一个引用类型对象
    if (typeof target === 'object') {
        if (Array.isArray(target)) {// 如果是一个数组
            newObj = []; // 将newObj赋值为一个数组，并遍历
            for (let i in target) { // 递归克隆数组中的每一项
                newObj.push(deepCloneSimple(target[i]))
            }
            // 判断如果当前的值是null；直接赋值为null 
        } else if (target === null) {
            newObj = null;
            // 判断如果当前的值是一个正则表达式对象，直接赋值
        } else if (target.constructor === RegExp) {
            newObj = target;
        } else {
            // 否则是普通对象，直接for in循环递归遍历复制对象中每个属性值
            newObj = {};
            for (let i in target) {
                newObj[i] = deepCloneSimple(target[i]);
            }
        }
        // 如果不是对象而是原始数据类型，那么直接赋值
    } else { newObj = target; }
    // 返回最终结果 return newObj; 
    return newObj
}