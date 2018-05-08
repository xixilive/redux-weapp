import * as utils from '../es6/utils'

describe('Utils', () => {
  it('#isFn', () => {
    expect(utils.isFn()).toBe(false)
    expect(utils.isFn('')).toBe(false)
    expect(utils.isFn(1)).toBe(false)
    expect(utils.isFn({})).toBe(false)
    expect(utils.isFn([])).toBe(false)
    expect(utils.isFn(utils.isFn)).toBe(true)
  })

  it('#noop', () => {
    expect(typeof utils.noop).toBe('function')
    expect(utils.noop()).toBe(undefined)
  })

  it('#callInContext', () => {
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

  describe('#clone', () => {
    it('should clone object recursively', () => {
      const obj = {
        a: 1,
        b: new Date(1525766513827),
        c: [1,2,3],
        d: {
          e: 'str',
          f: null,
          g: [
            {h: 1}
          ]
        }
      }
  
      const newObj = utils.clone(obj)
      expect(newObj).toEqual(obj)
      obj.d.g[0].h = 2
      expect(obj.d.g[0].h).toBe(2)
      expect(newObj.d.g[0].h).toBe(1)
    })

    it('should clone primitive types', () => {
      expect(utils.clone(null)).toEqual(null)
      expect(utils.clone(undefined)).toEqual(undefined)
      expect(utils.clone(1)).toEqual(1)
      expect(utils.clone('string')).toEqual('string')
      expect(utils.clone(false)).toEqual(false)
      expect(utils.clone(NaN)).toEqual(NaN)
    })

    it('should not clone advanced types', () => {
      expect(utils.clone(() => {})).toBe(undefined)
      expect(utils.clone(/\s/)).toEqual(undefined)
    })
  })
})
