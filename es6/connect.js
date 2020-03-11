import {isFn, noop, shallowEqual, callInContext} from './utils'

let subscription = null
const listeners = []

const createListener = (name = 'subscriber', context, store, mapState) => {
  let prevState
  const listener = function(state, ...args){
    const nextState = mapState(state)
    if(shallowEqual(nextState, prevState)) {
      return
    }
    if(listener.isActive) {
      listener.stashed = null
      context.onStateChange.call(context, nextState, prevState, ...args)
    } else {
      listener.stashed = [nextState, prevState]
    }
    prevState = nextState
  }

  listener.index = listeners.push(listener) - 1
  listener.key = `${name}-${listener.index}`
  listener.stashed = null
  listener.isActive = true
  listener(store.getState(), 'INIT_SYNC') // to sync init state
  return listener
}

const setupSubscription = (store) => {
  if(isFn(subscription)){
    return subscription
  }
  return (subscription = store.subscribe(() => {
    const state = store.getState()
    listeners.forEach(fn => fn(state))
  }))
}

const injectChangeListenerStatus = (handler, listener, isActive) => {
  return function(){
    listener.isActive = isActive
    if(listener.stashed) {
      this.onStateChange(...listener.stashed)
    }
    return callInContext(handler, this, arguments)
  }
}

const injectRemoveListener = (handler, listener) => {
  return function(){
    listeners.splice(listener.index, 1)
    return callInContext(handler, this, arguments)
  }
}

const injectOnStateChange = (handler) => {
  return function(){
    return callInContext(handler, this, arguments)
  }
}

const connect = (store, mapState, mapDispatch) => {
  const overrides = isFn(mapDispatch) ? mapDispatch(store.dispatch) : {}

  return (injectLifeCycle, config) => {
    const mergedConfig = {...config, ...overrides}
    if(!isFn(mapState)){
      return mergedConfig
    }
    setupSubscription(store)
    return {...mergedConfig, ...injectLifeCycle(mergedConfig)}
  }
}

const connectApp = (store, mapState, mapDispatch) => {
  const factory = connect(store, mapState, mapDispatch)

  const injectAppLifeCycle = (config) => {
    const {onLaunch, onShow, onHide, onStateChange} = config

    return {
      onLaunch: function(){
        const listener = createListener('app', this, store, mapState)
        this.onShow = injectChangeListenerStatus(onShow, listener, true)
        this.onHide = injectChangeListenerStatus(onHide, listener, false)
        return callInContext(onLaunch, this, arguments)
      },

      onShow: isFn(onShow) ? onShow : noop,
      onHide: isFn(onHide) ? onHide : noop,
      onStateChange: injectOnStateChange(onStateChange)
    }
  }

  return config => factory(injectAppLifeCycle, config)
}

const connectPage = (store, mapState, mapDispatch) => {
  const factory = connect(store, mapState, mapDispatch)

  const injectPageLifeCycle = (config) => {
    const {onLoad, onUnload, onShow, onHide, onStateChange} = config

    return {
      onLoad: function(){
        const listener = createListener('page', this, store, mapState)
        this.onShow = injectChangeListenerStatus(onShow, listener, true)
        this.onHide = injectChangeListenerStatus(onHide, listener, false)
        this.onUnload = injectRemoveListener(onUnload, listener)
        return callInContext(onLoad, this, arguments)
      },

      onUnload: isFn(onUnload) ? onUnload : noop,
      onShow: isFn(onShow) ? onShow : noop,
      onHide: isFn(onHide) ? onHide : noop,
      onStateChange: injectOnStateChange(onStateChange)
    }
  }

  return config => factory(injectPageLifeCycle, config)
}

export default {
  App: connectApp,
  Page: connectPage
}
