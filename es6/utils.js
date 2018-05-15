const proto = Object.prototype
const hasOwnProp = proto.hasOwnProperty

const noop = function(){}

const isFn = (fn) => ('function' === typeof fn)
const typeOf = (v) => {
  return (proto.toString.call(v).match(/^\[object (.+?)\]$/) || [])[1]
}

const deepEqual = (a, b) => {
  if (a === b){
    return true
  }

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    const arrA = typeOf(a) === 'Array', arrB = typeOf(b) === 'Array'
    let i, length, key

    if (arrA && arrB) {
      length = a.length
      if (length != b.length){
        return false
      }
      for (i = length; i-- !== 0;){
        if (!deepEqual(a[i], b[i])){
          return false
        }
      }
      return true
    }

    if (arrA != arrB){
      return false
    }

    const dateA = a instanceof Date
    const dateB = b instanceof Date
    if (dateA != dateB){
      return false
    }
    if (dateA && dateB){
      return a.getTime() == b.getTime()
    }

    const regexpA = (a instanceof RegExp), regexpB = (b instanceof RegExp)
    if (regexpA != regexpB){
      return false
    }
    if (regexpA && regexpB){
      return a.toString() == b.toString()
    }

    const keys = Object.keys(a)
    length = keys.length

    if (length !== Object.keys(b).length){
      return false
    }

    for (i = length; i-- !== 0;){
      if (!hasOwnProp.call(b, keys[i])){
        return false
      }
    }

    for (i = length; i-- !== 0;) {
      key = keys[i]
      if (!deepEqual(a[key], b[key])){
        return false
      }
    }

    return true
  }

  return a !== a && b !== b
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
  isFn, noop, deepEqual, clone, callInContext
}
