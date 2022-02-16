// 状态值
const PENDING = "PENDING"
const FULFILLED = "FULFILLED"
const REJECTED = "REJECTED"
// 定义构造函数
    // state变量存储当前Promise对象的执行状态
    // value变量存储执行成功后的返回值，或执行失败后的错误提示信息
    // handlers变量是一个数组，存储将来用.then()函数传入的一个或多个后续任务函数。
    //执行成功后，把状态改为成功状态，并把执行结果返回值，保存在变量value中
     //执行失败后，把状态改为失败状态，并把错误提示信息，保存在变量value中