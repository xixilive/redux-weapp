import connect from '../es6/connect'
import {store, bindActionCreators, updatePage} from './helper'

const connectPage = (onStateChange) => {
  return connect.Page(
    store,
    (state) => state.page,
    (dispatch) => ({update: bindActionCreators(updatePage, dispatch)})
  )({onStateChange})
}

describe('connect page', () => {
  it('connect store with Page', () => {
    const onStateChange = jest.fn()
    const page = connectPage(onStateChange)
    // life-cycle functions
    expect(page.onLoad).toBeInstanceOf(Function)
    expect(page.onUnload).toBeInstanceOf(Function)
    expect(page.onShow).toBeInstanceOf(Function)
    expect(page.onHide).toBeInstanceOf(Function)
    expect(page.onStateChange).toBeInstanceOf(Function)
    expect(page.update).toBeInstanceOf(Function)

    expect(store.getState().page).toEqual({name: 'page', foo: {bar: 1}})

    // listener is not setup
    // Though store has changed, no callback got called yet
    page.update({name: 'page1'})
    expect(store.getState().page).toEqual({name: 'page1', foo: {bar: 1}})
    expect(onStateChange).toHaveBeenCalledTimes(0)

    page.onLoad()
    expect(onStateChange).toHaveBeenCalledTimes(1)
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'page1', foo: {bar: 1}}, undefined, 'INIT_SYNC')

    page.update({foo: {bar: 2}})
    expect(store.getState().page).toEqual({name: 'page1', foo: {bar: 2}})
    expect(onStateChange).toHaveBeenCalledTimes(2)
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'page1', foo: {bar: 2}}, {name: 'page1', foo: {bar: 1}})

    // should stash latest change
    page.onHide()
    page.update({foo: {bar: 3}})
    page.update({name: 'page2', foo: {bar: 4}})
    expect(onStateChange).toHaveBeenCalledTimes(2)
    
    // should pop stashed changes
    page.onShow()
    expect(onStateChange).toHaveBeenCalledTimes(3)
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'page2', foo: {bar: 4}}, {name: 'page1', foo: {bar: 3}})

    // should discard listener
    page.onUnload()
    page.update({name: 'discarded'})
    expect(onStateChange).toHaveBeenCalledTimes(3)

    // should re-setup listener
    page.onLoad()
    expect(onStateChange).toHaveBeenCalledTimes(4)
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'discarded', foo: {bar: 4}}, undefined, 'INIT_SYNC')
  })

  it('connect store with Page, but without mapState function', () => {
    const page = connect.Page(
      store,
      null,
      (dispatch) => ({update: bindActionCreators(updatePage, dispatch)})
    )({})

    expect(page.onLoad).toBe(undefined)
    expect(page.onUnload).toBe(undefined)
    expect(page.onShow).toBe(undefined)
    expect(page.onHide).toBe(undefined)
    expect(page.onStateChange).toBe(undefined)
    expect(page.update).toBeInstanceOf(Function)
    expect(() => page.update('name')).not.toThrow()
  })
})
