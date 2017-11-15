const express = require('express')
const app = express()
const { getAllAnimes } = require('./services')

app.get('/animes', function(req, res) {
  getAllAnimes()
    .then(animes => res.send(animes))
})

app.listen(3001, function() {
  console.log('SERVER LISTENING ON 3001')
})