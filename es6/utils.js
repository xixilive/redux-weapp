const proto = Object.prototype

const noop = function(){}

const isFn = (fn) => ('function' === typeof fn)

const typeOf = (v) => {
  let t = proto.toString.call(v) // [object XXX]
  return t.substr(8, t.length - 9)
}

const is = (x, y) => {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

const shallowEqual = (objA, objB) => {
  if (is(objA, objB)) return true
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false
    }
  }

  return true
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
  isFn, noop, shallowEqual, clone, callInContext
}
