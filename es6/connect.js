import {isFn, noop, shallowEqual, callInContext} from './utils'

let subscription = null
const listeners = []

const createListener = (context, mapState, store) => {
  let prevState
  const listener = function(state){
    const nextState = mapState(state)
    if(!prevState || !shallowEqual(nextState, prevState)){
      prevState = Object.assign({}, nextState)
      context.onStateChange.call(context, nextState)
    }
  }

  listener(store.getState()) // to sync init state
  listener.isActive = true
  return listener
}

const defaultMergeConfig = (config, overrides) => ({...config, ...overrides})

const setupSubscription = (store) => {
  if(isFn(subscription)){
    return subscription
  }
  const callback = () => {
    listeners.filter(fn => fn.isActive).forEach(fn => fn(store.getState()))
  }
  return (subscription = store.subscribe(callback))
}

const injectChangeListenerStatus = (store, handler, listener, isActive) => {
  return function(){
    if(listener){
      const prev = listener.isActive
      listener.isActive = isActive
      if(!prev && isActive){
        listener(store.getState())
      }
    }
    return callInContext(handler, this, arguments)
  }
}

const injectOnStateChange = (handler) => {
  return function(){
    return callInContext(handler, this, arguments)
  }
}

const connect = (store, mapState, mapDispatch) => {
  const resolveMapDispatch = () => {
    return isFn(mapDispatch) ? mapDispatch(store.dispatch) : {}
  }

  return (injectLifeCycle, config) => {
    const mergedConfig = defaultMergeConfig(config, resolveMapDispatch())
    if(!isFn(mapState)){
      return mergedConfig
    }

    setupSubscription(store)
    return {...mergedConfig, ...injectLifeCycle(mergedConfig, mapState)}
  }
}

const connectApp = (store, mapState, mapDispatch) => {
  const factory = connect(store, mapState, mapDispatch)

  const injectAppLifeCycle = (config) => {
    const {onLaunch, onShow, onHide, onStateChange} = config

    return {
      onLaunch: function(){
        const listener = createListener(this, mapState, store)
        listener.index = listeners.push(listener) - 1

        this.onShow = injectChangeListenerStatus(store, onShow, listener, true)
        this.onHide = injectChangeListenerStatus(store, onHide, listener, false)
        return callInContext(onLaunch, this, arguments)
      },
      onShow: isFn(onShow) ? onShow : noop,
      onHide: isFn(onHide) ? onHide : noop,
      onStateChange: injectOnStateChange(onStateChange)
    }
  }

  return (config) => {
    return factory(injectAppLifeCycle, config)
  }
}

const connectPage = (store, mapState, mapDispatch) => {
  const factory = connect(store, mapState, mapDispatch)

  const injectPageLifeCycle = (config) => {
    const {onLoad, onUnload, onShow, onHide, onStateChange} = config

    return {
      onLoad: function(){
        const listener = createListener(this, mapState, store)
        listener.index = listeners.push(listener) - 1

        this.onUnload = function(){
          listeners.splice(listener.index, 1)
          return callInContext(onUnload, this, arguments)
        }

        this.onShow = injectChangeListenerStatus(store, onShow, listener, true)
        this.onHide = injectChangeListenerStatus(store, onHide, listener, false)
        return callInContext(onLoad, this, arguments)
      },

      onUnload: isFn(onUnload) ? onUnload : noop,
      onShow: isFn(onShow) ? onShow : noop,
      onHide: isFn(onHide) ? onHide : noop,
      onStateChange: injectOnStateChange(onStateChange)
    }
  }

  return (config) => {
    return factory(injectPageLifeCycle, config)
  }
}

export default {
  App: connectApp,
  Page: connectPage
}
