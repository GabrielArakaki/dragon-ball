const xray = require('x-ray')
const R = require('ramda')

const x = xray()

function selectAllEpisodes() {
  const scope = {
  url: ['li a@href'],
  title: ['li a'] 
  }
  
  x('http://www.animesonlinebr.com.br/dublados/147', '.single', scope)(function(err, response) {
    console.log('ERR', err)
    console.log('RESPONSE', response)
  
    const episodes = transformTwoArraysIntoCollection(response.url, response.title, ['url', 'title'])
  })  

  setTimeout(function(){}, 10000)
}



function transformTwoArraysIntoCollection (array1, array2, names) {
  return R.zip(array1, array2)
    .map(item => {
      return {
        [names[0]]: item[0],
        [names[1]]: item[1]
      }
    })
}

module.exports = {
  transformTwoArraysIntoCollection: transformTwoArraysIntoCollection
}

