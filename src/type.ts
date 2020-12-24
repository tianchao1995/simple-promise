export const PENDING = 'pending'

export const FULFILLED = 'fulfilled'

export const REJECTED = 'rejected'
// 一个Promise必须处在其中之一的状态：pending, fulfilled 或 rejected
export type status = 'pending' | 'fulfilled' | 'rejected'

export type resolve = (value?:any) => void 
export type reject = (reason?:any) => void

export type thenFulfillExecutor = (value:any) => any
export type thenRejectExecutor = (reason:any) => any

export interface Promise {
  status: status

  value: any

  reason: any

  onFulfilledCbs: Array<() => any>

  onRejectedCbs: Array<() => any>

  then: (
    onFulfilled?: (value?: any) => any,
    onRejected?: (reason?: any) => any
  ) => Promise

  catch: (onRejected?: (reason?: any) => any) => Promise

}
