const express = require('express')
const cors = require('cors');
const R = require('ramda')

const app = express()
const { getAllAnimes, getAllEpisodes, getEpisodeVideoURL } = require('./services')

app.use(cors())

app.get('/animes', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  
  getAllAnimes()
    .filter(anime => new RegExp(req.query.string || '', 'i')
            .test(anime.title))
    .then(animes => res.send(animes))
})

app.get('/episodes', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  
  getAllEpisodes(req.query.animeUrl)
    .then(episodes => {
      const indexes = R.map(episode => {
        const array = episode.title
          .split(' ')
          .map((value, index) => {
            if (isNaN(value)) return null

            return index
          })
          .filter(value => value !== null)
        console.log('ARRAY', array)
        return array
      }, episodes)
      const index = R.reduce(R.intersection, R.head(indexes), indexes)
      const newIndex = R.isEmpty(index) ? R.head(R.head(indexes)) : R.head(index)
      return {
        episodes: episodes,
        index: newIndex
      }
    })  
    .filter(episode => new RegExp(req.query.string || '', 'i')
            .test(episode.title))
    .then(episodes => res.send(episodes))
})

app.get('/episode', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  
  getEpisodeVideoURL(req.query.baseUrl)
    .then(episode => res.send(episode))
})

app.listen(3001, function() {
  console.log('SERVER LISTENING ON 3001')
})
