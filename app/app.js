'use strict'

var OPTIONS = [
  "Hello, AngularJs",
  "Hello, Seu Viadão"
]

angular
  .module('app', [
    'ngSanitize',
    'com.2fdevs.videogular',
    'com.2fdevs.videogular.plugins.controls',
    'com.2fdevs.videogular.plugins.overlayplay',
    'com.2fdevs.videogular.plugins.poster',
    'ui.bootstrap'
  ])
  .controller('HelloController', ['$sce', '$scope', '$http', function($sce, $scope, $http) {
    $scope.message = 'TESTE DO GABAO'
    $scope.config = {
      sources: [
        {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
      ],
      tracks: [
        {
          src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
          kind: "subtitles",
          srclang: "en",
          label: "English",
          default: ""
        }
      ],
      theme: "bower_components/videogular-themes-default/videogular.css",
      plugins: {
        poster: "http://www.videogular.com/assets/images/videogular.png"
      }
    }

    $scope.onSelectAnime = function ($item, $model, $label) {
      $scope.animeresult = $item
    };
    
    $scope.onSelectEpisode = function ($item, $model, $label) {
      return $http
        .get('http://localhost:3001/episode', 
          { params: { baseUrl: $item.url } })
        .then(function(response) {
          $scope.config.sources = [
            { 
              src: $sce.trustAsResourceUrl(response.data),
              type: 'video/mp4',
            }
          ]
        })
    };
    
    $scope.getAnime = function(val) {
      return $http
        .get('http://localhost:3001/animes', { params: { string: val } })
        .then(function(response){
          console.log('RESPONSE DATA', response.data)
          return response.data
        });
    };

    $scope.getEpisode = function(val) {
      return $http
        .get('http://localhost:3001/episodes', 
          { params: { animeUrl: $scope.animeresult.url, string: val } })
        .then(function(response){
          console.log('RESPONSE DATA', response.data)
          return response.data
        })
    }

  }])
