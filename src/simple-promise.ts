import { status, PENDING, REJECTED, FULFILLED } from './type'

export class simgplePromise {
  status: status = PENDING

  value: any

  reason: any

  onFulfilledCbs: Array<(value?: any) => any> = []

  onRejectedCbs: Array<(reason?: any) => any> = []

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
        this.onFulfilledCbs.forEach(fn => fn(value))
      }
    }
    let reject = (reason?: any) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCbs.forEach(fn => fn(reason))
      }
    }

    typeof excutor === 'function' && excutor(resolve, reject)
  }

  then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any) {
    const fulfillIsFun: boolean = typeof onFulfilled === 'function'

    const rejectedIsFun: boolean = typeof onRejected === 'function'

    if (this.status === FULFILLED) {
      // onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
      setTimeout(() => {
        fulfillIsFun && onFulfilled!(this.value)
      }, 0)
    } else if (this.status === REJECTED) {
      // onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
      setTimeout(() => {
        rejectedIsFun && onRejected!(this.reason)
      }, 0)
    } else if (this.status === PENDING) {
      fulfillIsFun && this.onFulfilledCbs.push(onFulfilled!)
      rejectedIsFun && this.onRejectedCbs.push(onRejected!)
    }
  }
}
