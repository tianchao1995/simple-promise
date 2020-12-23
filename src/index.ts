
import { simgplePromise } from './simple-promise'


var p = new simgplePromise((resolve,reject)=>{
  reject(1)
  throw new Error('aaa')
})
p.then().then().then().then().then().then().then().then().then((value)=>{
  console.log('success',value)
}).catch().catch().catch().catch().catch((reason)=>{
  console.log('error',reason)
})