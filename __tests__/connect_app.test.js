import connect from '../es6/connect'
import {store, bindActionCreators, updateApp} from './helper'

const connectApp = (onStateChange) => {
  return connect.App(
    store,
    (state) => state.app,
    (dispatch) => ({update: bindActionCreators(updateApp, dispatch)})
  )({onStateChange})
}

describe('connect app', () => {
  it('connect store with App', () => {
    const onStateChange = jest.fn()
    const app = connectApp(onStateChange)
    // life-cycle functions
    expect(app.onLaunch).toBeInstanceOf(Function)
    expect(app.onShow).toBeInstanceOf(Function)
    expect(app.onHide).toBeInstanceOf(Function)
    expect(app.onStateChange).toBeInstanceOf(Function)
    expect(app.update).toBeInstanceOf(Function)

    expect(store.getState().app).toEqual({name: 'app', foo: {bar: 1}})
    expect(onStateChange).toHaveBeenCalledTimes(0)

    // listener is not setup
    // Though store has changed, no callback got called yet
    app.update({name: 'app1'})
    expect(store.getState().app).toEqual({name: 'app1', foo: {bar: 1}})
    expect(onStateChange).toHaveBeenCalledTimes(0)

    app.onLaunch()
    expect(onStateChange).toHaveBeenCalledTimes(1)
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'app1', foo: {bar: 1}}, undefined, 'INIT_SYNC') //calls: 1

    app.update({foo: {bar: 1}})
    expect(onStateChange).toHaveBeenCalledTimes(2)
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'app1', foo: {bar: 1}}, {name: 'app1', foo: {bar: 1}})//calls: 2

    // should stash latest change
    app.onHide()
    app.update({foo: {bar: 3}})
    app.update({name: 'app2', foo: {bar: 4}})
    expect(store.getState().app).toEqual({name: 'app2', foo: {bar: 4}})
    expect(onStateChange).toHaveBeenCalledTimes(2)

    // should pop stashed changes
    app.onShow()
    expect(onStateChange).toHaveBeenCalledTimes(3)
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'app2', foo: {bar: 4}}, {name: 'app1', foo: {bar: 3}})
  })

  it('connect store with App, but without mapState function', () => {
    const app = connect.App(
      store,
      null,
      (dispatch) => ({update: bindActionCreators(updateApp, dispatch)})
    )({})
    expect(app.onLaunch).toBe(undefined)
    expect(app.onShow).toBe(undefined)
    expect(app.onHide).toBe(undefined)
    expect(app.onStateChange).toBe(undefined)
    expect(app.update).toBeInstanceOf(Function)
    expect(() => app.update('name')).not.toThrow()
  })

})
