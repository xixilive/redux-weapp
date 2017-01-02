import * as utils from '../es6/utils'

describe('Utils', () => {
  it('.isFn', () => {
    expect(utils.isFn()).toBe(false)
    expect(utils.isFn('')).toBe(false)
    expect(utils.isFn(1)).toBe(false)
    expect(utils.isFn({})).toBe(false)
    expect(utils.isFn([])).toBe(false)
    expect(utils.isFn(utils.isFn)).toBe(true)
  })

  it('.shallowEqual', () => {
    expect(utils.shallowEqual()).toBe(true)
    expect(utils.shallowEqual({}, {})).toBe(true)
    expect(utils.shallowEqual({a: 1}, {a: 1})).toBe(true)
    expect(utils.shallowEqual({a: {}}, {a: {}})).toBe(false)
    expect(utils.shallowEqual({a: 1}, {b: 1})).toBe(false)
  })

  it('.callInContext', () => {
    expect(utils.callInContext('NonFunction', {})).toBe(undefined)

    expect(
      utils.callInContext(
        function(n){ return this.value + n },
        {value: 1},
        1
      )
    ).toBe(2)

    expect(
      function(){
        function fnToCall(...args){
          return this.value + (args.reduce((m, n) => (m += n), 0))
        }
        return utils.callInContext(fnToCall, {value: 1}, arguments)
      }(2,3)
    ).toBe(6)
  })
})
