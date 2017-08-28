const xray = require('x-ray')
const R = require('ramda')
const inquirer = require('inquirer')
const childProcess = require('child_process')

const x = xray()

runProgram()

function runProgram () {
  selectAllEpisodes((err, episodes) => {
    if (err) throw new Error('EPISODES NOT FOUND')
  
    const inquirerChoices = episodes.map(episode => {
      return {
        name: episode.title,
        value: episode.url
      }
    })
  
    inquirer
      .prompt([{
        type: 'list',
        name: 'episode',
        message: 'Choose an episode:',
        choices: inquirerChoices
      }])
      .then(value => value.episode)
      .then(findEpisodeVideoURL)
  })  
}

function selectAllEpisodes(callback) {
  const scope = {
    url: ['li a@href'],
    title: ['li a'] 
  }
  
  x('http://www.animesonlinebr.com.br/dublados/147', '.single', scope)(function(err, response) {
    if (err) return callback(err)
  
    const episodes = transformTwoArraysIntoCollection(response.url, response.title, ['url', 'title'])

    callback(null, episodes)
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

function findEpisodeVideoURL (baseURL) {
  console.log('BASE URL', baseURL)
  const scope = {
    url: ['link@href'],
    type: ['link@itemprop']
  }

  x(baseURL, '.contentBox', scope)(function(err, response){
    
    const finalIndex = R
      .findIndex(item => item === 'embedURL')(response.type)
    
    const finalUrl = response.url[finalIndex]

    console.log('finalUrl ', finalUrl)
  
    childProcess.exec(`open -a "Google Chrome" ${finalUrl}`)
  })

  setTimeout(function(){}, 10000)
}

module.exports = {
  transformTwoArraysIntoCollection: transformTwoArraysIntoCollection
}

