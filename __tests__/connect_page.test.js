import connect from '../es6/connect'
import {store, bindActionCreators, changePageName} from './helper'

const connectPage = (onStateChange) => {
  return connect.Page(
    store,
    (state) => ({name: state.page.name}),
    (dispatch) => ({changeName: bindActionCreators(changePageName, dispatch)})
  )({onStateChange})
}

describe('connect ', () => {

  it('store with Page', () => {
    const onStateChange = jest.fn()
    const page = connectPage(onStateChange)
    // life-cycle functions
    expect(page.onLoad).toBeInstanceOf(Function)
    expect(page.onUnload).toBeInstanceOf(Function)
    expect(page.onShow).toBeInstanceOf(Function)
    expect(page.onHide).toBeInstanceOf(Function)
    expect(page.onStateChange).toBeInstanceOf(Function)
    expect(page.changeName).toBeInstanceOf(Function)

    expect(store.getState().page.name).toBe('page')

    // listener is not setup
    // Though store has changed, no callback got called yet
    page.changeName('new page')
    expect(store.getState().page.name).toBe('new page')
    expect(onStateChange).not.toHaveBeenCalled()

    page.onLoad()
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'new page'}) //calls: 1

    page.changeName('new page2')
    expect(store.getState().page.name).toBe('new page2')
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'new page2'})//calls: 2

    page.onHide() // will pause to notify states change
    page.changeName('new page3')
    expect(store.getState().page.name).toBe('new page3')
    expect(onStateChange).toHaveBeenCalledTimes(2)
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'new page2'})

    page.onShow()
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'new page3'}) // resumed from inactive

    page.changeName('new page4')
    expect(store.getState().page.name).toBe('new page4')
    expect(onStateChange).toHaveBeenCalledTimes(4)
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'new page4'})

    page.changeName('new page4') //state not change
    expect(onStateChange).toHaveBeenCalledTimes(4)

    page.onUnload()
    page.changeName('new page5')
    expect(onStateChange).toHaveBeenCalledTimes(4)

    page.onLoad()
    expect(onStateChange).toHaveBeenCalledTimes(5)
    expect(onStateChange).toHaveBeenLastCalledWith({name: 'new page5'})
  })

  it('store with Page without mapState function', () => {
    const page = connect.Page(
      store,
      null,
      (dispatch) => ({changeName: bindActionCreators(changePageName, dispatch)})
    )({})

    expect(page.onLoad).toBe(undefined)
    expect(page.onUnload).toBe(undefined)
    expect(page.onShow).toBe(undefined)
    expect(page.onHide).toBe(undefined)
    expect(page.onStateChange).toBe(undefined)
    expect(page.changeName).toBeInstanceOf(Function)

    expect(() => page.changeName('name')).not.toThrow()
  })
})
