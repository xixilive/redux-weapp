import {createStore, bindActionCreators} from 'redux'

const initState = {
  app: {name: 'app', foo: {bar: 1}},
  page: {name: 'page', foo: {bar: 1}}
}

const store = createStore(
  (state = initState, {type, payload}) => {
    let key = (type.match(/^UPDATE_(.+?)$/) || [])[1]
    if(key){
      key = key.toLowerCase()
      const current = state[key]
      return {...state, [key]: {...current, ...payload}}
    }
    return state
  }
)

const updateState = (key, payload) => ({type: `UPDATE_${key.toUpperCase()}`, payload})
const updateApp = (payload) => updateState('APP', payload)
const updatePage = (payload) => updateState('PAGE', payload)

export {
  store, updateApp, updatePage, bindActionCreators
}
