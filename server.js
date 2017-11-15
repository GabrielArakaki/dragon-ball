const express = require('express')
const app = express()

app.get('/animes', function(req, res) {
  res.sendStatus(200)
})

app.listen(3001, function() {
  console.log('SERVER LISTENING ON 3001')
})