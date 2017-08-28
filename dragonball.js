const xray = require('x-ray')
const R = require('ramda')
const inquirer = require('inquirer')
const childProcess = require('child_process')
const Promise = require('bluebird')

const x = xray()

runProgram()

function runProgram () {
  getAllEpisodes()
    .then(getUserInput)
    .then(getEpisodeVideoURL)
    .done(openVideoInChrome)
}

function openVideoInChrome(finalUrl){
  childProcess.exec(`open -a "Google Chrome" ${finalUrl}`)
}

function getUserInput(episodes) {
  return inquirer
    .prompt([{
      type: 'list',
      name: 'episode',
      message: 'Choose an episode:',
      choices: episodes
    }])
    .then(value => value.episode)
}

function getAllEpisodes() {
  const scope = {
    url: ['li a@href'],
    title: ['li a'] 
  }
  
  const getEpisodes = Promise.promisify(x('http://www.animesonlinebr.com.br/dublados/147', '.single', scope))
  return getEpisodes()
    .then(response => {
      return transformTwoArraysIntoCollection(response.url, response.title, ['url', 'title'])
    })
    .then(episodes => {
      return episodes.map(episode => {
        return {
          name: episode.title,
          value: episode.url
        }
      })
    })
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

function getEpisodeVideoURL (baseURL) {
  console.log('BASE URL', baseURL)
  const scope = {
    url: ['link@href'],
    type: ['link@itemprop']
  }

  const getVideoUrl = Promise.promisify(x(baseURL, '.contentBox', scope))
  return getVideoUrl()
    .then(response => {
      const finalIndex = R
        .findIndex(item => item === 'embedURL')(response.type)

      return response.url[finalIndex]  
    })
}

module.exports = {
  transformTwoArraysIntoCollection: transformTwoArraysIntoCollection
}

