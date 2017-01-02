import {createStore, bindActionCreators} from 'redux'

const initState = {
  app: {name: 'app'},
  page: {name: 'page'}
}

const store = createStore(
  (state = initState, action) => {
    let key = (action.type.match(/CHANGE_(.+?)_NAME/) || [])[1]
    if(key){
      key = key.toLowerCase()
      const current = state[key]
      current.name = action.name
      return {...state, [key]: current}
    }
    return state
  }
)

const changeAppName = (name) => ({type: 'CHANGE_APP_NAME', name})
const changePageName = (name) => ({type: 'CHANGE_PAGE_NAME', name})

export {
  store, changeAppName, changePageName, bindActionCreators
}
