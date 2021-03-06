const xray = require('x-ray')
const R = require('ramda')
const inquirer = require('inquirer')
const childProcess = require('child_process')
const Promise = require('bluebird')

const { getAllAnimes, getAllEpisodes, getEpisodeVideoURL } = require('../server/services')

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
const x = xray()

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

function getUserInput(episodes) {
  const KEY = 'episode'
  const formatedEpisodes = R.map(episode => ({
      name: episode.title,
      value: episode.url
  }), episodes)
  return inquirer
    .prompt([{
      type: 'autocomplete',
      name: KEY,
      message: 'Choose an episode:',
      source: (answer, input) => Promise
        .resolve(R.filter(episode => new RegExp(input || '', 'i')
          .test(episode.name)
        , formatedEpisodes))
    }])
    .then(R.prop(KEY))
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
