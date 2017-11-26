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
    var DOMAIN = 'http://localhost:9001/'
    $scope.message = 'TESTE DO GABAO'
    $scope.config = {
      startTime: 120,
      autoHide: true,
      autoHideTime: 3000,
      autoPlay: true,
      sources: [],
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
        .get(DOMAIN + 'episode', 
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
        .get(DOMAIN + 'animes', { params: { string : val } }) 
        .then(function(response){
          return response.data
        });
    };

    $scope.getEpisode = function(val) {
      return $http
        .get(DOMAIN + 'episodes', 
          { params: { animeUrl: $scope.animeresult.url, string: val } })
        .then(function(response){
          return response.data
        })
    }

    $scope.onPlayerReady = function(API) {
      $scope.API = API
    }
  }])
