const xray = require('x-ray')
const R = require('ramda')
const inquirer = require('inquirer-bluebird')
const childProcess = require('child_process')
const Promise = require('bluebird')

const { transformTwoArraysIntoCollection } = require('./ramda')
const x = xray()

exports.selectEpisode = () => {
  function getAllAnimes() {
    const getAnimes = Promise.promisify(x(
      'http://www.animesonlinebr.com.br/animes-dublados.html',
      '.aba',
      {url: ['li a@href'], title: ['li a']}
    ))

    return getAnimes()
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

  function selectAnime(animes) {
    const KEY = 'anime'
    return inquirer
      .prompt([{
        type: 'list',
        name: KEY,
        message: 'Choose an anime:',
        choices: animes,
      }])
      .then(R.prop(KEY))
  }

  function getAllEpisodes(animeurl) {
    const SCOPE = {
      url: ['li a@href'],
      title: ['li a'] 
    }
    
    const getEpisodes = Promise.promisify(
      x(animeurl, '.single', SCOPE)
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
      .then(R.prop('episode'))
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

  getAllAnimes()
    .then(selectAnime)
    .then(getAllEpisodes)
    .then(getUserInput)
    .then(getEpisodeVideoURL)
    .catch(handleError)
    .done(openVideoInChrome)
}
