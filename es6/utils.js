const proto = Object.prototype
const hasOwnProp = proto.hasOwnProperty

const noop = function(){}

const isFn = (fn) => ('function' === typeof fn)

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

const callInContext = (fn, context, ...args) => {
  if(!isFn(fn)) return
  if(Object.prototype.toString.call(args[0]) === '[object Arguments]'){
    return fn.call(context, ...[].slice.call(args[0]))
  }
  return fn.call(context, ...args)
}

export {
  isFn, noop, shallowEqual, callInContext
}
