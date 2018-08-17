const proto = Object.prototype
const hasOwnProp = proto.hasOwnProperty

const noop = function(){}

const isFn = (fn) => ('function' === typeof fn)

const typeOf = (v) => {
  let t = proto.toString.call(v) // [object XXX]
  return t.substr(8, t.length - 9)
}

const deepEqual = (a, b) => {
  if (a === b){
    return true
  }

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    const arrA = typeOf(a) === 'Array', arrB = typeOf(b) === 'Array'
    if (arrA !== arrB){
      return false
    }

    let i
    if (arrA && arrB) {
      if (a.length !== b.length){
        return false
      }

      i = a.length
      while (i--){
        if (!deepEqual(a[i], b[i])){
          return false
        }
      }
      return true
    }
    
    const dateA = (a instanceof Date), dateB = (b instanceof Date)
    if (dateA !== dateB){
      return false
    }

    if (dateA && dateB){
      return a.getTime() === b.getTime()
    }

    const regexpA = (a instanceof RegExp), regexpB = (b instanceof RegExp)
    if (regexpA !== regexpB){
      return false
    }
    if (regexpA && regexpB){
      return a.toString() === b.toString()
    }

    const keys = Object.keys(a)
    i = keys.length
    if (i !== Object.keys(b).length){
      return false
    }

    // check own props
    while(i--){
      if (!hasOwnProp.call(b, keys[i])){
        return false
      }
    }

    i = keys.length
    while(i--){
      if (!deepEqual(a[keys[i]], b[keys[i]])){
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
    for(let i = 0, len = target.length; i < len; i++){
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
