import { status, PENDING, REJECTED, FULFILLED } from './type'

var resovePromise = (
  promise2: simgplePromise,
  x: any,
  resolve: (value?: any) => any,
  reject: (reason?: any) => any
) => {
  if (promise2 === x) {
    reject(
      new TypeError('TypeError: Chaining cycle detected for promise #<Promise>')
    )
  }
  if ((typeof x == 'object' && x !== null) || typeof x === 'function') {
    let then
    // 如果在取x.then值时抛出了异常，则以这个异常做为原因将promise拒绝
    try {
      then = x.then
    } catch (e) {
      reject(e)
    }
    // 大致判断promise对象
    if (typeof then === 'function') {
      // 以x为this调用then函数， 且第一个参数是resolvePromise，第二个参数是rejectPromise
      then.call(
        x,
        (y: any) => {
          resovePromise(promise2,y,resolve,reject)
        },
        (r: any) => {
          reject(r)
        }
      )
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

export class simgplePromise {
  status: status = PENDING

  value: any

  reason: any

  onFulfilledCbs: Array<() => any> = []

  onRejectedCbs: Array<() => any> = []

  constructor(
    excutor: (
      resolve: (value?: any) => any,
      reject: (reason?: any) => any
    ) => any
  ) {
    let resolve = (value?: any) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.onFulfilledCbs.forEach(fn => fn())
      }
    }
    let reject = (reason?: any) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCbs.forEach(fn => fn())
      }
    }
    // eg: new Primise(()=>{
    //       throw new Error('error')
    //      })
    // onRejected can receive.
    try {
      typeof excutor === 'function' && excutor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }
  then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any) {
    const fulfillIsFun: boolean = typeof onFulfilled === 'function'
    const rejectedIsFun: boolean = typeof onRejected === 'function'
    let x: any
    let promise2 = new simgplePromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
        setTimeout(() => {
          try {
            fulfillIsFun &&
              (x = onFulfilled!(this.value)) &&
              resovePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        // onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
        setTimeout(() => {
          try {
            rejectedIsFun &&
              (x = onRejected!(this.reason)) &&
              resovePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === PENDING) {
        fulfillIsFun &&
          this.onFulfilledCbs.push(() => {
            try {
              x =
                onFulfilled!(this.value) &&
                resovePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        rejectedIsFun &&
          this.onRejectedCbs.push(() => {
            try {
              x =
                onRejected!(this.reason) &&
                resovePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
      }
    })
    return promise2
  }
}
