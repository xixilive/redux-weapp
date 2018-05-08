const proto = Object.prototype
const hasOwnProp = proto.hasOwnProperty

const noop = function(){}

const isFn = (fn) => ('function' === typeof fn)
const typeOf = (v) => {
  return (proto.toString.call(v).match(/^\[object (.+?)\]$/) || [])[1]
}

const shallowEqual = (a, b) => {
  if (a === b){
    return true
  }

  let [na, nb] = [0, 0]
  for(let k in a){
    if(hasOwnProp.call(a, k) && a[k] !== b[k]){
      return false
    }
    na++
  }

  for(let k in b){
    if(hasOwnProp.call(b, k)){
      nb++
    }
  }

  return na === nb
}

// Clone JSON serializable object recursive
// Because a store state should/must be JSON serializable
const clonable = (target) => {
  switch(typeOf(target)){
    case 'Object':
    case 'Array':
    case 'Date':
      return true
    default:
      return false
  }
}

const clone = (target) => {
  if(Object(target) !== target){ //primitives
    return target
  }

  if(!clonable(target)){
    return
  }

  if(target instanceof Array){
    const newArr = []
    for(let i = 0; i < target.length; i++){
      newArr[i] = clone(target[i])
    }
    return newArr
  }
  
  if(target instanceof Date){
    return new Date(target.getTime())
  }

  const result = {}
  for(let k in target){
    result[k] = clone(target[k])
  }
  return result
}

const callInContext = (fn, context, ...args) => {
  if(!isFn(fn)) return
  if(Object.prototype.toString.call(args[0]) === '[object Arguments]'){
    return fn.call(context, ...[].slice.call(args[0]))
  }
  return fn.call(context, ...args)
}

export {
  isFn, noop, shallowEqual, clone, callInContext
}
