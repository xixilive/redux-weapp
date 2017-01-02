# Redux-based State Management for Wechat applet(微信小程序, weapp)

To connect Redux store with your weapp's App or Page factory.

## Install

```
npm i xixilive/redux-weapp --save-dev
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
  //to map next state into your app
  (state) => ({}),
  // to bind dispatch with your action,
  // and this binding will be injected into your app
  (dispatch) => ({doSomething: bindActionCreators(todo, dispatch)})
)({
  onLaunch(){},
  ...,
  onStateChange(){
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
  //to map next state into your app
  (state) => ({}),
  // to bind dispatch with your action,
  // and this binding will be injected into your app
  (dispatch) => ({doSomething: bindActionCreators(todo, dispatch)})
)({
  onLoad(){},
  ...,
  onStateChange(){
    // receive state changes here
  }
})

// start your app with connect config
Page(page)
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
