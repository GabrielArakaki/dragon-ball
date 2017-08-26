var xray = require('x-ray')
var childProcess = require('child_process')

var x = xray();

x('http://www.animesonlinebr.com.br/video/2621', 'body@html')(function(err, response){
console.log('ERR', err)
var parsedResponse = response.split('\n')
  var finalLine = parsedResponse.find(function(line) {
    return line.indexOf('itemprop="embedURL"') !== -1
  })



  var finalUrl=finalLine.split(' ').find(piece => piece.indexOf('href') !== -1).split('"')[1]
  console.log('finalUrl', finalUrl)


  var episodeLine = parsedResponse.find(function(line) {
    return line.indexOf('itemprop="keywords"') !== -1
  })
  console.log('episodeLine', episodeLine)
  var finalEpisode=episodeLine.split('"')[3]
  console.log('finalEpisode', decodeURIComponent(finalEpisode))

  childProcess.exec(`open -a "Google Chrome" ${finalUrl}`)
})

setTimeout(function() { } , 10000)
