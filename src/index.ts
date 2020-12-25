
import { simgplePromise } from './simple-promise'
var  promisesAplusTests  = require("promises-aplus-tests")

var obj = {
  then:(r:any,j:any)=>{ r('1111');j(222222)}
}
var d = new Promise((resolve:any,reject:any)=>{
  setTimeout(()=>{
    resolve(obj)
  },2000)
})
var c = new Promise((resolve:any,reject:any)=>{
  setTimeout(()=>{
    resolve(d)
  },1000)
})
var p = new Promise((resolve:any,reject:any)=>{
  resolve('成功了')
})
Promise.all([1,2,3,d,d,d,p,d,p,2222]).then((c)=>{
  console.log(c)
},(error)=>{
  console.log('error1',error)
});
(<simgplePromise>simgplePromise.all([1,2,3,d,d,d,p,d,p,2222])).then((c)=>{
  console.log(c)
},(error)=>{
  console.log('error2',error)
})
// promisesAplusTests(simgplePromise,{ reporter: "dot" },(err:any)=>{
//   console.log(err)
// })