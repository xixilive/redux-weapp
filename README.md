# redux-weapp

[![Build Status](https://travis-ci.org/xixilive/redux-weapp.svg?branch=master)](https://travis-ci.org/xixilive/redux-weapp)

Redux-based State Management for Wechat applet(微信小程序, weapp), to connect Redux store with your weapp's App or Page factory. [Simple Example](https://github.com/xixilive/wxweather)

## Install

```
# via Github
npm install xixilive/redux-weapp --save-dev

# via npm
npm install redux-weapp --save-dev
```

## Usage

```js
// Redux store
import {createStore, bindActionCreators} from 'redux'
//create your Redux store
const store = createStore(...)
// Define actions
const todo = () => ({type: 'SOMETHING'})
```

## connect to weapp App

```js
import connect from 'redux-weapp'

const app = connect.App(
  store,
  //to map next state into your app, with a params argument which passed on `App.onLaunch` life-cycle
  (state, params) => ({}),
  // to bind dispatch with your action,
  // and this binding will be injected into your app
  (dispatch) => ({doSomething: bindActionCreators(todo, dispatch)})
)({
  onLaunch(options){},
  ...,
  onStateChange(nextState, prevState){
    // receive state changes here
  }
})

// start your app with connect config
App(app)
```

### connect to weapp Page

```js
import connect from 'redux-weapp'

const page = connect.Page(
  store,
  //to map next state into your app, with a params argument which passed on `Page.onLoad` life-cycle
  (state, params) => ({}),
  // to bind dispatch with your action,
  // and this binding will be injected into your app
  (dispatch) => ({doSomething: bindActionCreators(todo, dispatch)})
)({
  onLoad(options){},
  ...,
  onStateChange(nextState, prevState){
    // receive state changes here
  }
})

// start your app with connect config
Page(page)
```

## High-order connect API

### connect.App

```ts
//define app connect function
factory = connect.App(
  store:ReduxStore, 
  mapStateToProps:Function(state, appLaunchOptions), 
  mapDispatchToProps:Function(dispatch)
):Function

//build a store-binding app config object
config = factory({
  onLaunch(options:Object){},
  onStateChange(),
  ...
}):Object

//launch app with store-binding config
App(config)
```

### connect.Page

```ts
//define page connect function
connect.Page(
  store:ReduxStore, 
  mapStateToProps:Function, 
  mapDispatchToProps:Function
):Function

//build a store-binding page config object
config = factory({
  onLoad(options:Object){},
  onStateChange(),
  ...
}):Object

//start page instance with store-binding config
Page(config)
```

### the `onStateChange` function

```ts
// would be called after each store state change
onStateChange(nextState:Object, prevState:Object):void
```

## Life-cycle

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

## Example

![Example Screen Shot](https://raw.githubusercontent.com/xixilive/wxweather/master/doc/screenshot.jpg)