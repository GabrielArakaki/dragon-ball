const xray = require('x-ray')
const Promise = require('bluebird')

const { transformTwoArraysIntoCollection } = require('./ramda')
const x = xray()

/** Animes Online Br */

exports.getAllAnimes = () => {
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
}
