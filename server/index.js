const express = require('express')
const cors = require('cors');
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

const PORT = 9001
app.listen(PORT, function() {
  console.log(`SERVER LISTENING ON ${PORT}`)
})
