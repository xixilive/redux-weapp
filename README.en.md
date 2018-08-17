# redux-weapp

![Travis](https://img.shields.io/travis/xixilive/redux-weapp/master.svg)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/redux-weapp.svg)
![npm](https://img.shields.io/npm/dt/redux-weapp.svg)
![NpmVersion](https://img.shields.io/npm/v/redux-weapp.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/xixilive/redux-weapp/badge.svg?targetFile=package.json)](https://snyk.io/test/github/xixilive/redux-weapp?targetFile=package.json)
![NpmLicense](https://img.shields.io/npm/l/redux-weapp.svg)

Redux-based State Management for Wechat applet(微信小程序, weapp), to connect Redux store with your weapp's App or Page factory. 

## Install

```
# via Github
npm install xixilive/redux-weapp --save-dev

# via npm
npm install redux-weapp --save-dev
```

## Usage

Before trying these demo code snippets, you should/must be experienced in weapp modulize development. 
[微信小程序模块化开发实践](https://gist.github.com/xixilive/5bf1cde16f898faff2e652dbd08cf669)

```js
// Redux store
import {createStore} from 'redux'
//create your Redux store
const store = createStore(...)
```

## connect to weapp App

```js
import connect from 'redux-weapp'

const app = connect.App(
  store,
  //to map next state into your app, with a params argument which passed on `App.onLaunch` life-cycle
  (state, params) => {
    // return an object, which will be passed to onStateChange function
    return {}
  },
  // to bind dispatch with your action,
  // and this binding will be injected into your app
  (dispatch) => {
    // return an object, which can be invoked within app context(this scope).
    return {}
  }
)({
  onLaunch(options){},
  ...,
  onStateChange(nextState){
    // receive state changes
  }
})

// launch your app
App(app)
```

### connect to weapp Page

Assume we have a [store shape](https://redux.js.org/basics/store) as following:

```json
{
  todos: [Todo:Object]
}
```

and Each todo element in store is an object with schema:

```
{
  title: String,
  complete: Boolean
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

const page = connect.Page(
  store,
  //to map next-state into your page, with a params argument which passed on `Page.onLoad` life-cycle
  (state, params) => ({
    todos: state.todos
  }),
  // to bind dispatch with your action,
  // and this binding will be injected into your app
  (dispatch) => ({
    fetchTodos(status = 'inprogress'){
      // dispatch an action
      dispatch(fetchTodosAction(status))
    }
  })
)({
  onLoad(options){
    this.fetchTodos()
  },
  
  onStateChange(nextState){
    const {todos} = nextState
    this.setState({todos})
  },

  // view interactions
  onTapCompleteTab(){
    this.fetchTodos('complete')
  },

  onTapInProgressTab(){
    this.fetchTodos()
  }
})

// start your app with connect config
Page(page)
```

## connect API

### connect.App

```ts
//define app connect function
factory = connect.App(
  store:ReduxStore, 
  mapStateToProps:Function(state:Object, appLaunchOptions:Object), 
  mapDispatchToProps:Function(dispatch:Function)
):Function

//build a store-binding app config object
config = factory({
  onLaunch(options:Object){},
  onStateChange(nextState:Object, prevState:Object),
  ...
}):Object

//launch app with store-binding config
App(config)
```

### connect.Page

```ts
//define page connect function
factory = connect.Page(
  store:ReduxStore, 
  mapStateToProps:Function(state:Object, pageLoadOptions:Object), 
  mapDispatchToProps:Function(dispatch:Function)
):Function

//build a store-binding page config object
config = factory({
  onLoad(options:Object){},
  onStateChange(nextState:Object, prevState:Object)
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

----

Good luck!