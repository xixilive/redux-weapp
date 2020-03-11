# redux-weapp

![Travis](https://img.shields.io/travis/xixilive/redux-weapp/master.svg)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/redux-weapp.svg)
![npm](https://img.shields.io/npm/dt/redux-weapp.svg)
![NpmVersion](https://img.shields.io/npm/v/redux-weapp.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/xixilive/redux-weapp/badge.svg?targetFile=package.json)](https://snyk.io/test/github/xixilive/redux-weapp?targetFile=package.json)
![NpmLicense](https://img.shields.io/npm/l/redux-weapp.svg)

Redux-based State Management for Wechat applet(微信小程序, weapp), to connect Redux store with your weapp's App or Page lifecycles. 

## Install

```
# via Github
npm install xixilive/redux-weapp --save-dev

# via npm
npm install redux-weapp --save-dev

# via yarn
yarn add -D redux-weapp
```

## Build

```sh
git clone https://github.com/xixilive/redux-weapp.git \
  && cd redux-weapp \
  && yarn \
  && yarn build
```

## Usage

Before trying these demo code snippets, you should/must be experienced in weapp modulize development. 
[微信小程序模块化开发实践](https://www.jianshu.com/p/8fe7b756a211)

```js
// Redux store
import {createStore} from 'redux'
//create your Redux store
const store = createStore(...)
```

## connect to weapp App

```js
import connect from 'redux-weapp'
const config = connect.App(
  store,
  //to map next state into your app
  (state) => {
    // must return an object, which will be passed to onStateChange function
    return {}
  },
  // to bind dispatch with your action,
  // and this binding will be injected into your app object.
  (dispatch) => {
    // return an object, which can be invoked within app context(this scope).
    return {}
  }
)({
  onLaunch(options){},
  //...,
  onStateChange(nextState, prevState, initFlag){
    this.setData({...this.data, ...nextState})
  }
})

// construct your app
App(config)
```

### connect to weapp Page

Assume we have a [store shape](https://redux.js.org/basics/store) as following:

```json
{
  "todos": [
    {
      "title": "String",
      "complete": "Boolean"
    }
  ]
}
```

and we have defined an action creator([FSA](https://github.com/redux-utilities/flux-standard-action)) as:

```js
const fetchTodosAction = (status) => ({type: 'FETCH_TODOS', filter: {status}})
```

Ok, let's connect store to todo-list page.

```js
// 
import connect from 'redux-weapp'

const config = connect.Page(
  store,
  //to map next-state into your page
  (state) => ({todos: state.todos}),

  // to bind dispatch with your action creators,
  // and this binding will be injected into your page object
  (dispatch) => ({
    fetchTodos(status = 'inprogress'){
      // dispatch an action
      dispatch(fetchTodosAction(status))
    }
  })
)({
  onLoad(options){
    this.fetchTodos('inprogress')
  },
  
  onStateChange(nextState, prevState, initFlag){
    const {todos} = nextState
    this.setData({todos}) // to update UI
  },

  // view interactions
  onTapCompleteTab(){
    this.fetchTodos('complete')
  },

  onTapInProgressTab(){
    this.fetchTodos('inprogress')
  }
})

// construct your page
Page(config)
```

## connect API

### connect.App

```ts
//define app connect function
factory = connect.App(
  store:ReduxStore, 
  mapStateToProps:Function(state:Object), 
  mapDispatchToProps:Function(dispatch:Function)
):Function

//build a store-binding app config object
config = factory({
  onLaunch(options:Object){},
  onStateChange(nextState:Object, prevState:Object, initFlag:Any),
  //...
}):Object

//launch app with store-binding config
App(config)
```

### connect.Page

```ts
//define page connect function
factory = connect.Page(
  store:ReduxStore, 
  mapStateToProps:Function(state:Object), 
  mapDispatchToProps:Function(dispatch:Function)
):Function

//build a store-binding page config object
config = factory({
  onLoad(options:Object){},
  onStateChange(nextState:Object, prevState:Object, initFlag:Any)
  //...
}):Object

//start page instance with store-binding config
Page(config)
```

### the `onStateChange` function

```ts
// would be called after each concerned state changed
onStateChange(nextState:Object, prevState:Object, initFlag:Any):void
```

- `initFlag`: new feature from `redux-weapp@0.2.x`, see Changes section for details.

## Changes from v0.2.x

### `connect.App` API

- removed `appLaunchOptions` argument from `mapState` function.

```ts
// v0.1.x
connect.App({
  store:ReduxStore,
  mapState:Function(state:Object, appLaunchOptions:Object):Object,
  mapDispatch:Function(dispatch:Function):Object,
})

// v0.2.x
connect.App({
  store:ReduxStore,
  mapState:Function(state:Object):Object,
  mapDispatch:Function(dispatch:Function):Object,
})
```

### `connect.Page` API

- removed `pageLoadOptions` argument from `mapState` function.

```ts
// v0.1.x
connect.Page({
  store:ReduxStore,
  mapState:Function(state:Object, pageLoadOptions:Object):Object,
  mapDispatch:Function(dispatch:Function):Object,
})

// v0.2.x
connect.Page({
  store:ReduxStore,
  mapState:Function(state:Object):Object,
  mapDispatch:Function(dispatch:Function):Object,
})
```

### `onStateChange` callback

- add `initFlag` as the 3rd argument, which could be a string value `INIT_SYNC` just on the very first dispatch, `undefined` otherwise.

```ts
// v0.1.x
onStateChange(nextState:Object, prevState:Object)

// v0.2.x
onStateChange(nextState:Object, prevState:Object, initFlag:Any)
```

## Lifecycles

### for weapp App

- `onLaunch`

setup an subscribe listener when `onLaunch` function called, and the initial store state will be broadcasted.

- `onShow`

An inactive listener will be set to `active` when `onShow` function has called, and the listener will be called with last state.

- `onHide`

An active listener will be set to `inactive` when `onHide` function has called.

### for weapp Page

- `onLoad`

setup an subscribe listener when `onLoad` function called, and the initial store state will be broadcasted.

- `onShow`

An inactive listener will be set to `active` when `onShow` function has called, and the listener will be called with last state.

- `onHide`

An active listener will be set to `inactive` when `onHide` function has called.

- `onUnload`

The listener will be remove when `onUnload` function has called.

----

Good luck!