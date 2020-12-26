
import { simgplePromise } from './simple-promise'
var  promisesAplusTests  = require("promises-aplus-tests")

var obj = {
  then:(r:any,j:any)=>{ r('自定义then');j(222222)}
}

var o = function *(){
  yield 1;
  yield 2;
  return 'done'
}
var iteratorFactor = (values:any)=>{
  var index = -1;
  return {
    [Symbol.iterator]:()=>({
      next(){
        index ++;
        return {
          value:index > values.length ? undefined : values[index],
          done:index > values.length - 1
        }
      }
    })
  }
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
var arr = [p,c,obj,2,3]
var set = new Set([222,333,111,111,p,c,obj,p,c,obj,obj])
var str = '1234567,6666'
Promise.all(set).then((c)=>{
  console.log('1',c)
},(error)=>{
  console.log('error1',error)
});
simgplePromise.all(set).then((c)=>{
  console.log('2',c)
},(error)=>{
  console.log('error2',error)
})
// promisesAplusTests(simgplePromise,{ reporter: "dot" },(err:any)=>{
//   console.log(err)
// })