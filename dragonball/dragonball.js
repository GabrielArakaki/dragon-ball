const xray = require('x-ray')
const R = require('ramda')
const inquirer = require('inquirer')
const childProcess = require('child_process')
const Promise = require('bluebird')

const Episodes = require('./mongoose').Episodes
const x = xray()

function selectEpisode () {
  getAllEpisodes()
    .then(getUserInput)
    .then(getEpisodeVideoURL)
    .catch(handleError)
    .done(openVideoInChrome)
}

function downloadEpisodes () {
  getAllEpisodes()
    .map(persistURLs)
    .catch(handleError)
}

function handleError(error) {
  console.log('ERROR', error)
}

function persistURLs(episode) {
  return getEpisodeVideoURL(episode.value)
    .then(saveURLinMongo.bind(null, episode.name))
}


function saveURLinMongo(episodeName, finalUrl) {
  console.log('EPISODE NAME ', episodeName)
  console.log('FINAL URL ', finalUrl)
  const find = Episodes.findOne({ name: episodeName }).exec()
  find
    .then(episode => {
      console.log('episode', episode)
      if (episode) return
      console.log('Episodes', Episodes)
      const newEpisode = new Episodes({ name: episodeName, url: finalUrl })
      newEpisode
        .save()
        .then(console.log)
        .catch(console.log)
    })
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
  transformTwoArraysIntoCollection,
  selectEpisode,
  downloadEpisodes
}

