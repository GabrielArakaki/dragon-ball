const transformTwoArraysIntoCollection = require('../dragonball/dragonball').transformTwoArraysIntoCollection

const assert = require('chai').assert

const array1 = ['a', 'b', 'c', 'd']
const array2 = [10, 11, 12, 13]
const names = ['char', 'number']

const expected = [{
      char: 'a',
      number: 10
    },
    {
      char: 'b',
      number: 11
    },
    {
      char: 'c',
      number: 12
    },
    {
      char: 'd',
      number: 13
    }]

describe('Transform two arrays into collection', () => {
  it('should transform two arrays into a collection', () => {
    assert.deepEqual(transformTwoArraysIntoCollection(array1, array2, names), expected)
  })
})