# redux-weapp

![Travis](https://img.shields.io/travis/xixilive/redux-weapp/master.svg)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/redux-weapp.svg)
![npm](https://img.shields.io/npm/dt/redux-weapp.svg)
![NpmVersion](https://img.shields.io/npm/v/redux-weapp.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/xixilive/redux-weapp/badge.svg?targetFile=package.json)](https://snyk.io/test/github/xixilive/redux-weapp?targetFile=package.json)
![NpmLicense](https://img.shields.io/npm/l/redux-weapp.svg)

基于 [Redux](https://redux.js.org/) 的微信小程序状态管理, 将Redux store连接到小程序App和Page. 

## 安装

```
# 通过Github代码库安装
npm install xixilive/redux-weapp --save-dev

# 通过npm安装
npm install redux-weapp --save-dev
```

## 使用

不用担心，Redux-weapp的API非常简单，严格说只有一个API，就是 `connect` 函数，但是在尝试下面的代码片段之前，希望你对小程序的模块化开发有一些背景知识或经验，并且了解 [Redux](https://redux.js.org/) 的基本原理。
[微信小程序模块化开发实践](https://gist.github.com/xixilive/5bf1cde16f898faff2e652dbd08cf669)

```js
// 引入Redux store的创建函数
import {createStore} from 'redux'
// 创建store实例
const store = createStore(...)
```

## 将Store连接到App

```js
import connect from 'redux-weapp'

const app = connect.App(
  store,
  // 下面这个函数定义了一个map的方式
  // 当store变化时, 会调用这个函数, 将store里的状态map出来，
  // 并将结果作为nextState pass到onStateChange回调函数
  // 其中，params是一个plain object，包含了App.onLaunch时携带的参数
  (state, params) => {
    // return an object, which will be passed to onStateChange function
    return {}
  },

  // 下面这个函数的目的是将actions与dispatcher绑定起来, 
  // 以便在你的app里可以方便地派发actions，
  // 这些连接过的函数，可以在App对象里使用 `this.XXX` 的方式调用
  (dispatch) => {
    // return an object, which can be invoked within app context(this scope).
    return {}
  }
)({
  onLaunch(options){},
  ...,
  onStateChange(nextState, prevState){
    // 这是一个约定的回调函数，当store中，你所关注的状态发生变化时，会自动调用这个函数
    // nextState是最新的一次状态，prevState是前一次状态
  }
})

// 定义App
App(app)
```

### 将Store连接到Page

假设我们有下面这个[Store shape](https://redux.js.org/basics/store), Store里维护了一个较大的Plain Object，Shape就是这个Object的结构。

```json
{
  todos: [Todo:Object]
}
```

todos是个数字，再假定每个元素的结构如下：

```
{
  title: String,
  complete: Boolean
}
```

再假设我们有定义这样的Action Creator([FSA](https://github.com/redux-utilities/flux-standard-action)):

```js
const fetchTodosAction = (status) => ({type: 'FETCH_TODOS', filter: {status}})
```

好了，我们开始把Store连接到Page上，如下代码：

```js
// 引入connect函数
import connect from 'redux-weapp'

const page = connect.Page(
  store,
  // 下面这个函数定义了一个map的方式
  // 当store变化时, 会调用这个函数, 将store里的状态map出来，
  // 并将结果作为nextState pass到onStateChange回调函数
  // 其中，params是一个plain object，包含了Page.onLoad时携带的参数
  (state, params) => ({
    todos: state.todos
  }),

  // 下面这个函数的目的是将actions与dispatcher绑定起来, 
  // 以便在你的page里可以方便地派发actions，
  // 这些连接过的函数，可以在Page对象里使用 `this.XXX` 的方式调用
  (dispatch) => ({
    fetchTodos(status = 'inprogress'){
      // dispatch an action
      dispatch(fetchTodosAction(status))
    }
  })
)({
  onLoad(options){
    // 加载所有的Todos
    this.fetchTodos()
  },
  
  onStateChange(nextState){
    // 第一次调用时，会看到todos是个空数组
    // 第二次调用时，会发现todos里有N个元素......
    // 这是因为在onLoad时，我们dispatch了一个动作，去加载Todos，
    // 当加载(网络下载)完成后，store里的todos变化了
    const {todos} = nextState
    this.setState({todos})
  },

  // UI交互，重新加载数据
  // 这里是简单的筛选出完成状态的todos
  onTapCompleteTab(){
    this.fetchTodos('complete')
  },

  onTapInProgressTab(){
    this.fetchTodos()
  }
})

// 定义Page
Page(page)
```

## connect API

### connect.App

```ts
// 定义一个高阶函数
const factory = connect.App(
  // redux store 实例
  store:ReduxStore, 

  // map函数用来从store里map出你所关注的(concerns)部分状态
  // 因为store里可能是一个很大的object，不同的action会引起不同的变化
  // 而通常我们一个view只会关心特定的部分，没必要去关注整个store的状态
  mapStateToProps:Function(state:Object, appLaunchOptions:Object), 

  // 绑定dispatch和action creator
  // 返回易于在App中调用的函数形式，上下文 `this` 指向当前app object
  mapDispatchToProps:Function(dispatch:Function)
):Function

// 构建连接了store的config object
// 再将这个object pass给小程序App函数
config = factory({
  onLaunch(options:Object){},
  onStateChange(nextState:Object, prevState:Object),
  ...
}):Object

// 定义App
App(config)
```

上述的分步写法可以合并为下面的形式：

```js
App(
  connect.App(store, mapStateToProps, mapDispatchToProps)({
    onLaunch(){},
    onStateChange(){}
  })
)
```

### connect.Page

```ts
// 定义一个高阶函数
const factory = connect.Page(
  // redux store 实例
  store:ReduxStore, 

  // map函数用来从store里map出你所关注的(concerns)部分状态
  // 因为store里可能是一个很大的object，不同的action会引起不同的变化
  // 而通常我们一个view只会关心特定的部分，没必要去关注整个store的状态
  mapStateToProps:Function(state:Object, pageLoadOptions:Object), 

  // 绑定dispatch和action creator
  // 返回易于在App中调用的函数形式，上下文 `this` 指向当前app object
  mapDispatchToProps:Function(dispatch:Function)
):Function

// 构建连接了store的config object
// 再将这个object pass给小程序Page函数
config = factory({
  onLoad(options:Object){},
  onStateChange(nextState:Object, prevState:Object)
  ...
}):Object

// 定义页面
Page(config)
```

上述的分步写法可以合并为下面的形式：

```js
Page(
  connect.Page(store, mapStateToProps, mapDispatchToProps)({
    onLoad(){},
    onStateChange(){}
  })
)
```

### `onStateChange` 函数

`onStateChange` 函数是redux-weapp约定的生命周期函数，关联到App和Page的lifecycle，你不能主动调用此函数。

```ts
// 每当store中，你所关注的部分state发生变化时，都会自动调用这个函数
onStateChange(nextState:Object, prevState:Object):void
```

Good luck! 
