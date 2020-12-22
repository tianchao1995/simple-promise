import { simgplePromise } from './simple-promise'


var p = new simgplePromise((resolve,reject)=>{
  setTimeout(()=>{
    resolve(1);
  },2000)
})

p.then((value)=>{
  console.log('resolve',value)
},(reason)=>{
  console.log('reject',reason)
})
console.log('同步')