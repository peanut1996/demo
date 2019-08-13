class MyPromise {
  constructor(executor) {
    this._promiseStatus = MyPromise.PENDING
    this._promiseValue

    this.execute(executor)
  }

  execute(executor) {
    if (typeof executor != 'function') {
      throw new Error(`Promise resolver ${executor} is not a function`)
    }
    // 异常捕获
    try {
      executor(
        data => {
          this._promiseStatus = MyPromise.PENDING
          this._promiseValue = data
        },
        data => {
          this._promiseStatus = MyPromise.REJECTED
          this._promiseValue = data
        }
      )
    } catch (e) {
      this._promiseStatus = MyPromise.REJECTED
      this._promiseValue = e
    }
  }
  then(onfulfilled, onrejected) {
    let _ref = null,
      timer = null,
      result = new MyPromise(() => {})

    // 因为promise的executor是异步操作,需要监听promise对象状态变化,并且不能阻塞进程
    timer = setInterval(() => {
      if (
        (typeof onfulfilled == 'function' &&
          this._promiseStatus == MyPromise.FULFILLED) ||
        (typeof onrejected == 'function' &&
          this._promiseStatus == MyPromise.REJECTED)
      ) {
        // 状态发生变化,取消监听
        clearInterval(timer)
        //捕获传入 then 中的回调的错误，交给 then 返回的 promise 处理
        try {
          if (this._promiseStatus == MyPromise.FULFILLED) {
            _ref = onfulfilled(this._promiseValue)
          } else {
            _ref = onrejected(this._promiseValue)
          }

          //根据回调的返回值来决定 then 返回的 MyPromise 实例的状态
          if (_ref instanceof MyPromise) {
            //如果回调函数中返回的是 MyPromise 实例，那么需要监听其状态变化，返回新实例的状态是根据其变化相应的
            timer = setInterval(() => {
              if (
                _ref._promiseStatus == MyPromise.FULFILLED ||
                _ref._promiseStatus == MyPromise.REJECTED
              ) {
                clearInterval(timer)
                result._promiseValue = _ref._promiseValue
                result._promiseStatus = _ref._promiseStatus
              }
            }, 0)
          } else {
            //如果返回的是非 MyPromise 实例
            result._promiseValue = _ref
            result._promiseStatus = MyPromise.FULFILLED
          }
        } catch (e) {
          //回调中抛出错误的情况
          result._promiseStatus = MyPromise.REJECTED
          result._promiseValue = e
        }
      }
    }, 0)
    //promise 之所以能够链式操作，因为返回了MyPromise对象
    return result
  }
}

MyPromise.PENDING = 'pending'
MyPromise.FULFILLED = 'resolved'
MyPromise.REJECTED = 'rejected'

export default MyPromise
