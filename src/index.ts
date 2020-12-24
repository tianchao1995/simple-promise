
import { simgplePromise } from './simple-promise'
var  promisesAplusTests  = require("promises-aplus-tests")

var promise2 = require('../promise2.js')
var obj = {
  then:(r:any,j:any)=>{ r('1111');j(222222)}
}
var d = new simgplePromise((resolve:any,reject:any)=>{
  setTimeout(()=>{
    resolve('ddddd')
  },2000)
})
var c = new simgplePromise((resolve:any,reject:any)=>{
  setTimeout(()=>{
    resolve(obj)
  },1000)
})
var p = new simgplePromise((resolve:any,reject:any)=>{
  reject(c)
})
p.then((v:any)=>{
  console.log('success',v)
},(err)=>{
  console.log('error',err)
})

// promisesAplusTests(simgplePromise,{ reporter: "dot" },(err:any)=>{
//   console.log(err)
// })