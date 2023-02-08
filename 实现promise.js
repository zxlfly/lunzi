class MyPro {
  static PENDING = 'PENDING'
  static FULFILLED = 'FULFILLED'
  static REJECTED = 'REJECTED'
  constructor(executor) {
    this.status = MyPro.PENDING
    this.value = null
    this.reason = null
    this.onFulfilledCb = []
    this.onRejectedCb = []
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }
  resolve = (value) => {
    if (this.status === MyPro.PENDING) {
      this.status = MyPro.FULFILLED
      this.value = value
      this.onFulfilledCb.forEach(cb => cb(value))
    }
  }
  reject = (reason) => {
    if (this.status === MyPro.PENDING) {
      this.status = MyPro.REJECTED
      this.reason = reason
      this.onFulfilledCb.forEach(cb => cb(reason))
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => { console.log('v', v); }
    onRejected = typeof onRejected === "function" ? onRejected : (e) => { console.log('e', e); }
    if (this.status === MyPro.FULFILLED) {
      setTimeout(() => onFulfilled(this.value))
    } else if (this.status === MyPro.REJECTED) {
      setTimeout(() => onRejected(this.reason))
    } else if (this.status === MyPro.PENDING) {
      this.onFulfilledCb.push(onFulfilled)
      this.onRejectedCb.push(onRejected)
    }
    // 这里并没有实现真正的链式调用
    return this
  }
}