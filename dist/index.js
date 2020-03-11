/* redux-weapp@0.2.1 */
'use strict';const noop = function(){};
const isFn = (fn) => ('function' === typeof fn);

const is = (x, y) => {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
};

const shallowEqual = (objA, objB) => {
  if (is(objA, objB)) return true
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

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
};

const callInContext = (fn, context, ...args) => {
  if(!isFn(fn)) return
  if(Object.prototype.toString.call(args[0]) === '[object Arguments]'){
    return fn.call(context, ...[].slice.call(args[0]))
  }
  return fn.call(context, ...args)
};let subscription = null;
const listeners = [];

const createListener = (name = 'subscriber', context, store, mapState) => {
  let prevState;
  const listener = function(state, ...args){
    const nextState = mapState(state);
    if(shallowEqual(nextState, prevState)) {
      return
    }
    if(listener.isActive) {
      listener.stashed = null;
      context.onStateChange.call(context, nextState, prevState, ...args);
    } else {
      listener.stashed = [nextState, prevState];
    }
    prevState = nextState;
  };

  listener.index = listeners.push(listener) - 1;
  listener.key = `${name}-${listener.index}`;
  listener.stashed = null;
  listener.isActive = true;
  listener(store.getState(), 'INIT_SYNC'); // to sync init state
  return listener
};

const setupSubscription = (store) => {
  if(isFn(subscription)){
    return subscription
  }
  return (subscription = store.subscribe(() => {
    const state = store.getState();
    listeners.forEach(fn => fn(state));
  }))
};

const injectChangeListenerStatus = (handler, listener, isActive) => {
  return function(){
    listener.isActive = isActive;
    if(listener.stashed) {
      this.onStateChange(...listener.stashed);
    }
    return callInContext(handler, this, arguments)
  }
};

const injectRemoveListener = (handler, listener) => {
  return function(){
    listeners.splice(listener.index, 1);
    return callInContext(handler, this, arguments)
  }
};

const injectOnStateChange = (handler) => {
  return function(){
    return callInContext(handler, this, arguments)
  }
};

const connect = (store, mapState, mapDispatch) => {
  const overrides = isFn(mapDispatch) ? mapDispatch(store.dispatch) : {};

  return (injectLifeCycle, config) => {
    const mergedConfig = {...config, ...overrides};
    if(!isFn(mapState)){
      return mergedConfig
    }
    setupSubscription(store);
    return {...mergedConfig, ...injectLifeCycle(mergedConfig)}
  }
};

const connectApp = (store, mapState, mapDispatch) => {
  const factory = connect(store, mapState, mapDispatch);

  const injectAppLifeCycle = (config) => {
    const {onLaunch, onShow, onHide, onStateChange} = config;

    return {
      onLaunch: function(){
        const listener = createListener('app', this, store, mapState);
        this.onShow = injectChangeListenerStatus(onShow, listener, true);
        this.onHide = injectChangeListenerStatus(onHide, listener, false);
        return callInContext(onLaunch, this, arguments)
      },

      onShow: isFn(onShow) ? onShow : noop,
      onHide: isFn(onHide) ? onHide : noop,
      onStateChange: injectOnStateChange(onStateChange)
    }
  };

  return config => factory(injectAppLifeCycle, config)
};

const connectPage = (store, mapState, mapDispatch) => {
  const factory = connect(store, mapState, mapDispatch);

  const injectPageLifeCycle = (config) => {
    const {onLoad, onUnload, onShow, onHide, onStateChange} = config;

    return {
      onLoad: function(){
        const listener = createListener('page', this, store, mapState);
        this.onShow = injectChangeListenerStatus(onShow, listener, true);
        this.onHide = injectChangeListenerStatus(onHide, listener, false);
        this.onUnload = injectRemoveListener(onUnload, listener);
        return callInContext(onLoad, this, arguments)
      },

      onUnload: isFn(onUnload) ? onUnload : noop,
      onShow: isFn(onShow) ? onShow : noop,
      onHide: isFn(onHide) ? onHide : noop,
      onStateChange: injectOnStateChange(onStateChange)
    }
  };

  return config => factory(injectPageLifeCycle, config)
};

var connect$1 = {
  App: connectApp,
  Page: connectPage
};module.exports=connect$1;