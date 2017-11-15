const xray = require('x-ray')
const R = require('ramda')
const inquirer = require('inquirer')
const childProcess = require('child_process')
const Promise = require('bluebird')

const { transformTwoArraysIntoCollection } = require('./ramda')
const { getAllAnimes } = require('./services')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
const x = xray()


exports.selectEpisode = () => {
  
  function selectAnime(animes) {
    const KEY = 'anime'
    const formatedAnimes = R.map(anime => ({
      name: anime.title,
      value: anime.url,
    }), animes)

    return inquirer
      .prompt([{
        type: 'autocomplete',
        name: KEY,
        message: 'Choose an anime:',
        source: (answer, input) => Promise
          .resolve(R.filter(anime => new RegExp(input || '', 'i')
            .test(anime.name)
          , formatedAnimes))
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
        type: 'autocomplete',
        name: 'episode',
        message: 'Choose an episode:',
        source: (answer, input) => Promise
          .resolve(R.filter(episode => new RegExp(input || '', 'i')
            .test(episode.name)
          , episodes))

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
