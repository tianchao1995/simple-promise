
import { simgplePromise } from './simple-promise'
var  promisesAplusTests  = require("promises-aplus-tests")

var obj = {
  then:(r:any,j:any)=>{ r('1111');j(222222)}
}
var d = new Promise((resolve:any,reject:any)=>{
  setTimeout(()=>{
    reject(222)
  },2000)
})
var c = new Promise((resolve:any,reject:any)=>{
  setTimeout(()=>{
    resolve(obj)
  },1000)
})
var p = new Promise((resolve:any,reject:any)=>{
  resolve('成功了')
})
Promise.reject(456).finally(()=>{
  return new Promise((resolve,reject)=>{
    setTimeout(() => {
      reject(123)
    }, 3000);
  })
}).then(data=>{
  console.log(data,'success')
}).catch(err=>{
  console.log(err,'error')
})
simgplePromise.reject(456).finally(()=>{
  return new simgplePromise((resolve,reject)=>{
    setTimeout(() => {
      reject(123)
    }, 3000);
  })
}).then(data=>{
  console.log(data,'success')
}).catch(err=>{
  console.log(err,'error')
})
// promisesAplusTests(simgplePromise,{ reporter: "dot" },(err:any)=>{
//   console.log(err)
// })