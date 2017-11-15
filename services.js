const xray = require('x-ray')
const Promise = require('bluebird')
const cache = require('lru-cache')()
const R = require('ramda')

const { transformTwoArraysIntoCollection } = require('./ramda')
const x = xray()

/** Animes Online Br */

exports.getAllAnimes = () => {
  function getAnimes() {
    const animes = cache.get('animes')
    if (animes) return Promise.resolve(animes)

    return Promise.promisify(x(
      'http://www.animesonlinebr.com.br/animes-dublados.html',
      '.aba',
      {url: ['li a@href'], title: ['li a']}
    ))()
      .tap(response => cache.set('animes', response, 3600))
  }

  return getAnimes()
    .then(response => {
      return transformTwoArraysIntoCollection(
        response.url, 
        response.title, 
        ['url', 'title']
      )
    })
}

exports.getAllEpisodes = animeurl => {
  function getEpisodes() {
    const episodes = cache.get(animeurl)
    if (episodes) return Promise.resolve(episodes)

    return Promise.promisify(x(
      animeurl,
      '.single',
      {url: ['li a@href'], title: ['li a']}
    ))()
      .tap(response => cache.set(animeurl, response, 3600))
  }


  return getEpisodes()
    .then(response => {
      return transformTwoArraysIntoCollection(
        response.url, 
        response.title, 
        ['url', 'title']
      )
    })
}

exports.getEpisodeVideoURL = baseURL => {
  console.log('BASE URL', baseURL)
   
  function getVideoUrl() {
    const episodes = cache.get(baseURL)
    if (episodes) return Promise.resolve(episodes)

    return Promise.promisify(x(
      baseURL,
      '.contentBox',
      { url: ['link@href'], type: ['link@itemprop'] }
    ))()
      .tap(response => cache.set(baseURL, response, 3600))
  }

  return getVideoUrl()
    .then(response => {
      const finalIndex = R
        .findIndex(item => item === 'embedURL')(response.type)

      return response.url[finalIndex]  
    })
}
