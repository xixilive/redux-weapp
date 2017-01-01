# Redux-based State Management for Wechat applet (weapp)

To connect Redux store with your weapp's App or Page factory.

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

const appConfig = connect.App(
  store,
  //to map next state into your app
  (state) => ({}),
  // to bind dispatch with your action,
  // and this binding will be injected into your app
  (dispatch) => ({doSomething: bindActionCreators(todo, dispatch)})
)

// start your app with connect config
App(appConfig({
  onLaunch(){},
  ...,
  onStateChange(){
    // receive state changes here
  }
}))
```

### connect to weapp Page

```js
import connect from 'redux-weapp'

const pageConfig = connect.App(
  store,
  //to map next state into your app
  (state) => ({}),
  // to bind dispatch with your action,
  // and this binding will be injected into your app
  (dispatch) => ({doSomething: bindActionCreators(todo, dispatch)})
)

// start your app with connect config
App(pageConfig({
  onLoad(){},
  ...,
  onStateChange(){
    // receive state changes here
  }
}))
```

## Life-cycle

### for weapp App

- setup an subscribe listener when `onLaunch` function called, and the initial store state will be dispatched.
- An inactive listener will be set to `active` when `onShow` function has called.
- An active listener will be set to `inactive` when `onHide` function has called.

### for weapp Page

- setup an subscribe listener when `onLoad` function called, and the initial store state will be dispatched.
- An inactive listener will be set to `active` when `onShow` function has called.
- An active listener will be set to `inactive` when `onHide` function has called.
- The listener will be remove when `onUnload` function has called.
