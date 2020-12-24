
import { simgplePromise } from './simple-promise'
var  promisesAplusTests  = require("promises-aplus-tests")

var obj = {
  then:(r:any,j:any)=>{ r('1111');j(222222)}
}
var d = new Promise((resolve:any,reject:any)=>{
  setTimeout(()=>{
    resolve('ddddd')
  },2000)
})
var c = new Promise((resolve:any,reject:any)=>{
  setTimeout(()=>{
    resolve(obj)
  },1000)
})
var p = new Promise((resolve:any,reject:any)=>{
  reject('error')
})
p.then((v:any)=>{
  console.log('success',v)
},(err)=>{
  console.log('error',err)
})
// promisesAplusTests(simgplePromise,{ reporter: "dot" },(err:any)=>{
//   console.log(err)
// })