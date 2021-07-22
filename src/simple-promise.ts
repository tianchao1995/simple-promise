import {
  status,
  PENDING,
  REJECTED,
  FULFILLED,
  Promise,
  resolve,
  reject,
  thenFulfillExecutor,
  thenRejectExecutor
} from './type'

const isIterable = (obj: any) =>
  obj != null && typeof obj[Symbol.iterator] === 'function'

var resovePromise = (
  promise2: simgplePromise,
  x: any,
  resolve: resolve,
  reject: reject
) => {
  if (promise2 === x) {
    return reject(
      new TypeError('Chaining cycle detected for promise #<Promise>')
    )
  }
  if ((typeof x == 'object' && x !== null) || typeof x === 'function') {
    let called: boolean = false
    // 如果在取x.then值时抛出了异常，则以这个异常做为原因将promise拒绝
    try {
      let then = x.then
      // 大致判断promise对象
      if (typeof then === 'function') {
        // 以x为this调用then函数， 且第一个参数是resolvePromise，第二个参数是rejectPromise
        then.call(
          x,
          (y: any) => {
            if (called) return
            called = true
            resovePromise(promise2, y, resolve, reject)
          },
          (r: any) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

export class simgplePromise implements Promise {
  status: status = PENDING

  value: any

  reason: any

  onFulfilledCbs: Array<() => any> = []

  onRejectedCbs: Array<() => any> = []

  constructor(excutor: (resolve: resolve, reject: reject) => any) {
    let resolve: resolve = (value?: any) => {
      let resolved = () => {
        if (this.status === PENDING) {
          this.status = FULFILLED
          this.value = value
          this.onFulfilledCbs.forEach(fn => fn())
        }
      }
      if (
        (typeof value == 'object' && value !== null) ||
        typeof value === 'function'
      ) {
        try {
          let then = value.then
          if (typeof then === 'function') {
            value.then(resolve, reject)
          } else {
            resolved()
          }
        } catch (e) {
          reject(e)
        }
        return
      }
      resolved()
    }
    let reject: reject = (reason?: any) => {
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

  then(
    onFulfilled?: thenFulfillExecutor,
    onRejected?: thenRejectExecutor
  ): simgplePromise {

    const fulfillIsFun: boolean = typeof onFulfilled === 'function'

    const rejectedIsFun: boolean = typeof onRejected === 'function'

    onFulfilled = fulfillIsFun ? onFulfilled : (value: any) => value

    onRejected = rejectedIsFun
      ? onRejected
      : (reason: any) => {
          throw reason
        }

    let x: any

    let promise2 = new simgplePromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
        setTimeout(() => {
          try {
            x = onFulfilled!(this.value)
            resovePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        // onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
        setTimeout(() => {
          try {
            x = onRejected!(this.reason)
            resovePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === PENDING) {
        this.onFulfilledCbs.push(() => {
          setTimeout(() => {
            try {
              x = onFulfilled!(this.value)
              resovePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCbs.push(() => {
          setTimeout(() => {
            try {
              x = onRejected!(this.reason)
              resovePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    
    return promise2
  }

  catch(onRejected?: thenRejectExecutor): simgplePromise {

    return this.then(undefined, onRejected)

  }

  finally(callback?: resolve): simgplePromise {

    return this.then(
      value => {
        return simgplePromise.resolve(callback && callback()).then(() => value)
      },
      reason => {
        return simgplePromise.resolve(callback && callback()).then(() => {
          throw reason
        })
      }
    )

  }

  static resolve(value?: any): simgplePromise {

    return new simgplePromise((resolve, _) => {
      resolve(value)
    })
    
  }

  static reject(reason?: any): simgplePromise {

    return new simgplePromise((_, reject) => {
      reject(reason)
    })

  }

  static all(promises: Iterable<any>): simgplePromise | never {

    if (!isIterable(promises)) {
      const type = typeof promises
      throw new TypeError(`TypeError: ${type} ${promises} is not iterable`)
    }

    let values: any[] = []

    let resolveCount = 0

    let index = -1

    return new simgplePromise((resolve, reject) => {
      for (let p of promises) {
        index++
        ~(function (_index: number) {
          Promise.resolve(p).then(value => {
            values[_index] = value
            resolveCount++
            if (resolveCount === index + 1) {
              resolve(values)
            }
          }, reject)
        })(index)
      }
      if (index == -1) {
        resolve(values)
      }
    })
  }

  static race(promises: Iterable<any>): simgplePromise | never {

    if (!isIterable(promises)) {
      const type = typeof promises
      throw new TypeError(`TypeError: ${type} ${promises} is not iterable`)
    }
    return new simgplePromise((resolve, reject) => {
      for (let p of promises) {
        Promise.resolve(p).then(resolve, reject)
      }
    })
  }

}

//验证规范  promises-aplus-tests
;(<any>simgplePromise).defer = (<any>simgplePromise).deferred = function () {
  let dfd: any = {}
  dfd.promise = new (<any>simgplePromise)((resolve: any, reject: any) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
console.log('main')
