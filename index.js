const xray = require('x-ray')
const R = require('ramda')
const inquirer = require('inquirer')
const childProcess = require('child_process')
const Promise = require('bluebird')

const { transformTwoArraysIntoCollection } = require('./ramda')
const x = xray()

const ANIME_URL = 'http://www.animesonlinebr.com.br/dublados'
const SERIES_ID = '153'
// Dragon Ball Z -> 153
// Dragon Ball -> 147

exports.selectEpisode = () => {
  function getAllEpisodes() {
    const SCOPE = {
      url: ['li a@href'],
      title: ['li a'] 
    }
    
    const getEpisodes = Promise.promisify(
      x(`${ANIME_URL}/${SERIES_ID}`, '.single', SCOPE)
    )
    
    return getEpisodes()
      .then(response => {
        return transformTwoArraysIntoCollection(
          response.url, 
          response.title, 
          ['url', 'title']
        )
      })
      .then(R.map(episode => ({
          name: episode.title,
          value: episode.url
      })))
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

  function handleError(error) {
    console.log('ERROR', error)
  }

  function openVideoInChrome(finalUrl){
    childProcess.exec(`open -a "Google Chrome" ${finalUrl}`)
  }


  getAllEpisodes()
    .then(getUserInput)
    .then(getEpisodeVideoURL)
    .catch(handleError)
    .done(openVideoInChrome)
}
