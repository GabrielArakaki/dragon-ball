const express = require('express')
const app = express()
const { getAllAnimes } = require('./services')

app.get('/animes', function(req, res) {
  getAllAnimes()
    .filter(anime => new RegExp(req.query.string || '', 'i')
            .test(anime.title))
    .then(animes => res.send(animes))
})

app.listen(3001, function() {
  console.log('SERVER LISTENING ON 3001')
})