const R = require('ramda')

exports.transformTwoArraysIntoCollection = (array1, array2, names) => {
        return R.zip(array1, array2)
          .map(item => {
            return {
              [names[0]]: item[0],
              [names[1]]: item[1]
            }
          })
    }
